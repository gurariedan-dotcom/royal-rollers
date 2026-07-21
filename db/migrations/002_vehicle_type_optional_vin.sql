-- Run this against the live Supabase project (SQL editor) to bring the
-- existing quote_requests table in line with the updated db/schema.sql:
--   1. Vehicle info configurator now lets customers skip the VIN and enter
--      year/make/model/type manually instead, so vin can no longer be
--      not-null.
--   2. New vehicle_type column (body style: sedan/suv/truck/etc), only
--      collected in manual-entry mode.

alter table quote_requests alter column vin drop not null;
alter table quote_requests add column if not exists vehicle_type text;
