# Royal Rollers — Handoff

Written for a fresh Claude Code session picking this up with no memory of
the work so far. Read this first before touching anything. (Persistent
memory for this project also has condensed versions of the key facts here
— see `royal-rollers-decisions`, `royal-rollers-deployment`, and
`royal-rollers-dev-notes` — this file is the full version.)

## What this project is

A Next.js 14 (App Router) site for Royal Rollers, a vehicle transport
brokerage. Based in the Tri-State area (NY/NJ/CT), now markets itself as
serving any US destination (not just Florida, though Florida remains the
flagship/highest-volume route). Customers request a quote, the owner
manually prices it, the customer books with a deposit + saved card, and
the remaining balance charges automatically on delivery.

## Where everything lives

- **Code:** this folder, `/Users/Work/Downloads/royal-rollers`. **No git,
  no GitHub** — this is the only editable copy of the source. Vercel only
  has built snapshots from each deploy, not something you could pull back
  down and keep editing.
- **Local dev:** `npm run dev` → `http://localhost:3000`. Launch via the
  Browser pane's `preview_start` with name `royal-rollers-dev` (configured
  in `.claude/launch.json`), not raw `npm run dev` in Bash, so it can be
  screenshotted/inspected.
- **Live site:** https://royal-rollers-virid.vercel.app (stable alias —
  survives redeploys). Admin page at `/admin/bookings`, gated by
  `INTERNAL_OPS_SECRET`.
- **Credentials:** all in `.env.local` already (Supabase, Stripe test
  keys, Resend, `INTERNAL_OPS_SECRET`, `DEPOSIT_PERCENT`, `ESTIMATE_*`).
  Same values are already mirrored into Vercel's env vars for both
  `production` and `preview`. **Database is shared** between local dev and
  the live site (same Supabase project) — test data created in one shows
  up in the other.
- **Redeploying:** `npm run build` locally first (catches real errors
  Vercel's stricter build finds that `next dev` doesn't — see gotchas
  below), then `npx --yes vercel --prod --yes` from this folder.

## Architecture

- **Next.js 14** App Router, React 18, TypeScript, Tailwind
- **Supabase** (Postgres) — two tables: `quote_requests`, `bookings`
  (`db/schema.sql`). `lib/db.ts` is the client wrapper + row types.
- **Stripe** — deposit charge + saved card (`setup_future_usage:
  off_session`) for a later balance charge. Test mode only. `lib/stripe.ts`.
