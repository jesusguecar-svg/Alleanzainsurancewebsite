import type { Metadata } from "next";
import { LegalDocument } from "@/components/LegalDocument";
import { officeAddressLines, officeHours, phones } from "@/lib/config/contact";
import { activePortalRoutes } from "@/lib/config/routes";

const title = "Nosotros | Alleanza Insurance Corp.";
const description =
  "Alleanza Insurance Corp. es una agencia de seguros independiente en Carrollton, Texas, que orienta a familias hispanas en salud, vida y beneficios para empresas.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/nosotros" },
  openGraph: { type: "website", locale: "es_US", url: "/nosotros", siteName: "Alleanza Insurance Corp.", title, description },
};

/*
 * Only facts the site already publishes elsewhere (agency type, office, hours,
 * phones, product lines). Mission, history, team size and licensed territory
 * belong in lib/config/company.ts and stay off this page until verified.
 */
export default function Page() {
  const lines = activePortalRoutes.filter((route) => !route.external);

  return (
    <LegalDocument title="Nosotros">
      <p>
        Alleanza Insurance Corp. es una agencia de seguros independiente. Te ayudamos a entender, comparar y acceder a
        opciones de seguro, en español, y un agente de seguros con licencia confirma la elegibilidad y los detalles antes
        de que solicites una cobertura. Las pólizas las emiten las compañías aseguradoras correspondientes; su
        disponibilidad varía según el estado, el producto y la compañía.
      </p>

      <h2>Cómo podemos ayudarte</h2>
      <ul>
        {lines.map((route) => (
          <li key={route.id}>
            <a href={route.href}>{route.title}</a>: {route.description}
          </li>
        ))}
      </ul>

      <h2>Nuestro equipo</h2>
      <p>
        Conoce a nuestros <a href="/agentes">agentes</a>, sus idiomas y los estados donde cuentan con licencia. Para
        verificar una licencia, consulta la página de <a href="/licencias">licencias</a>. Si quieres crecer como
        agente, conoce nuestra <a href="/work">oportunidad de carrera</a>.
      </p>

      <h2>Oficina</h2>
      <address className="not-italic">
        {officeAddressLines.map((line) => <span key={line} className="block">{line}</span>)}
      </address>
      <ul>
        {officeHours.map((entry) => <li key={entry.days}>{entry.days}: {entry.hours}</li>)}
      </ul>

      <h2>Hablemos</h2>
      <p>
        Llámanos al <a href={`tel:${phones[0].href}`}>{phones[0].label}</a> o usa el{" "}
        <a href="/contacto">formulario de contacto</a>.
      </p>
    </LegalDocument>
  );
}
