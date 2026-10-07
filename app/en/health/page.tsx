import type { Metadata } from "next";
import HealthExperience from "@/components/health/HealthExperience";
import { getGoogleReviews } from "@/lib/google-reviews";
import { siteUrl } from "@/lib/config/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Health Insurance and Obamacare (ACA) Guidance | Alleanza Insurance Corp.",
  description: "Explore ACA / Obamacare, private health, dental, vision, and supplemental coverage with Alleanza. Understand your options with licensed, bilingual advisor guidance.",
  keywords: ["health insurance", "Obamacare", "ACA", "bilingual insurance agent", "private health insurance", "supplemental insurance", "Health Insurance Marketplace", "Texas health insurance"],
  alternates: { canonical: "/en/health", languages: { "es-US": "/health", "en-US": "/en/health", "x-default": "/health" } },
  openGraph: {
    type: "website", locale: "en_US", url: "/en/health", siteName: "Alleanza Insurance Corp.",
    title: "Compare your options. Understand the differences. | Alleanza Health",
    description: "Compare ACA, private health, and supplemental coverage with clear costs, limits, and bilingual guidance.",
  },
};

export default async function EnglishHealthPage() {
  const reviews = await getGoogleReviews("en");
  const structuredData = {
    "@context": "https://schema.org", "@type": "InsuranceAgency", name: "Alleanza Insurance Corp.",
    url: `${siteUrl}/en/health`, areaServed: "US", availableLanguage: ["English", "Spanish"],
    address: { "@type": "PostalAddress", streetAddress: "3424 Midcourt Rd Ste 122", addressLocality: "Carrollton", addressRegion: "TX", postalCode: "75006", addressCountry: "US" },
    telephone: "+1-214-997-4650",
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><HealthExperience locale="en" reviews={reviews} reviewsUrl={process.env.GOOGLE_REVIEWS_URL} /></>;
}
