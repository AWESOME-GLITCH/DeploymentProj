import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#08080a",
          soft: "#0f0f12",
          card: "#141418",
          elevated: "#1a1a20",
          hover: "#1f1f26",
          orange: "#1c130a",
        },
        line: {
          DEFAULT: "#24242b",
          soft: "#1a1a20",
          strong: "#33333d",
        },
        ink: {
          DEFAULT: "#fafafa",
          soft: "#a1a1ac",
          faint: "#71717a",
        },
        brand: {
          DEFAULT: "#ff8300",
          soft: "#ff9d3d",
          glow: "#e57500",
        },
        accent: {
          teal: "#33d6c0",
          amber: "#ffb547",
          rose: "#ff6b8b",
          blue: "#5b9dff",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        display: [
          "var(--font-display)",
          "var(--font-sans)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,131,0,0.28), 0 4px 18px -8px rgba(255,131,0,0.3)",
        card: "inset 0 1px 0 0 rgba(255,255,255,0.04), 0 12px 32px -24px rgba(0,0,0,0.9)",
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};

export default config;
