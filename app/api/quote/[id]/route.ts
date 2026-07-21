import { NextRequest, NextResponse } from "next/server";
import { getDb, type QuoteRequestRow } from "@/lib/db";

// Deposit split lives here, server-side, so it's never something a client
// request can override (see app/api/booking/route.ts, which reads the same
// stored quoted_amount_cents rather than trusting a client-supplied number).
// The percentage itself is a placeholder -- the handoff doc explicitly
// leaves "deposit amount or structure" as an open decision (Section 10).
// Swap this for whatever the owner decides (flat fee vs. percentage).
const DEPOSIT_PERCENT = Number(process.env.DEPOSIT_PERCENT ?? "20") / 100;

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const db = getDb();
  const { data, error } = await db
    .from("quote_requests")
    .select(
      "id, service_type, vehicle_year, vehicle_make, vehicle_model, pickup_zip, dropoff_zip, status, quoted_amount_cents, contact_name, contact_email"
    )
    .eq("id", params.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Quote not found." }, { status: 404 });
  }

  const quote = data as Pick<
    QuoteRequestRow,
    | "id"
    | "service_type"
    | "vehicle_year"
    | "vehicle_make"
    | "vehicle_model"
    | "pickup_zip"
    | "dropoff_zip"
    | "status"
    | "quoted_amount_cents"
    | "contact_name"
    | "contact_email"
  >;

  if (!quote.quoted_amount_cents) {
    return NextResponse.json(
      { id: quote.id, status: quote.status, priced: false },
      { status: 200 }
    );
  }

  const depositAmountCents = Math.round(quote.quoted_amount_cents * DEPOSIT_PERCENT);
  const balanceAmountCents = quote.quoted_amount_cents - depositAmountCents;

  return NextResponse.json({
    id: quote.id,
    status: quote.status,
    priced: true,
    serviceType: quote.service_type,
    vehicle: `${quote.vehicle_year ?? ""} ${quote.vehicle_make ?? ""} ${quote.vehicle_model ?? ""}`.trim(),
    pickupZip: quote.pickup_zip,
    dropoffZip: quote.dropoff_zip,
    contactName: quote.contact_name,
    contactEmail: quote.contact_email,
    quotedAmountCents: quote.quoted_amount_cents,
    depositAmountCents,
    balanceAmountCents,
  });
}
