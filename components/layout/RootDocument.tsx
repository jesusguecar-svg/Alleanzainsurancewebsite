import type { Metadata } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import { AnalyticsRuntime } from "@/components/analytics/AnalyticsRuntime";
import { VercelObservability } from "@/components/analytics/VercelObservability";
import { HealthTransition } from "@/components/transitions/HealthTransition";
import { isProductionDeploy, siteUrl } from "@/lib/config/site";

/**
 * The <html> document shared by the Spanish and English root layouts (app/(es)/layout.tsx and
 * app/(en)/layout.tsx). Two root layouts exist only so each language ships the right
 * <html lang> in the server HTML, with every page still static. Public URLs are unchanged:
 * route groups do not appear in the path.
 */

/**
 * Inter is the brand's only typeface (brandbook pp. 21-22). Self-hosted from the
 * committed variable font so the site never depends on a third-party font CDN.
 */
const inter = localFont({
  src: "../../public/fonts/Inter-V.ttf",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});

export type SiteLocale = "es" | "en";

const defaults = {
  es: {
    title: "Alleanza Insurance Corp. | Orientación para elegir con claridad",
    description:
      "Seguros para familias hispanas, desde Carrollton, Texas, con una red de agentes licenciados en los 50 estados: seguro médico, Obamacare (ACA), seguro de vida y coberturas complementarias. Te lo explicamos en español; la disponibilidad depende del estado y la elegibilidad.",
    ogLocale: "es_US",
  },
  en: {
    title: "Alleanza Insurance Corp. | Guidance to choose with clarity",
    description:
      "Insurance guidance for Hispanic families, from Carrollton, Texas, with a network of licensed agents serving clients across all 50 states. Product availability varies by state, applicable licensing, and eligibility.",
    ogLocale: "en_US",
  },
} as const;

export function rootMetadata(locale: SiteLocale): Metadata {
  const { title, description, ogLocale } = defaults[locale];
  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    // No `url` here: pages without their own openGraph would otherwise announce the homepage.
    openGraph: { type: "website", locale: ogLocale, siteName: "Alleanza Insurance Corp.", title, description },
    // No title or description here: each page falls back to its own Open Graph text.
    twitter: { card: "summary_large_image" },
    robots: isProductionDeploy ? { index: true, follow: true } : { index: false, follow: false },
  };
}

/**
 * Google Consent Mode v2 defaults. Runs before anything else on every page, so GTM, which loads
 * later and only after the visitor allows analytics, always starts from "denied". Advertising
 * signals stay denied in this phase; the consent banner only ever grants analytics_storage.
 */
const consentDefaults = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag("consent","default",{ad_storage:"denied",ad_user_data:"denied",ad_personalization:"denied",analytics_storage:"denied",functionality_storage:"denied",personalization_storage:"denied",security_storage:"granted",wait_for_update:500});
gtag("set","ads_data_redaction",true);gtag("set","url_passthrough",false);
gtag("set",{allow_google_signals:false,allow_ad_personalization_signals:false});`;

export function RootDocument({ locale, children }: { locale: SiteLocale; children: ReactNode }) {
  return (
    <html lang={locale} className={`${inter.variable} scroll-smooth`}>
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
