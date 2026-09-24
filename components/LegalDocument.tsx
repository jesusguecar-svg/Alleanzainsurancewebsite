import type { ReactNode } from "react";
import { SiteFooter } from "./layout/SiteFooter";
import { SiteHeader } from "./layout/SiteHeader";
import { portalNavLinks } from "@/lib/config/routes";

export function LegalDocument({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <main className="bg-white text-navy">
      <SiteHeader links={portalNavLinks} cta={{ href: "/health#contacto", label: "Hablar con un asesor" }} />
      <article className="mx-auto max-w-3xl px-5 pb-24 pt-36 md:pb-32 md:pt-44">
        <p className="text-xs font-semibold uppercase tracking-[.22em] text-cyan">Alleanza Insurance</p>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl">{title}</h1>
        <p className="mt-3 text-sm text-navy/50">Última actualización: {updated}</p>
        <div className="legal-prose mt-10 space-y-6 text-sm leading-relaxed text-navy/75 md:text-base [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-navy [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_a]:font-semibold [&_a]:underline-offset-4 [&_a]:hover:underline">
          {children}
        </div>
      </article>
      <SiteFooter />
    </main>
  );
}
