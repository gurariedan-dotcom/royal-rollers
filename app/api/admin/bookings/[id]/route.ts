import { NextRequest, NextResponse } from "next/server";
import { getDb, type BookingRow } from "@/lib/db";

// Deletes a booking and its underlying quote request -- used from the
// internal /admin/bookings page to clear out test/example data or handle a
// customer's deletion request. Does NOT touch Stripe: the customer, saved
// payment method, and charge history stay there as the permanent financial
// record. This only removes our own copy of the data.
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const authHeader = req.headers.get("authorization");
  const expected = process.env.INTERNAL_OPS_SECRET;
  if (!expected || authHeader !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const db = getDb();
  const { data: booking, error: findError } = await db
    .from("bookings")
    .select("quote_request_id")
    .eq("id", params.id)
    .single();

  if (findError || !booking) {
    return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  }
  const quoteRequestId = (booking as Pick<BookingRow, "quote_request_id">).quote_request_id;

  const { error: deleteBookingError } = await db.from("bookings").delete().eq("id", params.id);
  if (deleteBookingError) {
    console.error("Failed to delete booking:", deleteBookingError);
    return NextResponse.json({ error: "Failed to delete booking." }, { status: 500 });
  }

  const { error: deleteQuoteError } = await db
    .from("quote_requests")
    .delete()
    .eq("id", quoteRequestId);
  if (deleteQuoteError) {
    // Not fatal -- the booking (the record with payment/consent data) is
    // already gone, which is the sensitive part. An orphaned quote row can
    // be cleaned up separately.
    console.error("Deleted booking but failed to delete its quote request:", deleteQuoteError);
  }

  return NextResponse.json({ deleted: true });
}
