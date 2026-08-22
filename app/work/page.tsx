import type { Metadata } from "next";
import WorkPage from "@/components/WorkPage";

export const metadata: Metadata = {
  title: "Trabaja con nosotros | Carrera como agente de seguros | Alleanza Insurance",
  description:
    "Construye una carrera como agente de seguros acompañando a familias hispanas. Acceso a varias compañías, respaldo del equipo, herramientas de venta y formación continua con Alleanza Academy.",
  alternates: { canonical: "/work" },
  openGraph: {
    type: "website",
    locale: "es_US",
    url: "/work",
    siteName: "Alleanza Insurance",
    title: "Construye una carrera ayudando a familias",
    description:
      "Una carrera en seguros con acompañamiento, formación y oportunidad de crecimiento.",
  },
};

export default function Page() {
  return <WorkPage />;
}
