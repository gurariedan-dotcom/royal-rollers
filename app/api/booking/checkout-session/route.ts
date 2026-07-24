import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { createDepositCheckoutSession } from "@/lib/stripe";

// Deposit/balance amounts are deliberately NOT accepted from the client --
// they're derived here from the quote's stored quoted_amount_cents (see
// app/api/quote/[id]/route.ts), the same way that route computes them for
// display. A client-supplied amount would let anyone book at any price.
const DEPOSIT_PERCENT = Number(process.env.DEPOSIT_PERCENT ?? "20") / 100;

const bookingSchema = z.object({
  quoteRequestId: z.string().uuid(),
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

  // Stripe rejects any Checkout Session whose total is under $0.50 USD. A
  // quote priced low enough that its deposit share falls below that floor
  // would otherwise fail inside createDepositCheckoutSession with an opaque
  // "Could not start checkout" -- catching it here gives a real explanation.
  if (depositAmountCents < 50) {
    return NextResponse.json(
      { error: "This quote's deposit is too small to charge. Please contact us to re-price it." },
      { status: 422 }
    );
  }

  // Written as "pending" before the customer even reaches Stripe, so the
  // consent acknowledgment (with its timestamp/IP, which matters for
  // payment-processor disputes) is captured up front rather than only on
  // successful payment -- and so the Checkout Session has a booking row to
  // attach itself back to once payment completes (see lib/booking.ts).
  const consentTimestamp = new Date().toISOString();
  const consentIp = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? null;

  const { data: booking, error: bookingError } = await db
    .from("bookings")
    .insert({
      quote_request_id: data.quoteRequestId,
      deposit_amount_cents: depositAmountCents,
      deposit_status: "pending",
      balance_amount_cents: balanceAmountCents,
      balance_charge_status: "not_charged",
      consent_given_at: consentTimestamp,
      consent_ip: consentIp,
    })
    .select()
    .single();

  if (bookingError || !booking) {
    console.error("Failed to create pending booking:", bookingError);
    return NextResponse.json({ error: "Could not start checkout. Please try again." }, { status: 500 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? req.nextUrl.origin;

  let session;
  try {
    session = await createDepositCheckoutSession({
      email: data.contactEmail,
      name: data.contactName,
      depositAmountCents,
      quoteRequestId: data.quoteRequestId,
      bookingId: booking.id,
      successUrl: `${siteUrl}/book/${data.quoteRequestId}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${siteUrl}/book/${data.quoteRequestId}?canceled=1`,
    });
  } catch (err) {
    console.error("Stripe Checkout Session creation failed:", err);
    // Nothing was charged -- safe to remove the pending row rather than
    // leave an orphaned booking with no way to ever pay it.
    await db.from("bookings").delete().eq("id", booking.id);
    return NextResponse.json({ error: "Could not start checkout. Please try again." }, { status: 502 });
  }

  if (!session.url) {
    await db.from("bookings").delete().eq("id", booking.id);
    return NextResponse.json({ error: "Could not start checkout. Please try again." }, { status: 502 });
  }

  await db.from("bookings").update({ stripe_checkout_session_id: session.id }).eq("id", booking.id);

  return NextResponse.json({ checkoutUrl: session.url });
}
