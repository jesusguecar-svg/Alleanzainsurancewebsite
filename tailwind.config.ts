import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: { cyan: "#04c0fe", navy: "#061431" },
      fontFamily: { sans: ["var(--font-manrope)", "sans-serif"], display: ["var(--font-playfair)", "serif"] },
    },
  },
  plugins: [],
} satisfies Config;
