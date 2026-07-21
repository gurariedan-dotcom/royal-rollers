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
// 1. createBookingCustomerAndDeposit: creates a Stripe Customer, charges the
//    deposit with a PaymentIntent, and (via setup_future_usage) saves the
//    card used for that payment so it can be charged again later
//    off-session. This is the standard "save a card while taking a real
//    payment" pattern -- see Stripe's docs on setup_future_usage.
// 2. chargeRemainingBalance: runs later (triggered by whatever marks a job
//    "delivered" -- see the open question in README.md about what that
//    trigger actually is) and charges the saved payment method off-session.

export async function createBookingCustomerAndDeposit(params: {
  email: string;
  name: string;
  depositAmountCents: number;
  paymentMethodId: string;
  quoteRequestId: string;
}) {
  const stripe = getStripe();

  const customer = await stripe.customers.create({
    email: params.email,
    name: params.name,
    payment_method: params.paymentMethodId,
    invoice_settings: { default_payment_method: params.paymentMethodId },
    metadata: { quote_request_id: params.quoteRequestId },
  });

  const depositIntent = await stripe.paymentIntents.create({
    amount: params.depositAmountCents,
    currency: "usd",
    customer: customer.id,
    payment_method: params.paymentMethodId,
    // Cards only -- the saved payment method needs to be chargeable off-session
    // later for the balance, which redirect-based methods generally can't do.
    // Restricting the type here also avoids Stripe requiring a `return_url`,
    // which only applies to payment methods that might redirect the customer.
    payment_method_types: ["card"],
    off_session: false, // customer is present for the deposit itself
    confirm: true,
    setup_future_usage: "off_session", // <- this is what saves the card
    metadata: { quote_request_id: params.quoteRequestId, purpose: "deposit" },
  });

  return { customer, depositIntent };
}

// Used after the client completes 3D Secure authentication for the deposit
// (see app/api/booking/[id]/confirm/route.ts) -- the server re-checks the
// PaymentIntent's actual status with Stripe rather than trusting whatever
// the client claims happened.
export async function retrievePaymentIntent(id: string) {
  const stripe = getStripe();
  return stripe.paymentIntents.retrieve(id);
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
