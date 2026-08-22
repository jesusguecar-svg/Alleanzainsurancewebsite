import type { Config } from "tailwindcss";

/**
 * Brand tokens come from the official brandbook and
 * docs/brand/color-tipography-Alleanza.pdf. Do not introduce ad-hoc tints —
 * see docs/brand/README.md before adding a colour.
 */
export default {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        /** Cian Alleanza — accents, buttons, links, icons, CTAs. */
        cyan: "#04C0FE",
        /** Azul marino Alleanza — text, headings, institutional backgrounds, navigation. */
        navy: "#061431",
        /** Aqua Alleanza — categories, positive messages, education, Academy. */
        aqua: "#1DD4B7",
        /** Gris institucional — supporting backgrounds, dividers, cards. */
        mist: "#EAEDF3",
      },
      fontFamily: {
        // Inter is the only brand typeface; Arial/Helvetica are the sanctioned
        // fallbacks when it cannot load.
        sans: ["var(--font-inter)", "Arial", "Helvetica", "sans-serif"],
        display: ["var(--font-inter)", "Arial", "Helvetica", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
