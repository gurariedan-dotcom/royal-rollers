---
name: Royal Rollers
description: A vehicle transport brokerage site styled as a stamped steel ID plate, not a printed manifest or a SaaS product.
colors:
  ink: "#16181C"
  ink-soft: "#383C44"
  paper: "#F1F2F4"
  paper-dim: "#E3E5E9"
  brass: "#2955D1"
  brass-dark: "#1E3F9E"
  brass-light: "#7FA0F5"
  highway: "#146B63"
  highway-light: "#3F9187"
  rust: "#7A3B4E"
  rust-light: "#A65E73"
  slate: "#565C66"
  slate-light: "#8990A0"
typography:
  display:
    fontFamily: "Big Shoulders Display, sans-serif"
    fontSize: "clamp(1.875rem, 4vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "0.02em"
  title:
    fontFamily: "Big Shoulders Display, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.02em"
  body:
    fontFamily: "Archivo, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Fragment Mono, monospace"
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

**Creative North Star: "The Rig Plate"**

Royal Rollers now reads like a stamped steel ID plate bolted to a rig, not a printed document. The manifest idea survives — VINs, ZIPs, and dollar amounts still render as data, not prose — but the surface underneath it changed: near-black graphite instead of warm paper, a bold cobalt "signal blue" instead of dusty steel-blue, and a tall, high-contrast condensed display face instead of interstate-signage caps. The effect should feel sleek (clean surfaces, confident weight, no clutter) and rugged (a real freight-yard color language, structural type) at once — the two are meant to sit together, not compromise into something in-between.

This still explicitly rejects the generic SaaS look — no gradient-heavy hero, no glassmorphism, nothing that reads as a lead-gen funnel dressed up as a product — and adds a new rejection: no printed-paper texture or warm brass anywhere. The former "paper grain" overlay is gone; the page is flat, precise digital surface now, not simulated stock. Two accent colors still carry real semantic weight — a cool teal for the insured/carrier option, a deep oxblood for the personal-driver option and its doubled error state — coordinated as one cool, saturated family with the new primary blue rather than the old family's dusty desaturation.

**Key Characteristics:**
- Near-black graphite surfaces (no more soft warm-gray paper) with a bold, saturated cobalt accent — sleeker and more confident than the old muted steel-blue
- Tall, high-contrast condensed display type (Big Shoulders Display) at tighter tracking than before — reads as stamped lettering, not shouted signage
- Fragment Mono reserved for structured data fields and micro-labels, distinct from the old code-editor mono
- The dashed route-rule motif carries over unchanged — still the one recurring divider motif, now rendered in signal blue
- Sharp corners throughout (2px radius) — unchanged, still a plate, not an app card
- Marketing CTAs stay ghost/outline by default; the header's persistent "Get a Quote" stays the one always-solid CTA

## 2. Colors

The neutrals are cooler and darker than before; the primary accent is now a bold, saturated blue rather than a muted steel-blue — this is the single biggest lever for the "semi-bold, sleek" shift the client asked for.

