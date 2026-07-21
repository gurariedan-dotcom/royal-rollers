-- Run this against the live Supabase project (SQL editor) to bring the
-- existing quote_requests table in line with the updated db/schema.sql:
-- adds a round_trip flag so a snowbird-style out-and-back job can be
-- requested and priced as one quote.

alter table quote_requests add column if not exists round_trip boolean not null default false;
