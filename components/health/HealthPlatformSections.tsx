"use client";

import { ArrowRight, ArrowUpRight, BookOpen, Check, Compass, MapPin, MessageCircle, Plus, SlidersHorizontal } from "lucide-react";
import type { GoogleReviews } from "@/lib/google-reviews";
import { acaAgentCertification, licensingStatement } from "@/lib/content/health";
import { getHealthWhatsapp } from "./HealthContact";
import { AlleanzaComparePlaceholder } from "./AlleanzaComparePlaceholder";
import { CoverageStage } from "./CoverageStage";
import { FactorCarousel } from "./FactorCarousel";
import { HealthJourneyFilm } from "./HealthJourneyFilm";
import { ReviewCarousel } from "./ReviewCarousel";
import f from "./faq.module.css";
import p from "./platform.module.css";

type LocaleProps = { locale: "es" | "en" };
const words = (locale: "es" | "en") => (es: string, en: string) => locale === "en" ? en : es;
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
  return <AlleanzaComparePlaceholder locale={locale} />;
}

export function CoverageCategories({ locale }: LocaleProps) {
  return <CoverageStage locale={locale} />;
}

export function ComparisonFactors({ locale }: LocaleProps) {
  return <FactorCarousel locale={locale} />;
}

export function ShoppingPathSelector({ locale }: LocaleProps) {
  const t = words(locale);
  const paths = [
    { icon: Compass, title: t("Quiero explorar mis opciones", "I want to explore my options"), text: t("Empieza por tu cuenta y revisa los tipos de cobertura que podrían tener sentido para ti.", "Start on your own and review coverage types that may make sense for you."), cta: t("Explorar cobertura", "Explore coverage"), href: "#compare", label: t("POR TU CUENTA", "ON YOUR OWN"), image: "/health/paths/explore.jpg", alt: t("Persona revisando opciones en su teléfono", "Person reviewing options on a phone") },
    { icon: MessageCircle, title: t("Prefiero hablar con alguien", "I’d rather talk to someone"), text: t("Un asesor autorizado de Alleanza puede ayudarte a revisar tu situación y explicarte tus opciones.", "A licensed Alleanza advisor can help review your situation and explain your options."), cta: t("Hablar con un asesor", "Talk to an advisor"), href: "#contacto", label: t("CON ORIENTACIÓN", "WITH GUIDANCE"), image: "/health/paths/guidance.jpg", alt: t("Conversación tranquila con un asesor", "A calm conversation with an advisor") },
  ];
  return <section className={p.section} aria-labelledby="paths-heading"><div className={p.centerIntro}><span className={p.eyebrow}>{t("A TU RITMO", "AT YOUR PACE")}</span><h2 id="paths-heading">{t("Tú decides ", "You decide ")}<em>{t("cómo empezar.", "how to start.")}</em></h2></div><div className={p.pathGrid}>{paths.map(({ icon: Icon, title, text, cta, href, label, image, alt }) => <article className={p.pathCard} key={href}><div><Icon size={29} strokeWidth={1.3} aria-hidden="true" /><span className={p.eyebrow}>{label}</span></div><h3>{title}</h3><p>{text}</p><a className={p.secondary} href={href}>{cta}<ArrowRight size={18} aria-hidden="true" /></a>{/* eslint-disable-next-line @next/next/no-img-element */}<img className={p.pathImage} src={image} alt={alt} width={1248} height={832} /></article>)}</div></section>;
}

export function HowAlleanzaWorks({ locale }: LocaleProps) {
  return <HealthJourneyFilm locale={locale} />;
}

