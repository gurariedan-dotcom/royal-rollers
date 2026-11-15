---
name: Royal Rollers
description: Vehicle transport brokerage site in deep navy and amber, built from the owner's 2026-11 mockups.
colors:
  navy: "#0F1B33"
  navy-2: "#16264A"
  navy-3: "#1C2D5B"
  navy-deep: "#0A1226"
  navy-muted: "#C3CBDD"
  navy-line: "#2A3653"
  amber: "#F2B84C"
  amber-dark: "#E3A532"
  amber-ink: "#8A6200"
  ink: "#15171C"
  ink-soft: "#3A3F4A"
  paper: "#F5F4EF"
  paper-dim: "#ECE9E0"
  card: "#FFFFFF"
  line: "#DDD8CE"
  slate: "#5E626D"
  slate-light: "#8A8F98"
  danger: "#B42318"
  choice-on: "#EEF2FB"
  illustration-blue: "#7FA2F5"
  illustration-white: "#E8ECF5"
  illustration-window: "#4A5E9A"
  illustration-road: "#3A4766"
  illustration-chassis: "#1C2A4D"
  hero-mid: "#142344"
typography:
  display:
    fontFamily: "Archivo, sans-serif"
    fontSize: "clamp(3rem, 7.5vw, 6rem)"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Archivo, sans-serif"
    fontSize: "3rem"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Archivo, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 800
    lineHeight: 1.3
    letterSpacing: "normal"
  body:
    fontFamily: "Archivo, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Archivo, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.18em"
  data:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
rounded:
  none: "0px"
  sm: "6px"
  DEFAULT: "8px"
  md: "10px"
  btn: "10px"
  lg: "12px"
  xl: "16px"
  2xl: "20px"
  3xl: "28px"
  full: "9999px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "32px"
  section: "96px"
components:
  button-amber:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.navy}"
    rounded: "{rounded.btn}"
    padding: "12px 24px"
  button-amber-hover:
    backgroundColor: "{colors.amber-dark}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.navy}"
    rounded: "{rounded.btn}"
    padding: "12px 24px"
  button-outline-on-navy:
    backgroundColor: "transparent"
    textColor: "{colors.paper}"
    rounded: "{rounded.btn}"
    padding: "12px 24px"
  card:
    backgroundColor: "{colors.card}"
    rounded: "{rounded.xl}"
  field:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "12px 16px"
  field-error:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "12px 16px"
---

# Design System: Royal Rollers

## 1. Overview

Built from the owner's 2026-11 mockups. Deep navy carries the brand (header, hero, the Carrier Transport card, info tiles, contact band, footer). One amber accent does the selling: every primary CTA, highlighted words in the hero, completed quote steps. Content sits on white cards over a warm off-white page, alternating with a slightly darker band (`paper-dim`) to separate sections.

**Key characteristics**
- Navy + amber, nothing else saturated. `danger` red is for errors only.
- Archivo for everything, bold sentence-case headings. JetBrains Mono only for literal data (VIN, ZIP, dollar estimates).
- Rounded white cards with a 1px warm border; soft navy-tinted shadow only on floating surfaces (quote card, dialogs, date picker, hero illustration).
- One amber kicker (small, bold, tracked, uppercase) above each page/section title.

## 2. Colors

- **Navy** `#0F1B33` — brand surfaces; also the outline button and focus ring on light backgrounds. `navy-2` for cards on navy, `navy-3` for the hero gradient highlight, `navy-deep` for the footer.
- **Amber** `#F2B84C` — CTAs and highlights on navy. **Always dark (navy) text on amber** — white on amber is 1.8:1 and fails.
- **Amber ink** `#8A6200` — amber-family text on light backgrounds (kickers, "Typically 24-30 hours"). Passes AA on `paper` and `paper-dim`.
- **Ink** `#15171C` headings and body; **slate** `#5E626D` secondary text (5.5:1 on paper). `slate-light` fails body contrast — placeholders and decoration only.
- **Navy-muted** `#C3CBDD` — body text on navy (10.5:1).
- **Danger** `#B42318` — errors, destructive admin actions. Never decorative.
- **Illustration colors** (`illustration-*`, `hero-mid`) — only inside `TruckIllustration` and the hero gradient.

Legacy token names in `tailwind.config.ts` are remapped so older components restyle without edits: `brass` = navy, `highway` = navy (Carrier), `rust` = ink (Personal Driver).

## 3. Typography

- **Display** — hero h1, `clamp(3rem, 7.5vw, 6rem)`, 800, -0.02em.
- **Headline** — section h2 / page h1, `text-4xl md:text-5xl`, 800.
- **Title** — card and step titles, 1.25rem, 800.
- **Body** — 1rem/1.6, `text-lg` for lead paragraphs. Cap prose at ~70ch.
- **Label** — `.kicker` (amber-ink) above titles; `.manifest-label` (slate) for table row labels. Uppercase, 0.18em tracking, used sparingly.
- **Field label** — `.field-label`, bold ink, sentence case.
- Headings use `text-wrap: balance`, paragraphs `text-wrap: pretty`.

## 4. Components (globals.css)

- `.btn-amber` — primary CTA. `.btn-outline` — secondary; flips to white-on-navy inside `.on-navy`.
- `.card` — white, `rounded-xl`, 1px `line` border.
- `.field` / `.field-error` — 2px border inputs, navy on focus.
- `.choice` / `.choice-on` — selectable tiles (service cards, option buttons, vehicle types); selected = navy border + `#EEF2FB` fill.
- `.on-navy` — wrap any navy surface: switches headings to white, focus rings to amber, outline buttons to white.
- `.hero-bg` — navy gradient with faint horizontal lane lines.

## 5. Layout and motion

- Content width `max-w-6xl` (marketing), `max-w-4xl` (FAQ, quote form, contact). Sections `py-20 md:py-24`.
- Homepage = long scroll of the shared sections in `components/Sections.tsx`; standalone pages reuse the same sections with an `h1`.
- Motion: the hero truck rolls in and cars settle onto the decks (CSS, transform-only so it is visible even if animation never runs); FAQ and mobile nav expand with `motion`. `prefers-reduced-motion` collapses all of it globally.
