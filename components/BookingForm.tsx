"use client";

import { useEffect, useState, type FormEvent } from "react";
import { loadStripe, type Stripe as StripeJs } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

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

let stripePromise: Promise<StripeJs | null> | null = null;
function getStripePromise() {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!key) {
      // Fails loudly rather than silently rendering a broken card field --
      // see .env.example for the variable this needs.
      throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set.");
    }
    stripePromise = loadStripe(key);
  }
  return stripePromise;
}

function InnerBookingForm({ quote }: { quote: QuoteSummary }) {
  const stripe = useStripe();
  const elements = useElements();
  const [consent, setConsent] = useState(false);
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    if (!consent) {
      setMessage("Please confirm you understand the automatic balance charge before booking.");
      return;
    }

    setSubmitState("submitting");
    setMessage("");

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setSubmitState("error");
      setMessage("Card field failed to load. Please refresh and try again.");
      return;
    }

    const { paymentMethod, error: pmError } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: { name: quote.contactName, email: quote.contactEmail },
    });

    if (pmError || !paymentMethod) {
      setSubmitState("error");
      setMessage(pmError?.message ?? "Could not process that card.");
      return;
    }

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quoteRequestId: quote.id,
          paymentMethodId: paymentMethod.id,
          contactName: quote.contactName,
          contactEmail: quote.contactEmail,
          consentToAutoCharge: true,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Booking failed.");
      }

      const result = await res.json();

      if (result.requiresAction) {
        // Card needs 3D Secure -- this is what actually shows the
        // authentication challenge (a Stripe-hosted popup/modal). Without
        // this call, a "requires_action" PaymentIntent just sits there
        // unauthenticated and Stripe shows it as "Incomplete."
        const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(result.clientSecret);

        if (confirmError) {
          setSubmitState("error");
          setMessage(confirmError.message ?? "Card authentication failed.");
          return;
        }
        if (paymentIntent?.status !== "succeeded") {
          setSubmitState("error");
          setMessage("Payment could not be authenticated. Please try again.");
          return;
        }

        const confirmRes = await fetch(`/api/booking/${result.bookingId}/confirm`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentIntentId: paymentIntent.id }),
        });
        if (!confirmRes.ok) {
          const confirmBody = await confirmRes.json().catch(() => ({}));
          throw new Error(confirmBody.error ?? "Booking failed.");
        }
      }

      setSubmitState("success");
    } catch (err) {
      setSubmitState("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (submitState === "success") {
    return (
      <div className="rounded-sm border border-highway bg-highway/10 p-8 text-center">
        <p className="font-display text-xl uppercase tracking-signage text-highway">Booked</p>
        <p className="mt-3 text-ink/80">
          Your deposit of {quote.depositAmountCents ? formatDollars(quote.depositAmountCents) : ""} has
          been charged, and your card is on file for the remaining balance on delivery.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-sm border border-ink/10 p-4">
        <label className="manifest-label">Card details</label>
        <div className="mt-2 rounded-sm border border-slate-light/60 p-3">
          <CardElement options={{ style: { base: { fontSize: "16px", color: "#1E2A3A" } } }} />
        </div>
      </div>

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

      {message && <p className="rounded-sm border border-rust bg-rust/10 p-3 text-sm text-rust">{message}</p>}

      <button
        type="submit"
        disabled={!stripe || submitState === "submitting"}
        className="w-full rounded-sm bg-brass px-6 py-3 font-display text-sm uppercase tracking-wideish text-paper hover:bg-brass-dark disabled:opacity-60"
      >
        {submitState === "submitting"
          ? "Processing\u2026"
          : quote.depositAmountCents
          ? `Pay Deposit \u2014 ${formatDollars(quote.depositAmountCents)}`
          : "Pay Deposit"}
      </button>
    </form>
  );
}

export default function BookingForm({ quoteId }: { quoteId: string }) {
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
    return <p className="text-rust">{loadError}</p>;
  }
  if (!quote) {
    return <p className="text-ink/60">Loading your quote\u2026</p>;
  }
  if (!quote.priced) {
    return (
      <p className="text-ink/70">
        This quote hasn&apos;t been priced yet. You&apos;ll get an email as soon as it is &mdash;
        this page will be ready to go from that link.
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

      <Elements stripe={getStripePromise()}>
        <InnerBookingForm quote={quote} />
      </Elements>
    </div>
  );
}
