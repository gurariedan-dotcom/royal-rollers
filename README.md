# Royal Rollers

Marketing site + quote request + booking flow for Royal Rollers, a vehicle
transport brokerage based in the Tri-State (NY/NJ/CT) area, serving any
destination nationwide. Built from the project handoff doc, in full.

## Important: this has not been run or built

The environment this was written in has **no network access** &mdash; so
`npm install` was never run, the dev server was never started, and none of
this has been visually verified or type-checked end to end. Everything below
is written carefully and consistently against Next.js 14 / React 18 / Stripe
/ Resend / Supabase APIs, but you are the first one to actually boot it.
Budget time for the normal first-run snags (a typo, a version mismatch) that
any new project has before its first successful `npm run dev`.

## Setup

1. `npm install`
2. Copy `.env.example` to `.env.local` and fill in real values:
   - Supabase project URL + service role key
   - Stripe secret key + publishable key
   - Resend API key, from address, and where owner alerts should go
   - `INTERNAL_OPS_SECRET` &mdash; any long random string (`openssl rand -hex 32`)
   - `DEPOSIT_PERCENT` &mdash; decided at 25%
3. Run `db/schema.sql` against your Supabase project (SQL editor, or `psql`).
4. `npm run dev` and open `http://localhost:3000`.

## What's actually wired up

- **Homepage, Services, How It Works, About, FAQ, Contact** &mdash; static
  marketing pages with real copy for this business (not lorem ipsum).
- **Quote form** (`/quote`) &mdash; five-step form (Service &rarr; Vehicle &rarr;
  Route &rarr; Timing &rarr; Contact), client- and server-validated with the
  same Zod schema (`lib/validation.ts`), so the rules can't drift between the
  two. The open/enclosed field only appears for Carrier Transport, and the
  server enforces that too (not just the UI).
- **`POST /api/quote`** &mdash; saves the request and fires both emails: a
  receipt to the customer and an alert to the owner, in parallel, with
  failures logged but not blocking the save.
- **Pricing the quote** &mdash; `PATCH /api/quote/[id]/price` (protected by
  `INTERNAL_OPS_SECRET`) is where a price actually gets attached to a quote
  request. This didn't exist anywhere in the original plan (see "Filled gaps"
  below) but without it, nothing downstream has a number to book against.
  There's no admin UI for this yet &mdash; call it directly (curl, Postman,
  whatever's handy) until one exists.
- **Booking page** (`/book/[quoteId]`) &mdash; loads the priced quote,
  collects a card via Stripe Elements, and books it. This page also wasn't in
  the original file tree (see below) &mdash; without it there was no way for
  a customer to actually pay a deposit.
- **`POST /api/booking`** &mdash; creates a Stripe customer, charges the
  deposit, and saves the card via `setup_future_usage: "off_session"` so it
  can be charged again later without the customer present. Deposit/balance
  amounts are computed server-side from the stored quote price, never
  trusted from the client.
- **`POST /api/charge-balance`** &mdash; charges the saved card for the
  remaining balance. Protected by the same shared secret; see "Still open"
  below for why this doesn't run automatically yet.
- **Instant estimate** &mdash; the Route step of the quote form shows a live,
  non-binding `$X&ndash;$Y` range as soon as enough fields are filled in
  (`app/api/route-distance/route.ts` geocodes both ZIPs via the free,
  no-signup Zippopotam.us API and estimates driving distance from
  straight-line distance with a standard road-distance correction factor;
  `lib/pricing.ts` turns that into a range). This is purely informational:
  it's never sent as part of the quote submission and never touches
  `quoted_amount_cents` &mdash; the real price is still always set by hand via
  `PATCH /api/quote/[id]/price`.

## Filled gaps (found during review, addressed here)

The original plan was thorough but had a few holes that would have blocked
writing correct backend logic. These were fixed rather than left as TODOs:

1. **Nowhere to store the actual quoted price.** Added
   `quoted_amount_cents` to `quote_requests` and the `/api/quote/[id]/price`
   route to set it. Everything else (deposit math, the booking page, the
   quote-ready email) reads from this one field.
