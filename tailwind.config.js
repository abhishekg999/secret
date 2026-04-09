/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    extend: {
      fontFamily: {
        sans: ["JetBrains Mono", "Courier New", "monospace"],
        mono: ["JetBrains Mono", "Courier New", "monospace"],
      },
      colors: {
        // Surfaces — three depth levels
        surface: {
          DEFAULT: "#111827", // page background
          raised: "#1f2937", // cards, panels
          inset: "#374151", // inputs, inner elements
        },
        // Text hierarchy
        content: {
          DEFAULT: "#f3f4f6", // headings, primary
          body: "#d1d5db", // body text
          muted: "#9ca3af", // labels, hints
          faint: "#6b7280", // least important
        },
        // Borders — two levels
        edge: {
          DEFAULT: "#374151", // card borders, dividers
          subtle: "#4b5563", // inner borders (inputs)
        },
        // Accent — purple
        accent: {
          DEFAULT: "#581c87", // buttons, primary actions
          hover: "#6b21a8", // hover state
          muted: "#a78bfa", // soft text, icon hovers
          ring: "#a855f7", // focus rings, drag
          bar: "#9333ea", // progress bar fill
        },
        // Status
        danger: {
          DEFAULT: "#7f1d1d", // background
          edge: "#b91c1c", // border
          content: "#fee2e2", // text on danger bg
          muted: "#f87171", // standalone text
        },
        success: "#4ade80",
        warning: {
          DEFAULT: "#eab308", // bar fill
          content: "#facc15", // text
        },
      },
      borderRadius: {
        lg: "0",
        md: "0",
        sm: "0",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
