import type { Config } from "tailwindcss";

// Design tokens for Royal Rollers.
// Concept: "Modernist manifest" -- flat, architectural, black on off-white
// with one red accent. No shadows, no corner radius, 2px rules dividing
// every section. Token names (brass/highway/rust) are kept from the
// original palette so component code doesn't need to change, only the hex
// values: brass is now the single red accent; highway/rust (used to tell
// Carrier vs Personal Driver apart at a glance) are the accent and ink,
// respectively, since the system has no room for a second hue.
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    borderRadius: {
      none: "0px",
      sm: "0px",
      DEFAULT: "0px",
      md: "0px",
      lg: "0px",
      xl: "0px",
      "2xl": "0px",
      "3xl": "0px",
      full: "0px",
    },
    extend: {
      // Buttons opt into real elevation/roundness via these tokens
      // (rounded-btn/rounded-pill, shadow-button/shadow-button-hover)
      // without touching the flat 0-radius/no-shadow scale everything
      // else in the system still uses.
      borderRadius: {
        btn: "14px",
        pill: "999px",
      },
      colors: {
        ink: {
          DEFAULT: "#201E1D", // primary text, headers
          soft: "#403C3A",
        },
        paper: {
          DEFAULT: "#F3F2F2", // off-white background
          dim: "#E7E5E4",
        },
        brass: {
          DEFAULT: "#EC3013", // the one red accent — primary CTAs, focus rings
          dark: "#AE1800",
          light: "#FF8266",
        },
        highway: {
          DEFAULT: "#EC3013", // Carrier / insured — accent red
          light: "#FF8266",
        },
        rust: {
          DEFAULT: "#201E1D", // Personal Driver — ink black
          light: "#403C3A",
        },
        slate: {
          DEFAULT: "#605D5D",
          light: "#8A8785",
        },
      },
      fontFamily: {
        display: ["var(--font-archivo)", "sans-serif"],
        body: ["var(--font-archivo)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      letterSpacing: {
        wideish: "0.03em",
        signage: "0.02em",
      },
      boxShadow: {
        // Flat design system everywhere else -- panels stay shadowless.
        panel: "none",
        "panel-lg": "none",
        // Buttons only: real elevation, so primary/interactive controls
        // read as tappable, floating surfaces rather than flat rects.
        button: "0 1px 2px rgba(32,30,29,0.08), 0 10px 24px -8px rgba(32,30,29,0.35)",
        "button-hover": "0 2px 4px rgba(32,30,29,0.10), 0 16px 32px -8px rgba(32,30,29,0.4)",
        "button-sm": "0 1px 2px rgba(32,30,29,0.08), 0 6px 14px -6px rgba(32,30,29,0.3)",
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
