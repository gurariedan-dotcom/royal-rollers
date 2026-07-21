import { createClient } from "@supabase/supabase-js";

// Server-only client. Uses the service-role key so API routes can write
// quote_requests/bookings rows regardless of row-level-security policy,
// which is appropriate here because this file is only ever imported from
// server code (API routes), never from a client component.
//
// Required env vars (see .env.example):
//   SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY
function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. Check .env.local against .env.example.`
    );
  }
  return value;
}

// No generated Database type is wired up here -- every caller already
// manually casts query results to QuoteRequestRow/BookingRow below. Without
// an explicit generic, `.update()`/`.select()` calls resolve their argument
// types to `never` under strict type-checking (this only surfaces in
// `next build`, not `next dev`, which is why it went unnoticed locally).
let cachedClient: ReturnType<typeof createClient<any>> | null = null;

export function getDb() {
  if (!cachedClient) {
    cachedClient = createClient<any>(
      getEnv("SUPABASE_URL"),
      getEnv("SUPABASE_SERVICE_ROLE_KEY"),
      { auth: { persistSession: false } }
    );
  }
  return cachedClient;
}

// Row shapes matching db/schema.sql -- kept here so API routes don't need to
// re-derive types from raw query results.
export type QuoteRequestRow = {
  id: string;
  service_type: "carrier" | "personal_driver";
  vin: string | null;
  vehicle_year: number | null;
  vehicle_make: string | null;
  vehicle_model: string | null;
  vehicle_type: string | null;
  is_running: boolean | null;
  enclosed: boolean | null;
  pickup_zip: string;
  dropoff_zip: string;
  preferred_pickup_date: string | null;
  flexibility_window: string | null;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  status: "pending" | "quoted" | "booked" | "completed";
  quoted_amount_cents: number | null;
  created_at: string;
};

export type BookingRow = {
  id: string;
  quote_request_id: string;
  deposit_amount_cents: number;
  deposit_status: "pending" | "paid";
  stripe_customer_id: string | null;
  stripe_payment_method_id: string | null;
  balance_amount_cents: number | null;
  balance_charge_status: "not_charged" | "charged" | "failed";
  consent_given_at: string | null;
  consent_ip: string | null;
  created_at: string;
};
