import type { Config } from "tailwindcss";

// Design tokens for Royal Rollers.
// Concept: a shipping-manifest / interstate-corridor look, not a generic
// SaaS gradient. "Charcoal + Chrome" palette: cool graphite ink, a steel-blue
// chrome accent for CTAs, a deep teal-green for "insured / carrier" trust
// signals, and burnt copper for the Personal Driver option. Token names
// (brass/highway/rust) are kept from the original manifest concept so
// component code doesn't need to change, only the hex values underneath.
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#1C1E22", // primary text, headers — graphite
          soft: "#3A3D44",
        },
        paper: {
          DEFAULT: "#F2F2F0", // cool off-white background
          dim: "#E6E6E2",
        },
        brass: {
          DEFAULT: "#4C6B8A", // steel-blue chrome accent — primary CTAs
          dark: "#38516A",
          light: "#7396B4",
        },
        highway: {
          DEFAULT: "#2E5C4E", // deep teal-green — Carrier / insured
          light: "#3F7C6A",
        },
        rust: {
          DEFAULT: "#8A4A2E", // burnt copper — Personal Driver accent
          light: "#B06B45",
        },
        slate: {
          DEFAULT: "#5B6169",
          light: "#8B929B",
        },
      },
      fontFamily: {
        display: ["var(--font-oswald)", "sans-serif"],
        body: ["var(--font-public-sans)", "sans-serif"],
        mono: ["var(--font-plex-mono)", "monospace"],
      },
      letterSpacing: {
        wideish: "0.04em",
        signage: "0.08em",
      },
      boxShadow: {
        // Ink-tinted, not pure-black -- gives depth without looking like a
        // default Tailwind/Bootstrap card shadow.
        panel: "0 1px 2px rgba(28,30,34,0.06), 0 12px 32px -12px rgba(28,30,34,0.18)",
        "panel-lg": "0 4px 8px rgba(28,30,34,0.08), 0 24px 60px -20px rgba(28,30,34,0.28)",
      },
      keyframes: {
        "pop-in": {
          "0%": { transform: "scale(0.5)", opacity: "0" },
          "60%": { transform: "scale(1.08)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
      },
      animation: {
        "pop-in": "pop-in 0.3s ease-out",
        shimmer: "shimmer 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
