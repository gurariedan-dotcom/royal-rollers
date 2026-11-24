import type { Config } from "tailwindcss";

// Dark surfaces, cool foregrounds, and amber calls to action.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    borderRadius: {
      none: "0px",
      sm: "6px",
      DEFAULT: "8px",
      md: "10px",
      lg: "12px",
      xl: "16px",
      "2xl": "20px",
      "3xl": "28px",
      full: "9999px",
    },
    extend: {
      borderRadius: {
        btn: "10px",
        pill: "9999px",
      },
      colors: {
        ink: {
          DEFAULT: "#EEF2FA", // headings, primary text
          soft: "#C1CCDE",
        },
        paper: {
          DEFAULT: "#0C1424", // page background
          dim: "#131E32", // alternate band background
        },
        card: "#19263D",
        accent: "#AAC2FF",
        selected: "#243657",
        line: "#475773", // card + input borders
        navy: {
          DEFAULT: "#0F1B33",
          2: "#16264A", // cards on navy, Carrier card
          3: "#1C2D5B", // hero gradient highlight
          deep: "#0A1226", // footer base
          muted: "#C3CBDD", // body text on navy (10.5:1)
          line: "#2A3653", // borders on navy
        },
        amber: {
          DEFAULT: "#F2B84C", // CTAs, highlights on navy
          dark: "#E3A532", // CTA hover
          ink: "#F2B84C", // amber text on dark surfaces
        },
        brass: {
          DEFAULT: "#0F1B33", // legacy accent name -> navy
          dark: "#0A1226",
          light: "#A5B0CE",
        },
        highway: {
          DEFAULT: "#0F1B33", // Carrier Transport
          light: "#C3CBDD",
        },
        rust: {
          DEFAULT: "#15171C", // Personal Driver
          light: "#3A3F4A",
        },
        slate: {
          DEFAULT: "#B4BFD3", // muted text
          light: "#A0ADC5",
        },
        danger: "#FF918A", // errors and destructive actions only
      },
      fontFamily: {
        display: ["var(--font-archivo)", "sans-serif"],
        body: ["var(--font-archivo)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      letterSpacing: {
        wideish: "0.03em",
        signage: "-0.02em",
        kicker: "0.18em",
      },
      boxShadow: {
        panel: "0 24px 48px -28px rgba(15, 27, 51, 0.28)",
        "panel-lg": "0 32px 64px -32px rgba(15, 27, 51, 0.45)",
        button: "none",
        "button-hover": "none",
        "button-sm": "none",
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
