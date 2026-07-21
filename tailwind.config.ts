import type { Config } from "tailwindcss";

// Design tokens for Royal Rollers.
// Concept: a shipping-manifest / interstate-corridor look, not a generic
// SaaS gradient. Ink on paper, a brass VIN-plate accent, and a highway green
// reserved for "insured / carrier" trust signals. See README.md > Design
// notes for the reasoning behind each choice.
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#1E2A3A", // primary text, headers — "ink on a manifest"
          soft: "#3A4756",
        },
        paper: {
          DEFAULT: "#F0F1EC", // cool off-white background, not warm cream
          dim: "#E4E6DE",
        },
        brass: {
          DEFAULT: "#A6763B", // VIN-plate brass — primary accent / CTAs
          dark: "#8A5F2C",
          light: "#C99A5B",
        },
        highway: {
          DEFAULT: "#1F4B3F", // interstate-shield green — Carrier / insured
          light: "#2E6552",
        },
        rust: {
          DEFAULT: "#B5502F", // Personal Driver accent — road, motion
          light: "#CC6A44",
        },
        slate: {
          DEFAULT: "#5C6570",
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
      keyframes: {
        "pop-in": {
          "0%": { transform: "scale(0.5)", opacity: "0" },
          "60%": { transform: "scale(1.08)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "pop-in": "pop-in 0.3s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
