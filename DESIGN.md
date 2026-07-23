---
name: Royal Rollers
description: A vehicle transport brokerage site styled as a flat, stamped transport manifest, not a printed document or a SaaS product.
colors:
  ink: "#201E1D"
  ink-soft: "#403C3A"
  paper: "#F3F2F2"
  paper-dim: "#E7E5E4"
  brass: "#EC3013"
  brass-dark: "#AE1800"
  brass-light: "#FF8266"
  slate: "#605D5D"
  slate-light: "#8A8785"
typography:
  display:
    fontFamily: "Archivo, sans-serif"
    fontSize: "clamp(1.875rem, 4vw, 3rem)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "0.02em"
  title:
    fontFamily: "Archivo, sans-serif"
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
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.04em"
rounded:
  flat: "0px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "32px"
components:
  button-primary:
    backgroundColor: "{colors.brass}"
    textColor: "{colors.paper}"
    typography: "{typography.title}"
    rounded: "{rounded.flat}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.brass-dark}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.brass}"
    typography: "{typography.title}"
    rounded: "{rounded.flat}"
    padding: "12px 24px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.title}"
    rounded: "{rounded.flat}"
    padding: "12px 24px"
  input-field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.flat}"
    padding: "8px 12px"
  input-field-error:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.brass-dark}"
    typography: "{typography.body}"
    rounded: "{rounded.flat}"
    padding: "8px 12px"
---

# Design System: Royal Rollers

## 1. Overview

**Creative North Star: "The Modernist Manifest"**

Royal Rollers now reads like a printed transport manifest run through a Modernist type foundry, not a stamped steel plate and not a SaaS product page. Every surface is flat: off-white paper, near-black ink, one red accent, nothing else. There is no gradient, no shadow, no rounded corner anywhere on the site. Structure comes entirely from solid 2px rules dividing sections the way a manifest divides line items, condensed uppercase Archivo doing the work a heavier display face used to do, and monospace reserved for anything that is literally data.

This still explicitly rejects the generic SaaS look — no gradient-heavy hero, no glassmorphism, no soft-shadow cards, nothing that reads as a lead-gen funnel dressed up as a product — and adds the Modernist system's own constraint on top: no second hue. The former two-accent system (a teal for Carrier Transport, an oxblood for Personal Driver) is gone. The two service types are now told apart by the only two tones the system has: red fill for Carrier Transport, black fill for Personal Driver. A third, functional-only color (`brass-dark`) exists solely to make error and danger states visible; it is never used as decoration.

**Key Characteristics:**
- Flat off-white paper background, near-black ink text, one saturated red accent — no second brand hue anywhere
- Archivo carries both display and body type; JetBrains Mono is reserved for VINs, ZIPs, dollar amounts, and other structured data
- Zero border radius on every interactive surface — buttons, inputs, cards, badges, step indicators
- Zero drop shadows — separation comes from solid 2px rules and flat color blocks, never elevation
- Carrier Transport = solid red; Personal Driver = solid black — the one semantic color pairing the whole site relies on
- `brass-dark`, a deeper shade of the same accent, is reserved exclusively for error/danger states so they stay visually distinct from both normal text (ink) and the Carrier Transport brand color (brass)

## 2. Colors

The palette is deliberately narrow: one accent, one neutral family, and a single darker shade of the accent reserved for functional alerts. Nothing in this system reads as decoration.

