import type { Metadata } from "next";
import { LegalDocument } from "@/components/LegalDocument";

/*
 * Property & Casualty is not offered: Alleanza is not licensed for P&C yet (management decision,
 * 2026-10-28). This route stays as a discreet "coming soon" notice, with no quote, call or
 * contact CTA for P&C, out of navigation and the sitemap. The former landing page is kept in
 * components/PropertyLanding.tsx for when the line is licensed.
 */
export const metadata: Metadata = {
  title: "Property & Casualty — Próximamente | Alleanza Insurance Corp.",
  description:
    "Property & Casualty se encuentra en desarrollo en Alleanza Insurance Corp. y todavía no está disponible. Estará sujeto a los requisitos de licencia y disponibilidad correspondientes.",
  alternates: { canonical: "/property-casualty" },
  robots: { index: false, follow: true },
  openGraph: {
    type: "website",
    locale: "es_US",
    url: "/property-casualty",
    siteName: "Alleanza Insurance Corp.",
    title: "Property & Casualty — Próximamente",
    description: "Estamos ampliando nuestras soluciones. Property & Casualty todavía no está disponible.",
  },
};

export default function Page() {
  return (
    <LegalDocument title="Property & Casualty — Próximamente">
      <p>
        Estamos ampliando nuestras soluciones. Property & Casualty se encuentra actualmente en desarrollo y estará
        sujeto a los requisitos de licencia y disponibilidad correspondientes.
      </p>
      <p>
        Por ahora, Alleanza Insurance Corp. no ofrece seguros de hogar, auto, inquilinos ni responsabilidad civil, y no
        recibe solicitudes ni cotizaciones para estas coberturas.
      </p>
      <h2>Lo que sí puedes revisar hoy</h2>
      <ul>
        <li>
          <a href="/health">Salud</a>: seguros de salud, ACA y protección complementaria.
        </li>
        <li>
          <a href="/life">Vida</a>: protección financiera para tu familia.
        </li>
        <li>
          <a href="/employers">Empresas</a>: beneficios complementarios para tu equipo.
        </li>
      </ul>
    </LegalDocument>
  );
}
