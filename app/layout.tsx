import type { Metadata } from "next";
import localFont from "next/font/local";
import { siteUrl } from "@/lib/config/site";
import "./globals.css";

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

const title = "Alleanza Insurance | Tu familia, protegida";
const description =
  "Seguros para familias hispanas en Texas: seguro médico, Obamacare (ACA), seguro de vida y coberturas complementarias como accidentes, hospitalización, cáncer y eventos cardíacos. Te lo explicamos en español, con agentes de seguros con licencia.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_US",
    url: "/",
    siteName: "Alleanza Insurance",
    title,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${inter.variable} scroll-smooth`}>
      <body>{children}</body>
    </html>
  );
}
