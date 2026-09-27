"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Check, ChevronDown, Eye, Heart, Menu, MessageCircle, Plus, ShieldCheck, Star, X } from "lucide-react";
import { Logo } from "../Logo";
import { LanguageSwitch } from "../LanguageSwitch";
import { SiteFooter } from "../layout/SiteFooter";
import { EnglishSiteFooter } from "../layout/EnglishSiteFooter";
import { CoverageMap } from "./CoverageMap";
import { CinematicHealthHero } from "./CinematicHealthHero";
import { HealthContact, getHealthWhatsapp } from "./HealthContact";
import { healthServices, healthServicesEn } from "@/lib/content/health";
import type { GoogleReviews } from "@/lib/google-reviews";
import s from "./health.module.css";

const icons = { heart: Heart, shield: ShieldCheck, eye: Eye, plus: Plus };

const copy = {
  es: {
    skip: "Saltar al contenido",
    home: "Alleanza Insurance Corp. — inicio",
    category: "Salud",
    by: "por Alleanza Insurance Corp.",
    navigation: "Navegación de salud",
    mobileNavigation: "Navegación móvil",
    talk: "Hablemos",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    links: [["#coberturas", "Tu cobertura"], ["#presencia", "Cerca de ti"], ["#opiniones", "Opiniones"], ["#alianzas", "Alianzas"]],
    servicesEyebrow: "01 / PROTECCIÓN A TU MEDIDA",
    servicesNote: "Hoy. Mañana. Contigo.",
    servicesHeading: <>No todas las vidas son iguales.<br /><em>Tu cobertura tampoco.</em></>,
    servicesIntro: <>Escuchamos tu historia. Comparamos tus opciones.<br />Y te ayudamos a decidir con claridad.</>,
    coverageTypes: "Tipos de cobertura",
    visualLabel: "ALLEANZA · SALUD",
    learnMore: "Quiero saber más",
    extraTitle: "Tu seguro médico + un respaldo extra.",
    extraText: "Protección complementaria para cuando la vida toma un giro inesperado.",
    tags: ["Accidentes", "Cáncer", "Derrame cerebral", "Hospitalización"],
    servicesDisclaimer: "Los beneficios complementarios dependen de la póliza y del evento cubierto; no sustituyen un seguro médico integral. Revisamos contigo condiciones, exclusiones y disponibilidad.",
    reviewsEyebrow: "03 / HISTORIAS QUE NOS UNEN",
    reviewsHeading: <>La confianza no se promete.<br /><em>Se construye contigo.</em></>,
    reviewsIntro: <>Detrás de cada cobertura hay una persona.<br />Y detrás de cada opinión, una experiencia.</>,
    stars: "de 5 estrellas",
    reviewsOnGoogle: "reseñas en Google",
    reviewsRelevance: "Reseñas mostradas por relevancia según Google.",
    invitationTitle: <>Tu experiencia es parte<br />de nuestra historia.</>,
    invitationText: "Conoce las opiniones de nuestra comunidad en Google o comparte cómo te acompañamos.",
    visitGoogle: "Visítanos en Google",
    allReviews: "Ver todas las opiniones en Google",
    alliancesEyebrow: "04 / ALIANZAS QUE SUMAN",
    alliancesHeading: <>Bien acompañado.<br /><em>Mejor protegido.</em></>,
    alliancesIntro: <>Te orientamos para comparar opciones<br />de cobertura en cada etapa de tu vida.</>,
    globeDescription: "Protección complementaria para afrontar el impacto económico de eventos cubiertos, con la orientación de Alleanza Insurance Corp.",
    globeLink: "Conoce Family Heritage",
    marketplaceLabel: "MERCADO DE SEGUROS MÉDICOS",
    marketplaceDescription: "Asesoría para explorar planes de Obamacare, entender sus beneficios y revisar las ayudas disponibles según tu elegibilidad.",
    marketplaceLink: "Conoce el Mercado de Salud",
    allianceDisclaimer: "Alleanza Insurance Corp. es una agencia de seguros independiente. El Marketplace es el mercado de seguros médicos, no una aseguradora. Las pólizas se emiten por las compañías aseguradoras correspondientes. Este sitio no pertenece al gobierno federal ni implica su respaldo.",
    faqEyebrow: "SIN DUDAS EN EL CAMINO",
    faqHeading: <>Hablemos <em>claro.</em></>,
    faqs: [
      ["¿Por dónde empiezo si no sé qué seguro necesito?", "Por una conversación. Revisamos tu estado, tus necesidades y las opciones disponibles. Te explicamos redes, primas, deducibles y copagos antes de que decidas."],
      ["¿Puedo recibir ayuda aunque no haya una oficina cerca?", "Sí. Ofrecemos atención a distancia en los 50 estados, por teléfono o videollamada y en español. La disponibilidad de planes y agentes autorizados depende del estado."],
      ["¿Cuál es la diferencia entre ACA y un seguro privado?", "Los planes del Marketplace ACA los ofrecen aseguradoras privadas y pueden incluir ayuda económica para quienes califican. Fuera del Marketplace también hay opciones privadas. Revisamos contigo beneficios, condiciones y elegibilidad, sin asumir que todos los planes son iguales."],
      ["¿La protección complementaria reemplaza mi seguro médico?", "No. Es una protección adicional que puede pagar beneficios ante eventos cubiertos, como accidentes, cáncer, derrame cerebral o una hospitalización, según la póliza. Los límites, exclusiones y períodos de espera se revisan antes de contratar."],
    ],
    closingLabel: "ALLEANZA INSURANCE CORP. · AGENCIA INDEPENDIENTE",
    closing: <>Conoce tus opciones.<br /><em>Decide con claridad.</em></>,
    universe: "Explora el universo Alleanza",
    whatsapp: "Habla con Alleanza Insurance Corp. por WhatsApp",
    whatsappShort: "¿Hablamos?",
  },
  en: {
    skip: "Skip to content",
    home: "Alleanza Insurance Corp. — home",
    category: "Health",
    by: "by Alleanza Insurance Corp.",
    navigation: "Health navigation",
    mobileNavigation: "Mobile navigation",
    talk: "Let's talk",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    links: [["#coberturas", "Your coverage"], ["#presencia", "Near you"], ["#opiniones", "Reviews"], ["#alianzas", "Partners"]],
    servicesEyebrow: "01 / PROTECTION MADE FOR YOU",
    servicesNote: "Today. Tomorrow. With you.",
    servicesHeading: <>No two lives are the same.<br /><em>Your coverage should not be either.</em></>,
    servicesIntro: <>We listen to your story. We compare your options.<br />Then we help you decide with clarity.</>,
    coverageTypes: "Coverage types",
    visualLabel: "ALLEANZA · HEALTH",
    learnMore: "I want to learn more",
    extraTitle: "Your health insurance + extra support.",
    extraText: "Supplemental protection for when life takes an unexpected turn.",
    tags: ["Accidents", "Cancer", "Stroke", "Hospitalization"],
    servicesDisclaimer: "Supplemental benefits depend on the policy and covered event; they do not replace comprehensive health insurance. We review conditions, exclusions, and availability with you.",
    reviewsEyebrow: "03 / STORIES THAT CONNECT US",
    reviewsHeading: <>Trust is not promised.<br /><em>It is built with you.</em></>,
    reviewsIntro: <>Behind every policy is a person.<br />And behind every review is an experience.</>,
    stars: "out of 5 stars",
    reviewsOnGoogle: "Google reviews",
    reviewsRelevance: "Reviews shown by relevance according to Google.",
    invitationTitle: <>Your experience is part<br />of our story.</>,
    invitationText: "Read what our community says on Google or share how we supported you.",
    visitGoogle: "Visit us on Google",
    allReviews: "See all Google reviews",
    alliancesEyebrow: "04 / PARTNERSHIPS THAT ADD VALUE",
    alliancesHeading: <>Well supported.<br /><em>Better protected.</em></>,
    alliancesIntro: <>We help you compare coverage options<br />at every stage of life.</>,
    globeDescription: "Supplemental protection designed to help with the financial impact of covered events, with guidance from Alleanza Insurance Corp.",
    globeLink: "Explore Family Heritage",
    marketplaceLabel: "HEALTH INSURANCE MARKETPLACE",
    marketplaceDescription: "Guidance to explore Obamacare plans, understand their benefits, and review financial help based on eligibility.",
    marketplaceLink: "Explore the Health Marketplace",
    allianceDisclaimer: "Alleanza Insurance Corp. is an independent insurance agency. The Marketplace is a health insurance marketplace, not an insurance company. Policies are issued by the applicable insurance companies. This website is not operated or endorsed by the federal government.",
    faqEyebrow: "CLEAR ANSWERS FOR THE ROAD AHEAD",
    faqHeading: <>Let's make it <em>clear.</em></>,
    faqs: [
      ["Where do I start if I do not know what insurance I need?", "Start with a conversation. We review your state, needs, and available options. We explain networks, premiums, deductibles, and copays before you decide."],
      ["Can I get help if there is no office near me?", "Yes. We offer remote service in all 50 states by phone or video call, in English and Spanish. Plan and licensed-agent availability depends on the state."],
      ["What is the difference between ACA and private insurance?", "Private insurance companies offer ACA Marketplace plans, which may include financial help for people who qualify. Private options also exist outside the Marketplace. We review benefits, conditions, and eligibility without assuming every plan is the same."],
      ["Does supplemental protection replace health insurance?", "No. It is additional protection that may pay benefits after covered events such as accidents, cancer, stroke, or hospitalization, depending on the policy. We review limits, exclusions, and waiting periods before enrollment."],
    ],
    closingLabel: "ALLEANZA INSURANCE CORP. · INDEPENDENT AGENCY",
    closing: <>Know your options.<br /><em>Decide with clarity.</em></>,
    universe: "Explore the Alleanza universe",
    whatsapp: "Talk to Alleanza Insurance Corp. on WhatsApp",
    whatsappShort: "Let's talk",
  },
} as const;

