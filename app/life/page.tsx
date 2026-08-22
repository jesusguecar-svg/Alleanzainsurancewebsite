import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export const metadata: Metadata = {
  title: "Seguro de vida en español | Alleanza Insurance",
  description:
    "Seguro de vida explicado en español: cómo funcionan las modalidades disponibles y qué debes confirmar con la compañía aseguradora antes de solicitar. Orientación de un agente con licencia.",
  alternates: { canonical: "/life" },
  openGraph: {
    type: "website", locale: "es_US", url: "/life", siteName: "Alleanza Insurance",
    title: "Seguro de vida | Alleanza Insurance",
    description: "Protección financiera para tu familia, explicada en español.",
  },
};

export default function Page() {
  return (
    <PlaceholderPage
      icon="life"
      eyebrow="Protección para los tuyos"
      title="Seguro de vida, explicado sin rodeos."
      intro="Una póliza de vida puede dejar un beneficio a las personas que designes, según los términos del contrato. Te ayudamos a entender las diferencias entre las modalidades disponibles y qué implica cada una."
      points={[
        "Qué distingue a cada modalidad y para qué situación suele usarse.",
        "Qué preguntas de salud y requisitos de elegibilidad puede pedir la compañía.",
        "Cómo se define el monto y a quién designas como beneficiario.",
        "Qué exclusiones y períodos de contestabilidad conviene revisar en la póliza.",
      ]}
      primaryCta={{ href: "/health#contacto", label: "Hablar con un agente con licencia" }}
      secondaryCta={{ href: "/", label: "Ver todas las áreas" }}
    />
  );
}
