import { healthServices, healthServicesEn } from "@/lib/content/health";

/**
 * Salud credibility facts.
 * Subscriber floor: stated by the business on 2026-10-21 for this page only.
 * Founding year, place, and BBB rating: BBB profile for Alleanza Insurance Corp,
 * Carrollton. The A+ is a rating, not BBB accreditation.
 * This file does not publish companyFacts.
 */
export type CredibilityLocale = "es" | "en";

export const healthSubscriberFloor = 20000;

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
  const subscribers = en ? "20,000+" : "+20,000";
  return {
    headlineLead: en ? "More than finding insurance." : "Más que encontrar un seguro.",
    headlineEmphasis: en ? "Finding peace of mind." : "Encontrar tranquilidad.",
    description: en
      ? "Since 2019, Cynthia and Guillermo Villard have guided families from Carrollton, Texas, including Texas, Florida, and Utah. Personalized health-insurance guidance, in Spanish and English."
      : "Desde 2019, Cynthia y Guillermo Villard acompañan a familias desde Carrollton, Texas, también en Florida y Utah. Orientación personalizada de seguro de salud, en español y en inglés.",
    benefits: benefits[locale],
    facts: [
      {
        id: "subscribers",
        value: subscribers,
        label: en ? "health insurance subscribers" : "suscriptores de salud",
        note: en ? "More than 20,000. Health coverage only." : "Más de 20,000. Solo seguro de salud.",
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
        id: "founded",
        value: "2019",
        label: en ? "founded in Texas" : "fundada en Texas",
        note: en ? "Carrollton. Cynthia and Guillermo Villard." : "Carrollton. Cynthia y Guillermo Villard.",
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
        label: en ? "service, 365 days" : "servicio, 365 días",
        note: en ? "In Spanish and English." : "En español y en inglés.",
      },
    ] satisfies CredibilityFact[],
  };
}