function GoogleWord() {
  return <span className={s.googleWord} aria-label="Google"><span>G</span><span>o</span><span>o</span><span>g</span><span>l</span><span>e</span></span>;
}

export default function HealthExperience({ reviews, reviewsUrl, locale = "es" }: { reviews: GoogleReviews | null; reviewsUrl?: string; locale?: "es" | "en" }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [service, setService] = useState(0);
  const [formService, setFormService] = useState("guidance");
  const [formState, setFormState] = useState("");
  const reduced = useReducedMotion();
  const english = locale === "en";
  const t = copy[locale];
  const services = english ? healthServicesEn : healthServices;
  const current = services[service];
  const Icon = icons[current.icon];
  const googleUrl = reviews?.url || reviewsUrl || "https://www.google.com/maps/search/?api=1&query=Alleanza+Insurance+3424+Midcourt+Rd+Carrollton+TX";
  const whatsapp = getHealthWhatsapp(locale);

  useEffect(() => {
    document.documentElement.lang = locale;
    return () => { document.documentElement.lang = "es"; };
  }, [locale]);

  function toContact(state?: string, selectedService?: string) {
    if (state) setFormState(state);
    if (selectedService) setFormService(selectedService);
    document.getElementById("contacto")?.scrollIntoView({ behavior: reduced ? "instant" : "smooth" });
  }

  return <div className={s.page} lang={locale}>
    <a className={s.skipLink} href="#contenido">{t.skip}</a>
    <header className={s.header}>
      <a href="/" aria-label={t.home}><Logo width={174} /></a>
      <a className={s.headerCategory} href={english ? "/en/health" : "/health"}>{t.category} <span>{t.by}</span></a>
      <nav className={s.desktopNav} aria-label={t.navigation}>{t.links.map(link => <a key={link[0]} href={link[0]}>{link[1]}</a>)}</nav>
      <LanguageSwitch locale={locale} spanishHref="/health" englishHref="/en/health" preserveHash className={s.healthLanguage} />
      <a href="#contacto" className={s.headerCta}>{t.talk} <ArrowUpRight size={15} /></a>
      <button type="button" className={s.menuButton} aria-label={menuOpen ? t.closeMenu : t.openMenu} aria-expanded={menuOpen} aria-controls="health-menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
      {menuOpen && <nav id="health-menu" className={s.mobileNav} aria-label={t.mobileNavigation}>{t.links.map(link => <a href={link[0]} key={link[0]} onClick={() => setMenuOpen(false)}>{link[1]}<ArrowUpRight size={17} /></a>)}</nav>}
    </header>

    <main id="contenido">
      <CinematicHealthHero locale={locale} onReview={() => toContact(undefined, "review")} onExplore={() => toContact(undefined, "guidance")} />

      <section id="coberturas" className={s.services} aria-labelledby="services-heading">
        <div className={s.sectionTop}><span className={s.eyebrow}>{t.servicesEyebrow}</span><span className={s.sectionNote}>{t.servicesNote}</span></div>
        <div className={s.servicesIntro}><h2 id="services-heading">{t.servicesHeading}</h2><p>{t.servicesIntro}</p></div>
        <div className={s.serviceTabs} role="tablist" aria-label={t.coverageTypes}>{services.map((item, index) => <button type="button" key={item.id} id={"tab-" + item.id} role="tab" aria-selected={service === index} aria-controls={"panel-" + item.id} tabIndex={service === index ? 0 : -1} onClick={() => setService(index)} onKeyDown={event => { let next = index; if (event.key === "ArrowRight") next = (index + 1) % 4; else if (event.key === "ArrowLeft") next = (index + 3) % 4; else if (event.key === "Home") next = 0; else if (event.key === "End") next = 3; else return; event.preventDefault(); setService(next); document.getElementById("tab-" + services[next].id)?.focus(); }}><span>0{index + 1}</span>{item.title}</button>)}</div>
        <div className={s.servicePanel} role="tabpanel" id={"panel-" + current.id} aria-labelledby={"tab-" + current.id} tabIndex={0} key={current.id}><div className={s.serviceVisual} data-service={current.id} aria-hidden="true"><div className={s.visualRing} /><div className={s.visualRingTwo} /><div className={s.serviceGlass}><Icon strokeWidth={.8} /></div><span className={s.visualLabel}>{t.visualLabel}</span><span className={s.visualNumber}>0{service + 1}</span></div><div className={s.serviceCopy}><span className={s.eyebrow}>{current.title}</span><h3>{current.short}</h3><p>{current.description}</p><ul>{current.details.map(detail => <li key={detail}><Check size={15} />{detail}</li>)}</ul><button type="button" className={s.textLink} onClick={() => toContact(undefined, current.id)}>{t.learnMore} <ArrowUpRight size={18} /></button></div></div>
        <div className={s.complementary}><span className={s.complementaryIcon}><Plus size={23} /></span><div><h3>{t.extraTitle}</h3><p>{t.extraText}</p></div><div className={s.protectionTags}>{t.tags.map(tag => <button key={tag} type="button" onClick={() => { setService(3); toContact(undefined, "supplemental"); }}>{tag}<ArrowUpRight size={12} /></button>)}</div></div>
        <p className={s.smallPrint}>{t.servicesDisclaimer}</p>
      </section>

      <CoverageMap locale={locale} onChoose={state => toContact(state)} />

      <section id="opiniones" className={s.reviews} aria-labelledby="reviews-heading">
        <div className={s.sectionTop}><span className={s.eyebrow}>{t.reviewsEyebrow}</span><GoogleWord /></div>
        <div className={s.reviewIntro}><h2 id="reviews-heading">{t.reviewsHeading}</h2><p>{t.reviewsIntro}</p></div>
        {reviews && reviews.reviews.length > 0 ? <><div className={s.rating}><strong>{reviews.rating.toLocaleString(english ? "en-US" : "es-US", { maximumFractionDigits: 1 })}</strong><div><span className={s.stars} aria-label={reviews.rating + " " + t.stars}>{Array.from({ length: 5 }, (_, index) => <Star key={index} size={17} fill={index < Math.round(reviews.rating) ? "currentColor" : "none"} />)}</span><a href={reviews.url} target="_blank" rel="noopener noreferrer">{reviews.count.toLocaleString(english ? "en-US" : "es-US")} {t.reviewsOnGoogle}</a></div></div><div className={s.reviewGrid}>{reviews.reviews.slice(0, 3).map((review, index) => <article className={s.reviewCard} key={review.name + "-" + index}><span className={s.stars} aria-label={review.rating + " " + t.stars}>{Array.from({ length: 5 }, (_, i) => <Star key={i} size={13} fill={i < review.rating ? "currentColor" : "none"} />)}</span><p>{review.text}</p><div className={s.reviewer}><span>{review.name.slice(0, 1)}</span><div><a href={review.authorUrl || reviews.url} target="_blank" rel="noopener noreferrer">{review.name}</a><small>{review.date}</small></div><GoogleWord /></div></article>)}</div><p className={s.smallPrint}>{t.reviewsRelevance}</p></> : <div className={s.reviewInvitation}><div className={s.quoteMark} aria-hidden="true">“</div><div><h3>{t.invitationTitle}</h3><p>{t.invitationText}</p></div><a href={googleUrl} target="_blank" rel="noopener noreferrer" className={s.primaryButton}>{t.visitGoogle} <ArrowUpRight size={17} /></a></div>}
        {reviews && <a href={googleUrl} className={s.textLink} target="_blank" rel="noopener noreferrer">{t.allReviews} <ArrowUpRight size={16} /></a>}
      </section>

      <section id="alianzas" className={s.alliances} aria-labelledby="alliances-heading">
        <div className={s.sectionTop}><span className={s.eyebrow}>{t.alliancesEyebrow}</span><ShieldCheck size={19} /></div>
        <div className={s.allianceIntro}><h2 id="alliances-heading">{t.alliancesHeading}</h2><p>{t.alliancesIntro}</p></div>
        <div className={s.partnerGrid}><article className={s.partner}><div className={s.partnerBrand}><span className={s.globeSymbol} aria-hidden="true">◎</span><div><strong>Globe Life</strong><span>FAMILY HERITAGE DIVISION</span></div><ArrowUpRight size={23} /></div><p>{t.globeDescription}</p><a href="https://www.familyheritagegl.com/" target="_blank" rel="noopener noreferrer">{t.globeLink} <ArrowUpRight size={15} /></a></article><article className={s.partner}><div className={s.partnerBrand}><span className={s.acaSymbol}>+</span><div><strong>ACA Marketplace</strong><span>{t.marketplaceLabel}</span></div><ArrowUpRight size={23} /></div><p>{t.marketplaceDescription}</p><a href={english ? "https://www.healthcare.gov/" : "https://www.cuidadodesalud.gov/es/"} target="_blank" rel="noopener noreferrer">{t.marketplaceLink} <ArrowUpRight size={15} /></a></article></div>
        <p className={s.smallPrint}>{t.allianceDisclaimer}</p>
      </section>

      <section className={s.faq} aria-labelledby="faq-heading"><div><span className={s.eyebrow}>{t.faqEyebrow}</span><h2 id="faq-heading">{t.faqHeading}</h2></div><div className={s.faqList}>{t.faqs.map(([question, answer]) => <details key={question}><summary>{question}<ChevronDown size={18} /></summary><p>{answer}</p></details>)}</div></section>

      <HealthContact locale={locale} selectedState={formState} onState={setFormState} selectedService={formService} onService={setFormService} />
      <div className={s.closing}><span>{t.closingLabel}</span><p>{t.closing}</p><a href="/">{t.universe} <ArrowRight size={16} /></a></div>
    </main>
    {english ? <EnglishSiteFooter /> : <SiteFooter editorial />}
    <a className={s.floatingWhatsapp} href={whatsapp} target="_blank" rel="noopener noreferrer" aria-label={t.whatsapp}><MessageCircle size={23} /><span>{t.whatsappShort}</span></a>
  </div>;
}
