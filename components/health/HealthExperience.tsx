"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Logo } from "../Logo";
import { LanguageSwitch } from "../LanguageSwitch";
import { SiteFooter } from "../layout/SiteFooter";
import { EnglishSiteFooter } from "../layout/EnglishSiteFooter";
import { CoverageMap } from "./CoverageMap";
import { CinematicHealthHero } from "./CinematicHealthHero";
import { HealthContact } from "./HealthContact";
import { CarrierAccess, CompareSection, ComparisonFactors, CoverageCategories, HealthEducation, HealthFAQ, HealthFinalCTA, HealthTrust, HowAlleanzaWorks, ShoppingComparison, ShoppingPathSelector } from "./HealthPlatformSections";
import type { GoogleReviews } from "@/lib/google-reviews";
import s from "./health.module.css";
import p from "./platform.module.css";

export default function HealthExperience({ reviews, reviewsUrl, locale = "es" }: { reviews: GoogleReviews | null; reviewsUrl?: string; locale?: "es" | "en" }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [formService, setFormService] = useState("guidance");
  const [formState, setFormState] = useState("");
  const reduced = useReducedMotion();
  const en = locale === "en";
  const links = [["#compare", en ? "Compare options" : "Comparar opciones"], ["#como-funciona", en ? "How it works" : "Cómo funciona"], ["#coberturas", en ? "Coverage types" : "Tipos de cobertura"], ["#presencia", en ? "Where we work" : "Dónde estamos"], ["#aprender", en ? "Learn" : "Aprender"]];

  useEffect(() => {
    document.documentElement.lang = locale;
    const previous = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = reduced ? "auto" : "smooth";
    return () => { document.documentElement.lang = "es"; document.documentElement.style.scrollBehavior = previous; };
  }, [locale, reduced]);

  function toContact(service = "guidance") {
    setFormService(service);
    const section = document.getElementById("contacto");
    section?.scrollIntoView({ behavior: reduced ? "instant" : "smooth" });
    section?.querySelector<HTMLInputElement>("input[name=name]")?.focus({ preventScroll: true });
  }

  return <div className={`${s.page} ${p.platform}`} lang={locale}>
    <a className={s.skipLink} href="#contenido">{en ? "Skip to content" : "Saltar al contenido"}</a>
    <header className={`${s.header} ${p.header}`} onKeyDown={event => { if (event.key === "Escape") { setMenuOpen(false); document.getElementById("health-menu-toggle")?.focus(); } }}>
      <a href="/" aria-label={en ? "Alleanza Insurance Corp. — home" : "Alleanza Insurance Corp. — inicio"}><Logo width={174} /></a>
      <a className={s.headerCategory} href={en ? "/en/health" : "/health"}>{en ? "Health" : "Salud"}</a>
      <nav className={s.desktopNav} aria-label={en ? "Health navigation" : "Navegación de salud"}>{links.map(([href, label]) => <a key={href} href={href}>{label}</a>)}</nav>
      <LanguageSwitch locale={locale} spanishHref="/health" englishHref="/en/health" preserveHash className={s.healthLanguage} />
      <a href="#compare" className={s.headerCta}>{en ? "Compare options" : "Comparar opciones"}<ArrowUpRight size={15} aria-hidden="true" /></a>
      <button id="health-menu-toggle" type="button" className={s.menuButton} aria-label={menuOpen ? (en ? "Close menu" : "Cerrar menú") : (en ? "Open menu" : "Abrir menú")} aria-expanded={menuOpen} aria-controls="health-menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
      {menuOpen && <nav id="health-menu" className={s.mobileNav} aria-label={en ? "Mobile navigation" : "Navegación móvil"}>{[...links, ["#contacto", en ? "Talk to an advisor" : "Hablar con un asesor"]].map(([href, label]) => <a href={href} key={href} onClick={() => setMenuOpen(false)}>{label}<ArrowUpRight size={17} aria-hidden="true" /></a>)}</nav>}
    </header>
    <main id="contenido">
      <CinematicHealthHero locale={locale} onReview={() => document.getElementById("compare")?.scrollIntoView({ behavior: reduced ? "instant" : "smooth" })} onExplore={() => toContact("guidance")} />
      <CompareSection locale={locale} />
      <CoverageCategories locale={locale} />
      <CoverageMap locale={locale} onChoose={state => { setFormState(state); toContact(); }} />
      <ComparisonFactors locale={locale} />
      <ShoppingPathSelector locale={locale} />
      <HowAlleanzaWorks locale={locale} />
      <CarrierAccess locale={locale} />
      <HealthTrust locale={locale} reviews={reviews} reviewsUrl={reviewsUrl} />
      <ShoppingComparison locale={locale} />
      <HealthFAQ locale={locale} />
      <div className={p.advisor}><HealthContact locale={locale} selectedState={formState} onState={setFormState} selectedService={formService} onService={setFormService} /></div>
      <HealthEducation locale={locale} />
      <HealthFinalCTA locale={locale} />
    </main>
    {en ? <EnglishSiteFooter /> : <SiteFooter editorial />}
  </div>;
}
