"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ShieldCheck } from "@phosphor-icons/react/dist/ssr";

type QuoteSummary = {
  id: string;
  status: string;
  priced: boolean;
  serviceType?: "carrier" | "personal_driver";
  vehicle?: string;
  pickupZip?: string;
  dropoffZip?: string;
  contactName?: string;
  contactEmail?: string;
  quotedAmountCents?: number;
  depositAmountCents?: number;
  balanceAmountCents?: number;
};

function formatDollars(cents: number) {
  return (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function InnerBookingForm({ quote, canceled }: { quote: QuoteSummary; canceled: boolean }) {
  const [consent, setConsent] = useState(false);
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "error">("idle");
  const [message, setMessage] = useState(
    canceled ? "Checkout was canceled. You can try again whenever you're ready." : ""
  );

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!consent) {
      setMessage("Please confirm you understand the automatic balance charge before booking.");
      return;
    }

    setSubmitState("submitting");
    setMessage("");

    try {
      const res = await fetch("/api/booking/checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quoteRequestId: quote.id,
          contactName: quote.contactName,
          contactEmail: quote.contactEmail,
          consentToAutoCharge: true,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Could not start checkout.");
      }

      const { checkoutUrl } = await res.json();
      window.location.href = checkoutUrl;
    } catch (err) {
      setSubmitState("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <label className="flex items-start gap-3 text-sm text-ink/80">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1"
        />
        <span>
          I understand my card will be saved on file and the remaining balance of{" "}
          {quote.balanceAmountCents ? formatDollars(quote.balanceAmountCents) : "the balance"}{" "}
          will be charged automatically once my vehicle is delivered, without further action on my part.
        </span>
      </label>

      {message && <p className="rounded-sm border border-brass-dark bg-brass-dark/10 p-3 text-sm text-brass-dark">{message}</p>}

      <button
        type="submit"
        disabled={submitState === "submitting"}
        className="w-full rounded-sm bg-brass px-6 py-3 font-display text-sm uppercase tracking-wideish text-paper hover:bg-brass-dark disabled:opacity-60"
      >
        {submitState === "submitting"
          ? "Redirecting to checkout…"
          : quote.depositAmountCents
          ? `Continue to Payment, ${formatDollars(quote.depositAmountCents)}`
          : "Continue to Payment"}
      </button>

      <p className="flex items-center justify-center gap-2 text-xs text-slate">
        <ShieldCheck size={16} weight="duotone" aria-hidden="true" />
        Secure checkout powered by Stripe &mdash; Apple Pay and Google Pay supported
      </p>
    </form>
  );
}

export default function BookingForm({ quoteId, canceled }: { quoteId: string; canceled?: boolean }) {
  const [quote, setQuote] = useState<QuoteSummary | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/quote/${quoteId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Could not load this quote.");
        return res.json();
      })
      .then(setQuote)
      .catch((err) => setLoadError(err.message));
  }, [quoteId]);

  if (loadError) {
    return (
      <p className="rounded-sm border border-brass-dark bg-brass-dark/10 p-4 text-sm text-brass-dark">{loadError}</p>
    );
  }
  if (!quote) {
    return (
      <div className="space-y-3" aria-live="polite" aria-busy="true">
        <p className="manifest-label">Quote summary</p>
        <div className="skeleton h-24 w-full" />
        <div className="skeleton h-12 w-2/3" />
      </div>
    );
  }
  if (!quote.priced) {
    return (
      <p className="text-ink/70">
        This quote hasn&apos;t been priced yet. You&apos;ll get an email as soon as it is,
        and this page will be ready to go from that link.
      </p>
    );
  }

  return (
    <div>
      <div className="mb-8 rounded-sm border border-ink/10 p-5">
        <p className="manifest-label">Quote summary</p>
        <dl className="mt-3 grid grid-cols-2 gap-y-2 text-sm">
          <dt className="text-ink/60">Vehicle</dt>
          <dd className="text-ink">{quote.vehicle}</dd>
          <dt className="text-ink/60">Route</dt>
          <dd className="text-ink">{quote.pickupZip} &rarr; {quote.dropoffZip}</dd>
          <dt className="text-ink/60">Total quote</dt>
          <dd className="text-ink">{quote.quotedAmountCents ? formatDollars(quote.quotedAmountCents) : ""}</dd>
          <dt className="text-ink/60">Deposit due now</dt>
          <dd className="font-semibold text-brass">
            {quote.depositAmountCents ? formatDollars(quote.depositAmountCents) : ""}
          </dd>
        </dl>
      </div>

      <InnerBookingForm quote={quote} canceled={!!canceled} />
    </div>
  );
}
