"use client";

import { ArrowRight, ChevronDown, MessageCircle } from "lucide-react";
import type { GoogleReviews } from "@/lib/google-reviews";
import { acaAgentCertification, licensingStatement } from "@/lib/content/health";
import { getHealthWhatsapp } from "./HealthContact";
import { AlleanzaComparePlaceholder } from "./AlleanzaComparePlaceholder";
import { CoverageStage } from "./CoverageStage";
import { FactorCarousel } from "./FactorCarousel";
import { HealthJourneyFilm } from "./HealthJourneyFilm";
import { ReviewCarousel } from "./ReviewCarousel";
import u from "./health.module.css";
import f from "./faq.module.css";
import p from "./platform.module.css";

type LocaleProps = { locale: "es" | "en" };
const words = (locale: "es" | "en") => (es: string, en: string) => locale === "en" ? en : es;
export function JourneyActions({ locale }: LocaleProps) {
  const t = words(locale);
  return <div className={`${u.actions} ${p.centerActions}`}><a className={`${u.btn} ${u.btnP}`} href="#compare" data-cta="health_compare_options" data-product-line="health">{t("Comparar opciones", "Compare options")}<ArrowRight size={18} strokeWidth={1.5} aria-hidden="true" /></a><a className={`${u.btn} ${u.btnS}`} href="#contacto" data-cta="health_talk_advisor" data-product-line="health">{t("Hablar con un asesor", "Talk to an advisor")}</a></div>;
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
    { title: t("Quiero explorar mis opciones", "I want to explore my options"), text: t("Empieza por tu cuenta y revisa los tipos de cobertura que podrían tener sentido para ti.", "Start on your own and review coverage types that may make sense for you."), cta: t("Explorar cobertura", "Explore coverage"), href: "#compare", label: t("Por tu cuenta", "On your own") },
    { title: t("Prefiero hablar con alguien", "I’d rather talk to someone"), text: t("Un asesor autorizado de Alleanza puede ayudarte a revisar tu situación y explicarte tus opciones.", "A licensed Alleanza advisor can help review your situation and explain your options."), cta: t("Hablar con un asesor", "Talk to an advisor"), href: "#contacto", label: t("Con orientación", "With guidance") },
  ];
  return <section className={`${u.sec} ${u.white}`} aria-labelledby="paths-heading"><div className={u.wrap}><div className={p.center}><p className={u.eyebrow}>{t("A tu ritmo", "At your pace")}</p><h2 id="paths-heading" className={u.h2}>{t("Tú decides cómo empezar", "You decide how to start")}</h2></div><div className={p.paths}>{paths.map(({ title, text, cta, href, label }) => <article className={p.path} key={href}><p className={u.eyebrow}>{label}</p><h3 className={u.h3}>{title}</h3><p className={u.body}>{text}</p><a className={`${u.btn} ${u.btnS}`} href={href} data-cta={href === "#contacto" ? "health_path_advisor" : "health_path_explore"} data-product-line="health">{cta}<ArrowRight size={18} strokeWidth={1.5} aria-hidden="true" /></a></article>)}</div></div></section>;
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
  return <section className={`${u.sec} ${u.white}`} aria-labelledby="shopping-heading"><div className={u.wrap}><p className={u.eyebrow}>{t("Elige cómo comparar", "Choose how to compare")}</p><h2 id="shopping-heading" className={`${u.h2} ${p.tableTitle}`}>{t("Más que buscar un precio", "More than finding a price")}</h2><div className={p.tableWrap} tabIndex={0} role="region" aria-labelledby="shopping-heading"><table className={p.table}><thead><tr><td />{columns.map((column, index) => <th scope="col" className={index === 0 ? p.us : undefined} key={column.title}>{column.title}<span>{column.note}</span></th>)}</tr></thead><tbody>{rows.map((row, i) => <tr key={row}><th scope="row">{row}</th>{columns.map((column, index) => <td className={index === 0 ? p.us : undefined} key={column.title}>{column.values[i]}</td>)}</tr>)}</tbody></table></div><p className={`${u.fine} ${p.tableNote}`}>{t("Comparación orientativa de formas de buscar cobertura, no de compañías específicas. Los servicios de otras aseguradoras y plataformas pueden variar. Alleanza no representa todas las opciones del mercado.", "An overview of ways to shop, not a comparison of specific companies. Other insurers’ and platforms’ services may vary. Alleanza does not represent every option in the market.")}</p></div></section>;
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
    <section id="preguntas" className={`${u.white} ${f.section}`} aria-labelledby="faq-heading">
      <div className={u.wrap}>
        <div className={f.layout}>
          <div>
            <p className={u.eyebrow}>{t("Preguntas, sin rodeos", "Straightforward answers")}</p>
            <h2 id="faq-heading" className={`${u.h2} ${f.title}`}>{t("Hablemos claro", "Let’s make it clear")}</h2>
            <p className={u.body}>{t("Respuestas directas. Si tu caso es otro, un asesor puede seguir por WhatsApp.", "Direct answers. If your situation is different, an advisor can continue on WhatsApp.")}</p>
            <a className={`${u.btn} ${u.btnS} ${f.whatsapp}`} href={getHealthWhatsapp(locale)} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={18} strokeWidth={1.5} aria-hidden="true" />
              {t("Escribir por WhatsApp", "Message on WhatsApp")}
            </a>
            <p className={u.small}>{t("También por teléfono o Zoom", "By phone or Zoom as well")}</p>
          </div>
          <div>
            {faqs.map(([question, answer]) => (
              <details className={f.item} key={question}>
                <summary>{question}<ChevronDown size={18} strokeWidth={1.5} aria-hidden="true" /></summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
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
  return <section id="aprender" className={`${u.sec} ${u.white}`} aria-labelledby="education-heading"><div className={u.wrap}><p className={u.eyebrow}>{t("Aprende lo que importa", "Learn what matters")}</p><h2 id="education-heading" className={`${u.h2} ${p.guidesTitle}`}>{t("Entiende tu cobertura", "Understand your coverage")}<br /><span className={u.soft}>{t("antes de elegirla", "before you choose it")}</span></h2><div className={p.guides}>{articles.map(([title, subtitle, text], index) => <details className={p.guide} key={title}><summary><span className={`${p.guideN} ${u.num}`} aria-hidden="true">0{index + 1}</span><h3 className={`${u.h4} ${p.guideTitle}`}>{title}</h3><span className={`${u.small} ${p.guideSub}`}>{subtitle}</span><span className={p.guideGo}>{t("Leer guía breve", "Read short guide")}<ChevronDown size={18} strokeWidth={1.5} aria-hidden="true" /></span></summary><p className={u.body}>{text}</p></details>)}</div><p className={`${u.fine} ${p.guidesNote}`}>{t("Información educativa general. Consulta las condiciones de cada plan. Fuentes:", "General educational information. Review each plan’s terms. Sources:")} <a href="https://www.healthcare.gov/choose-a-plan/plans-categories/" target="_blank" rel="noopener noreferrer">{t("categorías de planes", "plan categories")}</a> · <a href="https://www.healthcare.gov/choose-a-plan/plan-types/" target="_blank" rel="noopener noreferrer">{t("tipos de red", "network types")}</a> · <a href="https://www.healthcare.gov/glossary/out-of-pocket-maximum-limit/" target="_blank" rel="noopener noreferrer">{t("gastos de bolsillo", "out-of-pocket costs")}</a> (HealthCare.gov).</p></div></section>;
}

export function HealthFinalCTA({ locale }: LocaleProps) {
  const t = words(locale);
  return <section className={p.end} aria-labelledby="final-heading"><div className={`${u.wrap} ${p.center}`}><p className={u.eyebrow}>Alleanza Insurance Corp.</p><h2 id="final-heading" className={u.h2}>{t("Tu cobertura debería tener sentido", "Your coverage should make sense")}<br /><span className={u.soft}>{t("antes de firmarla", "before you sign")}</span></h2><p className={`${u.lead} ${p.endLead}`}>{t("Empieza explorando tus opciones o habla con un asesor cuando estés listo.", "Start exploring your options or talk to an advisor when you’re ready.")}</p><JourneyActions locale={locale} /></div></section>;
}
