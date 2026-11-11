import type { Metadata } from "next";
import { HealthGuides } from "@/components/guides/HealthGuides";
import HealthExperience from "@/components/health/HealthExperience";
import { serverOpenEnrollmentPhase } from "@/lib/content/open-enrollment";
import { getGoogleReviews } from "@/lib/google-reviews";
import { siteUrl } from "@/lib/config/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationRef } from "@/lib/seo/schema";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Seguro médico y Obamacare (ACA) en español | Alleanza Insurance Corp.",
  description:
    "Explora ACA / Obamacare, seguro privado, dental, visión y protección complementaria. Alleanza te ayuda a entender tus opciones con orientación de asesores autorizados.",
  keywords: [
    "seguro médico",
    "Obamacare",
    "ACA",
    "seguro de salud en español",
    "seguro privado",
    "protección complementaria",
    "Mercado de Salud",
    "seguro de salud Texas",
    "seguros para familias hispanas",
  ],
  alternates: { canonical: "/health", languages: { "es-US": "/health", "en-US": "/en/health", "x-default": "/health" } },
  openGraph: {
    type: "website",
    locale: "es_US",
    url: "/health",
    siteName: "Alleanza Insurance Corp.",
    title: "Compara tus opciones. Entiende las diferencias. | Alleanza Salud",
    description:
      "Compara ACA, seguro privado y coberturas complementarias en español, con costos y límites claros.",
  },
};

export default async function Page() {
  const reviews = await getGoogleReviews("es");
  const structuredData = {
    "@context": "https://schema.org", "@type": "WebPage", "@id": `${siteUrl}/health#webpage`,
    url: `${siteUrl}/health`, inLanguage: "es", about: organizationRef,
  };
  return <><JsonLd data={structuredData} /><HealthExperience locale="es" openEnrollmentPhase={serverOpenEnrollmentPhase()} reviews={reviews} reviewsUrl={process.env.GOOGLE_REVIEWS_URL} guides={<HealthGuides locale="es" />} /></>;
}
