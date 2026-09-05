"use client";

import { ArrowRight, Menu } from "lucide-react";
import { useState } from "react";
import { Logo } from "../Logo";

export type NavLink = { href: string; label: string };

/**
 * Shared header for every route. Links are passed in, because the health
 * landing navigates by in-page anchor while the portal and spokes navigate
 * between routes.
 */
export function SiteHeader({
  links,
  cta,
  locale = "es",
}: {
  links: NavLink[];
  cta?: { href: string; label: string };
  locale?: "es" | "en";
}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-white/60 bg-white/85 px-5 py-3 shadow-[0_12px_40px_rgba(6,20,49,.08)] backdrop-blur-xl md:px-7">
        <a href="/" aria-label="Alleanza Insurance — inicio" className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan">
          <Logo width={175} />
        </a>

        <nav aria-label={locale === "en" ? "Primary" : "Principal"} className="hidden items-center gap-7 text-[13px] font-medium lg:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="transition hover:text-cyan">{link.label}</a>
          ))}
        </nav>

        {cta && (
          <a href={cta.href} className="hidden items-center gap-2 rounded-full bg-cyan px-5 py-3 text-xs font-semibold text-navy shadow-[0_8px_25px_rgba(4,192,254,.35)] transition hover:-translate-y-0.5 md:flex">
            {cta.label} <ArrowRight aria-hidden="true" size={15} />
          </a>
        )}

        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="menu-movil"
          aria-label={locale === "en" ? "Open menu" : "Abrir menú"}
          className="lg:hidden"
        >
          <Menu aria-hidden="true" />
        </button>
      </div>

      {open && (
        <nav id="menu-movil" aria-label={locale === "en" ? "Primary" : "Principal"} className="mx-auto mt-2 flex max-w-7xl flex-col gap-4 rounded-2xl bg-white p-6 shadow-xl lg:hidden">
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}</a>
          ))}
          {cta && <a href={cta.href} onClick={() => setOpen(false)} className="font-semibold text-cyan">{cta.label}</a>}
        </nav>
      )}
    </header>
  );
}
