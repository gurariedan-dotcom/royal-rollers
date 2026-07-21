import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { createBookingCustomerAndDeposit } from "@/lib/stripe";

// The client is expected to have already turned the customer's card details
// into a Stripe PaymentMethod id via Stripe.js / Elements on the frontend --
// raw card numbers should never reach this route or this server. See
// components/BookingForm.tsx.
//
// Deposit/balance amounts are deliberately NOT accepted from the client --
// they're derived here from the quote's stored quoted_amount_cents (see
// app/api/quote/[id]/route.ts), the same way that route computes them for
// display. A client-supplied amount would let anyone book at any price.
const DEPOSIT_PERCENT = Number(process.env.DEPOSIT_PERCENT ?? "20") / 100;

// Stripe's own StripeCardError.message is specific ("Your card has
// insufficient funds.", "Your card's security code is incorrect.") -- bucketed
// into two generic categories instead, rather than surfacing Stripe's exact
// wording to the customer.
const INVALID_INFO_CODES = new Set([
  "incorrect_cvc",
  "invalid_cvc",
  "incorrect_number",
  "invalid_number",
  "incorrect_zip",
  "invalid_expiry_month",
  "invalid_expiry_year",
  "expired_card",
]);

function cardErrorMessage(err: unknown): string {
  if (!(err instanceof Stripe.errors.StripeCardError)) {
    return "We couldn't process that card. Please check the details and try again.";
  }
  if (err.code && INVALID_INFO_CODES.has(err.code)) {
    return "That card's details look invalid. Please check the number, expiration, and security code.";
  }
  return "Your card was declined. Please try a different card or contact your bank.";
}

const bookingSchema = z.object({
  quoteRequestId: z.string().uuid(),
  paymentMethodId: z.string().min(1),
  contactEmail: z.string().email(),
  contactName: z.string().min(1),
  // Required acknowledgment per Section 4.5 -- the auto-charge-on-arrival
  // consent checkbox. The API refuses to book without it, so this can't be
  // skipped by calling the route directly.
  consentToAutoCharge: z.literal(true, {
    errorMap: () => ({ message: "Consent to the automatic balance charge is required to book." }),
  }),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed.", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }
  const data = parsed.data;
  const db = getDb();

  const { data: quote, error: quoteError } = await db
    .from("quote_requests")
    .select("*")
    .eq("id", data.quoteRequestId)
    .single();

  if (quoteError || !quote) {
    return NextResponse.json({ error: "Quote request not found." }, { status: 404 });
  }
  if (!quote.quoted_amount_cents) {
    return NextResponse.json(
      { error: "This quote hasn't been priced yet -- nothing to book against." },
      { status: 422 }
    );
  }

  const depositAmountCents = Math.round(quote.quoted_amount_cents * DEPOSIT_PERCENT);
  const balanceAmountCents = quote.quoted_amount_cents - depositAmountCents;

  let stripeResult;
  try {
    stripeResult = await createBookingCustomerAndDeposit({
      email: data.contactEmail,
      name: data.contactName,
      depositAmountCents,
      paymentMethodId: data.paymentMethodId,
      quoteRequestId: data.quoteRequestId,
    });
  } catch (err) {
    console.error("Stripe deposit charge failed:", err);
    return NextResponse.json({ error: cardErrorMessage(err) }, { status: 402 });
  }

  // `confirm: true` doesn't guarantee the charge went through -- a card that
  // needs 3D Secure comes back with status "requires_action" rather than
  // throwing. Treating that as success (the previous behavior here) would
  // record a "paid" deposit in the database for a charge Stripe never
  // actually captured. Only "succeeded" means the money moved; anything else
  // needs the client to finish authenticating before this booking is real.
  const intentStatus = stripeResult.depositIntent.status;
  if (intentStatus !== "succeeded" && intentStatus !== "requires_action") {
    console.error("Stripe deposit charge did not succeed, status:", intentStatus);
    return NextResponse.json(
      { error: "We couldn't process that card. Please check the details and try again." },
      { status: 402 }
    );
  }

  const consentTimestamp = new Date().toISOString();
  const consentIp = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? null;

  const { data: booking, error: bookingError } = await db
    .from("bookings")
    .insert({
      quote_request_id: data.quoteRequestId,
      deposit_amount_cents: depositAmountCents,
      deposit_status: intentStatus === "succeeded" ? "paid" : "pending",
      stripe_customer_id: stripeResult.customer.id,
      stripe_payment_method_id: data.paymentMethodId,
      balance_amount_cents: balanceAmountCents,
      balance_charge_status: "not_charged",
      consent_given_at: consentTimestamp,
      consent_ip: consentIp,
    })
    .select()
    .single();

  if (bookingError || !booking) {
    console.error("Failed to save booking after Stripe deposit attempt:", bookingError);
    // If the intent had already succeeded, the deposit went through in
    // Stripe at this point -- this needs manual reconciliation against the
    // Stripe dashboard using the PaymentIntent id below, since we can't
    // silently lose a paid deposit.
    return NextResponse.json(
      {
        error: "Payment succeeded but we couldn't save the booking. Contact support with this reference.",
        stripePaymentIntentId: stripeResult.depositIntent.id,
      },
      { status: 500 }
    );
  }

  if (intentStatus === "requires_action") {
    // Card needs 3D Secure -- the client must call stripe.confirmCardPayment
    // with this client secret to show the authentication challenge, then
    // hit /api/booking/[id]/confirm to finalize once that succeeds. The
    // booking stays "pending" until then.
    return NextResponse.json(
      {
        bookingId: booking.id,
        requiresAction: true,
        clientSecret: stripeResult.depositIntent.client_secret,
        paymentIntentId: stripeResult.depositIntent.id,
      },
      { status: 200 }
    );
  }

  await db.from("quote_requests").update({ status: "booked" }).eq("id", data.quoteRequestId);

  return NextResponse.json({ bookingId: booking.id, status: "booked" }, { status: 201 });
}
