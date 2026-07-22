---
name: Royal Rollers
description: A vehicle transport brokerage site styled as a shipping manifest, not a SaaS product.
colors:
  ink: "#1C1E22"
  ink-soft: "#3A3D44"
  paper: "#F2F2F0"
  paper-dim: "#E6E6E2"
  brass: "#4C6B8A"
  brass-dark: "#38516A"
  brass-light: "#7396B4"
  highway: "#1F5C56"
  highway-light: "#3B8478"
  rust: "#733C4A"
  rust-light: "#9C5D6C"
  slate: "#5B6169"
  slate-light: "#8B929B"
typography:
  display:
    fontFamily: "Oswald, sans-serif"
    fontSize: "clamp(1.875rem, 4vw, 3rem)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "0.08em"
  title:
    fontFamily: "Oswald, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.04em"
  body:
    fontFamily: "Public Sans, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "IBM Plex Mono, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.04em"
rounded:
  sm: "2px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "32px"
components:
  button-primary:
    backgroundColor: "{colors.brass}"
    textColor: "{colors.paper}"
    typography: "{typography.title}"
    rounded: "{rounded.sm}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.brass-dark}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.title}"
    rounded: "{rounded.sm}"
    padding: "12px 24px"
  input-field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "8px 12px"
---

# Design System: Royal Rollers

## 1. Overview

**Creative North Star: "The Shipping Manifest"**

Royal Rollers reads like a transport document, not a tech product: graphite type on a cool paper ground, a steel-blue "chrome" accent, and structured fields — VIN, ZIPs, dollar amounts — set in monospace so they read as data rather than marketing copy. Display type is condensed and uppercase, styled after interstate signage; a dashed "route" rule stands in for section dividers, always reading as a road rather than a generic hairline. The palette is "Charcoal + Chrome": cool, precise, engineered, rather than the original's warm brass/manifest-paper feel — chosen for a more premium, less generic first impression. Depth now comes from restrained, ink-tinted shadows on a few elevated surfaces (the comparison table, the quote/booking panels) in addition to color blocks and borders.

This explicitly rejects the generic SaaS look: no gradient-heavy hero, no glassmorphism, nothing that reads as a lead-gen funnel dressed up as a product. Two accent colors carry real semantic weight rather than decoration — a cool teal marks the insured/carrier option, a muted wine marks the personal-driver option and doubles as the error state — so color differences always mean something on this site, never just variety. Both are deliberately cool and desaturated so they read as part of the same Charcoal + Chrome family as the primary steel-blue accent, rather than as leftover warm/earthy tones from the site's earlier palette.

**Key Characteristics:**
- Cool, mostly-flat surfaces with a few restrained tinted-shadow panels for elevation on key interactive surfaces
- Condensed uppercase display type (Oswald) paired with a workmanlike body sans (Public Sans)
- Monospace (IBM Plex Mono) reserved for structured data fields and micro-labels, never body prose
- A single recurring motif — the dashed route rule — used everywhere a divider would otherwise go
- Sharp corners throughout (2px radius) — this is a document, not an app card
- Marketing CTAs are ghost/outline by default (fill reveals on hover); the persistent header "Get a Quote" is the one CTA that's always solid-filled

## 2. Colors

Two neutrals carry the page; the steel-blue "chrome" accent is deliberately cool, not warm; cool teal and muted wine are load-bearing semantic colors, not decoration.

