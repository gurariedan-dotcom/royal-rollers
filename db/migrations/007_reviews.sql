-- Run this against the live Supabase project (SQL editor) BEFORE deploying
-- the admin Reviews tab. Stores past-customer reviews the owner adds by hand
-- from /admin/reviews; shown on /reviews and the homepage. Read and written
-- only by server code with the service-role key, like quote_requests.

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  route text,
  rating smallint check (rating between 1 and 5),
  body text not null,
  created_at timestamptz not null default now()
);
