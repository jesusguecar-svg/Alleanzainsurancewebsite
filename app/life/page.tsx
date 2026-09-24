import type { Metadata } from "next";
import LifeLanding from "@/components/LifeLanding";
import { resolveMedia } from "@/lib/media";

export const metadata: Metadata = {
  title: "Seguro de vida en español | Alleanza Insurance",
  description:
    "Seguro de vida explicado en español: temporal, permanente y gastos finales. Qué puede dejar cada modalidad, a quién designas como beneficiario y qué conviene confirmar con la compañía antes de solicitar.",
  keywords: [
    "seguro de vida",
    "seguro de vida temporal",
    "seguro de vida permanente",
    "gastos finales",
    "seguro de vida en español",
    "beneficiario",
    "seguro de vida Texas",
  ],
  alternates: { canonical: "/life" },
  openGraph: {
    type: "website",
    locale: "es_US",
    url: "/life",
    siteName: "Alleanza Insurance",
    title: "El seguro de vida no debería ser un misterio. Nosotros te lo explicamos.",
    description:
      "Temporal, permanente y gastos finales, explicados en español, con un agente de seguros con licencia.",
  },
};

export default function Page() {
  const media = {
    hero: resolveMedia("life-hero"),
    concepts: resolveMedia("life-concepts"),
    process: resolveMedia("life-process"),
  };

  return <LifeLanding media={media} />;
}
