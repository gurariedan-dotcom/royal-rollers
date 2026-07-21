import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb, type BookingRow } from "@/lib/db";
import { chargeRemainingBalance } from "@/lib/stripe";
import { sendBalanceChargeFailedEmail, sendBalanceChargeFailedOwnerAlertEmail } from "@/lib/email";

// IMPORTANT -- this route has no real trigger yet.
//
// The handoff doc says the balance is charged "automatically ... upon
// vehicle arrival/delivery," but nothing in planning defined what actually
// fires that: a manual "mark delivered" click somewhere, a scheduled date,
// a webhook from Central Dispatch, etc. There's no admin UI in this build
// to click a button from, so for now this is a plain authenticated endpoint
// (shared-secret header) that something -- a manual curl/Postman call, a
// cron job, or a future admin page -- has to call on purpose.
//
// Do not wire this to run unattended (e.g. "charge N days after pickup")
// without deciding that's actually the right trigger -- an early or wrong
// charge on a customer's card is a real trust problem for this business.
const chargeBalanceSchema = z.object({
  bookingId: z.string().uuid(),
});

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const expected = process.env.INTERNAL_OPS_SECRET;
  if (!expected || authHeader !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = chargeBalanceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed.", issues: parsed.error.flatten() }, { status: 422 });
  }

  const db = getDb();
  const { data: booking, error } = await db
    .from("bookings")
    .select("*")
    .eq("id", parsed.data.bookingId)
    .single();

  if (error || !booking) {
    return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  }

  const b = booking as BookingRow;

  if (b.balance_charge_status === "charged") {
    return NextResponse.json({ status: "already_charged" }, { status: 200 });
  }
  if (!b.stripe_customer_id || !b.stripe_payment_method_id || !b.balance_amount_cents) {
    return NextResponse.json({ error: "Booking is missing payment details." }, { status: 422 });
  }

  const result = await chargeRemainingBalance({
    stripeCustomerId: b.stripe_customer_id,
    stripePaymentMethodId: b.stripe_payment_method_id,
    balanceAmountCents: b.balance_amount_cents,
    quoteRequestId: b.quote_request_id,
  });

  if (!result.success) {
    await db.from("bookings").update({ balance_charge_status: "failed" }).eq("id", b.id);
    console.error(`Balance charge failed for booking ${b.id}:`, result.reason);

    // Card declined or needs 3D-Secure re-authentication -- either way the
    // customer needs to hear from a human, not just see a "failed" status
    // nobody outside this system can see.
    const { data: quote } = await db
      .from("quote_requests")
      .select("contact_name, contact_email")
      .eq("id", b.quote_request_id)
      .single();

    if (quote) {
      const emailResults = await Promise.allSettled([
        sendBalanceChargeFailedEmail({
          contactName: quote.contact_name,
          contactEmail: quote.contact_email,
          balanceAmountCents: b.balance_amount_cents,
          quoteRequestId: b.quote_request_id,
          reason: result.reason,
        }),
        sendBalanceChargeFailedOwnerAlertEmail({
          contactName: quote.contact_name,
          contactEmail: quote.contact_email,
          balanceAmountCents: b.balance_amount_cents,
          quoteRequestId: b.quote_request_id,
          reason: result.reason,
        }),
      ]);
      emailResults.forEach((r, i) => {
        if (r.status === "rejected") {
          console.error(`Balance-failure email ${i === 0 ? "to customer" : "to owner"} failed:`, r.reason);
        }
      });
    }

    return NextResponse.json(
      { error: "Balance charge failed.", reason: result.reason },
      { status: 402 }
    );
  }

  await db.from("bookings").update({ balance_charge_status: "charged" }).eq("id", b.id);
  await db
    .from("quote_requests")
    .update({ status: "completed" })
    .eq("id", b.quote_request_id);

  return NextResponse.json({ status: "charged", paymentIntentId: result.paymentIntent.id });
}
