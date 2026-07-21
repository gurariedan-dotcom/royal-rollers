import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// Read-only list for the internal /admin/bookings page. Protected by the
// same shared secret as the other internal ops routes (charge-balance,
// quote pricing) -- no separate auth system introduced for this.
//
// Joins quote_requests in a single query via the existing foreign key
// (bookings.quote_request_id -> quote_requests.id) so the customer name,
// vehicle, and route can be shown without a second round trip.
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const expected = process.env.INTERNAL_OPS_SECRET;
  if (!expected || authHeader !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const db = getDb();
  const { data, error } = await db
    .from("bookings")
    .select(
      "id, deposit_amount_cents, deposit_status, balance_amount_cents, balance_charge_status, created_at, " +
        "quote_requests(contact_name, contact_email, vehicle_year, vehicle_make, vehicle_model, vehicle_type, pickup_zip, dropoff_zip, round_trip)"
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load bookings for admin list:", error);
    return NextResponse.json({ error: "Failed to load bookings." }, { status: 500 });
  }

  const bookings = ((data ?? []) as unknown as Record<string, unknown>[]).map((row) => {
    const quote = row.quote_requests as Record<string, unknown> | null;
    return {
      id: row.id,
      contactName: quote?.contact_name ?? "(quote not found)",
      contactEmail: quote?.contact_email ?? "",
      vehicle: [quote?.vehicle_year, quote?.vehicle_make, quote?.vehicle_model, quote?.vehicle_type ? `(${quote.vehicle_type})` : null]
        .filter(Boolean)
        .join(" "),
      route: quote ? `${quote.pickup_zip} → ${quote.dropoff_zip}${quote.round_trip ? " (round trip)" : ""}` : "",
      depositAmountCents: row.deposit_amount_cents,
      depositStatus: row.deposit_status,
      balanceAmountCents: row.balance_amount_cents,
      balanceChargeStatus: row.balance_charge_status,
      createdAt: row.created_at,
    };
  });

  return NextResponse.json({ bookings });
}
