import Link from "next/link";
import QuickAnswers from "@/components/QuickAnswers";
import Reveal from "@/components/Reveal";
import RoadTexture from "@/components/RoadTexture";
import { ShieldCheck, SteeringWheel } from "@phosphor-icons/react/dist/ssr";

const ghostCta =
  "rounded-sm border border-brass px-6 py-3 font-display text-sm uppercase tracking-wideish text-brass transition-all hover:bg-brass hover:text-paper hover:-translate-y-px active:translate-y-0 active:scale-[0.98]";

const ghostCtaOnDark =
  "rounded-sm border border-paper px-6 py-3 font-display text-sm uppercase tracking-wideish text-paper transition-all hover:bg-paper hover:text-ink hover:-translate-y-px active:translate-y-0 active:scale-[0.98]";

export default function HomePage() {
  return (
    <>
      <section className="relative mx-auto max-w-6xl overflow-hidden px-6 py-16 md:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full bg-brass/10 blur-3xl"
        />

        <div className="relative z-10 max-w-2xl">
          <p className="manifest-label">Nationwide Transport</p>
          <h1 className="mt-3 text-4xl font-semibold leading-[1.05] tracking-tight md:text-5xl">
            Your car, moved anywhere.{" "}
            <span className="text-brass">Your call how.</span>
          </h1>
          <p className="mt-6 max-w-md text-ink/75">
            Royal Rollers arranges vehicle transport anywhere in the country,
            on an insured multi-car hauler, or driven directly by a personal
            driver. Two real options, quoted directly by us.
          </p>
          <div className="mt-8 flex gap-4">
            <Link href="/quote" className={ghostCta}>
              Get a Quote
            </Link>
            <Link
              href="/services"
              className="rounded-sm border border-ink/20 px-6 py-3 font-display text-sm uppercase tracking-wideish text-ink transition-all hover:border-ink/50 hover:-translate-y-px active:translate-y-0 active:scale-[0.98]"
            >
              Compare Options
            </Link>
          </div>
        </div>
      </section>

      <div className="route-rule mx-auto max-w-6xl opacity-30" />

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <h2 className="text-center text-3xl">Pick what fits your timeline</h2>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Reveal className="rounded-sm bg-highway p-8 text-paper shadow-panel md:p-10">
            <ShieldCheck size={32} weight="duotone" className="text-paper/90" />
            <p className="mt-4 font-display text-xl uppercase tracking-wideish">
              Carrier Transport
            </p>
            <p className="mt-3 text-paper/80">
              Your vehicle rides on an insured, licensed carrier&apos;s hauler.
              No mileage added. No hidden fees. Typically 1-4 days.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="rounded-sm bg-rust p-8 text-paper shadow-panel md:p-10 md:mt-12">
            <SteeringWheel size={32} weight="duotone" className="text-paper/90" />
            <p className="mt-4 font-display text-xl uppercase tracking-wideish">
              Personal Driver
            </p>
            <p className="mt-3 text-paper/80">
              A driver takes your car directly, point to point. Faster and more
              precise timing, typically 24-30 hours. Adds mileage to the vehicle.
            </p>
          </Reveal>
        </div>

        <p className="mt-8 text-center text-sm text-ink/60">
          <Link href="/services" className="underline hover:text-brass">
            See the full side-by-side comparison
          </Link>
        </p>
      </section>

      <div className="route-rule mx-auto max-w-6xl opacity-30" />

      <QuickAnswers />

      {/* Full-bleed closing moment -- diagonal-cut gradient band with a
          drifting road-line texture, instead of a stock photo. */}
      <section
        className="relative flex min-h-[420px] items-center justify-center overflow-hidden bg-gradient-to-br from-ink to-brass-dark py-24 text-center"
        style={{ clipPath: "polygon(0 48px, 100% 0, 100% calc(100% - 48px), 0 100%)" }}
      >
        <RoadTexture />

        <Reveal className="relative z-10 mx-auto max-w-2xl px-6">
          <h2 className="text-3xl text-paper">A priced quote sent straight to your inbox</h2>
          <p className="mx-auto mt-4 max-w-xl text-paper/80">
            Submit your vehicle and route details once. You&apos;ll get a real number
            back by email, not a callback promise.
          </p>
          <Link href="/quote" className={`mt-8 inline-block ${ghostCtaOnDark}`}>
            Get a Quote
          </Link>
        </Reveal>
      </section>
    </>
  );
}