### Primary
- **Signal Red** (#EC3013, token name `brass`): the one accent. Used for every primary CTA, focus-visible outlines, the Carrier Transport / insured trust signal, and the hero's one line of colored text. Darkens to #AE1800 on hover/fill.

### Neutral
- **Ink** (#201E1D): primary text, headers, borders, and the Personal Driver brand color (`rust` is a semantic alias for this same value — see Named Rules below). Also the Footer's background.
- **Ink Soft** (#403C3A): secondary, de-emphasized dark-on-light text.
- **Paper** (#F3F2F2): the page background — a flat, cool off-white. Also the text color on dark (Footer) surfaces.
- **Paper Dim** (#E7E5E4): subtle surface variation against Paper.
- **Slate** (#605D5D) / **Slate Light** (#8A8785): manifest-label text and muted, non-error field borders.

### Named Rules
**The One Accent Rule.** Signal Red is the only saturated color on the site. There is no secondary brand hue. Where the previous system used two option colors (teal for Carrier, oxblood for Personal Driver), this system uses the two tones it actually has: Carrier Transport is solid Signal Red, Personal Driver is solid Ink. `highway` and `rust` are kept as token names in code purely so components don't need renaming — `highway` resolves to Signal Red, `rust` resolves to Ink. Neither is a color in its own right; both are aliases with a single fixed meaning (Carrier / Personal Driver respectively).

**The Functional-Red Rule.** `brass-dark` (#AE1800) exists only to make error, danger, and failure states visible — invalid form fields, error banners, the crash page, destructive-confirmation copy. It is never used decoratively. It is deliberately the same hue family as Signal Red (so it still reads as "red = pay attention") but dark enough to stay distinct from both the bright Carrier Transport red and plain ink text.

**The No-Warmth Rule.** No cream, beige, or brass-toned neutral anywhere. Paper is a true cool off-white, not a warm parchment tone — warming it up drifts back toward a generic, forgettable look.

## 3. Typography

**Display Font:** Archivo, weight 800 (with sans-serif fallback)
**Body Font:** Archivo, weights 400–700 (with sans-serif fallback)
**Label/Mono Font:** JetBrains Mono (with monospace fallback)

**Character:** One grotesk carries the entire page — Archivo at 800 for anything shouting a heading, at 400–700 for everything else — so the system never has to reconcile two competing sans-serifs. JetBrains Mono is the one deliberate contrast: it marks anything that is literally data (VIN, ZIP, dollar figures, micro-labels) so structured fields read as data, not prose.

### Hierarchy
- **Display** (800, `clamp(1.875rem, 4vw, 3rem)`, line-height 1.05): hero and top-of-page h1s. Uppercase, 0.02em tracking.
- **Headline** (800, 1.875rem / text-3xl, line-height ~1.2): section h2s ("Pick what fits your timeline"). Uppercase, same tracking as Display, one step down in size.
- **Title** (700, 1.25rem / text-xl, line-height 1.2): component-level headings, e.g. the Carrier Transport / Personal Driver card titles. Uppercase, 0.03em tracking.
- **Body** (400, 1rem, line-height 1.6): all prose copy, generally at `ink/75` or `ink/70` opacity rather than a separate lighter color token. Cap at ~65–75ch per paragraph.
- **Label** (400, 0.75rem / text-xs, 0.04em tracking, uppercase): the `manifest-label` class — used above form fields, in nav sub-labels ("Tri-State → Nationwide"), and the hero eyebrow. Always Slate on light backgrounds.

### Named Rules
**The Data-Reads-As-Data Rule.** Any field the user or system treats as structured data — VIN, ZIP, dollar amounts — renders in JetBrains Mono, even inline. Never let a data value inherit body prose styling.

**The One-Family Rule.** Archivo is the only sans-serif on the page, in both display and body roles. Don't introduce a second display face; weight and size carry the hierarchy that a second font family used to.

## 4. Elevation

Flat by rule, not by default-and-forgot: `shadow-panel` and `shadow-panel-lg` both resolve to `none` at the token level, so no surface on the site casts a drop shadow. Separation between sections and components comes entirely from solid 2px rules (`rgba(32,30,29,0.4)`), flat color blocks (the Carrier/Personal Driver cards, the Footer's full ink inversion), and opacity tints (`bg-brass/5`, `border-ink/10`) — never from lift.

### Named Rules
**The Flat-By-Rule Rule.** Elevation tokens exist in code (`shadow-panel`) purely so components don't need editing, but they are permanently set to `none`. Never reintroduce a real `box-shadow` value under either token, and never add a new ad hoc shadow to a component — depth is a solved problem here, and the answer is always "no shadow."

## 5. Components

### Buttons
- **Shape:** zero radius everywhere — every interactive surface in the system shares this same flat corner.
- **Primary:** Signal Red background, Paper text, uppercase Title-scale label, 0.03em tracking, ~12px/24px padding. Used for the header's persistent "Get a Quote," in-form progress actions (quote form Next/Submit), and the admin "Mark Delivered & Charge" action. Hover darkens to `brass-dark` (#AE1800).
- **Ghost (marketing CTAs):** transparent background, Signal Red text and 1px Signal Red border, same shape and label treatment as Primary. Hover fills solid Signal Red with Paper text. Default for every in-page "Get a Quote" link outside the header.
- **Secondary / Neutral Ghost:** transparent background, Ink text, 1px `ink/20` border — used for non-primary actions like "Compare Options." Hover strengthens the border to `ink/50`, no fill change.
- **Danger:** same shape as Primary, Signal Red background darkening to `brass-dark` on hover — used for destructive confirmations (e.g. admin "Yes, Delete"). Deliberately the same red family as Primary rather than a separate hue, since Signal Red is the system's only saturated color.
- **Focus:** every interactive element (not just inputs) gets a 2px solid Signal Red outline with 2px offset via `:focus-visible` — a global base-layer rule, not per-component.

### Cards / Containers
- **Corner Style:** zero radius, matching buttons and inputs — nothing in this system uses a softer edge.
- **Background:** Carrier Transport and Personal Driver option cards are solid fills (Signal Red and Ink respectively) with Paper text, not tinted washes. Neutral containers use plain Paper.
- **Shadow:** none, ever (see Elevation).
- **Border:** 2px solid `rgba(32,30,29,0.4)` where a card needs a boundary against Paper; small state indicators (step badges, checkboxes) also keep a 2px border since it reads better at that size.
- **Internal Padding:** generous — 32px (`p-8`) is standard for option/decision cards.

### Inputs / Fields
- **Style:** Paper background, 1px border at `slate-light/60` opacity, zero radius, 8px/12px padding, placeholder text in Slate Light.
- **Focus:** the same global 2px Signal Red `:focus-visible` outline as every other interactive element — no separate glow or border-color focus treatment.
- **Error:** border and adjacent message copy both switch to `brass-dark` (#AE1800) — never plain Ink, which would make the error invisible against normal body text. No background change, no icon; the color shift alone carries the error state.
- **Labels:** every field label uses the `manifest-label` treatment (mono, uppercase, Slate) directly above the input, not inline or floating.

### Navigation
- **Header:** Paper background (with backdrop blur, sticky), 1px `ink/10` bottom border, no shadow. Nav links are Body-weight at `ink/80`, hovering to Signal Red. The primary CTA ("Get a Quote") is a filled Signal Red button, always present, right-aligned — the one CTA label used identically everywhere on the site (header, hero, closing banner, footer).
- **Footer:** full color inversion — Ink background, Paper text — with link columns at reduced opacity (`paper/60`, `paper/70`) hovering to Signal Red Light (#FF8266). A solid 2px rule separates the link grid from the copyright line instead of a plain hairline.

### Route Rule (signature element)
A solid 2px rule at `rgba(32,30,29,0.4)` used everywhere a section divider or hairline would normally go — between homepage sections, above the Footer's copyright line. Replaces the previous system's dashed "route" motif with the flat, unbroken line the Modernist reference calls for.

### Transport Scene (signature component)
The homepage's centerpiece illustration (`components/TransportScene.tsx`): an animated flatbed carrier hauling two cars, with a solo Personal Driver car out ahead on the same road. Carrier elements render in Signal Red, the solo car in Ink, matching the Carrier/Personal Driver color-coding used everywhere else on the site. Wheels spin and the road markings scroll continuously ("treadmill" motion); everything collapses to a static frame under `prefers-reduced-motion`. The same dashed line reused here (inside the illustration itself, not as a page rule) also appears at smaller scale as the quote form's step tracker (`components/RouteProgress.tsx`).

## 6. Do's and Don'ts

### Do:
- **Do** render structured data (VIN, ZIP, dollar amounts) in JetBrains Mono, uppercase where applicable, everywhere it appears — inline, in tables, in labels.
- **Do** use the solid 2px rule (`rgba(32,30,29,0.4)`) for every section divider — never a dashed line, never a soft gray hairline.
- **Do** keep every interactive element's corner radius at zero — buttons, inputs, cards, and badges all share this value, no exceptions.
- **Do** keep Carrier Transport = Signal Red and Personal Driver = Ink as a fixed, exclusive pairing — don't introduce a third "option" hue if a new service type is ever added; extend the pairing logic instead (e.g. a bordered/outline treatment) rather than adding a new saturated color.
- **Do** use `brass-dark` for every error, danger, or failure state (invalid fields, error banners, destructive confirmations, the crash page) so they stay visually distinct from both plain Ink text and the Signal Red brand color.
- **Do** carry the global `:focus-visible` Signal Red outline and `prefers-reduced-motion` collapse into any new component — both are base-layer rules already in `globals.css`.

### Don't:
- **Don't** use a gradient-heavy hero, glassmorphism, or a generic-tech-startup visual language — explicitly rejected in `tailwind.config.ts`'s own comments as the thing this project is not.
- **Don't** add a drop shadow anywhere. `shadow-panel`/`shadow-panel-lg` resolve to `none` at the token level; don't override them or add an ad hoc `box-shadow` to a new component.
- **Don't** use a warm cream/beige background or a warm brass/gold accent — Paper is a true cool off-white, not a parchment tone.
- **Don't** let a data value (VIN, ZIP, dollar figure) inherit body prose styling — it must render in the mono Label face, not Archivo.
- **Don't** soften corners on new components (no rounded corners anywhere outside of genuinely circular elements, and this system has none) — zero radius is the system-wide rule.
- **Don't** use plain Ink for an error or danger state — it's indistinguishable from normal text and borders. Use `brass-dark`.
- **Don't** introduce a second saturated hue for a new "option" or category. Signal Red is the only accent; if two things need telling apart, use the Signal-Red/Ink pairing the way Carrier/Personal Driver already does.
