-- Short, human-readable order number for quote_requests, distinct from the
-- uuid primary key. Meant to be what customers/owner say out loud and what a
-- future "track my order" page looks up by -- a uuid doesn't work for either.
-- Starts at 1000 so early orders don't look like a test ("Order #1").
create sequence quote_requests_order_number_seq start with 1000;

alter table quote_requests
  add column order_number integer not null default nextval('quote_requests_order_number_seq') unique;

alter sequence quote_requests_order_number_seq owned by quote_requests.order_number;
