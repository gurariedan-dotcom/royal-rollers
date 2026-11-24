"use client";

import { useEffect, useState } from "react";
import { animate, AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, MapPin } from "@phosphor-icons/react/dist/ssr";

// Homepage entry to the quote calculator, per the 2026-11 hero mockup. Shows a
// rough, non-binding estimate as soon as both ZIPs are in (same endpoint and
// pricing as QuoteForm's live estimate), then submits as a plain GET to /quote,
// which pre-fills QuoteForm. Vehicle type no longer affects price and most cars
// run, so the estimate assumes a running sedan on a carrier.

type Estimate = {
  lowCents: number;
  highCents: number;
  miles: number;
  pickupPlace: string;
  dropoffPlace: string;
};

const ZIP = /^\d{5}$/;
const usd = (cents: number) =>
  `$${Math.round(cents / 100).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

// Counts a number up from 0 for the estimate reveal; jumps straight there under reduced motion.
function CountUp({ to }: { to: number }) {
  const reduce = useReducedMotion();
  const [value, setValue] = useState(reduce ? to : 0);
  useEffect(() => {
    if (reduce) {
      setValue(to);
      return;
    }
    const controls = animate(0, to, { duration: 0.9, ease: [0.25, 1, 0.5, 1], onUpdate: setValue });
    return () => controls.stop();
  }, [to, reduce]);
  return <>{usd(value)}</>;
}

function ZipField({
  id,
  name,
  label,
  value,
  onChange,
}: {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="field-label">{label}</label>
      <div className="relative">
        <MapPin size={22} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate" />
        <input
          id={id}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 5))}
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={5}
          pattern="\d{5}"
          title="5-digit ZIP code"
          placeholder="ZIP code"
          required
          className="field pl-12"
        />
      </div>
    </div>
  );
}

export default function HeroQuoteCard() {
  const reduce = useReducedMotion();
  const [pickupZip, setPickupZip] = useState("");
  const [dropoffZip, setDropoffZip] = useState("");
  const [enclosed, setEnclosed] = useState<"open" | "enclosed">("open");
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  useEffect(() => {
    if (!ZIP.test(pickupZip) || !ZIP.test(dropoffZip)) {
      setEstimate(null);
      setStatus("idle");
      return;
    }

    let cancelled = false;
    setStatus("loading");
    const timer = setTimeout(() => {
      const params = new URLSearchParams({
        pickupZip,
        dropoffZip,
        enclosed,
        serviceType: "carrier",
        isRunning: "running",
        vehicleType: "sedan",
      });
      fetch(`/api/route-distance?${params.toString()}`)
        .then((res) => (res.ok ? res.json() : Promise.reject()))
        .then((data) => {
          if (cancelled) return;
          setEstimate({
            lowCents: data.estimateLowCents,
            highCents: data.estimateHighCents,
            miles: data.miles,
            pickupPlace: data.pickupPlace,
            dropoffPlace: data.dropoffPlace,
          });
          setStatus("done");
        })
        .catch(() => {
          if (!cancelled) {
            setEstimate(null);
            setStatus("error");
          }
        });
    }, 400);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [pickupZip, dropoffZip, enclosed]);

  const panelMotion = reduce
    ? {}
    : {
        initial: { opacity: 0, height: 0 },
        animate: { opacity: 1, height: "auto" },
        exit: { opacity: 0, height: 0 },
        transition: { duration: 0.3, ease: [0.25, 1, 0.5, 1] as const },
      };

  return (
    <form action="/quote" method="get" className="card rounded-2xl p-6 shadow-panel-lg sm:p-8">
      <h1 className="text-center text-4xl !text-ink md:text-5xl">Get an instant quote</h1>
      <p className="mt-2 text-center text-lg text-slate">Free, no obligation estimate.</p>

      <div className="mt-7 space-y-5">
        <ZipField id="heroPickupZip" name="pickupZip" label="Pickup location" value={pickupZip} onChange={setPickupZip} />
        <ZipField id="heroDropoffZip" name="dropoffZip" label="Delivery location" value={dropoffZip} onChange={setDropoffZip} />

        <fieldset>
          <legend className="field-label">Transport type</legend>
          <div className="flex gap-8">
            {(["open", "enclosed"] as const).map((val) => (
              <label key={val} className="flex cursor-pointer items-center gap-2.5 text-lg capitalize text-ink">
                <input
                  type="radio"
                  name="enclosed"
                  value={val}
                  checked={enclosed === val}
                  onChange={() => setEnclosed(val)}
                  className="h-5 w-5 accent-navy"
                />
                {val}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div aria-live="polite">
        <AnimatePresence initial={false}>
          {status !== "idle" && (
            <motion.div key="estimate" {...panelMotion} className="overflow-hidden">
              <div className="pt-6">
                {status === "loading" && (
                  <div className="flex items-center gap-3 rounded-xl border border-line bg-paper px-5 py-4">
                    <span className="apple-spinner text-navy" aria-hidden="true" />
                    <p className="text-slate">Calculating your estimate&hellip;</p>
                  </div>
                )}

                {status === "done" && estimate && (
                  <div className="on-navy rounded-xl bg-navy px-5 py-5 text-paper sm:px-6">
                    <p className="kicker">Estimated cost</p>
                    <p className="mt-2 whitespace-nowrap font-display text-[1.75rem] font-extrabold tracking-signage text-amber min-[400px]:text-4xl sm:text-5xl">
                      <CountUp to={estimate.lowCents} />
                      <span className="mx-1.5 text-navy-muted sm:mx-2">&ndash;</span>
                      <CountUp to={estimate.highCents} />
                    </p>
                    <p className="mt-3 text-navy-muted">
                      {estimate.pickupPlace} <span aria-hidden="true">&rarr;</span>
                      <span className="sr-only">to</span> {estimate.dropoffPlace}
                      <span className="whitespace-nowrap"> · ~{estimate.miles.toLocaleString("en-US")} mi</span>
                    </p>
                    <p className="mt-3 text-xs text-navy-muted/70">
                      Rough instant estimate, not a final price. Your exact quote comes by email.
                    </p>
                  </div>
                )}

                {status === "error" && (
                  <p className="rounded-xl border border-line bg-paper px-5 py-4 text-slate">
                    Couldn&apos;t estimate those ZIP codes. Check them, or continue for an exact quote.
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button type="submit" className="btn-amber mt-7 w-full py-4 text-xl">
        {status === "done" ? "Get my exact quote" : "Start my quote"} <ArrowRight size={22} weight="bold" />
      </button>
    </form>
  );
}
