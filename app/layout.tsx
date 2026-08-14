import type { Metadata } from "next";
import { siteUrl } from "@/lib/config/site";
import "./globals.css";

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
    <html lang="es" className="scroll-smooth">
      <body>{children}</body>
    </html>
  );
}
