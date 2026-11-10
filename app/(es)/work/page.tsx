import type { Metadata } from "next";
import WorkPage from "@/components/WorkPage";
import { companyFacts } from "@/lib/config/company";

const careerDescription = companyFacts.carrierRelationships.verified
  ? "Construye una carrera como agente de seguros acompañando a familias hispanas. Acceso a varias compañías, respaldo del equipo, herramientas de venta y formación continua con Alleanza Academy."
  : "Construye una carrera como agente de seguros acompañando a familias hispanas. Respaldo del equipo, herramientas de venta y formación continua con Alleanza Academy.";

export const metadata: Metadata = {
  title: "Trabaja con nosotros | Carrera como agente de seguros | Alleanza Insurance Corp.",
  description: careerDescription,
  alternates: { canonical: "/work" },
  openGraph: {
    type: "website",
    locale: "es_US",
    url: "/work",
    siteName: "Alleanza Insurance Corp.",
    title: "Construye una carrera ayudando a familias",
    description:
      "Una carrera en seguros con acompañamiento, formación y oportunidad de crecimiento.",
  },
};

export default function Page() {
  return <WorkPage />;
}