### Primary
- **Chrome / Steel-blue** (#4C6B8A, token name `brass`): the primary accent. Used for the header's persistent CTA, focus-visible outlines, in-form progress buttons, and the hero's one line of colored text. Darkens to #38516A on hover/fill, lightens to #7396B4 for accent text on dark (footer) backgrounds. Most marketing CTAs (hero, page-level "Get a Quote" links) use it as an outline that fills solid on hover, rather than a permanent fill.

### Secondary
- **Cool Teal** (#1F5C56, token name `highway`): reserved exclusively for the Carrier Transport / insured-and-licensed trust signal. Blue-leaning rather than grass-green, so it sits comfortably next to the steel-blue chrome accent. Never used decoratively — its presence always means "this is the insured option."
- **Muted Wine** (#733C4A, token name `rust`): the Personal Driver option's accent, and doubles as the form error-state color (invalid field borders). Cooled and desaturated from the site's earlier warm copper so it reads as an engineered "chrome family" color rather than an earthy construction-orange. The shared error usage is intentional (it already means "pay attention" in this system).

### Neutral
- **Ink** (#1C1E22): primary text and headers — graphite, not navy. Also the Footer's background, inverting the palette for a clear section break.
- **Ink Soft** (#3A3D44): secondary ink tone for de-emphasized dark-on-light text.
- **Paper** (#F2F2F0): the page background — a cool, slightly gray off-white. Also the text color on dark (Footer) surfaces.
- **Paper Dim** (#E6E6E2): subtle surface variation against Paper.
- **Slate** (#5B6169) / **Slate Light** (#8B929B): manifest-label text and muted field borders. Slate Light at 60% opacity is the default (non-error) input border.

### Named Rules
**The Semantic Color Rule.** Cool teal and muted wine are never used as generic accents — they mean Carrier Transport and Personal Driver respectively (and, for wine, form errors) everywhere they appear. If a new component needs a third "option" color, it must earn a name and a fixed meaning the same way; don't reach for either as decoration.

## 3. Typography

**Display Font:** Oswald (condensed, with sans-serif fallback)
**Body Font:** Public Sans (with sans-serif fallback)
**Label/Mono Font:** IBM Plex Mono (with monospace fallback)

**Character:** Oswald's condensed, geometric verticality plus uppercase tracking gives headlines an interstate-signage weight; Public Sans stays plain and workmanlike underneath it so the page never fights itself for attention; IBM Plex Mono marks anything that is literally data (VIN, ZIP, dollar figures, micro-labels) so the eye can tell "field" from "prose" at a glance.

### Hierarchy
- **Display** (600, `clamp(1.875rem, 4vw, 3rem)`, line-height 1.05): hero and top-of-page h1s. Uppercase, 0.08em tracking (`tracking-signage`).
- **Headline** (600, 1.875rem / text-3xl, line-height ~1.2): section h2s ("Pick what fits your timeline"). Uppercase, same signage tracking as Display, one step down in size.
- **Title** (600, 1.25rem / text-xl, line-height 1.2): component-level headings, e.g. the Carrier Transport / Personal Driver card titles. Uppercase, 0.04em tracking (`tracking-wideish`).
- **Body** (400, 1rem, line-height 1.6): all prose copy, generally at `ink/75` or `ink/70` opacity rather than a separate lighter color token. Cap at ~65–75ch per paragraph.
- **Label** (400, 0.75rem / text-xs, 0.04em tracking, uppercase): the `manifest-label` class — used above form fields, in nav sub-labels ("Tri-State → Nationwide"), and section eyebrows. Always Slate on light backgrounds.

### Named Rules
**The Data-Reads-As-Data Rule.** Any field the user or system treats as structured data — VIN, ZIP, dollar amounts — renders in the mono Label/Data face, even inline. Never let a data value inherit body prose styling; it must look like it came off a manifest, not a sentence.

## 4. Elevation

Mostly flat, with restrained ink-tinted shadows (`shadow-panel` / `shadow-panel-lg`) reserved for a handful of genuinely elevated, interactive surfaces: the comparison table, the quote and booking form panels, hovered contact cards. Everywhere else, depth and separation still come from borders, background color blocks, and opacity tints (`bg-highway/5`, `border-ink/10`, etc.), plus the dark-inverted Footer as a hard color break.

### Named Rules
**The Restrained-Shadow Rule.** Shadows are the exception, not the default — reach for a tinted background or a border first. When a surface needs to feel genuinely lifted (a form panel, a hovering card), use `shadow-panel`/`shadow-panel-lg`, never a generic gray drop shadow.

## 5. Components

### Buttons
- **Shape:** sharp corners (`rounded-sm`, 2px radius) — every interactive surface in the system uses this same near-flat radius.
- **Primary (persistent):** chrome/steel-blue background (#4C6B8A), paper text, uppercase Title-scale label, `tracking-wideish`, 12px/24px padding. This treatment is reserved for the header's always-visible "Get a Quote" button and in-task progress actions (quote form Next/Submit, booking Pay Deposit) — not for marketing CTAs. Hover darkens to #38516A.
- **Ghost (marketing CTAs):** transparent background, chrome-colored text and 1px chrome border, same shape and label treatment as Primary. Hover fills solid chrome with paper text. This is the default for every in-page "Get a Quote"/"Start Your Quote" link (hero, page CTAs) — only one solid CTA (the header's) should ever be visible on screen at once.
- **Secondary / Neutral Ghost:** transparent background, ink text, 1px `ink/20` border — used for non-primary actions like "Compare Options" or "Ask for References". Hover strengthens the border to `ink/50` — no fill change.
- **Focus:** every interactive element (not just inputs) gets a 2px solid chrome outline with 2px offset via `:focus-visible` — this is a global base-layer rule, not per-component.

### Cards / Containers
- **Corner Style:** `rounded-sm` (2px), matching buttons and inputs — nothing in this system uses a softer radius.
- **Background:** semantic color at 5% opacity tint (`bg-highway/5`, `bg-rust/5`) for the two transport-option cards; plain Paper for neutral containers.
- **Shadow:** reserved for a few genuinely elevated panels (see Elevation) — most cards still use border + tint for separation.
- **Border:** 1px, colored (matching the card's own semantic color) — the quote form's own service-selection cards use this (thinned from an earlier 2px for a leaner look); small state indicators (checkboxes, step badges) keep a 2px border since it reads better at that size.
- **Internal Padding:** generous — 32px (`p-8`) is standard for option/decision cards.

### Inputs / Fields
- **Style:** Paper background, 1px border at `slate-light/60` opacity, `rounded-sm`, 8px/12px padding, placeholder text in Slate Light.
- **Focus:** the same global 2px chrome `:focus-visible` outline as every other interactive element — no separate glow or border-color focus treatment.
- **Error:** border swaps to solid Wine (#733C4A); no background change, no icon — the border color alone carries the error state, paired with adjacent error copy.
- **Labels:** every field label uses the `manifest-label` treatment (mono, uppercase, Slate) directly above the input, not inline or floating.

### Navigation
- **Header:** Paper background (with backdrop blur, sticky), 1px `ink/10` bottom border, no shadow. Nav links are Body-weight at `ink/80`, hovering to Chrome. The primary CTA ("Get a Quote") is a filled Chrome button, always present, right-aligned — the one CTA on the whole site that stays solid-filled everywhere.
- **Footer:** full color inversion — Ink background, Paper text — with link columns at reduced opacity (`paper/60`, `paper/70`) hovering to Chrome Light. A `route-rule` divider separates the link grid from the copyright line instead of a plain hairline.

### Route Rule (signature element)
A 2px-tall repeating dashed line in Chrome (10px on, 10px off) used everywhere a section divider or hairline would normally go — between homepage sections, above the Footer's copyright line. It's the one recurring motif that ties every page back to the "route" concept, and should be reached for instead of a plain `border-t` whenever a visual break is needed at full page width.

### Transport Scene (signature component)
The homepage's centerpiece illustration (`components/TransportScene.tsx`): an animated flatbed carrier hauling two cars, with a solo Personal Driver car out ahead on the same road — a literal picture of the site's core choice rather than an abstract diagram. Carrier elements use Highway teal, the solo car uses Rust wine, matching the color-coding used everywhere else on the site. Wheels spin and the road markings scroll continuously ("treadmill" motion); everything collapses to a static frame under `prefers-reduced-motion`. The same dashed-line visual language from the Route Rule is reused at smaller scale as the quote form's step tracker (`components/RouteProgress.tsx`).

## 6. Do's and Don'ts

### Do:
- **Do** render structured data (VIN, ZIP, dollar amounts) in IBM Plex Mono, uppercase where applicable, everywhere it appears — inline, in tables, in labels.
- **Do** use the dashed `route-rule` motif for section dividers instead of a plain border line.
- **Do** keep every interactive element's corner radius at 2px (`rounded-sm`) — buttons, inputs, and cards all share this value.
- **Do** give Highway Teal and Rust Wine fixed, single meanings (Carrier/insured; Personal Driver, and wine doubles as form-error) rather than using them as general-purpose accent colors.
- **Do** keep marketing CTAs as ghost/outline (fill-on-hover) and reserve the solid chrome fill for the header's persistent CTA and in-task progress buttons.
- **Do** carry the global `:focus-visible` chrome outline and `prefers-reduced-motion` collapse into any new component — both are base-layer rules already in `globals.css`.

### Don't:
- **Don't** use a gradient-heavy hero, glassmorphism, or a generic-tech-startup visual language — explicitly rejected in `tailwind.config.ts`'s own comments as the thing this project is not.
- **Don't** reach for a generic gray drop shadow anywhere — if a surface needs elevation, use the ink-tinted `shadow-panel`/`shadow-panel-lg` tokens, and only on genuinely elevated surfaces.
- **Don't** use a warm cream/beige background, or a warm brass/gold accent. This palette is deliberately cool (Charcoal + Chrome) — warming it up drifts back toward the project's earlier, more generic look.
- **Don't** let a data value (VIN, ZIP, dollar figure) inherit body prose styling — it must render in the mono Label face, not Public Sans.
- **Don't** soften corners on new components (no `rounded-md`/`rounded-lg`/`rounded-full` outside of genuinely circular elements) — 2px is the system-wide radius.
- **Don't** put a solid-filled marketing CTA anywhere except the header — every in-page CTA should be the ghost/outline treatment.
