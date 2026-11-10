import { Newsreader } from "next/font/google";

/**
 * Headline serif for /health only. Replaces the Georgia stack on this page because Georgia is
 * missing on Android. next/font self-hosts the files at build time; no runtime font CDN.
 */
export const healthSerif = Newsreader({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-newsreader",
  display: "swap",
});
