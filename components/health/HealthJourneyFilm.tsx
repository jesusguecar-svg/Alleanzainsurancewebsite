import { ArrowRight } from "lucide-react";
import u from "./health.module.css";
import s from "./journey-film.module.css";

type Locale = "es" | "en";

type Step = {
  number: string;
  title: string;
  text: string;
  facts?: [string, string][];
  items?: string[];
};

const copy = (locale: Locale) => (es: string, en: string) => (locale === "en" ? en : es);

function journeySteps(locale: Locale): Step[] {
  const t = copy(locale);
  return [
    {
      number: "01",
      title: t("Cuéntanos sobre tu situación", "Tell us about your situation"),
      text: t("Hogar, médicos, medicamentos y cómo usas la atención.", "Home, doctors, medicines, and how you use care."),
      facts: [
        [t("Hogar", "Home"), t("Tu código postal y quién vive contigo.", "Your ZIP code and who lives with you.")],
        [t("Médicos", "Doctors"), t("Los que quieres conservar.", "The ones you want to keep.")],
        [t("Medicamentos", "Medicines"), t("Los que usas ahora.", "The ones you take now.")],
        [t("Atención", "Care you use"), t("Consultas, especialistas, urgencias.", "Visits, specialists, urgent care.")],
      ],
    },
    {
      number: "02",
      title: t("Identificamos los caminos disponibles", "We identify available paths"),
      text: t("Según tu ubicación y tu situación. No todos aplican.", "Based on your location and situation. Not every path applies."),
      items: ["ACA", t("Salud privada", "Private medical"), t("Dental y visión", "Dental and vision"), t("Complementaria", "Supplemental"), t("Descuento", "Discount plan")],
    },
    {
      number: "03",
      title: t("Comparamos información relevante", "We compare relevant information"),
      text: t("La misma información, lado a lado. Esta vista no es una cotización.", "The same information, side by side. This view is not a quote."),
      facts: [
        [t("Médicos", "Doctors"), t("Consultorios y hospitales de la red.", "In-network offices and hospitals.")],
        [t("Medicamentos", "Medicines"), t("La lista, los costos y las autorizaciones.", "The list, the costs, and any authorizations.")],
        [t("Costo completo", "Full cost"), t("Deducible, copagos y máximo. No solo la prima.", "Deductible, copays, and the maximum. Not only the premium.")],
      ],
    },
    {
      number: "04",
      title: t("Tú revisas tus opciones", "You review your options"),
      text: t("La decisión se queda contigo.", "The decision stays with you."),
      items: [t("La red", "The network"), t("El costo completo", "The full cost"), t("Lo que incluye", "What is included")],
    },
    {
      number: "05",
      title: t("Un asesor puede ayudarte cuando lo necesites", "An advisor can help when you need one"),
      text: t("Orientación con licencia, cuando la pidas.", "Licensed guidance, when you ask for it."),
      facts: [
        [t("Un asesor autorizado", "A licensed advisor"), t("Por teléfono o por Zoom, donde el agente está autorizado y el producto está disponible.", "By phone or Zoom, where the agent is licensed and the product is available.")],
      ],
    },
  ];
}

/** How it works (#como-funciona): the five steps as a plain numbered list. No scroll pinning. */
export function HealthJourneyFilm({ locale }: { locale: Locale }) {
  const t = copy(locale);
  const steps = journeySteps(locale);
  return <section id="como-funciona" className={u.sec} aria-labelledby="process-heading">
    <div className={`${u.wrap} ${s.layout}`}>
      <div>
        <p className={u.eyebrow}>{t("Así te acompañamos", "How we help")}</p>
        <h2 id="process-heading" className={u.h2}>{t("Una forma más clara", "A clearer way")}<br /><span className={u.soft}>{t("de encontrar cobertura", "to find coverage")}</span></h2>
      </div>
      <div>
        <ol className={s.steps}>
          {steps.map(step => <li key={step.number}>
            <span className={`${s.n} ${u.num}`} aria-hidden="true">{step.number}</span>
            <div>
              <h3 className={u.h3}>{step.title}</h3>
              <p className={`${u.body} ${s.text}`}>{step.text}</p>
              {step.facts && <dl className={s.facts} data-count={step.facts.length}>{step.facts.map(([term, detail]) => <div key={term}><dt>{term}</dt><dd>{detail}</dd></div>)}</dl>}
              {step.items && <ul className={s.inline}>{step.items.map(item => <li key={item}>{item}</li>)}</ul>}
            </div>
          </li>)}
        </ol>
        <div className={s.foot}>
          <a className={`${u.btn} ${u.btnS}`} href="#contacto" data-cta="health_journey_advisor" data-product-line="health">{t("Cuéntanos sobre tu situación", "Tell us about your situation")}<ArrowRight size={18} strokeWidth={1.5} aria-hidden="true" /></a>
          <p className={u.fine}>{t("Escenas ilustrativas. La comparación puede requerir orientación de un asesor o continuar en la plataforma correspondiente. No todos los productos se cotizan directamente en este sitio.", "Illustrative scenes. Comparison may require advisor guidance or continue on the relevant platform. Not every product is quoted directly on this website.")}</p>
        </div>
      </div>
    </div>
  </section>;
}
