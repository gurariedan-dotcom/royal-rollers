import Stripe from "stripe";

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}.`);
  }
  return value;
}

let cachedStripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!cachedStripe) {
    cachedStripe = new Stripe(getEnv("STRIPE_SECRET_KEY"), {
      apiVersion: "2024-06-20",
    });
  }
  return cachedStripe;
}

// --- Booking flow (Section 4.5 of the handoff doc) ---------------------
//
// 1. createDepositCheckoutSession: a Stripe-hosted Checkout page for the
//    deposit, with `setup_future_usage: "off_session"` on the underlying
//    PaymentIntent so the card used still gets saved for the balance charge
//    later, same as the old custom Elements flow did -- Checkout just
//    replaces the card form and 3D Secure handling, which Stripe's hosted
//    page now does natively (no client-side confirmCardPayment dance).
//    Cards only (Apple Pay / Google Pay ride along automatically as
//    wallets on the card payment method) -- PayPal is deliberately not
//    offered here because Stripe's off-session reuse support for a saved
//    PayPal account isn't reliable enough for the automatic
//    charge-on-delivery balance flow this depends on.
// 2. retrieveCheckoutSession / finalizeBookingFromSession (lib/booking.ts):
//    read back the Customer + PaymentMethod Checkout attached once payment
//    completes.
// 3. chargeRemainingBalance: runs later (triggered by whatever marks a job
//    "delivered" -- see the open question in README.md about what that
//    trigger actually is) and charges the saved payment method off-session.

export async function createDepositCheckoutSession(params: {
  email: string;
  name: string;
  depositAmountCents: number;
  quoteRequestId: string;
  bookingId: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const stripe = getStripe();

  return stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: params.email,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: params.depositAmountCents,
          product_data: {
            name: "Royal Rollers — Transport Deposit",
            description: `Booking deposit for quote ${params.quoteRequestId}`,
          },
        },
      },
    ],
    payment_intent_data: {
      setup_future_usage: "off_session", // <- this is what saves the card for the balance charge
      metadata: { quote_request_id: params.quoteRequestId, booking_id: params.bookingId, purpose: "deposit" },
    },
    metadata: { quote_request_id: params.quoteRequestId, booking_id: params.bookingId },
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
  });
}

// Expanded so the caller can read the saved Customer + PaymentMethod ids
// straight off the session without a second round trip to Stripe.
export async function retrieveCheckoutSession(id: string) {
  const stripe = getStripe();
  return stripe.checkout.sessions.retrieve(id, {
    expand: ["payment_intent.payment_method"],
  });
}

export async function constructWebhookEvent(payload: string | Buffer, signature: string) {
  const stripe = getStripe();
  return stripe.webhooks.constructEvent(payload, signature, getEnv("STRIPE_WEBHOOK_SECRET"));
}

export async function chargeRemainingBalance(params: {
  stripeCustomerId: string;
  stripePaymentMethodId: string;
  balanceAmountCents: number;
  quoteRequestId: string;
}) {
  const stripe = getStripe();

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: params.balanceAmountCents,
      currency: "usd",
      customer: params.stripeCustomerId,
      payment_method: params.stripePaymentMethodId,
      off_session: true,
      confirm: true,
      metadata: { quote_request_id: params.quoteRequestId, purpose: "balance" },
    });
    return { success: true as const, paymentIntent };
  } catch (err) {
    // Off-session charges can fail outright (declined card) or come back
    // requiring authentication the customer isn't present to complete
    // (SCA / 3D Secure) -- Stripe surfaces the latter as a StripeCardError
    // with code "authentication_required", carrying the PaymentIntent in
    // `requires_action` status. Both need a real fallback -- see README.md,
    // "Open question: balance-charge failure handling" -- rather than
    // silently swallowing the error here.
    if (err instanceof Stripe.errors.StripeCardError) {
      if (err.code === "authentication_required") {
        return { success: false as const, reason: "requires_authentication" as const, error: err };
      }
      return { success: false as const, reason: "card_declined" as const, error: err };
    }
    return { success: false as const, reason: "unknown" as const, error: err };
  }
}
