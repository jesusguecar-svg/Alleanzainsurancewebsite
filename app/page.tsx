import type { Metadata } from "next";
import PortalHub from "@/components/PortalHub";

export const metadata: Metadata = {
  title: "Alleanza Insurance | Salud, vida, propiedad, academia y carrera",
  description:
    "Portal de Alleanza Insurance. Orientación clara en español para familias, clientes y futuros agentes: seguros de salud y ACA, seguro de vida, propiedad y riesgos, formación y carrera.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_US",
    url: "/",
    siteName: "Alleanza Insurance",
    title: "Alleanza Insurance | Elige el camino correcto para proteger lo que más importa",
    description:
      "Orientación clara en español en salud, vida, propiedad, academia y carrera.",
  },
};

export default function Page() {
  return <PortalHub />;
}
