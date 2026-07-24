import Stripe from "stripe";
import { getDb, type BookingRow } from "@/lib/db";

// Finalizes a booking after its Stripe Checkout Session has been paid.
// Called from two places that race to be first: the success-page redirect
// (fast path, fires for almost every real customer) and the Stripe webhook
// (safety net for the case where the customer pays but closes the tab
// before the redirect completes). Whichever runs first wins; the other is
// a no-op via the `deposit_status === "paid"` guard below, keyed off the
// unique `stripe_checkout_session_id` rather than trusting either caller.
export async function finalizeBookingFromSession(session: Stripe.Checkout.Session) {
  if (session.payment_status !== "paid") {
    return { status: "not_paid" as const };
  }

  const db = getDb();
  const { data: booking, error } = await db
    .from("bookings")
    .select("*")
    .eq("stripe_checkout_session_id", session.id)
    .single();

  if (error || !booking) {
    return { status: "booking_not_found" as const };
  }

  const bookingRow = booking as BookingRow;
  if (bookingRow.deposit_status === "paid") {
    return { status: "already_finalized" as const, bookingId: bookingRow.id };
  }

  const paymentIntent = session.payment_intent as Stripe.PaymentIntent | null;
  const paymentMethod = paymentIntent?.payment_method as Stripe.PaymentMethod | string | null | undefined;
  const paymentMethodId = typeof paymentMethod === "string" ? paymentMethod : paymentMethod?.id;
  const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id;

  if (!customerId || !paymentMethodId) {
    console.error(`Checkout session ${session.id} paid but missing customer/payment method for booking ${bookingRow.id}`);
    return { status: "missing_payment_details" as const };
  }

  await db
    .from("bookings")
    .update({
      deposit_status: "paid",
      stripe_customer_id: customerId,
      stripe_payment_method_id: paymentMethodId,
    })
    .eq("id", bookingRow.id);

  await db.from("quote_requests").update({ status: "booked" }).eq("id", bookingRow.quote_request_id);

  return { status: "finalized" as const, bookingId: bookingRow.id };
}
