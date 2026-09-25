"use client";

import { useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Check, ChevronDown, Eye, Heart, Menu, MessageCircle, Plus, ShieldCheck, Star, X } from "lucide-react";
import { Logo } from "../Logo";
import { SiteFooter } from "../layout/SiteFooter";
import { CoverageMap } from "./CoverageMap";
import { CinematicHealthHero } from "./CinematicHealthHero";
import { HealthContact, healthWhatsapp } from "./HealthContact";
import { healthServices } from "@/lib/content/health";
import type { GoogleReviews } from "@/lib/google-reviews";
import s from "./health.module.css";

const links = [{ href: "#coberturas", label: "Tu cobertura" }, { href: "#presencia", label: "Cerca de ti" }, { href: "#opiniones", label: "Opiniones" }, { href: "#alianzas", label: "Alianzas" }];
const icons = { heart: Heart, shield: ShieldCheck, eye: Eye, plus: Plus };

function GoogleWord() { return <span className={s.googleWord} aria-label="Google"><span>G</span><span>o</span><span>o</span><span>g</span><span>l</span><span>e</span></span>; }

export default function HealthExperience({ reviews, reviewsUrl }: { reviews: GoogleReviews | null; reviewsUrl?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [service, setService] = useState(0);
  const [formService, setFormService] = useState("guidance");
  const [formState, setFormState] = useState("");
  const reduced = useReducedMotion();
  const current = healthServices[service];
  const Icon = icons[current.icon];
  const googleUrl = reviews?.url || reviewsUrl || "https://www.google.com/maps/search/?api=1&query=Alleanza+Insurance+3424+Midcourt+Rd+Carrollton+TX";

  function toContact(state?: string, selectedService?: string) {
    if (state) setFormState(state);
    if (selectedService) setFormService(selectedService);
    document.getElementById("contacto")?.scrollIntoView({ behavior: reduced ? "instant" : "smooth" });
  }

  return <div className={s.page}>
    <a className={s.skipLink} href="#contenido">Saltar al contenido</a>
    <header className={s.header}><a href="/" aria-label="Alleanza Insurance — inicio"><Logo width={174} /></a><a className={s.headerCategory} href="/health">Salud <span>por Alleanza</span></a><nav className={s.desktopNav} aria-label="Navegación de salud">{links.map(link => <a key={link.href} href={link.href}>{link.label}</a>)}</nav><a href="#contacto" className={s.headerCta}>Hablemos <ArrowUpRight size={15} /></a><button type="button" className={s.menuButton} aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"} aria-expanded={menuOpen} aria-controls="health-menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>{menuOpen && <nav id="health-menu" className={s.mobileNav} aria-label="Navegación móvil">{links.map(link => <a href={link.href} key={link.href} onClick={() => setMenuOpen(false)}>{link.label}<ArrowUpRight size={17} /></a>)}</nav>}</header>

    <main id="contenido">
      <CinematicHealthHero onReview={() => toContact(undefined, "review")} onExplore={() => toContact(undefined, "guidance")} />

      <section id="coberturas" className={s.services} aria-labelledby="services-heading"><div className={s.sectionTop}><span className={s.eyebrow}>01 / PROTECCIÓN A TU MEDIDA</span><span className={s.sectionNote}>Hoy. Mañana. Contigo.</span></div><div className={s.servicesIntro}><h2 id="services-heading">No todas las vidas son iguales.<br /><em>Tu cobertura tampoco.</em></h2><p>Escuchamos tu historia. Comparamos tus opciones.<br />Y te ayudamos a decidir con claridad.</p></div>
        <div className={s.serviceTabs} role="tablist" aria-label="Tipos de cobertura">{healthServices.map((item, index) => <button type="button" key={item.id} id={`tab-${item.id}`} role="tab" aria-selected={service === index} aria-controls={`panel-${item.id}`} tabIndex={service === index ? 0 : -1} onClick={() => setService(index)} onKeyDown={event => { let next = index; if (event.key === "ArrowRight") next = (index + 1) % 4; else if (event.key === "ArrowLeft") next = (index + 3) % 4; else if (event.key === "Home") next = 0; else if (event.key === "End") next = 3; else return; event.preventDefault(); setService(next); document.getElementById(`tab-${healthServices[next].id}`)?.focus(); }}><span>0{index + 1}</span>{item.title}</button>)}</div>
        <div className={s.servicePanel} role="tabpanel" id={`panel-${current.id}`} aria-labelledby={`tab-${current.id}`} tabIndex={0} key={current.id}><div className={s.serviceVisual} data-service={current.id} aria-hidden="true"><div className={s.visualRing} /><div className={s.visualRingTwo} /><div className={s.serviceGlass}><Icon strokeWidth={.8} /></div><span className={s.visualLabel}>ALLEANZA · SALUD</span><span className={s.visualNumber}>0{service + 1}</span></div><div className={s.serviceCopy}><span className={s.eyebrow}>{current.title}</span><h3>{current.short}</h3><p>{current.description}</p><ul>{current.details.map(detail => <li key={detail}><Check size={15} />{detail}</li>)}</ul><button type="button" className={s.textLink} onClick={() => toContact(undefined, current.id)}>Quiero saber más <ArrowUpRight size={18} /></button></div></div>
        <div className={s.complementary}><span className={s.complementaryIcon}><Plus size={23} /></span><div><h3>Tu seguro médico + un respaldo extra.</h3><p>Protección complementaria para cuando la vida toma un giro inesperado.</p></div><div className={s.protectionTags}>{["Accidentes", "Cáncer", "Derrame cerebral", "Hospitalización"].map(tag => <button key={tag} type="button" onClick={() => { setService(3); toContact(undefined, "supplemental"); }}>{tag}<ArrowUpRight size={12} /></button>)}</div></div><p className={s.smallPrint}>Los beneficios complementarios dependen de la póliza y del evento cubierto; no sustituyen un seguro médico integral. Revisamos contigo condiciones, exclusiones y disponibilidad.</p>
      </section>

      <CoverageMap onChoose={state => toContact(state)} />

      <section id="opiniones" className={s.reviews} aria-labelledby="reviews-heading"><div className={s.sectionTop}><span className={s.eyebrow}>03 / HISTORIAS QUE NOS UNEN</span><GoogleWord /></div><div className={s.reviewIntro}><h2 id="reviews-heading">La confianza no se promete.<br /><em>Se construye contigo.</em></h2><p>Detrás de cada cobertura hay una persona.<br />Y detrás de cada opinión, una experiencia.</p></div>
        {reviews && reviews.reviews.length > 0 ? <><div className={s.rating}><strong>{reviews.rating.toLocaleString("es-US", { maximumFractionDigits: 1 })}</strong><div><span className={s.stars} aria-label={`${reviews.rating} de 5 estrellas`}>{Array.from({ length: 5 }, (_, index) => <Star key={index} size={17} fill={index < Math.round(reviews.rating) ? "currentColor" : "none"} />)}</span><a href={reviews.url} target="_blank" rel="noopener noreferrer">{reviews.count.toLocaleString("es-US")} reseñas en Google</a></div></div><div className={s.reviewGrid}>{reviews.reviews.slice(0, 3).map((review, index) => <article className={s.reviewCard} key={`${review.name}-${index}`}><span className={s.stars} aria-label={`${review.rating} de 5 estrellas`}>{Array.from({ length: 5 }, (_, i) => <Star key={i} size={13} fill={i < review.rating ? "currentColor" : "none"} />)}</span><p>{review.text}</p><div className={s.reviewer}><span>{review.name.slice(0, 1)}</span><div><a href={review.authorUrl || reviews.url} target="_blank" rel="noopener noreferrer">{review.name}</a><small>{review.date}</small></div><GoogleWord /></div></article>)}</div><p className={s.smallPrint}>Reseñas mostradas por relevancia según Google.</p></> : <div className={s.reviewInvitation}><div className={s.quoteMark} aria-hidden="true">“</div><div><h3>Tu experiencia es parte<br />de nuestra historia.</h3><p>Conoce las opiniones de nuestra comunidad en Google o comparte cómo te acompañamos.</p></div><a href={googleUrl} target="_blank" rel="noopener noreferrer" className={s.primaryButton}>Visítanos en Google <ArrowUpRight size={17} /></a></div>}
        {reviews && <a href={googleUrl} className={s.textLink} target="_blank" rel="noopener noreferrer">Ver todas las opiniones en Google <ArrowUpRight size={16} /></a>}
      </section>

      <section id="alianzas" className={s.alliances} aria-labelledby="alliances-heading"><div className={s.sectionTop}><span className={s.eyebrow}>04 / ALIANZAS QUE SUMAN</span><ShieldCheck size={19} /></div><div className={s.allianceIntro}><h2 id="alliances-heading">Bien acompañado.<br /><em>Mejor protegido.</em></h2><p>Conectamos tu tranquilidad con opciones<br />de protección para cada etapa de tu vida.</p></div><div className={s.partnerGrid}><article className={s.partner}><div className={s.partnerBrand}><span className={s.globeSymbol} aria-hidden="true">◎</span><div><strong>Globe Life</strong><span>FAMILY HERITAGE DIVISION</span></div><ArrowUpRight size={23} /></div><p>Protección complementaria para afrontar el impacto económico de eventos cubiertos, con el acompañamiento de Alleanza.</p><a href="https://www.familyheritagegl.com/" target="_blank" rel="noopener noreferrer">Conoce Family Heritage <ArrowUpRight size={15} /></a></article><article className={s.partner}><div className={s.partnerBrand}><span className={s.acaSymbol}>+</span><div><strong>ACA Marketplace</strong><span>MERCADO DE SEGUROS MÉDICOS</span></div><ArrowUpRight size={23} /></div><p>Asesoría para explorar planes de Obamacare, entender sus beneficios y revisar las ayudas disponibles según tu elegibilidad.</p><a href="https://www.cuidadodesalud.gov/es/" target="_blank" rel="noopener noreferrer">Conoce el Mercado de Salud <ArrowUpRight size={15} /></a></article></div><p className={s.smallPrint}>Alleanza es una agencia de seguros independiente. El Marketplace es el mercado de seguros médicos, no una aseguradora. Este sitio no pertenece al gobierno federal ni implica su respaldo.</p></section>

      <section className={s.faq} aria-labelledby="faq-heading"><div><span className={s.eyebrow}>SIN DUDAS EN EL CAMINO</span><h2 id="faq-heading">Hablemos <em>claro.</em></h2></div><div className={s.faqList}>{[
        ["¿Por dónde empiezo si no sé qué seguro necesito?", "Por una conversación. Revisamos tu estado, tus necesidades y las opciones disponibles. Te explicamos redes, primas, deducibles y copagos antes de que decidas."],
        ["¿Puedo recibir ayuda aunque no haya una oficina cerca?", "Sí. Ofrecemos atención a distancia en los 50 estados, por teléfono o videollamada y en español. La disponibilidad de planes y agentes autorizados depende del estado."],
        ["¿Cuál es la diferencia entre ACA y un seguro privado?", "Los planes del Marketplace ACA los ofrecen aseguradoras privadas y pueden incluir ayuda económica para quienes califican. Fuera del Marketplace también hay opciones privadas. Revisamos contigo beneficios, condiciones y elegibilidad, sin asumir que todos los planes son iguales."],
        ["¿La protección complementaria reemplaza mi seguro médico?", "No. Es una protección adicional que puede pagar beneficios ante eventos cubiertos, como accidentes, cáncer, derrame cerebral o una hospitalización, según la póliza. Los límites, exclusiones y períodos de espera se revisan antes de contratar."],
      ].map(([question, answer]) => <details key={question}><summary>{question}<ChevronDown size={18} /></summary><p>{answer}</p></details>)}</div></section>

      <HealthContact selectedState={formState} onState={setFormState} selectedService={formService} onService={setFormService} />
      <div className={s.closing}><span>ALLEANZA INSURANCE</span><p>La tranquilidad de <em>tenernos.</em></p><a href="/">Explora el universo Alleanza <ArrowRight size={16} /></a></div>
    </main>
    <SiteFooter editorial />
    <a className={s.floatingWhatsapp} href={healthWhatsapp} target="_blank" rel="noopener noreferrer" aria-label="Habla con Alleanza por WhatsApp"><MessageCircle size={23} /><span>¿Hablamos?</span></a>
  </div>;
}
