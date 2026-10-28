import { healthServices, healthServicesEn } from "@/lib/content/health";

/**
 * Salud credibility facts.
 * No customer or subscriber counts: the former "20,000 subscribers" figure was removed by
 * management decision on 2026-10-28 because it could not be supported. Do not replace it with
 * another count unless it is verified through `companyFacts`.
 * Operating since 2019 and the 50-state agent network: confirmed by management, 2026-10-28.
 * Founding year, place, and BBB rating: BBB profile for Alleanza Insurance Corp,
 * Carrollton. The A+ is a rating, not BBB accreditation.
 * This file does not publish companyFacts.
 */
export type CredibilityLocale = "es" | "en";

export const bbbProfileUrl = "https://www.bbb.org/us/tx/carrollton/profile/health-insurance/alleanza-insurance-corp-0875-91352784";

export type CredibilityBenefit = {
  id: string;
  title: string;
  text: string;
};

export type CredibilityFact = {
  id: string;
  value: string;
  label: string;
  note: string;
  href?: string;
  external?: boolean;
  linkLabel?: string;
};

const benefits: Record<CredibilityLocale, readonly CredibilityBenefit[]> = {
  es: [
    { id: "explore", title: "Explora tus opciones", text: "Revisa las categorías de la guía." },
    { id: "human", title: "Orientación humana", text: "Un asesor autorizado, cuando lo pidas." },
    { id: "informed", title: "Decisiones informadas", text: "Red, costos y condiciones, sin prometer ahorros." },
    { id: "language", title: "Atención en tu idioma", text: "En español o en inglés." },
  ],
  en: [
    { id: "explore", title: "Explore your options", text: "Review the categories in the guide." },
    { id: "human", title: "Human guidance", text: "A licensed advisor, when you ask." },
    { id: "informed", title: "Informed decisions", text: "Network, costs, and terms. No savings promise." },
    { id: "language", title: "Service in your language", text: "In Spanish or English." },
  ],
};

export function credibilityContent(locale: CredibilityLocale) {
  const en = locale === "en";
  const services = en ? healthServicesEn : healthServices;
  return {
    headlineLead: en ? "More than finding insurance." : "Más que encontrar un seguro.",
    headlineEmphasis: en ? "Finding peace of mind." : "Encontrar tranquilidad.",
    description: en
      ? "Since 2019, Cynthia and Guillermo Villard have guided families from Carrollton, Texas, including Texas, Florida, and Utah. Personalized health-insurance guidance, in Spanish and English."
      : "Desde 2019, Cynthia y Guillermo Villard acompañan a familias desde Carrollton, Texas, también en Florida y Utah. Orientación personalizada de seguro de salud, en español y en inglés.",
    benefits: benefits[locale],
    facts: [
      {
        id: "founded",
        value: "2019",
        label: en ? "Protecting families since 2019" : "Protegiendo familias desde 2019",
        note: en ? "Alleanza Insurance Corp. Carrollton, Texas." : "Alleanza Insurance Corp. Carrollton, Texas.",
      },
      {
        id: "categories",
        value: String(services.length),
        label: en ? "coverage categories" : "categorías de cobertura",
        note: en ? "In the health guide. Not insurers." : "En la guía. No son aseguradoras.",
        href: "#coberturas",
        linkLabel: en ? `${services.length} coverage categories in the health guide` : `${services.length} categorías de cobertura en la guía de salud`,
      },
      {
        id: "network",
        value: "50",
        label: en ? "states with licensed-agent service" : "estados con atención de agentes licenciados",
        note: en ? "Product availability varies by state, licensing, and eligibility." : "La disponibilidad de productos depende del estado, las licencias y la elegibilidad.",
      },
      {
        id: "bbb",
        value: "A+",
        label: en ? "BBB rating" : "calificación BBB",
        note: en ? "A rating, not accreditation." : "Es una calificación, no una acreditación.",
        href: bbbProfileUrl,
        external: true,
        linkLabel: en ? "Alleanza Insurance Corp BBB rating, A plus. This is not accreditation." : "Calificación BBB de Alleanza Insurance Corp, A+. No es una acreditación.",
      },
      {
        id: "service",
        value: "24/7",
        label: en ? "Contact us 24/7" : "Contáctanos 24/7",
        // 24/7 means a request can be sent at any time, not live staffing (management decision, 2026-10-28).
        note: en ? "You can send us your request at any time; our team will respond during business hours." : "Puedes enviarnos tu solicitud en cualquier momento; nuestro equipo responderá dentro del horario de atención.",
      },
    ] satisfies CredibilityFact[],
  };
}
