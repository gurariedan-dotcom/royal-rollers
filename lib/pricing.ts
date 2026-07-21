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

const BASE_FEE_CENTS = envNumber("ESTIMATE_BASE_FEE_CENTS", 15000);
const PER_MILE_CENTS = envNumber("ESTIMATE_PER_MILE_CENTS", 85);
const ENCLOSED_SURCHARGE_PERCENT = envNumber("ESTIMATE_ENCLOSED_SURCHARGE_PERCENT", 30);
const PERSONAL_DRIVER_SURCHARGE_PERCENT = envNumber("ESTIMATE_PERSONAL_DRIVER_SURCHARGE_PERCENT", 20);
const NOT_RUNNING_FLAT_ADD_CENTS = envNumber("ESTIMATE_NOT_RUNNING_FLAT_ADD_CENTS", 20000);
const RANGE_SPREAD_PERCENT = envNumber("ESTIMATE_RANGE_SPREAD_PERCENT", 15);

export type EstimateInput = {
  miles: number;
  serviceType: "carrier" | "personal_driver";
  enclosed?: "open" | "enclosed";
  isRunning: "running" | "not_running";
};

export type EstimateResult = {
  lowCents: number;
  highCents: number;
};

// Pure -- no fetch/DB calls, safe to call from a server route (current use)
// or unit-test directly.
export function computeEstimate(input: EstimateInput): EstimateResult {
  let midpoint = BASE_FEE_CENTS + input.miles * PER_MILE_CENTS;

  if (input.serviceType === "carrier" && input.enclosed === "enclosed") {
    midpoint *= 1 + ENCLOSED_SURCHARGE_PERCENT / 100;
  }
  if (input.serviceType === "personal_driver") {
    midpoint *= 1 + PERSONAL_DRIVER_SURCHARGE_PERCENT / 100;
  }
  if (input.isRunning === "not_running") {
    midpoint += NOT_RUNNING_FLAT_ADD_CENTS;
  }

  const spread = midpoint * (RANGE_SPREAD_PERCENT / 100);
  return {
    lowCents: Math.max(0, Math.round(midpoint - spread)),
    highCents: Math.round(midpoint + spread),
  };
}
