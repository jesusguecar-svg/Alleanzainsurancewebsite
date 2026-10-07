import type { Metadata } from "next";
import HealthExperience from "@/components/health/HealthExperience";
import { getGoogleReviews } from "@/lib/google-reviews";
import { siteUrl } from "@/lib/config/site";

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
    "@context": "https://schema.org", "@type": "InsuranceAgency", name: "Alleanza Insurance Corp.",
    url: `${siteUrl}/health`, areaServed: "US", availableLanguage: ["Spanish", "English"],
    address: { "@type": "PostalAddress", streetAddress: "3424 Midcourt Rd Ste 122", addressLocality: "Carrollton", addressRegion: "TX", postalCode: "75006", addressCountry: "US" },
    telephone: "+1-214-997-4650",
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><HealthExperience locale="es" reviews={reviews} reviewsUrl={process.env.GOOGLE_REVIEWS_URL} /></>;
}
