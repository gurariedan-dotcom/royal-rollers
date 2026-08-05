-- Run this against the live Supabase project (SQL editor) to add a short,
-- human-readable order number to quote_requests. The UUID primary key is
-- fine for URLs/lookups but unreadable read aloud over the phone or scanned
-- in an admin table -- emails and the admin UI now show "RR-1007" instead.
-- Bookings don't get their own number; they display their parent quote's.

create sequence if not exists quote_requests_order_number_seq;

alter table quote_requests add column if not exists order_number integer;

-- Backfill existing rows in creation order so earlier quotes get lower numbers.
update quote_requests
set order_number = sub.rn
from (
  select id, row_number() over (order by created_at) as rn
  from quote_requests
  where order_number is null
) sub
where quote_requests.id = sub.id;

select setval('quote_requests_order_number_seq', coalesce((select max(order_number) from quote_requests), 0));

alter table quote_requests alter column order_number set default nextval('quote_requests_order_number_seq');
alter table quote_requests alter column order_number set not null;
alter table quote_requests add constraint quote_requests_order_number_key unique (order_number);
