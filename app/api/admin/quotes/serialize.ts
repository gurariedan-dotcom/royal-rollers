import type { QuoteRequestRow } from "@/lib/db";

// Shared by the admin quotes list (GET) and single-quote edit (PATCH) routes
// so both send the client the same shape.
export function serializeQuoteForAdmin(q: QuoteRequestRow) {
  return {
    id: q.id,
    orderNumber: q.order_number,
    serviceType: q.service_type,
    vin: q.vin,
    vehicleYear: q.vehicle_year,
    vehicleMake: q.vehicle_make,
    vehicleModel: q.vehicle_model,
    vehicle: [q.vehicle_year, q.vehicle_make, q.vehicle_model].filter(Boolean).join(" "),
    vehicleType: q.vehicle_type,
    isRunning: q.is_running,
    enclosed: q.enclosed,
    pickupZip: q.pickup_zip,
    dropoffZip: q.dropoff_zip,
    roundTrip: q.round_trip,
    route: `${q.pickup_zip} → ${q.dropoff_zip}${q.round_trip ? " (round trip)" : ""}`,
    preferredPickupDate: q.preferred_pickup_date,
    flexibilityWindow: q.flexibility_window,
    contactName: q.contact_name,
    contactPhone: q.contact_phone,
    contactEmail: q.contact_email,
    status: q.status,
    quotedAmountCents: q.quoted_amount_cents,
    createdAt: q.created_at,
  };
}
