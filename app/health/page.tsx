import type { Metadata } from "next";
import HealthExperience from "@/components/health/HealthExperience";
import { getGoogleReviews } from "@/lib/google-reviews";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Seguro médico y Obamacare (ACA) en español | Alleanza Insurance",
  description:
    "Asesoría de salud en español en los 50 estados. Compara ACA / Obamacare, seguro privado, dental y visión y protección complementaria con Alleanza Insurance.",
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
  alternates: { canonical: "/health" },
  openGraph: {
    type: "website",
    locale: "es_US",
    url: "/health",
    siteName: "Alleanza Insurance",
    title: "La vida se vive mejor con tranquilidad. | Alleanza Salud",
    description:
      "Compara ACA, seguro privado y coberturas complementarias en español, con costos y límites claros.",
  },
};

export default async function Page() {
  const reviews = await getGoogleReviews();
  return <HealthExperience reviews={reviews} reviewsUrl={process.env.GOOGLE_REVIEWS_URL} />;
}
