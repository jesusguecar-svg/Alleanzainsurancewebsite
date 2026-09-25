import type { Metadata } from "next";
import PropertyLanding from "@/components/PropertyLanding";
import { resolveMedia } from "@/lib/media";

export const metadata: Metadata = {
  title: "Seguro de hogar, auto e inquilinos en español | Alleanza Insurance Corp.",
  description:
    "Seguro de propiedad explicado en español: hogar, auto, inquilinos y responsabilidad civil. Qué suele cubrir cada póliza, qué deducible aplica y qué conviene leer antes de contratar.",
  keywords: [
    "seguro de hogar",
    "seguro de auto",
    "seguro para inquilinos",
    "responsabilidad civil",
    "seguro de propiedad en español",
    "seguro de casa Texas",
    "seguro de carro en español",
  ],
  alternates: { canonical: "/property-casualty" },
  openGraph: {
    type: "website",
    locale: "es_US",
    url: "/property-casualty",
    siteName: "Alleanza Insurance Corp.",
    title: "Tu casa y tu auto merecen claridad. Nosotros te los explicamos.",
    description:
      "Hogar, auto, inquilinos y responsabilidad civil, explicados en español por un agente con licencia.",
  },
};

export default function Page() {
  const media = {
    hero: resolveMedia("property-hero"),
    concepts: resolveMedia("property-concepts"),
    process: resolveMedia("property-process"),
  };

  return <PropertyLanding media={media} />;
}
