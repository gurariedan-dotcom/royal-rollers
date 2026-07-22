---
name: Royal Rollers
description: A vehicle transport brokerage site styled as a shipping manifest, not a SaaS product.
colors:
  ink: "#1E2A3A"
  ink-soft: "#3A4756"
  paper: "#F0F1EC"
  paper-dim: "#E4E6DE"
  brass: "#A6763B"
  brass-dark: "#8A5F2C"
  brass-light: "#C99A5B"
  highway: "#1F4B3F"
  highway-light: "#2E6552"
  rust: "#B5502F"
  rust-light: "#CC6A44"
  slate: "#5C6570"
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

Royal Rollers reads like a transport document, not a tech product: ink-navy type on a cool paper ground, a brass accent lifted from a VIN plate, and structured fields — VIN, ZIPs, dollar amounts — set in monospace so they read as data rather than marketing copy. Display type is condensed and uppercase, styled after interstate signage; a dashed "route" rule stands in for section dividers, always reading as a road rather than a generic hairline. The system is flat by design — no shadows, no gradients, no rounded-card softness — because a manifest doesn't need to look soft to be trusted, it needs to look correct.

This explicitly rejects the generic SaaS look: no gradient-heavy hero, no floating soft-shadow cards, no glassmorphism, nothing that reads as a lead-gen funnel dressed up as a product. Two accent colors carry real semantic weight rather than decoration — highway green marks the insured/carrier option, rust marks the personal-driver option and doubles as the error state — so color differences always mean something on this site, never just variety.

**Key Characteristics:**
- Flat, bordered surfaces — depth comes from color blocks and opacity tints, never shadows
- Condensed uppercase display type (Oswald) paired with a workmanlike body sans (Public Sans)
- Monospace (IBM Plex Mono) reserved for structured data fields and micro-labels, never body prose
- A single recurring motif — the dashed route rule — used everywhere a divider would otherwise go
- Sharp corners throughout (2px radius) — this is a document, not an app card

## 2. Colors

Two neutrals carry the page; brass is the one warm accent; highway and rust are load-bearing semantic colors, not decoration.

