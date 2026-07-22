import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// Read-only list for the internal /admin/quotes page -- lets the owner see
// every incoming quote request (not just ones that became bookings) and
// price the ones still pending. Same shared-secret auth as the other
// internal ops routes (bookings, charge-balance, quote pricing).
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const expected = process.env.INTERNAL_OPS_SECRET;
  if (!expected || authHeader !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const db = getDb();
  const { data, error } = await db
    .from("quote_requests")
    .select(
      "id, service_type, vin, vehicle_year, vehicle_make, vehicle_model, vehicle_type, is_running, " +
        "enclosed, pickup_zip, dropoff_zip, round_trip, preferred_pickup_date, flexibility_window, " +
        "contact_name, contact_phone, contact_email, status, quoted_amount_cents, created_at"
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load quotes for admin list:", error);
    return NextResponse.json({ error: "Failed to load quotes." }, { status: 500 });
  }

  const quotes = ((data ?? []) as unknown as Record<string, unknown>[]).map((q) => ({
    id: q.id,
    serviceType: q.service_type,
    vin: q.vin,
    vehicle: [q.vehicle_year, q.vehicle_make, q.vehicle_model].filter(Boolean).join(" "),
    vehicleType: q.vehicle_type,
    isRunning: q.is_running,
    enclosed: q.enclosed,
    route: `${q.pickup_zip} → ${q.dropoff_zip}${q.round_trip ? " (round trip)" : ""}`,
    preferredPickupDate: q.preferred_pickup_date,
    flexibilityWindow: q.flexibility_window,
    contactName: q.contact_name,
    contactPhone: q.contact_phone,
    contactEmail: q.contact_email,
    status: q.status,
    quotedAmountCents: q.quoted_amount_cents,
    createdAt: q.created_at,
  }));

  return NextResponse.json({ quotes });
}
