import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/PlaceholderPage";
import { academyUrl } from "@/lib/config/contact";

export const metadata: Metadata = {
  title: "Alleanza Academy | Formación para agentes de seguros",
  description:
    "Alleanza Academy acompaña la formación de agentes de seguros: capacitación sobre productos y procesos, aprendizaje continuo y un camino claro de crecimiento.",
  alternates: { canonical: "/academy" },
  openGraph: {
    type: "website", locale: "es_US", url: "/academy", siteName: "Alleanza Insurance",
    title: "Alleanza Academy",
    description: "Formación y recursos para crecer como agente de seguros.",
  },
};

export default function Page() {
  return (
    <PlaceholderPage
      icon="academy"
      eyebrow="Formación y recursos"
      title="Alleanza Academy."
      intro="La academia acompaña a quienes empiezan y a quienes quieren seguir creciendo en el mundo de los seguros, con capacitación sobre productos y procesos y espacios de aprendizaje continuo."
      points={[
        "Capacitación continua sobre productos y procesos.",
        "Espacios para seguir estudiando el mercado y sus cambios.",
        "Un camino de crecimiento a tu ritmo.",
        "Oportunidad de formar y guiar a otros agentes.",
      ]}
      primaryCta={{ href: academyUrl, label: "Ir a la academia", external: true }}
      secondaryCta={{ href: "/work", label: "Ver oportunidades de carrera" }}
    />
  );
}
