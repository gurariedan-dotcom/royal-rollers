# Product

## Register

brand

## Platform

web

## Users

Primary: someone in the Tri-State area (or shipping a vehicle to it) who needs their car transported and wants a real, priced quote fast — not a vague callback promise. They're comparing carrier transport against a personal driver and need to trust the number they get before they'll hand over a deposit. Secondary: the Royal Rollers owner, who manually prices incoming quote requests and manages bookings through `/admin/bookings` — a real but lightly-designed workflow surface, not the site's public face.

## Product Purpose

A marketing site for Royal Rollers, a vehicle transport brokerage, that converts visitors into priced, booked jobs: request a quote, get a real dollar number by email, book with a deposit and saved card, and get charged the balance on delivery. Success is a visitor going from "curious about pricing" to a submitted quote request, and from a priced quote to a completed booking.

## Positioning

Submit your vehicle and route once, and get an actual priced quote back by email — not a "we'll call you back" runaround like typical transport brokers. The number is real, sent directly, every time.

## Conversion & proof

- Primary and secondary CTA: Primary — "Get a Quote" (routes to `/quote`, present in the header on every page and repeated at section ends). Secondary — "Compare Options" / "See the full side-by-side comparison" (routes to `/services`), for visitors not ready to commit.
- The line a visitor remembers after 10 seconds: "A priced quote sent straight to your inbox — not a callback promise."
- Belief ladder: (1) this broker will actually give me a number, not just a sales call; (2) the two transport options (insured carrier vs. personal driver) are explained clearly enough to pick one; (3) the price I get is real and the deposit is safe to pay; (4) the company follows through after I've paid.
- Proof on hand: none yet. `/reviews` exists but currently holds placeholder testimonial copy (`app/reviews/page.tsx`) — swap for real customer quotes once available.

## Brand Personality

Precise, trustworthy, no-nonsense. The voice favors real numbers over vague promises and treats data as data — VINs, ZIPs, and dollar amounts render in monospace rather than being dressed up as prose. The existing "transport manifest" visual concept (ink-navy on cool paper, a brass VIN-plate accent, condensed uppercase interstate-signage display type, a dashed "route" rule standing in for section dividers) already carries this personality; new work should extend it rather than introduce a different tone. Emotional goal: a visitor should feel like they're dealing with a logistics operation that has its act together, not a lead-gen funnel.

## Anti-references

Not a generic SaaS look — no gradient-heavy hero, no rounded soft-shadow cards, no generic-tech-startup visual language. This is explicitly called out in `tailwind.config.ts`'s own comments and should stay a hard constraint on future work.

## Design Principles

- Real numbers over vague promises — anything that reads as a placeholder, a "contact us for pricing," or a soft sales hook works against the core positioning claim.
- Data reads like data — VINs, ZIPs, dollar amounts, and other structured fields stay in the monospace/manifest register rather than being absorbed into regular prose styling.
- Two real options, not a funnel — Carrier Transport and Personal Driver are presented as genuinely different trade-offs (cost, speed, mileage), never collapsed into a single up-sell path.
- Extend the manifest concept, don't dilute it — new sections and components should read as part of the same interstate-corridor/shipping-manifest system, not a bolt-on style.
- The admin surface is functional, not neglected — `/admin/bookings` doesn't need brand polish, but it must stay clear and trustworthy for the one person who lives in it daily.

## Accessibility & Inclusion

WCAG 2.1 AA baseline. Already implemented: visible focus-visible outlines on all interactive elements (not just inputs), and a `prefers-reduced-motion` override that collapses animation/transition durations. New components should carry both forward by default.
