import type { Config } from "tailwindcss";

// Design tokens for Royal Rollers.
// Concept: "The Rig Plate" -- a stamped steel ID plate / stenciled shipping
// crate, not a printed paper manifest. Near-black graphite surfaces, a bold
// cobalt "signal blue" for CTAs and focus, a cool teal for "insured /
// carrier" trust signals, and a deep oxblood for the Personal Driver option.
// Token names (brass/highway/rust) are kept from the original manifest
// concept so component code doesn't need to change, only the hex values.
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#16181C", // primary text, headers — near-black graphite
          soft: "#383C44",
        },
        paper: {
          DEFAULT: "#F1F2F4", // cool off-white background
          dim: "#E3E5E9",
        },
        brass: {
          DEFAULT: "#2955D1", // signal blue — primary CTAs, focus rings
          dark: "#1E3F9E",
          light: "#7FA0F5",
        },
        highway: {
          DEFAULT: "#146B63", // cool teal — Carrier / insured
          light: "#3F9187",
        },
        rust: {
          DEFAULT: "#7A3B4E", // deep oxblood — Personal Driver accent
          light: "#A65E73",
        },
        slate: {
          DEFAULT: "#565C66",
          light: "#8990A0",
        },
      },
      fontFamily: {
        display: ["var(--font-big-shoulders)", "sans-serif"],
        body: ["var(--font-archivo)", "sans-serif"],
        mono: ["var(--font-fragment-mono)", "monospace"],
      },
      letterSpacing: {
        wideish: "0.02em",
        signage: "0.02em",
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
