import type { Metadata } from "next";
import localFont from "next/font/local";
import { AnalyticsConsent } from "@/components/AnalyticsConsent";
import { isProductionDeploy, siteUrl } from "@/lib/config/site";
import "./globals.css";
import { HealthTransition } from "@/components/transitions/HealthTransition";

/**
 * Inter is the brand's only typeface (brandbook pp. 21-22). Self-hosted from the
 * committed variable font so the site never depends on a third-party font CDN.
 */
const inter = localFont({
  src: "../public/fonts/Inter-V.ttf",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});

const title = "Alleanza Insurance Corp. | Orientación para elegir con claridad";
const description =
  "Seguros para familias hispanas, desde Carrollton, Texas, con una red de agentes licenciados en los 50 estados: seguro médico, Obamacare (ACA), seguro de vida y coberturas complementarias. Te lo explicamos en español; la disponibilidad depende del estado y la elegibilidad.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: { canonical: "/" },
  // No `url` here: pages without their own openGraph would otherwise announce the homepage.
  openGraph: {
    type: "website",
    locale: "es_US",
    siteName: "Alleanza Insurance Corp.",
    title,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
  robots: isProductionDeploy
    ? { index: true, follow: true }
    : { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${inter.variable} scroll-smooth`}>
      <body>
        {children}
        <HealthTransition />
        <AnalyticsConsent />
      </body>
    </html>
  );
}
