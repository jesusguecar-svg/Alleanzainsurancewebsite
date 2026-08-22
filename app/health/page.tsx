import type { Metadata } from "next";
import HealthLanding from "@/components/HealthLanding";
import { resolveMedia } from "@/lib/media";

export const metadata: Metadata = {
  title: "Seguro médico y Obamacare (ACA) en español | Alleanza Insurance",
  description:
    "Seguro de salud en español para familias hispanas en Texas. Compara Obamacare (ACA), seguro médico privado y protección complementaria — accidentes, hospitalaria, cáncer, cardíaca y cuidados intensivos — con orientación por teléfono o videollamada de un agente con licencia.",
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
    title: "El seguro médico es confuso. Nosotros te lo explicamos.",
    description:
      "Compara ACA, seguro privado y coberturas complementarias en español, con costos y límites claros.",
  },
};

export default function Page() {
  // Media availability is resolved on the server so missing files fall back
  // gracefully instead of 404-ing in the browser.
  const media = {
    hero: resolveMedia("health-hero"),
    concepts: resolveMedia("health-concepts"),
    process: resolveMedia("health-process"),
  };

  return <HealthLanding media={media} />;
}
