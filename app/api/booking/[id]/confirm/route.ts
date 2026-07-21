import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb, type BookingRow } from "@/lib/db";
import { retrievePaymentIntent } from "@/lib/stripe";

// Finalizes a booking after the client has completed 3D Secure via
// stripe.confirmCardPayment (see components/BookingForm.tsx). Never trust
// the client's word that authentication succeeded -- re-fetch the
// PaymentIntent from Stripe and check its status, plus cross-check it
// actually belongs to this booking, before marking the deposit paid.
const confirmSchema = z.object({
  paymentIntentId: z.string().min(1),
});

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = confirmSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed.", issues: parsed.error.flatten() }, { status: 422 });
  }

  const db = getDb();
  const { data: booking, error: bookingError } = await db
    .from("bookings")
    .select("*")
    .eq("id", params.id)
    .single();

  if (bookingError || !booking) {
    return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  }
  const bookingRow = booking as BookingRow;

  if (bookingRow.deposit_status === "paid") {
    // Already finalized -- return success so a duplicate confirm (e.g. a
    // retried request) doesn't error out.
    return NextResponse.json({ bookingId: bookingRow.id, status: "booked" });
  }

  const intent = await retrievePaymentIntent(parsed.data.paymentIntentId);

  if (
    intent.customer !== bookingRow.stripe_customer_id ||
    intent.metadata.quote_request_id !== bookingRow.quote_request_id
  ) {
    return NextResponse.json({ error: "This payment doesn't match this booking." }, { status: 403 });
  }

  if (intent.status !== "succeeded") {
    return NextResponse.json(
      { error: "Payment hasn't been completed yet.", status: intent.status },
      { status: 402 }
    );
  }

  await db.from("bookings").update({ deposit_status: "paid" }).eq("id", bookingRow.id);
  await db.from("quote_requests").update({ status: "booked" }).eq("id", bookingRow.quote_request_id);

  return NextResponse.json({ bookingId: bookingRow.id, status: "booked" });
}
