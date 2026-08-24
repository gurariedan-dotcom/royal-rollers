// Pricing for the non-binding, on-screen instant estimate shown while a
// customer fills out the quote form (see app/api/route-distance/route.ts
// and components/QuoteForm.tsx). This NEVER touches the real price -- the
// only binding, enforceable price is the one the owner manually sets via
// PATCH /api/quote/[id]/price. These figures are placeholders pending a
// real pricing decision, the same status DEPOSIT_PERCENT had before that
// got decided -- see README.md "Still open".
//
// Unlike payment-related env vars (e.g. STRIPE_SECRET_KEY), a missing or
// malformed value here should never break the page -- it just falls back
// to the default, since a broken estimate is low-stakes compared to a
// broken payment.
function envNumber(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

// Personal driver only -- carrier has no base fee (flat per-mile instead).
const BASE_FEE_CENTS = envNumber("ESTIMATE_BASE_FEE_CENTS", 15000);
const CARRIER_PER_MILE_CENTS = envNumber("ESTIMATE_CARRIER_PER_MILE_CENTS", 100);
const PERSONAL_DRIVER_PER_MILE_CENTS = envNumber("ESTIMATE_PERSONAL_DRIVER_PER_MILE_CENTS", 80);
const ENCLOSED_SURCHARGE_PERCENT = envNumber("ESTIMATE_ENCLOSED_SURCHARGE_PERCENT", 40);
const NOT_RUNNING_FLAT_ADD_CENTS = envNumber("ESTIMATE_NOT_RUNNING_FLAT_ADD_CENTS", 20000);
const RANGE_SPREAD_PERCENT = envNumber("ESTIMATE_RANGE_SPREAD_PERCENT", 5);
// Carrier long-haul discount -- checked against the total trip distance,
// i.e. after round trip doubles it (a 900mi one-way becomes 1800mi and
// qualifies even though 900mi alone wouldn't).
const CARRIER_LONG_HAUL_DISCOUNT_THRESHOLD_MILES = envNumber(
  "ESTIMATE_CARRIER_LONG_HAUL_DISCOUNT_THRESHOLD_MILES",
  1300,
);
const CARRIER_LONG_HAUL_DISCOUNT_PERCENT = envNumber("ESTIMATE_CARRIER_LONG_HAUL_DISCOUNT_PERCENT", 15);
const PERSONAL_DRIVER_ROUND_TRIP_DISCOUNT_CENTS = envNumber(
  "ESTIMATE_PERSONAL_DRIVER_ROUND_TRIP_DISCOUNT_CENTS",
  20000,
);
// Floor for the displayed range -- carrier pricing is a flat per-mile rate
// with no base fee, so very short/local routes can midpoint under $25 and
// round to $0 at $50 granularity. Never show a $0 estimate for a real trip.
const MINIMUM_ESTIMATE_CENTS = envNumber("ESTIMATE_MINIMUM_CENTS", 5000);

// ARCHIVED 2026-08-10: vehicle-size surcharge, disabled per request -- carrier
// and personal-driver quotes are now flat rate regardless of vehicleType.
// Kept here in case it needs to come back; not wired into computeEstimate.
//
// const VEHICLE_SURCHARGE_PERCENT: Record<Exclude<EstimateInput["vehicleType"], "sedan">, number> = {
//   suv: envNumber("ESTIMATE_SUV_SURCHARGE_PERCENT", 10),
//   minivan: envNumber("ESTIMATE_MINIVAN_SURCHARGE_PERCENT", 15),
//   pickup: envNumber("ESTIMATE_PICKUP_SURCHARGE_PERCENT", 20),
//   full_size_suv: envNumber("ESTIMATE_FULLSIZE_SUV_SURCHARGE_PERCENT", 30),
// };

export type EstimateInput = {
  miles: number;
  serviceType: "carrier" | "personal_driver";
  enclosed?: "open" | "enclosed";
  isRunning: "running" | "not_running";
  vehicleType: "sedan" | "suv" | "minivan" | "pickup" | "full_size_suv";
  // Round trip = the vehicle goes out and comes back later (common for
  // Tri-State <-> Florida snowbirds, see app/about/page.tsx). Priced as two
  // one-way jobs -- doubles total mileage, which can push a carrier trip
  // past the long-haul discount threshold on its own.
  roundTrip?: boolean;
};

export type EstimateResult = {
  lowCents: number;
  highCents: number;
};

// Pure -- no fetch/DB calls, safe to call from a server route (current use)
// or unit-test directly.
export function computeEstimate(input: EstimateInput): EstimateResult {
  const legs = input.roundTrip ? 2 : 1;
  const totalMiles = input.miles * legs;

  let midpoint: number;
  if (input.serviceType === "carrier") {
    midpoint = totalMiles * CARRIER_PER_MILE_CENTS;
    if (totalMiles > CARRIER_LONG_HAUL_DISCOUNT_THRESHOLD_MILES) {
      midpoint *= 1 - CARRIER_LONG_HAUL_DISCOUNT_PERCENT / 100;
    }
    if (input.enclosed === "enclosed") {
      midpoint *= 1 + ENCLOSED_SURCHARGE_PERCENT / 100;
    }
  } else {
    midpoint = BASE_FEE_CENTS * legs + totalMiles * PERSONAL_DRIVER_PER_MILE_CENTS;
    if (input.roundTrip) {
      midpoint -= PERSONAL_DRIVER_ROUND_TRIP_DISCOUNT_CENTS;
    }
  }

  if (input.isRunning === "not_running") {
    midpoint += NOT_RUNNING_FLAT_ADD_CENTS * legs;
  }

  const spread = midpoint * (RANGE_SPREAD_PERCENT / 100);
  // Rounded to the nearest $50 -- this is a rough estimate, not a quote, no
  // need for cent-level precision.
  const roundToFiftyDollars = (cents: number) => Math.round(cents / 5000) * 5000;
  return {
    lowCents: Math.max(MINIMUM_ESTIMATE_CENTS, roundToFiftyDollars(midpoint - spread)),
    highCents: Math.max(MINIMUM_ESTIMATE_CENTS, roundToFiftyDollars(midpoint + spread)),
  };
}
