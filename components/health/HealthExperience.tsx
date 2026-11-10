"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowRight, Instagram, Menu, X } from "lucide-react";
import { Logo } from "../Logo";
import { LanguageSwitch } from "../LanguageSwitch";
import { SiteFooter } from "../layout/SiteFooter";
import { EnglishSiteFooter } from "../layout/EnglishSiteFooter";
import { CoverageMap } from "./CoverageMap";
import { CinematicHealthHero } from "./CinematicHealthHero";
import { HealthCarrierLogos } from "./HealthCarrierLogos";
import { HealthCredibility } from "./HealthCredibility";
import { HealthContact } from "./HealthContact";
import { CompareSection, ComparisonFactors, CoverageCategories, HealthEducation, HealthFAQ, HealthFinalCTA, HealthTrust, HowAlleanzaWorks, ShoppingComparison, ShoppingPathSelector } from "./HealthPlatformSections";
import { instagramProfileUrl } from "@/lib/config/site";
import type { GoogleReviews } from "@/lib/google-reviews";
import s from "./health.module.css";
import { healthSerif } from "./fonts";

export default function HealthExperience({ reviews, reviewsUrl, locale = "es", guides }: { reviews: GoogleReviews | null; reviewsUrl?: string; locale?: "es" | "en"; guides?: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [formService, setFormService] = useState("guidance");
  const [formState, setFormState] = useState("");
  const reduced = useReducedMotion();
  const en = locale === "en";
  // "Compare options" lives in the header button, so it is not repeated as a text link.
  const links = [["#como-funciona", en ? "How it works" : "Cómo funciona"], ["#coberturas", en ? "Coverage types" : "Tipos de cobertura"], ["#presencia", en ? "Where we work" : "Dónde estamos"], ["#aprender", en ? "Learn" : "Aprender"]];

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

  return <div className={`${s.page} ${healthSerif.variable}`} lang={locale}>
    <a className={s.skipLink} href="#contenido">{en ? "Skip to content" : "Saltar al contenido"}</a>
    <header className={s.header} onKeyDown={event => { if (event.key === "Escape") { setMenuOpen(false); document.getElementById("health-menu-toggle")?.focus(); } }}>
      <div className={s.headerIn}>
        <a className={s.logo} href="/" aria-label={en ? "Alleanza Insurance Corp. — home" : "Alleanza Insurance Corp. — inicio"}><Logo width={174} /></a>
        <nav className={s.nav} aria-label={en ? "Health navigation" : "Navegación de salud"}>{links.map(([href, label]) => <a key={href} href={href}>{label}</a>)}</nav>
        <div className={s.headerEnd}>
          <LanguageSwitch locale={locale} spanishHref="/health" englishHref="/en/health" preserveHash className={s.lang} />
          <a className={`${s.icoBtn} ${s.headerInstagram}`} href={instagramProfileUrl} target="_blank" rel="noopener noreferrer" aria-label={en ? "Alleanza on Instagram" : "Alleanza en Instagram"}><Instagram size={18} strokeWidth={1.5} aria-hidden="true" /></a>
          <a href="#compare" className={`${s.btn} ${s.btnP} ${s.btnSm} ${s.headerCta}`} data-cta="health_header_compare" data-product-line="health">{en ? "Compare options" : "Comparar opciones"}</a>
          <button id="health-menu-toggle" type="button" className={`${s.icoBtn} ${s.menuButton}`} aria-label={menuOpen ? (en ? "Close menu" : "Cerrar menú") : (en ? "Open menu" : "Abrir menú")} aria-expanded={menuOpen} aria-controls="health-menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={18} strokeWidth={1.5} aria-hidden="true" /> : <Menu size={18} strokeWidth={1.5} aria-hidden="true" />}</button>
        </div>
      </div>
      {menuOpen && <nav id="health-menu" className={s.mobileNav} aria-label={en ? "Mobile navigation" : "Navegación móvil"}>{[["#compare", en ? "Compare options" : "Comparar opciones"], ...links, ["#contacto", en ? "Talk to an advisor" : "Hablar con un asesor"]].map(([href, label]) => <a href={href} key={href} onClick={() => setMenuOpen(false)}>{label}<ArrowRight size={18} strokeWidth={1.5} aria-hidden="true" /></a>)}<a href={en ? "/health" : "/en/health"} lang={en ? "es" : "en"} hrefLang={en ? "es" : "en"} onClick={() => setMenuOpen(false)}>{en ? "Español" : "English"}<ArrowRight size={18} strokeWidth={1.5} aria-hidden="true" /></a></nav>}
    </header>
    <main id="contenido">
      <CinematicHealthHero locale={locale} onReview={() => document.getElementById("compare")?.scrollIntoView({ behavior: reduced ? "instant" : "smooth" })} onExplore={() => toContact("guidance")} />
      <CompareSection locale={locale} />
      <HealthCarrierLogos locale={locale} />
      <CoverageCategories locale={locale} />
      <CoverageMap locale={locale} onChoose={state => { setFormState(state); toContact(); }} />
      <ComparisonFactors locale={locale} />
      <ShoppingPathSelector locale={locale} />
      <HowAlleanzaWorks locale={locale} />
      <HealthCredibility locale={locale} reviews={reviews} />
      <HealthTrust locale={locale} reviews={reviews} reviewsUrl={reviewsUrl} />
      <ShoppingComparison locale={locale} />
      <HealthFAQ locale={locale} />
      <HealthContact locale={locale} selectedState={formState} onState={setFormState} selectedService={formService} onService={setFormService} />
      <HealthEducation locale={locale} />
      {guides}
      <HealthFinalCTA locale={locale} />
    </main>
    {en ? <EnglishSiteFooter /> : <SiteFooter editorial />}
  </div>;
}
