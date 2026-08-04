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
          DEFAULT: "#0a0a0c",
          soft: "#121216",
          card: "#17171c",
          hover: "#20202a",
          orange: "#1c130a",
        },
        line: "#26262e",
        ink: {
          DEFAULT: "#f5f5f7",
          soft: "#a2a2ad",
          faint: "#6a6a76",
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
        glow: "0 0 0 1px rgba(255,131,0,0.25), 0 8px 40px -12px rgba(255,131,0,0.45)",
        card: "0 1px 0 0 rgba(255,255,255,0.03) inset, 0 8px 30px -18px rgba(0,0,0,0.9)",
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
