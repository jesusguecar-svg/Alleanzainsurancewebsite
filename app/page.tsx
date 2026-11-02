import type { Metadata } from "next";
import { HomeDirectory } from "@/components/home/HomeDirectory";
import PortalHub from "@/components/PortalHub";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationSchema, websiteSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "Alleanza Insurance Corp. | Salud, vida, academia y carrera",
  description:
    "Portal de Alleanza Insurance Corp. Orientación clara en español para familias, clientes y futuros agentes: seguros de salud y ACA, seguro de vida, beneficios para empresas, formación y carrera.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_US",
    url: "/",
    siteName: "Alleanza Insurance Corp.",
    title: "Alleanza Insurance Corp. | Compara opciones con claridad para lo que más importa",
    description:
      "Orientación clara en español en salud, vida, academia y carrera.",
  },
};

export default function Page() {
  return (
    <>
      <JsonLd data={organizationSchema()} />
      <JsonLd data={websiteSchema()} />
      <PortalHub><HomeDirectory /></PortalHub>
    </>
  );
}
