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
        paper: "#EEEDE4",
        "paper-dim": "#E4E2D6",
        ink: "#1B211F",
        "ink-soft": "#4A5450",
        seal: "#7A2E3B",
        "seal-dim": "#5C222C",
        brass: "#A9803A",
        pine: "#22403D",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        stamp: ["var(--font-stamp)", "monospace"],
      },
      borderRadius: {
        card: "22px",
      },
      boxShadow: {
        card: "0 30px 60px -25px rgba(27, 33, 31, 0.45)",
      },
    },
  },
  plugins: [],
};

export default config;
