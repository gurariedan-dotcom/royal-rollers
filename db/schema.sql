-- Royal Rollers schema.
-- Extends the draft in the handoff doc (Section 8) with two additions
-- identified during review, before any code was written against it:
--   1. quoted_amount_cents on quote_requests -- the doc had nowhere to
--      store the actual price once the owner quotes it, which is the
--      missing link between "quote requested" and "deposit amount."
--   2. consent_given_at / consent_ip on bookings -- the doc calls for a
--      consent checkbox at booking time but didn't say to record when/how
--      consent was given, which matters for payment-processor disputes.

create extension if not exists "pgcrypto";

create table quote_requests (
  id uuid primary key default gen_random_uuid(),
  service_type text not null check (service_type in ('carrier', 'personal_driver')),
  vin text not null,
  vehicle_year integer,
  vehicle_make text,
  vehicle_model text,
  is_running boolean,
  enclosed boolean, -- null when service_type = 'personal_driver'
  pickup_zip text not null,
  dropoff_zip text not null,
  preferred_pickup_date date,
  flexibility_window text,
  contact_name text not null,
  contact_phone text not null,
  contact_email text not null,
  status text not null default 'pending' check (status in ('pending', 'quoted', 'booked', 'completed')),
  quoted_amount_cents integer, -- set when the owner sends back a price (Section 4.4)
  created_at timestamptz not null default now()
);

create table bookings (
  id uuid primary key default gen_random_uuid(),
  quote_request_id uuid not null references quote_requests(id),
  deposit_amount_cents integer not null,
  deposit_status text not null default 'pending' check (deposit_status in ('pending', 'paid')),
  stripe_customer_id text,
  stripe_payment_method_id text,
  balance_amount_cents integer,
  balance_charge_status text not null default 'not_charged'
    check (balance_charge_status in ('not_charged', 'charged', 'failed')),
  consent_given_at timestamptz, -- when the customer checked the auto-charge acknowledgment
  consent_ip text,
  created_at timestamptz not null default now()
);

create index quote_requests_status_idx on quote_requests(status);
create index bookings_quote_request_id_idx on bookings(quote_request_id);
