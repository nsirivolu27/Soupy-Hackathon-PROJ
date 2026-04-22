import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        paper: "#F8FAFC",
        calm: "#0F766E",
        warm: "#F97316",
        danger: "#B91C1C"
      }
    }
  },
  plugins: []
} satisfies Config;
