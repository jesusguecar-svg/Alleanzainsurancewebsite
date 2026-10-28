import type { Metadata } from "next";
import localFont from "next/font/local";
import { AnalyticsRuntime } from "@/components/analytics/AnalyticsRuntime";
import { VercelObservability } from "@/components/analytics/VercelObservability";
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

/**
 * Google Consent Mode v2 defaults. Runs before anything else on every page, so GTM, which loads
 * later and only after the visitor allows analytics, always starts from "denied". Advertising
 * signals stay denied in this phase; the consent banner only ever grants analytics_storage.
 */
const consentDefaults = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag("consent","default",{ad_storage:"denied",ad_user_data:"denied",ad_personalization:"denied",analytics_storage:"denied",functionality_storage:"denied",personalization_storage:"denied",security_storage:"granted",wait_for_update:500});
gtag("set","ads_data_redaction",true);gtag("set","url_passthrough",false);
gtag("set",{allow_google_signals:false,allow_ad_personalization_signals:false});`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${inter.variable} scroll-smooth`}>
      <head>
        <script id="consent-defaults" dangerouslySetInnerHTML={{ __html: consentDefaults }} />
      </head>
      <body>
        {children}
        <HealthTransition />
        <AnalyticsRuntime googleTags={isProductionDeploy} />
        <VercelObservability />
      </body>
    </html>
  );
}