export function HealthTrust({ locale, reviews, reviewsUrl }: LocaleProps & { reviews: GoogleReviews | null; reviewsUrl?: string }) {
  return <ReviewCarousel locale={locale} reviews={reviews} reviewsUrl={reviewsUrl} />;
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
    [t("¿Pueden ayudarme a inscribirme en el Marketplace para 2027?", "Can you help me enroll in the Marketplace for 2027?"), t(`Sí. ${acaAgentCertification.es} ${licensingStatement.es} La elegibilidad para ayuda con el costo y los planes disponibles dependen de tu estado y tu situación.`, `Yes. ${acaAgentCertification.en} ${licensingStatement.en} Eligibility for financial help and the plans available depend on your state and situation.`)],
    [t("¿Alleanza es una compañía de seguros?", "Is Alleanza an insurance carrier?"), t("Alleanza Insurance Corp. es una agencia independiente. Te ayuda a encontrar, comparar y entender productos de aseguradoras y plataformas autorizadas. La cobertura la emite la compañía aseguradora correspondiente.", "Alleanza Insurance Corp. is an independent agency. We help you find, compare, and understand products from authorized insurers and platforms. The applicable insurance company issues the coverage.")],
    [t("¿Puedo comparar opciones sin hablar inmediatamente con un agente?", "Can I explore without speaking to an agent right away?"), t("Sí, puedes explorar las categorías y aprender qué comparar sin hablar con un agente. La comparación personalizada de planes en Alleanza Compare está en desarrollo. Por ahora, un asesor puede ayudarte a revisar opciones específicas.", "Yes. Explore categories and learn what to compare without talking to an agent. Personalized plan comparison in Alleanza Compare is in development. For now, an advisor can help you review specific options.")],
    [t("¿Qué debo mirar además del precio mensual?", "What should I look at beyond the monthly price?"), t("El deducible, máximo de bolsillo, copagos y coseguro; también la red de médicos y hospitales, los medicamentos cubiertos, las exclusiones y los límites. Piensa tanto en el uso habitual como en una atención inesperada.", "Review the deductible, out-of-pocket maximum, copays, and coinsurance; also check doctors, hospitals, covered prescriptions, exclusions, and limits. Consider routine care as well as unexpected needs.")],
    [t("¿Qué significa HMO, PPO o EPO?", "What do HMO, PPO, and EPO mean?"), t("Son tipos de red. HMO y EPO generalmente cubren atención dentro de la red, salvo emergencias. PPO suele permitir atención fuera de la red a un costo mayor. Las referencias a especialistas y otras reglas dependen del plan; confirma sus condiciones.", "They describe network types. HMO and EPO plans generally cover in-network care, except emergencies. PPO plans usually allow out-of-network care at a higher cost. Specialist referrals and other rules depend on the plan; check its terms.")],
    [t("¿La cobertura complementaria reemplaza mi seguro médico?", "Does supplemental coverage replace health insurance?"), t("No. Puede pagar beneficios ante eventos cubiertos, según la póliza, pero no sustituye un seguro médico integral. Revisa montos, exclusiones, límites y períodos de espera.", "No. It may pay benefits for covered events, depending on the policy, but it does not replace comprehensive health insurance. Review benefit amounts, exclusions, limits, and waiting periods.")],
    [t("¿Puedo recibir ayuda a distancia?", "Can I get help remotely?"), t("Sí. Podemos orientarte por teléfono o de forma remota en los mercados donde nuestros agentes están autorizados y los productos están disponibles.", "Yes. We can provide phone or remote guidance in markets where our agents are licensed and products are available.")],
    [t("¿Las mismas compañías están disponibles en todos los estados?", "Are the same companies available in every state?"), t("No necesariamente. Las compañías, redes, productos y beneficios varían según la ubicación y la elegibilidad. Confirmamos la disponibilidad para tu situación antes de avanzar.", "Not necessarily. Companies, networks, products, and benefits vary by location and eligibility. We confirm availability for your situation before moving forward.")],
  ];
  return (
    <section id="preguntas" className={f.section} aria-labelledby="faq-heading">
      <div className={f.wrap}>
        <div className={f.intro}>
          <span className={f.eyebrow}>{t("PREGUNTAS, SIN RODEOS", "STRAIGHTFORWARD ANSWERS")}</span>
          <h2 id="faq-heading">{t("Hablemos ", "Let’s make it ")}<em>{t("claro.", "clear.")}</em></h2>
          <p className={f.deck}>{t("Respuestas directas. Si tu caso es otro, un asesor puede seguir por WhatsApp.", "Direct answers. If your situation is different, an advisor can continue on WhatsApp.")}</p>
          <a className={f.whatsapp} href={getHealthWhatsapp(locale)} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={18} aria-hidden="true" />
            {t("Escribir por WhatsApp", "Message on WhatsApp")}
          </a>
          <p className={f.aside}>{t("También por teléfono o Zoom.", "By phone or Zoom as well.")}</p>
        </div>
        <div className={f.list}>
          {faqs.map(([question, answer]) => (
            <details key={question}>
              <summary>{question}<span className={f.plus}><Plus size={18} aria-hidden="true" /></span></summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
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