### Primary
- **Signal Blue** (#2955D1, token name `brass`): the primary accent. Used for the header's persistent CTA, focus-visible outlines, in-form progress buttons, the hero's one line of colored text, and the route-rule divider. Darkens to #1E3F9E on hover/fill, lightens to #7FA0F5 for accent text on dark (footer) backgrounds. Bolder and more saturated than the previous steel-blue — this is what carries the "semi-bold" instruction into the palette.

### Secondary
- **Deep Teal** (#146B63, token name `highway`): reserved exclusively for the Carrier Transport / insured-and-licensed trust signal. Sits a clear hue-step away from Signal Blue so the two never get confused at a glance, while staying in the same cool, saturated family.
- **Oxblood** (#7A3B4E, token name `rust`): the Personal Driver option's accent, and doubles as the form error-state color (invalid field borders). Deeper and more deliberate than the old muted wine — reads as a considered color choice, not a leftover neutral.

### Neutral
- **Ink** (#16181C): primary text and headers — near-black graphite, noticeably darker than the old ink for a sleeker, higher-contrast page. Also the Footer's background.
- **Ink Soft** (#383C44): secondary ink tone for de-emphasized dark-on-light text.
- **Paper** (#F1F2F4): the page background — a cool, crisp off-white, cooler than the old paper tone. Also the text color on dark (Footer) surfaces.
- **Paper Dim** (#E3E5E9): subtle surface variation against Paper.
- **Slate** (#565C66) / **Slate Light** (#8990A0): manifest-label text and muted field borders. Slate Light at 60% opacity is the default (non-error) input border.

### Named Rules
**The Semantic Color Rule.** Deep Teal and Oxblood are never used as generic accents — they mean Carrier Transport and Personal Driver respectively (and, for Oxblood, form errors) everywhere they appear. If a new component needs a third "option" color, it must earn a name and a fixed meaning the same way; don't reach for either as decoration.

**The No-Paper-Texture Rule.** The site no longer simulates a physical printed surface (no grain, no paper-fiber texture). Depth and material come from color, type weight, and structure — not a decorative overlay pretending to be paper.

## 3. Typography

**Display Font:** Big Shoulders Display (condensed, high-contrast, with sans-serif fallback)
**Body Font:** Archivo (with sans-serif fallback)
**Label/Mono Font:** Fragment Mono (with monospace fallback)

**Character:** Big Shoulders Display's tall, structural verticality reads like lettering stamped into a steel plate rather than printed interstate signage — it's the single change that does the most work toward "sleek but rugged." Archivo stays plain and workmanlike underneath it so the page never fights itself for attention. Fragment Mono marks anything that is literally data (VIN, ZIP, dollar figures, micro-labels) with more personality than a generic code-editor mono, while staying legible at small sizes.

### Hierarchy
- **Display** (700, `clamp(1.875rem, 4vw, 3rem)`, line-height 1.05): hero and top-of-page h1s. Uppercase, 0.02em tracking (`tracking-signage`) — tighter than the old 0.08em; the taller letterforms don't need the extra spacing to read as confident.
- **Headline** (700, 1.875rem / text-3xl, line-height ~1.2): section h2s ("Pick what fits your timeline"). Uppercase, same tracking as Display, one step down in size.
- **Title** (700, 1.25rem / text-xl, line-height 1.2): component-level headings, e.g. the Carrier Transport / Personal Driver card titles. Uppercase, 0.02em tracking (`tracking-wideish`).
- **Body** (400, 1rem, line-height 1.6): all prose copy, generally at `ink/75` or `ink/70` opacity rather than a separate lighter color token. Cap at ~65–75ch per paragraph.
- **Label** (400, 0.75rem / text-xs, 0.04em tracking, uppercase): the `manifest-label` class — used above form fields, in nav sub-labels ("Tri-State → Nationwide"), and section eyebrows. Always Slate on light backgrounds.

### Named Rules
**The Data-Reads-As-Data Rule.** Any field the user or system treats as structured data — VIN, ZIP, dollar amounts — renders in the mono Label/Data face, even inline. Never let a data value inherit body prose styling; it must look like it came off a plate, not a sentence.

**The Tight-Tracking Rule.** Display and Title tracking dropped from 0.08em/0.04em to 0.02em across the board. Big Shoulders Display is already tall and condensed; extra letter-spacing on top of that reads as loose, not confident. Don't reintroduce wide tracking on new display type.

## 4. Elevation

Mostly flat, with restrained ink-tinted shadows (`shadow-panel` / `shadow-panel-lg`) reserved for a handful of genuinely elevated, interactive surfaces: the comparison table, the quote and booking form panels, hovered contact cards. Everywhere else, depth and separation still come from borders, background color blocks, and opacity tints (`bg-highway/5`, `border-ink/10`, etc.), plus the dark-inverted Footer as a hard color break. Unchanged from the previous system — the recolor and refont didn't touch how depth is conveyed.

### Named Rules
**The Restrained-Shadow Rule.** Shadows are the exception, not the default — reach for a tinted background or a border first. When a surface needs to feel genuinely lifted (a form panel, a hovering card), use `shadow-panel`/`shadow-panel-lg`, never a generic gray drop shadow.

## 5. Components

### Buttons
- **Shape:** sharp corners (`rounded-sm`, 2px radius) — every interactive surface in the system uses this same near-flat radius.
- **Primary (persistent):** signal-blue background (#2955D1), paper text, uppercase Title-scale label, `tracking-wideish`, 12px/24px padding. Reserved for the header's always-visible "Get a Quote" button and in-task progress actions (quote form Next/Submit, booking Pay Deposit) — not for marketing CTAs. Hover darkens to #1E3F9E.
- **Ghost (marketing CTAs):** transparent background, signal-blue text and 1px signal-blue border, same shape and label treatment as Primary. Hover fills solid signal-blue with paper text. Default for every in-page "Get a Quote"/"Start Your Quote" link — only one solid CTA (the header's) should ever be visible on screen at once.
- **Secondary / Neutral Ghost:** transparent background, ink text, 1px `ink/20` border — used for non-primary actions like "Compare Options" or "Ask for References". Hover strengthens the border to `ink/50` — no fill change.
- **Focus:** every interactive element (not just inputs) gets a 2px solid signal-blue outline with 2px offset via `:focus-visible` — this is a global base-layer rule, not per-component.

### Cards / Containers
- **Corner Style:** `rounded-sm` (2px), matching buttons and inputs — nothing in this system uses a softer radius.
- **Background:** semantic color at 5% opacity tint (`bg-highway/5`, `bg-rust/5`) for the two transport-option cards; plain Paper for neutral containers.
- **Shadow:** reserved for a few genuinely elevated panels (see Elevation) — most cards still use border + tint for separation.
- **Border:** 1px, colored (matching the card's own semantic color); small state indicators (checkboxes, step badges) keep a 2px border since it reads better at that size.
- **Internal Padding:** generous — 32px (`p-8`) is standard for option/decision cards.

### Inputs / Fields
- **Style:** Paper background, 1px border at `slate-light/60` opacity, `rounded-sm`, 8px/12px padding, placeholder text in Slate Light.
- **Focus:** the same global 2px signal-blue `:focus-visible` outline as every other interactive element — no separate glow or border-color focus treatment.
- **Error:** border swaps to solid Oxblood (#7A3B4E); no background change, no icon — the border color alone carries the error state, paired with adjacent error copy.
- **Labels:** every field label uses the `manifest-label` treatment (mono, uppercase, Slate) directly above the input, not inline or floating.

### Navigation
- **Header:** Paper background (with backdrop blur, sticky), 1px `ink/10` bottom border, no shadow. Nav links are Body-weight at `ink/80`, hovering to Signal Blue. The primary CTA ("Get a Quote") is a filled Signal Blue button, always present, right-aligned — the one CTA on the whole site that stays solid-filled everywhere.
- **Footer:** full color inversion — Ink background, Paper text — with link columns at reduced opacity (`paper/60`, `paper/70`) hovering to Signal Blue Light. A `route-rule` divider separates the link grid from the copyright line instead of a plain hairline.

### Route Rule (signature element)
A 2px-tall repeating dashed line in Signal Blue (10px on, 10px off) used everywhere a section divider or hairline would normally go — between homepage sections, above the Footer's copyright line. It's the one recurring motif that ties every page back to the "road" concept, carried forward unchanged from the previous system, just recolored.

### Transport Scene (signature component)
The homepage's centerpiece illustration (`components/TransportScene.tsx`): an animated flatbed carrier hauling two cars, with a solo Personal Driver car out ahead on the same road. Carrier elements use Deep Teal, the solo car uses Oxblood, matching the color-coding used everywhere else on the site. Wheels spin and the road markings scroll continuously ("treadmill" motion); everything collapses to a static frame under `prefers-reduced-motion`. The same dashed-line visual language from the Route Rule is reused at smaller scale as the quote form's step tracker (`components/RouteProgress.tsx`).

## 6. Do's and Don'ts

### Do:
- **Do** render structured data (VIN, ZIP, dollar amounts) in Fragment Mono, uppercase where applicable, everywhere it appears — inline, in tables, in labels.
- **Do** use the dashed `route-rule` motif for section dividers instead of a plain border line.
- **Do** keep every interactive element's corner radius at 2px (`rounded-sm`) — buttons, inputs, and cards all share this value.
- **Do** give Deep Teal and Oxblood fixed, single meanings (Carrier/insured; Personal Driver, and Oxblood doubles as form-error) rather than using them as general-purpose accent colors.
- **Do** keep marketing CTAs as ghost/outline (fill-on-hover) and reserve the solid signal-blue fill for the header's persistent CTA and in-task progress buttons.
- **Do** carry the global `:focus-visible` signal-blue outline and `prefers-reduced-motion` collapse into any new component — both are base-layer rules already in `globals.css`.

### Don't:
- **Don't** use a gradient-heavy hero, glassmorphism, or a generic-tech-startup visual language — explicitly rejected in `tailwind.config.ts`'s own comments as the thing this project is not.
- **Don't** reintroduce the paper-grain texture or any simulated-physical-material overlay — the surface is flat digital now, not simulated paper.
- **Don't** reach for a generic gray drop shadow anywhere — if a surface needs elevation, use the ink-tinted `shadow-panel`/`shadow-panel-lg` tokens, and only on genuinely elevated surfaces.
- **Don't** use a warm cream/beige background, or a warm brass/gold accent. This palette is deliberately cool and dark — warming it up drifts back toward the project's earlier, more generic look.
- **Don't** let a data value (VIN, ZIP, dollar figure) inherit body prose styling — it must render in the mono Label face, not Archivo.
- **Don't** widen display/title tracking back toward 0.08em/0.04em — 0.02em is the system-wide tracking for Big Shoulders Display.
- **Don't** soften corners on new components (no `rounded-md`/`rounded-lg`/`rounded-full` outside of genuinely circular elements) — 2px is the system-wide radius.
- **Don't** put a solid-filled marketing CTA anywhere except the header — every in-page CTA should be the ghost/outline treatment.
