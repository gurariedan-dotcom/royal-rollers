-- Run this against the live Supabase project (SQL editor) BEFORE deploying
-- the personal-belongings quote question. Records whether the customer will
-- leave personal belongings/luggage in the vehicle, and what. Both nullable:
-- quotes submitted before this question existed simply have no answer.

alter table quote_requests add column if not exists has_personal_items boolean;
alter table quote_requests add column if not exists personal_items_description text;
