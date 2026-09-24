import type { Metadata } from "next";
import { LegalDocument } from "@/components/LegalDocument";
import { companyFacts } from "@/lib/config/company";
import { officeAddressLines, phones } from "@/lib/config/contact";

export const metadata: Metadata = {
  title: "Licencias | Alleanza Insurance",
  description:
    "Información sobre licencias de Alleanza Insurance. Los productos se ofrecen solo donde hay licencia y disponibilidad.",
  alternates: { canonical: "/licencias" },
};

export default function Page() {
  const states = companyFacts.licensedStates;

  return (
    <LegalDocument title="Licencias" updated="16 de septiembre de 2026">
      <p>
        Alleanza Insurance opera como agencia de seguros. Los productos que se presentan en este sitio
        los explica y, cuando corresponde, los ofrece un agente de seguros con licencia. La
        disponibilidad varía según el estado, el producto y la compañía aseguradora.
      </p>

      <h2>Oficina</h2>
      <p>{officeAddressLines.join(", ")}</p>

      <h2>Estados</h2>
      {states.verified ? (
        <p>
          Alleanza tiene licencia para operar, a través de agentes autorizados, en:{" "}
          {states.value.join(", ")}.
        </p>
      ) : (
        <p>
          Los números de licencia de la agencia y de los agentes, y el listado de estados, se
          publican aquí cuando un revisor registra el valor y su fuente. Hasta entonces no inferimos
          un territorio a partir de textos de marketing. Si necesitas confirmar una licencia ahora,
          llámanos al <a href={`tel:${phones[0].href}`}>{phones[0].label}</a> o consulta el registro
          público del departamento de seguros del estado correspondiente (en Texas, el Texas
          Department of Insurance).
        </p>
      )}

      <h2>Qué no es esta página</h2>
      <p>
        Esta página no es una cotización, no identifica compañías aseguradoras concretas y no afirma
        que un producto esté disponible para ti. Un agente con licencia confirma la elegibilidad y
        las limitaciones antes de cualquier solicitud.
      </p>

      <h2>Contacto</h2>
      <p>
        Para verificar credenciales o reportar un problema:{" "}
        <a href="/health#contacto">formulario de contacto</a> o{" "}
        <a href={`tel:${phones[0].href}`}>{phones[0].label}</a>.
      </p>
    </LegalDocument>
  );
}
