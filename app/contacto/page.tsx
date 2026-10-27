import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ContactSection } from "@/components/sections/ContactSection";
import { portalNavLinks } from "@/lib/config/routes";
import { healthEmail } from "@/lib/content/health";

const title = "Contacto | Alleanza Insurance Corp.";
const description =
  "Habla con Alleanza Insurance Corp.: oficina en Carrollton, Texas, teléfonos, horario y formulario para que un agente de seguros con licencia te contacte.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/contacto" },
  openGraph: { type: "website", locale: "es_US", url: "/contacto", siteName: "Alleanza Insurance Corp.", title, description },
};

export default function Page() {
  return (
    <main className="bg-white text-navy">
      <SiteHeader links={portalNavLinks} cta={{ href: "#contacto", label: "Hablar con un asesor" }} />
      <section className="mx-auto max-w-7xl px-5 pb-10 pt-36 md:pb-14 md:pt-44">
        <p className="text-xs font-semibold uppercase tracking-[.22em] text-cyan">Alleanza Insurance</p>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-6xl">Contacto</h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-navy/70 md:text-lg">
          Escríbenos, llámanos o visita nuestra oficina. Un agente de seguros con licencia te ayuda a entender tus
          opciones de salud, vida y protección complementaria.
        </p>
        <p className="mt-5 flex items-center gap-2 text-sm font-semibold">
          <Mail aria-hidden="true" size={16} />
          <a href={`mailto:${healthEmail}`} className="underline-offset-4 hover:underline">{healthEmail}</a>
        </p>
      </section>
      <ContactSection />
      <SiteFooter />
    </main>
  );
}
