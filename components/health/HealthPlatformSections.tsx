"use client";

import { useState } from "react";
import { ArrowRight, ArrowUpRight, BookOpen, Check, ChevronDown, CircleDollarSign, Compass, Eye, Heart, MapPin, MessageCircle, Plus, ShieldCheck, SlidersHorizontal, Star, Stethoscope } from "lucide-react";
import type { GoogleReviews } from "@/lib/google-reviews";
import { healthServices, healthServicesEn } from "@/lib/content/health";
import { AlleanzaComparePlaceholder } from "./AlleanzaComparePlaceholder";
import p from "./platform.module.css";

type LocaleProps = { locale: "es" | "en" };
const words = (locale: "es" | "en") => (es: string, en: string) => locale === "en" ? en : es;
const categoryIcons = [Heart, ShieldCheck, Eye, Plus];

export function JourneyActions({ locale }: LocaleProps) {
  const t = words(locale);
  return <div className={p.actions}><a className={p.primary} href="#compare">{t("Comparar opciones", "Compare options")}<ArrowRight size={18} aria-hidden="true" /></a><a className={p.secondary} href="#contacto">{t("Hablar con un asesor", "Talk to an advisor")}<ArrowUpRight size={18} aria-hidden="true" /></a></div>;
}

export function HealthHero({ locale }: LocaleProps) {
  const t = words(locale);
  return <section className={p.hero} aria-labelledby="health-title">
    <div className={p.heroCopy}>
      <span className={p.eyebrow}>{t("SEGUROS DE SALUD, SIN TENER QUE DESCIFRARLOS SOLO", "HEALTH INSURANCE. YOU DON’T HAVE TO FIGURE IT OUT ALONE.")}</span>
      <h1 id="health-title">{t("Compara tus opciones.", "Compare your options.")}<br /><em>{t("Nosotros te ayudamos a entenderlas.", "We help you understand them.")}</em></h1>
      <p>{t("Explora seguro médico, dental, visión y protección complementaria de las compañías y plataformas disponibles a través de Alleanza. Con un asesor autorizado cuando lo necesites.", "Explore medical, dental, vision, and supplemental insurance from the companies and platforms available through Alleanza. With a licensed advisor when you need one.")}</p>
      <JourneyActions locale={locale} />
      <ul className={p.assurances}>{[t("En español", "English & Spanish"), t("Sin compromiso", "No obligation"), t("Asesores autorizados", "Licensed advisors")].map(item => <li key={item}><Check size={14} aria-hidden="true" />{item}</li>)}</ul>
    </div>
    <div className={p.heroVisual}>
      <div className={p.heroOrbit} aria-hidden="true" />
      {/* Existing Health imagery and brand artwork; no new stock imagery. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={p.heroPhoto} src="/cinematic/people/salud.jpg" alt={t("Una madre y su hija comparten un abrazo", "A mother and daughter sharing a hug")} width={1536} height={1024} fetchPriority="high" />
      <div className={p.visualCaption}><span>{t("TU VIDA ES EL PUNTO DE PARTIDA", "YOUR LIFE IS THE STARTING POINT")}</span><p>{t("Primero tú.", "You come first.")}<br /><em>{t("Después, el plan.", "Then, the plan.")}</em></p></div>
      <div className={p.heroNote}><span className={p.noteIcon}><SlidersHorizontal size={23} strokeWidth={1.4} /></span><div><strong>{t("Más que un precio", "More than a price")}</strong><span>{t("Tu médico. Tu presupuesto. Tu vida.", "Your doctor. Your budget. Your life.")}</span></div></div>
    </div>
    <p className={p.heroLegal}>{t("Alleanza Insurance Corp. es una agencia independiente. La cobertura la emite la compañía aseguradora correspondiente.", "Alleanza Insurance Corp. is an independent agency. Coverage is issued by the applicable insurance company.")}</p>
  </section>;
}

export function CompareSection({ locale }: LocaleProps) {
  const t = words(locale);
  return <section id="compare" className={`${p.section} ${p.compareSection}`} aria-labelledby="compare-heading">
    <div className={p.compareIntro}><span className={p.eyebrow}>ALLEANZA COMPARE</span><h2 id="compare-heading">{t("Encuentra las opciones", "Find the options")}<br /><em>{t("que tienen sentido para ti.", "that make sense for you.")}</em></h2><p>{t("No necesitas saber si buscas ACA, cobertura privada o protección complementaria. Alleanza Compare podrá ayudarte a identificar qué caminos vale la pena explorar según tu situación.", "You don’t need to know whether you want ACA, private coverage, or supplemental insurance. Alleanza Compare will help identify which paths are worth exploring for your situation.")}</p><div className={p.comparePromise}><Compass size={24} strokeWidth={1.3} aria-hidden="true" /><span>{t("Empieza entendiendo tus opciones. A tu ritmo, sin dejar tus datos.", "Start by understanding your options. At your pace, without sharing your contact details.")}</span></div></div>
    <AlleanzaComparePlaceholder locale={locale} />
  </section>;
}

export function CoverageCategories({ locale }: LocaleProps) {
  const t = words(locale);
  const services = locale === "en" ? healthServicesEn : healthServices;
  const descriptions = [
    t("Compara opciones disponibles en el Marketplace según tu ubicación y situación.", "Compare Marketplace options based on your location and situation."),
    t("Explora alternativas fuera del Marketplace cuando puedan tener sentido para tu situación.", "Explore alternatives outside the Marketplace when they may make sense for you."),
    t("Coberturas diseñadas específicamente para servicios dentales y de visión.", "Coverage designed specifically for dental and vision services."),
    t("Beneficios adicionales para situaciones como accidentes, hospitalización o enfermedades graves.", "Additional benefits for situations such as accidents, hospitalization, or serious illness."),
  ];
  return <section id="coberturas" className={p.section} aria-labelledby="coverage-heading"><div className={p.sectionIntro}><span className={p.eyebrow}>{t("DISTINTAS NECESIDADES. DISTINTOS CAMINOS.", "DIFFERENT NEEDS. DIFFERENT PATHS.")}</span><h2 id="coverage-heading">{t("No todas las necesidades", "Different needs.")}<br /><em>{t("requieren la misma cobertura.", "Different coverage.")}</em></h2></div>
    <div className={p.categoryGrid}>{services.map((service, index) => { const Icon = categoryIcons[index]; return <article id={`coverage-${service.id}`} className={p.category} key={service.id}><span className={p.categoryIcon}><Icon size={27} strokeWidth={1.25} aria-hidden="true" /></span><span className={p.categoryNumber}>0{index + 1}</span><h3>{index === 0 ? t("Seguro médico ACA", "ACA health insurance") : index === 1 ? t("Cobertura médica privada", "Private medical coverage") : service.title}</h3><p>{descriptions[index]}</p><details><summary>{t("Conocer más", "Learn more")}<Plus size={16} aria-hidden="true" /></summary><div><ul>{service.details.map(detail => <li key={detail}>{detail}</li>)}</ul>{index === 1 && <p>{t("Los beneficios y las condiciones pueden ser distintos a los de un plan ACA. Revisa exclusiones y límites antes de elegir.", "Benefits and terms may differ from an ACA plan. Review exclusions and limits before choosing.")}</p>}{index === 3 && <p>{t("La cobertura complementaria no sustituye un seguro médico integral.", "Supplemental coverage does not replace comprehensive health insurance.")}</p>}</div></details></article>; })}</div><p className={p.legal}>{t("La cobertura complementaria no sustituye un seguro médico integral. La disponibilidad y las condiciones dependen del producto y del estado.", "Supplemental coverage does not replace comprehensive health insurance. Availability and terms depend on the product and state.")}</p>
  </section>;
}

export function ComparisonFactors({ locale }: LocaleProps) {
  const t = words(locale);
  const [active, setActive] = useState(0);
  const groups = [
    { title: t("Lo que pagas", "What you pay"), icon: CircleDollarSign, text: t("Mira el costo completo, no solo la mensualidad.", "Look at the full cost, beyond the monthly payment."), items: [
      [t("Prima mensual", "Monthly premium"), t("Lo que pagas por mantener la cobertura, incluso si no la usas.", "What you pay to keep coverage, even when you don’t use it.")],
      [t("Deducible", "Deductible"), t("Lo que pagas por ciertos servicios cubiertos antes de que el plan empiece a compartir esos costos.", "What you pay for certain covered services before the plan starts sharing those costs.")],
      [t("Máximo de bolsillo", "Out-of-pocket maximum"), t("En planes ACA, el límite anual por servicios cubiertos dentro de la red. No incluye primas ni servicios no cubiertos.", "For ACA plans, the annual limit for covered in-network services. Premiums and non-covered services are excluded.")],
      [t("Copagos", "Copays"), t("Cantidades fijas por determinados servicios. Revisa también el coseguro: el porcentaje que te corresponde pagar.", "Fixed amounts for certain services. Also check coinsurance: the percentage you pay.")],
    ] },
    { title: t("Dónde te atiendes", "Where you get care"), icon: Stethoscope, text: t("Tu cobertura también depende de quién te atiende.", "Coverage also depends on who provides your care."), items: [
      [t("Médicos", "Doctors"), t("Confirma que tus médicos participan en la red del plan específico.", "Confirm your doctors participate in the specific plan’s network.")],
      [t("Hospitales", "Hospitals"), t("Revisa los centros cercanos y los especialistas que podrías necesitar.", "Check nearby facilities and the specialists you may need.")],
      [t("Tipo de red", "Network type"), t("HMO, PPO y EPO tienen distintas reglas para especialistas y atención fuera de la red.", "HMO, PPO, and EPO plans have different rules for specialists and out-of-network care.")],
    ] },
    { title: t("Qué incluye", "What’s included"), icon: Plus, text: t("Los detalles que importan en tu día a día.", "The details that matter in your daily life."), items: [
      [t("Medicamentos", "Prescriptions"), t("Consulta la lista de medicamentos, sus costos y las autorizaciones que pueden requerir.", "Review covered drugs, their costs, and any required authorizations.")],
      [t("Telemedicina", "Telehealth"), t("Comprueba qué consultas virtuales cubre el plan y con qué proveedores.", "Check which virtual visits the plan covers and with which providers.")],
      [t("Beneficios adicionales", "Additional benefits"), t("Distingue lo incluido de los productos adicionales. Revisa límites, exclusiones y períodos de espera.", "Distinguish included benefits from additional products. Review limits, exclusions, and waiting periods.")],
    ] },
  ];
  return <section id="comparar" className={`${p.section} ${p.factors}`} aria-labelledby="factors-heading"><div className={p.factorsIntro}><span className={p.eyebrow}>{t("COMPARAR CON CRITERIO", "COMPARE WITH PERSPECTIVE")}</span><h2 id="factors-heading">{t("El precio es solo", "Price is only")}<br /><em>{t("una parte de la decisión.", "part of the decision.")}</em></h2><p>{t("Un plan económico no siempre es el plan que más sentido tiene para ti.", "An inexpensive plan isn’t always the plan that makes the most sense for you.")}</p><p>{t("No buscamos simplemente mostrarte el plan más barato. Queremos ayudarte a entender qué estás comprando y qué diferencias pueden afectar tu experiencia.", "Our goal is more than showing the cheapest plan. We help you understand what you’re buying and which differences may affect your experience.")}</p></div>
    <div className={p.factorExplorer}><div className={p.factorTabs} role="tablist" aria-label={t("Aspectos para comparar", "Comparison factors")}>{groups.map((group, index) => <button id={`factor-tab-${index}`} key={group.title} role="tab" aria-selected={active === index} aria-controls={`factor-panel-${index}`} tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)} onKeyDown={event => { const next = event.key === "ArrowRight" ? (index + 1) % 3 : event.key === "ArrowLeft" ? (index + 2) % 3 : event.key === "Home" ? 0 : event.key === "End" ? 2 : null; if (next !== null) { event.preventDefault(); setActive(next); document.getElementById(`factor-tab-${next}`)?.focus(); } }}><group.icon size={19} strokeWidth={1.5} aria-hidden="true" /><span>{group.title}</span></button>)}</div>
      <div key={active} className={p.factorPanel} role="tabpanel" id={`factor-panel-${active}`} aria-labelledby={`factor-tab-${active}`} tabIndex={0}><h3>{groups[active].text}</h3><dl>{groups[active].items.map(([title, text], index) => <div key={title}><dt><span>0{index + 1}</span>{title}</dt><dd>{text}</dd></div>)}</dl></div>
    </div>
  </section>;
}

export function ShoppingPathSelector({ locale }: LocaleProps) {
  const t = words(locale);
  return <section className={p.section} aria-labelledby="paths-heading"><div className={p.centerIntro}><span className={p.eyebrow}>{t("A TU RITMO", "AT YOUR PACE")}</span><h2 id="paths-heading">{t("Tú decides ", "You decide ")}<em>{t("cómo empezar.", "how to start.")}</em></h2></div><div className={p.pathGrid}>{[
    { icon: Compass, title: t("Quiero explorar mis opciones", "I want to explore my options"), text: t("Empieza por tu cuenta y revisa los tipos de cobertura que podrían tener sentido para ti.", "Start on your own and review coverage types that may make sense for you."), cta: t("Explorar cobertura", "Explore coverage"), href: "#compare", label: t("POR TU CUENTA", "ON YOUR OWN") },
    { icon: MessageCircle, title: t("Prefiero hablar con alguien", "I’d rather talk to someone"), text: t("Un asesor autorizado de Alleanza puede ayudarte a revisar tu situación y explicarte tus opciones.", "A licensed Alleanza advisor can help review your situation and explain your options."), cta: t("Hablar con un asesor", "Talk to an advisor"), href: "#contacto", label: t("CON ORIENTACIÓN", "WITH GUIDANCE") },
  ].map(({ icon: Icon, title, text, cta, href, label }) => <article className={p.pathCard} key={href}><div><Icon size={29} strokeWidth={1.3} aria-hidden="true" /><span className={p.eyebrow}>{label}</span></div><h3>{title}</h3><p>{text}</p><a className={p.secondary} href={href}>{cta}<ArrowRight size={18} aria-hidden="true" /></a></article>)}</div></section>;
}

export function HowAlleanzaWorks({ locale }: LocaleProps) {
  const t = words(locale);
  const steps = [t("Cuéntanos sobre tu situación", "Tell us about your situation"), t("Identificamos los caminos disponibles", "We identify available paths"), t("Comparamos información relevante", "We compare relevant information"), t("Tú revisas tus opciones", "You review your options"), t("Un asesor puede ayudarte cuando lo necesites", "An advisor can help when you need one")];
  return <section id="como-funciona" className={p.section} aria-labelledby="process-heading"><div className={p.sectionIntro}><span className={p.eyebrow}>{t("ASÍ TE ACOMPAÑAMOS", "HOW WE HELP")}</span><h2 id="process-heading">{t("Una forma más clara", "A clearer way")}<br /><em>{t("de encontrar cobertura.", "to find coverage.")}</em></h2></div><ol className={p.process}>{steps.map((step, index) => <li key={step}><span>0{index + 1}</span><h3>{step}</h3></li>)}</ol><p className={p.legal}>{t("La comparación puede requerir orientación de un asesor o continuar en la plataforma correspondiente. No todos los productos se cotizan directamente en este sitio.", "Comparison may require advisor guidance or continue on the relevant platform. Not every product is quoted directly on this website.")}</p></section>;
}

export function CarrierAccess({ locale }: LocaleProps) {
  const t = words(locale);
  // Only relationships already represented in this repository are displayed.
  // Add approved brand assets here after business verification; future routing
  // providers are not evidence of an existing carrier appointment.
  return <section id="alianzas" className={`${p.section} ${p.carriers}`} aria-labelledby="carriers-heading"><div><span className={p.eyebrow}>{t("COMPAÑÍAS Y VÍAS DE ACCESO", "COMPANIES & ACCESS PATHS")}</span><h2 id="carriers-heading">{t("Acceso a distintas", "Access to different")}<br /><em>{t("opciones de cobertura.", "coverage options.")}</em></h2></div><div className={p.carrierRow}><a href="https://www.familyheritagegl.com/" target="_blank" rel="noopener noreferrer" className={p.carrierWordmark}><span>Globe Life</span><strong>FAMILY HERITAGE DIVISION</strong><small>{t("Protección complementaria", "Supplemental coverage")}<ArrowUpRight size={14} /></small></a><div className={p.marketplace}><span className={p.eyebrow}>{t("VÍA DE EXPLORACIÓN", "EXPLORATION PATH")}</span><strong>Marketplace / ACA</strong><p>{t("Orientación para explorar el Mercado de Seguros Médicos. Es un mercado, no una aseguradora ni una alianza corporativa.", "Guidance to explore the Health Insurance Marketplace. It is a marketplace, not an insurance company or a corporate partnership.")}</p></div></div><p className={p.legal}>{t("La disponibilidad de compañías, productos y beneficios puede variar según el estado, elegibilidad y características de cada cobertura. Este sitio no pertenece al gobierno federal ni implica su respaldo.", "Company, product, and benefit availability may vary by state, eligibility, and coverage terms. This website is not operated or endorsed by the federal government.")}</p></section>;
}

export function HealthTrust({ locale, reviews, reviewsUrl }: LocaleProps & { reviews: GoogleReviews | null; reviewsUrl?: string }) {
  const t = words(locale);
  return <section id="opiniones" className={`${p.section} ${p.trust}`} aria-labelledby="trust-heading"><div className={p.trustHeading}><div><span className={p.eyebrow}>{t("EXPERIENCIAS REALES", "REAL EXPERIENCES")}</span><h2 id="trust-heading">{t("La confianza se construye", "Trust grows")}<br /><em>{t("con cada experiencia.", "with every experience.")}</em></h2></div>{reviews && <a className={p.rating} href={reviews.url} target="_blank" rel="noopener noreferrer"><strong>{reviews.rating.toFixed(1)}</strong><span><span aria-label={`${reviews.rating} / 5`}>{Array.from({ length: 5 }, (_, i) => <Star key={i} size={15} fill={i < Math.round(reviews.rating) ? "currentColor" : "none"} aria-hidden="true" />)}</span>{reviews.count} {t("reseñas en Google", "Google reviews")}<ArrowUpRight size={14} aria-hidden="true" /></span></a>}</div>
    {reviews?.reviews.length ? <div className={p.reviewGrid}>{reviews.reviews.slice(0, 3).map((review, i) => <figure className={p.reviewCard} key={`${review.name}-${i}`}><span className={p.reviewStars} aria-label={`${review.rating} / 5`}>{Array.from({ length: 5 }, (_, j) => <Star key={j} size={12} fill={j < review.rating ? "currentColor" : "none"} aria-hidden="true" />)}</span><blockquote>{review.text}</blockquote><figcaption><span className={p.avatar}>{review.name.charAt(0)}</span><a href={review.authorUrl || reviews.url} target="_blank" rel="noopener noreferrer">{review.name}<small>{review.date}</small></a></figcaption></figure>)}</div> : <p>{t("Conoce las experiencias compartidas en nuestro perfil público.", "Explore the experiences shared on our public profile.")}{reviewsUrl && <a className={p.textLink} href={reviewsUrl} target="_blank" rel="noopener noreferrer">Google<ArrowUpRight size={16} /></a>}</p>}
    {reviews && <p className={p.legal}>{t("Fuente: perfil de Google enlazado. Las opiniones describen experiencias individuales con la agencia; no garantizan resultados de una póliza.", "Source: linked Google profile. Reviews describe individual agency experiences; they do not guarantee policy outcomes.")}</p>}
  </section>;
}

export function ShoppingComparison({ locale }: LocaleProps) {
  const t = words(locale);
  const rows = [t("Varias opciones de cobertura", "Multiple coverage options"), t("Orientación de un asesor", "Advisor guidance"), t("Ayuda para entender diferencias", "Help understanding differences"), t("Opciones médicas + complementarias", "Medical + supplemental options"), t("Apoyo durante el proceso", "Support along the way"), t("Atención en español", "Spanish-language support")];
  const columns = [
    { title: "Alleanza", note: t("Comparación con orientación", "Comparison with guidance"), values: [t("Según disponibilidad", "Subject to availability"), t("Disponible", "Available"), t("Disponible", "Available"), t("Según disponibilidad", "Subject to availability"), t("Disponible", "Available"), t("Disponible", "Available")] },
    { title: t("Directo con una aseguradora", "Direct with an insurer"), note: t("Dentro de su oferta", "Within its offering"), values: [t("Su propia oferta", "Its own offering"), ...Array(5).fill(t("Puede variar", "May vary"))] },
    { title: t("Buscar por tu cuenta", "Research on your own"), note: t("Tú reúnes la información", "You gather the information"), values: [t("Según tu búsqueda", "Based on your search"), t("Si lo solicitas", "If requested"), t("Según las fuentes", "Depends on sources"), t("Según tu búsqueda", "Based on your search"), t("Puede variar", "May vary"), t("Puede variar", "May vary")] },
  ];
  return <section className={p.section} aria-labelledby="shopping-heading"><div className={p.sectionIntro}><span className={p.eyebrow}>{t("ELIGE CÓMO COMPARAR", "CHOOSE HOW TO COMPARE")}</span><h2 id="shopping-heading">{t("Más que ", "More than ")}<em>{t("buscar un precio.", "finding a price.")}</em></h2></div><div className={p.shoppingGrid}>{columns.map((column, index) => <article className={p.shoppingCard} data-featured={index === 0} key={column.title}><header><h3>{column.title}</h3><p>{column.note}</p></header><dl>{rows.map((row, i) => <div key={row}><dt>{row}</dt><dd>{column.values[i]}</dd></div>)}</dl></article>)}</div><p className={p.legal}>{t("Comparación orientativa de formas de buscar cobertura, no de compañías específicas. Los servicios de otras aseguradoras y plataformas pueden variar. Alleanza no representa todas las opciones del mercado.", "An overview of ways to shop, not a comparison of specific companies. Other insurers’ and platforms’ services may vary. Alleanza does not represent every option in the market.")}</p></section>;
}

export function RemoteSupport({ locale }: LocaleProps) {
  const t = words(locale);
  return <section id="presencia" className={`${p.section} ${p.remote}`} aria-labelledby="remote-heading"><MapPin size={32} strokeWidth={1.2} aria-hidden="true" /><div><h2 id="remote-heading">{t("Asesoría estés donde estés.", "Guidance, wherever you are.")}</h2><p>{t("Podemos ayudarte de forma remota y ofrecemos atención en mercados donde nuestros agentes y productos se encuentran disponibles.", "We can help remotely and offer service in markets where our agents and products are available.")}</p></div><a className={p.textLink} href={locale === "en" ? "/en/agents" : "/agentes"}>{t("Conoce a nuestros asesores", "Meet our advisors")}<ArrowUpRight size={17} aria-hidden="true" /></a></section>;
}

export function HealthFAQ({ locale }: LocaleProps) {
  const t = words(locale);
  const faqs = [
    [t("¿Por dónde empiezo?", "Where do I start?"), t("Explora los cuatro tipos de cobertura y los factores que conviene comparar. No necesitas conocer la terminología ni dejar tus datos. Si necesitas orientación sobre tu situación, puedes hablar con un asesor.", "Explore the four coverage types and the factors worth comparing. You don’t need to know the terminology or share your contact details. If you want guidance for your situation, you can talk to an advisor.")],
    [t("¿Cuál es la diferencia entre ACA y un seguro privado?", "What is the difference between ACA and private insurance?"), t("Los planes ACA del Marketplace también los emiten aseguradoras privadas y pueden incluir ayuda económica según elegibilidad. Fuera del Marketplace hay otras opciones privadas, algunas cumplen con ACA y otras tienen beneficios y límites diferentes. Hay que revisar cada producto.", "ACA Marketplace plans are also issued by private insurers and may include financial help based on eligibility. Other private options exist outside the Marketplace; some comply with ACA and others have different benefits and limits. Review each product.")],
    [t("¿Alleanza es una compañía de seguros?", "Is Alleanza an insurance carrier?"), t("Alleanza Insurance Corp. es una agencia independiente. Te ayuda a encontrar, comparar y entender productos de aseguradoras y plataformas autorizadas. La cobertura la emite la compañía aseguradora correspondiente.", "Alleanza Insurance Corp. is an independent agency. We help you find, compare, and understand products from authorized insurers and platforms. The applicable insurance company issues the coverage.")],
    [t("¿Puedo comparar opciones sin hablar inmediatamente con un agente?", "Can I explore without speaking to an agent right away?"), t("Sí, puedes explorar las categorías y aprender qué comparar sin hablar con un agente. La comparación personalizada de planes en Alleanza Compare está en desarrollo. Por ahora, un asesor puede ayudarte a revisar opciones específicas.", "Yes. Explore categories and learn what to compare without talking to an agent. Personalized plan comparison in Alleanza Compare is in development. For now, an advisor can help you review specific options.")],
    [t("¿Qué debo mirar además del precio mensual?", "What should I look at beyond the monthly price?"), t("El deducible, máximo de bolsillo, copagos y coseguro; también la red de médicos y hospitales, los medicamentos cubiertos, las exclusiones y los límites. Piensa tanto en el uso habitual como en una atención inesperada.", "Review the deductible, out-of-pocket maximum, copays, and coinsurance; also check doctors, hospitals, covered prescriptions, exclusions, and limits. Consider routine care as well as unexpected needs.")],
    [t("¿Qué significa HMO, PPO o EPO?", "What do HMO, PPO, and EPO mean?"), t("Son tipos de red. HMO y EPO generalmente cubren atención dentro de la red, salvo emergencias. PPO suele permitir atención fuera de la red a un costo mayor. Las referencias a especialistas y otras reglas dependen del plan; confirma sus condiciones.", "They describe network types. HMO and EPO plans generally cover in-network care, except emergencies. PPO plans usually allow out-of-network care at a higher cost. Specialist referrals and other rules depend on the plan; check its terms.")],
    [t("¿La cobertura complementaria reemplaza mi seguro médico?", "Does supplemental coverage replace health insurance?"), t("No. Puede pagar beneficios ante eventos cubiertos, según la póliza, pero no sustituye un seguro médico integral. Revisa montos, exclusiones, límites y períodos de espera.", "No. It may pay benefits for covered events, depending on the policy, but it does not replace comprehensive health insurance. Review benefit amounts, exclusions, limits, and waiting periods.")],
    [t("¿Puedo recibir ayuda a distancia?", "Can I get help remotely?"), t("Sí. Podemos orientarte por teléfono o de forma remota en los mercados donde nuestros agentes están autorizados y los productos están disponibles.", "Yes. We can provide phone or remote guidance in markets where our agents are licensed and products are available.")],
    [t("¿Las mismas compañías están disponibles en todos los estados?", "Are the same companies available in every state?"), t("No necesariamente. Las compañías, redes, productos y beneficios varían según la ubicación y la elegibilidad. Confirmamos la disponibilidad para tu situación antes de avanzar.", "Not necessarily. Companies, networks, products, and benefits vary by location and eligibility. We confirm availability for your situation before moving forward.")],
  ];
  return <section id="preguntas" className={`${p.section} ${p.faq}`} aria-labelledby="faq-heading"><div><span className={p.eyebrow}>{t("PREGUNTAS, SIN RODEOS", "STRAIGHTFORWARD ANSWERS")}</span><h2 id="faq-heading">{t("Hablemos ", "Let’s make it ")}<em>{t("claro.", "clear.")}</em></h2></div><div className={p.accordion}>{faqs.map(([question, answer]) => <details key={question}><summary>{question}<ChevronDown size={18} aria-hidden="true" /></summary><p>{answer}</p></details>)}</div></section>;
}

// These are local education previews, not fabricated blog links. A future
// WordPress adapter can provide published URLs and excerpts using this boundary.
export function HealthEducation({ locale }: LocaleProps) {
  const t = words(locale);
  const articles = [
    [t("Bronce vs. Plata vs. Oro", "Bronze vs. Silver vs. Gold"), t("Qué cambia entre categorías", "What changes across categories"), t("Los niveles describen cómo se reparten los costos, no la calidad de la atención. Compara prima y gastos al usar el plan. Si calificas para reducciones de costos compartidos, revisa las opciones Plata.", "Metal levels describe how costs are shared, not care quality. Compare premiums and costs when using care. If you qualify for cost-sharing reductions, review Silver options.")],
    ["HMO vs. PPO vs. EPO", t("Entiende tu red", "Understand your network"), t("Las siglas describen reglas de acceso. Revisa si debes usar proveedores de la red, si necesitas referencias y qué pasa con la atención fuera de la red.", "These names describe access rules. Check whether you must use in-network providers, need referrals, and how out-of-network care works.")],
    [t("Qué significa realmente tu deducible", "What your deductible really means"), t("Más allá de la mensualidad", "Beyond the monthly payment"), t("Es lo que pagas por ciertos servicios cubiertos antes de que el plan comparta esos costos. Algunos servicios pueden tener copagos o estar cubiertos antes de alcanzarlo. Consulta el resumen de beneficios.", "It is what you pay for certain covered services before the plan shares those costs. Some services may have copays or be covered before you reach it. Check the summary of benefits.")],
    [t("ACA vs. seguro privado", "ACA vs. private insurance"), t("Dos términos que se cruzan", "Two overlapping terms"), t("ACA no es una aseguradora: los planes del Marketplace los emiten compañías privadas. Fuera del Marketplace también hay planes, con requisitos y condiciones que debes revisar individualmente.", "ACA is not an insurer: private companies issue Marketplace plans. Plans also exist outside the Marketplace, with requirements and terms you should review individually.")],
    [t("¿Tu médico está dentro de la red?", "Is your doctor in the network?"), t("Una comprobación esencial", "An essential check"), t("Busca el nombre exacto del plan en el directorio de la aseguradora. Confirma con el consultorio que acepta ese plan, no solo la compañía. Las redes pueden cambiar.", "Look up the exact plan in the insurer’s directory. Confirm with the doctor’s office that it accepts that plan, not just the company. Networks can change.")],
  ];
  return <section id="aprender" className={`${p.section} ${p.education}`} aria-labelledby="education-heading"><div className={p.sectionIntro}><span className={p.eyebrow}>{t("APRENDE LO QUE IMPORTA", "LEARN WHAT MATTERS")}</span><h2 id="education-heading">{t("Entiende tu cobertura", "Understand your coverage")}<br /><em>{t("antes de elegirla.", "before you choose it.")}</em></h2></div><div className={p.educationGrid}>{articles.map(([title, subtitle, text], index) => <details className={p.articleCard} key={title}><summary><span className={p.articleTop}><BookOpen size={21} strokeWidth={1.3} aria-hidden="true" /><span>0{index + 1}</span></span><h3>{title}</h3><span className={p.articleSubtitle}>{subtitle}</span><span className={p.articleLink}>{t("Leer guía breve", "Read short guide")}<Plus size={17} aria-hidden="true" /></span></summary><p>{text}</p></details>)}</div><p className={p.legal}>{t("Información educativa general. Consulta las condiciones de cada plan. Fuentes:", "General educational information. Review each plan’s terms. Sources:")} <a href="https://www.healthcare.gov/choose-a-plan/plans-categories/" target="_blank" rel="noopener noreferrer">{t("categorías de planes", "plan categories")}</a> · <a href="https://www.healthcare.gov/choose-a-plan/plan-types/" target="_blank" rel="noopener noreferrer">{t("tipos de red", "network types")}</a> · <a href="https://www.healthcare.gov/glossary/out-of-pocket-maximum-limit/" target="_blank" rel="noopener noreferrer">{t("gastos de bolsillo", "out-of-pocket costs")}</a> (HealthCare.gov).</p></section>;
}

export function HealthFinalCTA({ locale }: LocaleProps) {
  const t = words(locale);
  return <section className={`${p.section} ${p.final}`} aria-labelledby="final-heading"><span className={p.eyebrow}>ALLEANZA INSURANCE CORP.</span><h2 id="final-heading">{t("Tu cobertura debería tener sentido", "Your coverage should make sense")}<br /><em>{t("antes de firmarla.", "before you sign.")}</em></h2><p>{t("Empieza explorando tus opciones o habla con un asesor cuando estés listo.", "Start exploring your options or talk to an advisor when you’re ready.")}</p><JourneyActions locale={locale} /></section>;
}
