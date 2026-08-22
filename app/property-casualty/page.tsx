import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export const metadata: Metadata = {
  title: "Seguros de propiedad y riesgos (P&C) | Alleanza Insurance",
  description:
    "Cobertura para propiedad y riesgos cotidianos, explicada en español. Orientación de un agente de seguros con licencia sobre qué revisar antes de contratar.",
  alternates: { canonical: "/property-casualty" },
  openGraph: {
    type: "website", locale: "es_US", url: "/property-casualty", siteName: "Alleanza Insurance",
    title: "Propiedad y riesgos | Alleanza Insurance",
    description: "Cobertura para propiedad y riesgos cotidianos, explicada en español.",
  },
};

export default function Page() {
  return (
    <PlaceholderPage
      icon="property-casualty"
      eyebrow="Propiedad y riesgos cotidianos"
      title="Cobertura para lo que ya construiste."
      intro="Estamos preparando esta sección para explicar, con el mismo cuidado que el resto del sitio, las coberturas de propiedad y responsabilidad disponibles y qué conviene revisar antes de contratar."
      points={[
        "Qué distingue una cobertura de propiedad de una de responsabilidad.",
        "Qué suele quedar excluido y por qué conviene leerlo antes de firmar.",
        "Cómo influyen la ubicación y las características del inmueble.",
        "Qué documentación pide normalmente la compañía aseguradora.",
      ]}
      primaryCta={{ href: "/health#contacto", label: "Hablar con un agente con licencia" }}
      secondaryCta={{ href: "/", label: "Ver todas las áreas" }}
    />
  );
}
