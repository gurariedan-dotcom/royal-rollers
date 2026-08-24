import { NextRequest, NextResponse } from "next/server";
import { getDb, type QuoteRequestRow } from "@/lib/db";
import { rateLimit, readJsonBody } from "@/lib/http";
import { quoteRequestEditSchema } from "@/lib/validation";
import { serializeQuoteForAdmin } from "../serialize";

// Lets the owner correct a detail on an already-submitted request (typo'd
// phone, wrong ZIP, VIN found after the fact) from /admin/quotes. Separate
// from PATCH /api/quote/[id]/price, which is customer-facing pricing and
// triggers the quote-ready email -- this route never emails anyone, it just
// edits the record. Same shared-secret auth as the other internal ops routes.
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const limited = rateLimit(req, "admin-quotes-edit", 30, 15 * 60_000);
  if (limited) return limited;

  const authHeader = req.headers.get("authorization");
  const expected = process.env.INTERNAL_OPS_SECRET;
  if (!expected || authHeader !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const bodyResult = await readJsonBody(req);
  if (!bodyResult.ok) return bodyResult.response;

  const parsed = quoteRequestEditSchema.safeParse(bodyResult.body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed.", issues: parsed.error.flatten() }, { status: 422 });
  }
  const data = parsed.data;

  const update: Record<string, unknown> = {};
  if (data.serviceType !== undefined) update.service_type = data.serviceType;
  if (data.vin !== undefined) update.vin = data.vin ? data.vin.toUpperCase() : null;
  if (data.vehicleYear !== undefined) update.vehicle_year = data.vehicleYear;
  if (data.vehicleMake !== undefined) update.vehicle_make = data.vehicleMake;
  if (data.vehicleModel !== undefined) update.vehicle_model = data.vehicleModel;
  if (data.vehicleType !== undefined) update.vehicle_type = data.vehicleType;
  if (data.isRunning !== undefined) update.is_running = data.isRunning === "running";
  if (data.enclosed !== undefined) update.enclosed = data.enclosed === "enclosed";
  if (data.pickupZip !== undefined) update.pickup_zip = data.pickupZip;
  if (data.dropoffZip !== undefined) update.dropoff_zip = data.dropoffZip;
  if (data.roundTrip !== undefined) update.round_trip = data.roundTrip;
  if (data.preferredPickupDate !== undefined) update.preferred_pickup_date = data.preferredPickupDate;
  if (data.flexibilityWindow !== undefined) update.flexibility_window = data.flexibilityWindow;
  if (data.contactName !== undefined) update.contact_name = data.contactName;
  if (data.contactPhone !== undefined) update.contact_phone = data.contactPhone;
  if (data.contactEmail !== undefined) update.contact_email = data.contactEmail;

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "No fields to update." }, { status: 422 });
  }

  const db = getDb();
  const { data: updated, error } = await db
    .from("quote_requests")
    .update(update)
    .eq("id", params.id)
    .select()
    .single();

  if (error || !updated) {
    return NextResponse.json({ error: "Quote not found." }, { status: 404 });
  }

  return NextResponse.json({ quote: serializeQuoteForAdmin(updated as QuoteRequestRow) });
}

// Removes a test/irrelevant quote request from /admin/quotes. Refuses if a
// booking already references it -- bookings carry the payment/consent
// record, so that deletion has to go through DELETE /api/admin/bookings/[id]
// (which removes the booking and its quote request together) rather than
// this route silently orphaning a paid booking's quote_request_id FK.
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const limited = rateLimit(req, "admin-quotes-delete", 30, 15 * 60_000);
  if (limited) return limited;

  const authHeader = req.headers.get("authorization");
  const expected = process.env.INTERNAL_OPS_SECRET;
  if (!expected || authHeader !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const db = getDb();

  const { data: existingBooking } = await db
    .from("bookings")
    .select("id")
    .eq("quote_request_id", params.id)
    .maybeSingle();

  if (existingBooking) {
    return NextResponse.json(
      { error: "This request has a booking attached -- delete the booking from /admin/bookings instead." },
      { status: 409 }
    );
  }

  const { error, count } = await db.from("quote_requests").delete({ count: "exact" }).eq("id", params.id);

  if (error) {
    console.error("Failed to delete quote request:", error);
    return NextResponse.json({ error: "Failed to delete quote request." }, { status: 500 });
  }
  if (!count) {
    return NextResponse.json({ error: "Quote not found." }, { status: 404 });
  }

  return NextResponse.json({ deleted: true });
}
