import type { Metadata } from "next";
import { LegalDocument } from "@/components/LegalDocument";
import { officeAddressLines, phones } from "@/lib/config/contact";

export const metadata: Metadata = {
  title: "Términos de uso | Alleanza Insurance Corp.",
  description:
    "Condiciones de uso del sitio de Alleanza Insurance Corp. La información es general y no constituye una cotización, una póliza ni un consejo personalizado.",
  alternates: { canonical: "/terminos" },
};

export default function Page() {
  return (
    <LegalDocument title="Términos de uso" updated="16 de septiembre de 2026">
      <p>
        Al usar este sitio aceptas estos términos. Si no estás de acuerdo, no lo uses. El sitio es
        informativo: no emite una póliza, no garantiza cobertura y no sustituye una conversación con
        un agente de seguros con licencia.
      </p>

      <h2>Quién opera el sitio</h2>
      <p>
        El sitio lo opera Alleanza Insurance Corp., con oficina en {officeAddressLines.join(", ")}. Teléfono:{" "}
        <a href={`tel:${phones[0].href}`}>{phones[0].label}</a>.
      </p>

      <h2>Información, no una oferta vinculante</h2>
      <p>
        Los textos, ejemplos y categorías de cobertura son generales. La disponibilidad, los precios,
        los requisitos de elegibilidad, las exclusiones y los beneficios dependen del producto, del
        estado y de la compañía aseguradora. El documento que rige, si se emite una póliza, es esa
        póliza. Enviar un formulario no crea una solicitud de seguro ni una relación de cliente.
      </p>

      <h2>Licencias y territorio</h2>
      <p>
        Alleanza Insurance Corp. te orienta y facilita el acceso a productos emitidos por compañías aseguradoras. Los productos se ofrecen solo donde la agencia y el agente que te atiende tienen licencia, y
        solo cuando el producto está disponible. Consulta la página de{" "}
        <a href="/licencias">licencias</a> y confirma con un agente antes de tomar una decisión.
      </p>

      <h2>Uso permitido</h2>
      <ul>
        <li>Puedes consultar el sitio para informarte y contactarnos.</li>
        <li>No puedes copiar la marca, el contenido o los materiales con fines comerciales sin permiso.</li>
        <li>No puedes usar el sitio para enviar información falsa, interferir con su funcionamiento o extraer datos de forma automatizada de manera abusiva.</li>
      </ul>

      <h2>Enlaces externos</h2>
      <p>
        El sitio puede enlazar a recursos de terceros, incluida Alleanza Academy. Esos sitios tienen
        sus propias condiciones. Alleanza no controla su contenido ni sus prácticas de privacidad.
      </p>

      <h2>Limitación</h2>
      <p>
        El sitio se ofrece “tal cual”. En la medida que permita la ley de Texas, Alleanza Insurance Corp. no responde
        por daños indirectos, pérdida de datos o interrupciones derivadas del uso del sitio. Esta
        limitación no afecta derechos que no se pueden renunciar, ni reclamaciones relacionadas con
        una póliza emitida.
      </p>

      <h2>Ley aplicable</h2>
      <p>
        Estos términos se rigen por las leyes del Estado de Texas, sin perjuicio de normas de
        protección al consumidor que correspondan a tu domicilio.
      </p>

      <h2>Contacto</h2>
      <p>
        Preguntas sobre estos términos: <a href="/health#contacto">formulario de contacto</a> o{" "}
        <a href={`tel:${phones[0].href}`}>{phones[0].label}</a>.
      </p>
    </LegalDocument>
  );
}