### Primary
- **Brass** (#A6763B): the VIN-plate accent. Used for every primary CTA ("Get a Quote"), focus-visible outlines, and the hero's one line of colored text. Darkens to #8A5F2C on hover, lightens to #C99A5B for accent text on dark (footer) backgrounds.

### Secondary
- **Highway Green** (#1F4B3F): reserved exclusively for the Carrier Transport / insured-and-licensed trust signal. Never used decoratively — its presence always means "this is the insured option."
- **Rust** (#B5502F): the Personal Driver option's accent, and doubles as the form error-state color (invalid field borders). Reads as road/motion, not danger, in its primary use; the shared error usage is intentional (rust already means "pay attention" in this system).

### Neutral
- **Ink** (#1E2A3A): primary text and headers — "ink on a manifest." Also the Footer's background, inverting the palette for a clear section break.
- **Ink Soft** (#3A4756): secondary ink tone for de-emphasized dark-on-light text.
- **Paper** (#F0F1EC): the page background — a cool, slightly gray off-white, deliberately not a warm cream. Also the text color on dark (Footer) surfaces.
- **Paper Dim** (#E4E6DE): subtle surface variation against Paper.
- **Slate** (#5C6570) / **Slate Light** (#8B929B): manifest-label text and muted field borders. Slate Light at 60% opacity is the default (non-error) input border.

### Named Rules
**The Semantic Color Rule.** Highway green and rust are never used as generic accents — they mean Carrier Transport and Personal Driver respectively (and, for rust, form errors) everywhere they appear. If a new component needs a third "option" color, it must earn a name and a fixed meaning the same way; don't reach for highway or rust as decoration.

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

Flat by default — there are no `box-shadow` declarations anywhere in the system. Depth and separation come entirely from borders, background color blocks, and opacity tints (`bg-highway/5`, `border-ink/10`, etc.), plus the dark-inverted Footer as a hard color break rather than a shadow-separated panel.

### Named Rules
**The No-Shadow Rule.** Never add `box-shadow` to convey elevation. A raised or "important" surface gets a 2px border and/or a tinted background instead — the manifest concept has no room for drop shadows, which read as generic app chrome.

## 5. Components

### Buttons
- **Shape:** sharp corners (`rounded-sm`, 2px radius) — every interactive surface in the system uses this same near-flat radius.
- **Primary:** brass background (#A6763B), paper text, uppercase Title-scale label, `tracking-wideish`, 12px/24px padding (scales up to 12px/32px on hero-level CTAs). Hover darkens to #8A5F2C.
- **Secondary / Ghost:** transparent background, ink text, 1px `ink/20` border, same shape and label treatment as Primary. Hover strengthens the border to `ink/50` — no fill change.
- **Focus:** every interactive element (not just inputs) gets a 2px solid brass outline with 2px offset via `:focus-visible` — this is a global base-layer rule, not per-component.

### Cards / Containers
- **Corner Style:** `rounded-sm` (2px), matching buttons and inputs — nothing in this system uses a softer radius.
- **Background:** semantic color at 5% opacity tint (`bg-highway/5`, `bg-rust/5`) for the two transport-option cards; plain Paper for neutral containers.
- **Shadow Strategy:** none — see Elevation. Separation comes from a 2px border at 30–40% opacity in the card's own semantic color.
- **Border:** 2px, colored (not the default 1px neutral border used elsewhere), reinforcing that these are decision cards, not passive containers.
- **Internal Padding:** generous — 32px (`p-8`) is standard for option/decision cards.

### Inputs / Fields
- **Style:** Paper background, 1px border at `slate-light/60` opacity, `rounded-sm`, 8px/12px padding, placeholder text in Slate Light.
- **Focus:** the same global 2px brass `:focus-visible` outline as every other interactive element — no separate glow or border-color focus treatment.
- **Error:** border swaps to solid Rust (#B5502F); no background change, no icon — the border color alone carries the error state, paired with adjacent error copy.
- **Labels:** every field label uses the `manifest-label` treatment (mono, uppercase, Slate) directly above the input, not inline or floating.

### Navigation
- **Header:** Paper background, 1px `ink/10` bottom border, no shadow. Nav links are Body-weight at `ink/80`, hovering to Brass. The primary CTA ("Get a Quote") is a filled Brass button, always present, right-aligned.
- **Footer:** full color inversion — Ink background, Paper text — with link columns at reduced opacity (`paper/60`, `paper/70`) hovering to Brass Light. A `route-rule` divider separates the link grid from the copyright line instead of a plain hairline.

### Route Rule (signature element)
A 2px-tall repeating dashed line in Brass (10px on, 10px off) used everywhere a section divider or hairline would normally go — between homepage sections, above the Footer's copyright line. It's the one recurring motif that ties every page back to the "route" concept, and should be reached for instead of a plain `border-t` whenever a visual break is needed at full page width.

### Route Map (signature component)
The homepage's centerpiece illustration (`components/RouteMap.tsx`): a stylized fan of lines from the Tri-State cluster to destination markers across the country, with Florida kept visually dominant as the flagship route. The same line/dot visual language is reused at smaller scale as the quote form's step tracker (`components/RouteProgress.tsx`), so "stops on a route" reads as one consistent idea rather than a one-off hero graphic.

## 6. Do's and Don'ts

### Do:
- **Do** render structured data (VIN, ZIP, dollar amounts) in IBM Plex Mono, uppercase where applicable, everywhere it appears — inline, in tables, in labels.
- **Do** use the dashed `route-rule` motif for section dividers instead of a plain border line.
- **Do** keep every interactive element's corner radius at 2px (`rounded-sm`) — buttons, inputs, and cards all share this value.
- **Do** give Highway Green and Rust fixed, single meanings (Carrier/insured; Personal Driver, and rust doubles as form-error) rather than using them as general-purpose accent colors.
- **Do** carry the global `:focus-visible` brass outline and `prefers-reduced-motion` collapse into any new component — both are base-layer rules already in `globals.css`.

### Don't:
- **Don't** use a gradient-heavy hero, glassmorphism, or a generic-tech-startup visual language — explicitly rejected in `tailwind.config.ts`'s own comments as the thing this project is not.
- **Don't** add `box-shadow` anywhere for elevation. This system conveys depth with borders and opacity tints only.
- **Don't** use a warm cream/beige background. Paper (#F0F1EC) is a cool, slightly gray off-white on purpose — warming it up drifts toward the generic SaaS look this project rejects.
- **Don't** let a data value (VIN, ZIP, dollar figure) inherit body prose styling — it must render in the mono Label face, not Public Sans.
- **Don't** soften corners on new components (no `rounded-md`/`rounded-lg`/`rounded-full` outside of genuinely circular elements) — 2px is the system-wide radius.