2. **No consent audit trail.** Added `consent_given_at` / `consent_ip` to
   `bookings`, captured at the moment of booking &mdash; relevant if a
   customer ever disputes the later automatic charge.
3. **Client-trusted charge amounts.** An earlier draft of `/api/booking`
   accepted `depositAmountCents`/`balanceAmountCents` from the request body,
   which would let anyone book at whatever price they sent. Fixed: the
   server derives both from the stored `quoted_amount_cents`.
4. **No booking page existed in the plan's own file tree**, despite the
   project's stated purpose being "submit a quote... and book the job with a
   deposit." Added `/book/[quoteId]` so that promise has a real page behind
   it.

## Still open (carried over from the handoff doc, Section 10 — not resolved here)

These need a decision from the business owner; they're not blockers for
running the app, but they block a real launch:

- **Business hours** &mdash; the original "1 hour, during business hours"
  promise was dropped from customer-facing copy since it was never actually
  enforced (no clock-checking logic exists). If a real turnaround-time
  promise is wanted later, it needs real hours defined and logic to match.
- **What triggers the balance charge.** `/api/charge-balance` exists and
  works (with a `/admin/bookings` page to trigger it by hand), but nothing
  calls it automatically. "On delivery" needs a real source of truth (a
  webhook, a date-based cron) before this can run unattended. Do not wire up
  a time-based cron as a shortcut without deciding this is actually right —
  an early charge is a real trust problem.
- **Instant-estimate pricing figures** &mdash; `ESTIMATE_BASE_FEE_CENTS`,
  `ESTIMATE_PER_MILE_CENTS`, and the other `ESTIMATE_*` vars in
  `.env.local` are scaffolded placeholders (see `lib/pricing.ts`), the same
  status `DEPOSIT_PERCENT` had before that got decided. The estimate is
  non-binding either way, but the numbers should reflect real costs before
  relying on them to set customer expectations.
- **Branding** &mdash; no logo or existing marketing materials to match.
  The design direction below is an original one built for this brief, not a
  placeholder for real brand assets.
- **Domain name / hosting** &mdash; not chosen; `NEXT_PUBLIC_SITE_URL` in
  `.env.local` is a placeholder used to build the booking link in emails.
- **Central Dispatch integration** &mdash; still assumed to be manual entry
  by the owner, using the site's collected fields as reference. No API
  integration exists.
- **VIN required at quote time** &mdash; kept as originally specified, since
  the owner deliberately wants Central-Dispatch-ready data from the start.
  Worth watching conversion on this in practice; it's a plausible drop-off
  point since not everyone has their VIN memorized.

## Design notes

The visual direction is a "transport manifest" concept rather than a generic
SaaS look: ink-navy text, a cool paper background, a brass accent (styled
after a VIN plate), and a highway green reserved for insured/Carrier trust
signals, with a rust tone for the Personal Driver option. Display type is
condensed and uppercase (interstate-signage feel), body text is Public Sans,
and data fields (VIN, ZIPs, dollar amounts) use a monospace face so they
read like data rather than prose.

The signature visual is the route map (`components/RouteMap.tsx`) &mdash; a
stylized fan of lines from the Tri-State area to destinations across the
country (Florida, Chicago, Texas, Los Angeles), with Florida kept visually
prominent as the flagship route. The same line/dot language is reused at a
smaller scale as the quote form's step tracker
(`components/RouteProgress.tsx`), so "stops on a route" is a consistent idea
rather than a one-off illustration.

## Project structure

```
app/                    Pages (App Router) + API routes
  api/quote             Submit + fetch + price a quote request
  api/booking           Deposit charge + card-on-file
  api/charge-balance    Off-session balance charge (manually triggered for now)
  book/[quoteId]        Customer-facing booking page
components/             Shared UI, including RouteMap/RouteProgress (signature visual)
lib/                    Stripe, Resend, Supabase, and shared Zod validation
db/schema.sql           Database schema (run this against Supabase)
```
