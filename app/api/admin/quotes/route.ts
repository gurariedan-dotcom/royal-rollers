import { NextRequest, NextResponse } from "next/server";
import { getDb, type QuoteRequestRow } from "@/lib/db";
import { rateLimit } from "@/lib/http";
import { serializeQuoteForAdmin } from "./serialize";

// Read-only list for the internal /admin/quotes page -- lets the owner see
// every incoming quote request (not just ones that became bookings) and
// price the ones still pending. Same shared-secret auth as the other
// internal ops routes (bookings, charge-balance, quote pricing).
export async function GET(req: NextRequest) {
  const limited = rateLimit(req, "admin-quotes", 30, 15 * 60_000);
  if (limited) return limited;

  const authHeader = req.headers.get("authorization");
  const expected = process.env.INTERNAL_OPS_SECRET;
  if (!expected || authHeader !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const db = getDb();
  const { data, error } = await db
    .from("quote_requests")
    .select(
      "id, order_number, service_type, vin, vehicle_year, vehicle_make, vehicle_model, vehicle_type, is_running, " +
        "enclosed, pickup_zip, dropoff_zip, round_trip, preferred_pickup_date, flexibility_window, " +
        "contact_name, contact_phone, contact_email, status, quoted_amount_cents, created_at"
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load quotes for admin list:", error);
    return NextResponse.json({ error: "Failed to load quotes." }, { status: 500 });
  }

  const quotes = ((data ?? []) as unknown as QuoteRequestRow[]).map(serializeQuoteForAdmin);

  return NextResponse.json({ quotes });
}
