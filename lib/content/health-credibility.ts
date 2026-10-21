import { healthServices, healthServicesEn } from "@/lib/content/health";

/**
 * Credibility copy for the Salud page. Counts come from the health guide
 * itself. No customer totals, savings, years, or carrier claims live here.
 */
export type CredibilityLocale = "es" | "en";

export type CredibilityBenefit = {
  id: string;
  title: string;
  text: string;
};

const benefits: Record<CredibilityLocale, readonly CredibilityBenefit[]> = {
  es: [
    { id: "explore", title: "Explora tus opciones", text: "Recorre las categorías de la guía y revisa cuál puede aplicar a tu situación." },
    { id: "human", title: "Orientación humana", text: "Un asesor autorizado puede explicarte las diferencias cuando quieras hablar con alguien." },
    { id: "informed", title: "Decisiones informadas", text: "Comparas red, costos y condiciones antes de elegir. Nada aquí promete un ahorro." },
    { id: "language", title: "Atención en tu idioma", text: "Puedes revisar la información y hablar con nosotros en español o en inglés." },
  ],
  en: [
    { id: "explore", title: "Explore your options", text: "Walk through the guide’s categories and see which may apply to your situation." },
    { id: "human", title: "Human guidance", text: "A licensed advisor can explain the differences when you want to talk with someone." },
    { id: "informed", title: "Informed decisions", text: "You compare network, costs, and terms before choosing. Nothing here promises savings." },
    { id: "language", title: "Service in your language", text: "You can review the information and speak with us in Spanish or English." },
  ],
};

export function credibilityContent(locale: CredibilityLocale) {
  const en = locale === "en";
  const services = en ? healthServicesEn : healthServices;
  return {
    headlineLead: en ? "More than finding insurance." : "Más que encontrar un seguro.",
    headlineEmphasis: en ? "Finding peace of mind." : "Encontrar tranquilidad.",
    description: en
      ? "Personalized guidance to review health insurance choices, with service in Spanish and English."
      : "Orientación personalizada para revisar opciones de seguro de salud, con atención en español y en inglés.",
    categoryCount: services.length,
    categoryLabel: en ? "coverage categories" : "categorías de cobertura",
    categoryNote: en ? "In the health guide. These are categories, not insurers." : "En la guía de salud. No son aseguradoras.",
    bilingualValue: "Español e inglés",
    bilingualLabel: en ? "Bilingual service" : "Atención bilingüe",
    bilingualNote: en ? "On this page and with an advisor." : "En esta página y con un asesor.",
    benefits: benefits[locale],
  };
}
