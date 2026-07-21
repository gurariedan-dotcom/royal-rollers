import { NextRequest, NextResponse } from "next/server";
import { quoteRequestSchema } from "@/lib/validation";
import { getDb, type QuoteRequestRow } from "@/lib/db";
import { sendOwnerAlertEmail, sendQuoteReceivedEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = quoteRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed.", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }
  const data = parsed.data;

  const db = getDb();
  const { data: inserted, error } = await db
    .from("quote_requests")
    .insert({
      service_type: data.serviceType,
      vin: data.vin ? data.vin.toUpperCase() : null,
      vehicle_year: data.vehicleYear,
      vehicle_make: data.vehicleMake,
      vehicle_model: data.vehicleModel,
      vehicle_type: data.vehicleType ?? null,
      is_running: data.isRunning === "running",
      enclosed: data.serviceType === "carrier" ? data.enclosed === "enclosed" : null,
      pickup_zip: data.pickupZip,
      dropoff_zip: data.dropoffZip,
      round_trip: data.roundTrip ?? false,
      preferred_pickup_date: data.preferredPickupDate,
      flexibility_window: data.flexibilityWindow,
      contact_name: data.contactName,
      contact_phone: data.contactPhone,
      contact_email: data.contactEmail,
      status: "pending",
    })
    .select()
    .single();

  if (error || !inserted) {
    console.error("Failed to save quote request:", error);
    return NextResponse.json(
      { error: "Something went wrong saving your request. Please try again." },
      { status: 500 }
    );
  }

  const quote = inserted as QuoteRequestRow;

  // Best-effort: a slow/failed email shouldn't make the customer think their
  // request wasn't received when it was already saved above.
  const emailResults = await Promise.allSettled([
    sendQuoteReceivedEmail(quote),
    sendOwnerAlertEmail(quote),
  ]);
  emailResults.forEach((result, i) => {
    if (result.status === "rejected") {
      console.error(`Email ${i === 0 ? "to customer" : "to owner"} failed:`, result.reason);
    }
  });

  return NextResponse.json({ id: quote.id, status: quote.status }, { status: 201 });
}
