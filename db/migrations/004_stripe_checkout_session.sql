-- Run this against the live Supabase project (SQL editor) to bring the
-- existing bookings table in line with the updated db/schema.sql: adds the
-- Stripe Checkout Session id so a booking row created before payment (to
-- capture consent even if the customer abandons checkout) can be found and
-- finalized idempotently once payment completes, whether that happens via
-- the success-page redirect or the Stripe webhook -- whichever fires first
-- wins, the other becomes a no-op.

alter table bookings add column if not exists stripe_checkout_session_id text unique;