- **Resend** — transactional email. `lib/email.ts`. Sandbox-restricted:
  can currently only deliver to `aryehdan13@gmail.com` (the Resend
  account's own address) until a real domain is verified.
- **Zod** — `lib/validation.ts`'s `quoteRequestSchema` is shared between
  client (`components/QuoteForm.tsx`) and server (`app/api/quote/route.ts`)
  so rules can't drift.

## Core flows

**Quote → price → email** (nothing here auto-prices):
1. 5-step form (`components/QuoteForm.tsx`) → `POST /api/quote` → saved
   with `status: "pending"`, no price. Two emails fire (customer receipt +
   owner alert).
2. VIN auto-decodes to year/make/model via NHTSA's free API
   (`app/api/vin-decode/route.ts`) — editable afterward, never overwrites
   a field the customer already typed.
3. A live, non-binding cost estimate shows on the Route step
   (`app/api/route-distance/route.ts` + `lib/pricing.ts`) — see "Instant
   estimate" below. **This never touches the real price.**
4. The owner manually sets the real price: `PATCH
   /api/quote/[id]/price` (bearer-token protected, no admin UI for this
   specific step — still curl/Postman only). This triggers
   `sendQuoteReadyEmail` with a booking link.

**Book → deposit → balance-on-delivery:**
1. `/book/[quoteId]` loads the priced quote, collects a card via Stripe
   Elements, `POST /api/booking`.
2. Deposit charged immediately (25% of quote). If the card needs 3D
   Secure, a two-step confirm flow handles it properly (see gotchas) —
   `POST /api/booking/[id]/confirm` finalizes only after re-verifying
   with Stripe directly.
3. `/admin/bookings` (gated by `INTERNAL_OPS_SECRET`, entered once per
   browser session) lists all bookings, searchable by name/email, with a
   two-step-confirm "Mark Delivered & Charge" button
   (`POST /api/charge-balance`) and a "Delete customer" button (removes
   the booking + its quote_request from Supabase; does not touch Stripe's
   own records).
4. If a balance charge fails, both the customer and owner get an email
   (`sendBalanceChargeFailedEmail` / `...OwnerAlertEmail` in
   `lib/email.ts`).

## Instant estimate calculator (added this session)

Purely additive — never sent as part of the quote submission, never
written to `quoted_amount_cents`. Confirmed zero shared code paths with
the real pricing flow via `grep`.

- `app/api/route-distance/route.ts` — geocodes both ZIPs via
  **Zippopotam.us** (free, no signup, no API key — deliberately *not* a
  paid mapping API; that was tried first and reversed, see decisions
  memory), computes straight-line distance, applies a 1.25x road-distance
  correction factor.
- `lib/pricing.ts` — pure `computeEstimate()` function. All dollar
  figures are env-configurable placeholders (`ESTIMATE_BASE_FEE_CENTS`,
  `ESTIMATE_PER_MILE_CENTS`, etc.) — same "needs a real decision later"
  status `DEPOSIT_PERCENT` used to have.
- Shown in `components/QuoteForm.tsx`'s Route step as a debounced,
  read-only `$X–$Y` range with "not a quote" disclaimer.

## Rebrand (added this session)

Was Tri-State-to-Florida-only; now Tri-State-based, any destination.
Edited: `app/layout.tsx` (title/description), `app/page.tsx` (hero),
`app/services/page.tsx`, `app/about/page.tsx` (full rewrite — dropped a
line that explicitly said "not trying to be a nationwide generalist"),
`components/Header.tsx`, `components/Footer.tsx`. The homepage's signature
`RouteMap.tsx` illustration now fans out from the Tri-State cluster to
**4 destinations** (Florida kept visually prominent, plus Chicago, Texas,
L.A.) instead of a single line to Florida.

## Key gotchas (full version in `royal-rollers-dev-notes` memory)

- **Always run `npm run build` before deploying**, not just `npm run
  dev`. This repo's Supabase client had no generated `Database` type,
  which caused several `.update()`/`.select()` calls to silently
  type-check as `never` under strict build mode — invisible in dev mode,
  hard build failures on Vercel. Fixed via `createClient<any>(...)` in
  `lib/db.ts`, but any *new* Supabase call could hit this again.
- **Stripe needs `payment_method_types: ["card"]` explicit** on
  PaymentIntents (`lib/stripe.ts`) — without it, newer Stripe accounts
  throw a `return_url` requirement error.
- **3D Secure is a two-step confirm, not synchronous.** `requires_action`
  is not an error — treating it as success was a real bug that recorded
  unpaid bookings as paid. Current code (`app/api/booking/route.ts` +
  `app/api/booking/[id]/confirm/route.ts` + `components/BookingForm.tsx`)
  handles this correctly; don't regress it.
- **Resend's SDK doesn't throw on failure** — it returns `{ error }`.
  Must check explicitly (see `send()` wrapper in `lib/email.ts`) or
  failures vanish with zero log output.
- **Zod's `superRefine` only runs if the base schema fully validates
  first** — the "enclosed required for carrier" cross-field rule in
  `lib/validation.ts` won't fire while other fields are still blank; this
  is expected Zod behavior, not a bug, and only matters at final submit.

## Current task status (as of this handoff)

All 11 tasks from this session's work are complete: local setup, critical
bug fixes (personal-driver validation bug, silent 3DS bypass, Resend
sandbox, decline messaging), booking-page fixes, `/admin/bookings` build
(with two-step confirm + delete), Vercel deployment, nationwide rebrand,
instant estimate calculator, and this handoff. Nothing is mid-flight or
half-finished.

## Genuinely open (real decisions, not yet made)

- What actually triggers the balance charge in production (currently:
  fully manual, no webhook/cron)
- `ESTIMATE_*` pricing figures are placeholders, need real numbers
- Real domain name / final hosting (currently a `vercel.app` address)
- Resend needs a verified domain before emailing real customers
- Central Dispatch integration is still manual entry by the owner
- No version control — worth setting up git + GitHub for real backups

## User preferences worth knowing

- Prefers free/no-signup solutions by default; will occasionally ask for
  a paid/more-accurate option but has reversed that choice before when
  the friction wasn't worth it — don't assume a one-time answer is
  permanent.
- Non-technical — explain things in plain language, avoid unexplained
  jargon, and don't assume familiarity with terminal/git/deployment
  concepts.
- Appreciates being walked through exact steps for third-party signups
  (which button, which page) rather than just told "go get an API key."
