import type { Metadata } from "next";
import { LegalDocument } from "@/components/LegalDocument";
import { companyFacts } from "@/lib/config/company";
import { officeAddressLines, phones } from "@/lib/config/contact";
import { acaAgentCertification, licensingStatement } from "@/lib/content/health";

const title = "Licencias | Alleanza Insurance Corp.";
const description =
  "Información sobre licencias de Alleanza Insurance Corp. Contamos con agentes debidamente licenciados según el estado y el producto. Las solicitudes se asignan de acuerdo con la licencia y disponibilidad aplicables.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/licencias" },
  openGraph: {
    type: "website",
    locale: "es_US",
    url: "/licencias",
    siteName: "Alleanza Insurance Corp.",
    title,
    description,
  },
};

export default function Page() {
  const states = companyFacts.licensedStates;

  return (
    <LegalDocument title="Licencias" updated="28 de octubre de 2026">
      <p>
        Alleanza Insurance Corp. opera como agencia de seguros independiente. Los productos que se presentan en este sitio
        los explica y, cuando corresponde, los ofrece un agente de seguros con licencia. La
        disponibilidad varía según el estado, el producto y la compañía aseguradora.
      </p>
      <p>{licensingStatement.es}</p>

      <h2>Oficina</h2>
      <p>{officeAddressLines.join(", ")}</p>

      <h2>Agentes y estados</h2>
      {states.verified ? (
        <p>
          Alleanza Insurance Corp. tiene licencia para operar, a través de agentes autorizados, en:{" "}
          {states.value.join(", ")}.
        </p>
      ) : (
        <p>
          Contamos con una red de agentes licenciados con capacidad de atención en los 50 estados. No todos
          los agentes tienen licencia en todos los estados: cada solicitud se asigna a un agente con licencia
          para tu estado y el producto que necesitas, y la disponibilidad de productos depende del estado, las
          licencias aplicables y la elegibilidad. Si quieres verificar la licencia de un agente, llámanos al{" "}
          <a href={`tel:${phones[0].href}`}>{phones[0].label}</a> o consulta el registro público del
          departamento de seguros de tu estado (en Texas, el Texas Department of Insurance).
        </p>
      )}

      <h2>Marketplace (ACA)</h2>
      <p>
        {acaAgentCertification.es} {licensingStatement.es}
      </p>

      <h2>Property & Casualty</h2>
      <p>
        Property & Casualty se encuentra actualmente en desarrollo y estará sujeto a los requisitos de licencia y
        disponibilidad correspondientes. Por ahora no ofrecemos estas coberturas.
      </p>

      <h2>Qué no es esta página</h2>
      <p>
        Esta página no es una cotización, no identifica compañías aseguradoras concretas y no afirma
        que un producto esté disponible para ti. Un agente con licencia confirma la elegibilidad y
        las limitaciones antes de cualquier solicitud.
      </p>

      <h2>Contacto</h2>
      <p>
        Para verificar credenciales o reportar un problema:{" "}
        <a href="/contacto">formulario de contacto</a> o{" "}
        <a href={`tel:${phones[0].href}`}>{phones[0].label}</a>.
      </p>
    </LegalDocument>
  );
}
