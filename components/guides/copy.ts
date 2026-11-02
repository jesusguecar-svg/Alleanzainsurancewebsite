/**
 * Fixed text around each guide. The disclaimers and index headings reuse the health page's copy.
 * TODO-COPY: the Spanish template labels, index descriptions and "Guides" block text are new.
 */
export const guideCopy = {
  es: {
    health: { href: "/health", label: "Salud" },
    index: {
      label: "Aprende",
      title: "Aprende: guías de seguros de salud | Alleanza Insurance Corp.",
      description: "Guías educativas sobre seguros de salud, con fuentes oficiales y revisadas por un agente con licencia.",
      eyebrow: "APRENDE LO QUE IMPORTA",
      h1: "Entiende tu cobertura antes de elegirla.",
    },
    block: { heading: "Guías", all: "Ver todas las guías" },
    breadcrumb: "Ruta de navegación",
    updated: "Actualizado",
    reviewedBy: "Revisado por",
    licensedAgent: "agente con licencia",
    keyFacts: "Datos clave",
    sources: "Fuentes",
    accessed: "Consultado el",
    related: "Guías relacionadas",
    disclaimer: "Información educativa general. Consulta las condiciones de cada plan.",
    notGovernment: "Este sitio no pertenece al gobierno federal ni implica su respaldo.",
    cta: "Habla con un agente con licencia",
    nav: [{ href: "/health", label: "Salud" }, { href: "/aprende", label: "Aprende" }, { href: "/agentes", label: "Agentes" }],
    headerCta: { href: "/contacto", label: "Hablar con un asesor" },
  },
  en: {
    health: { href: "/en/health", label: "Health" },
    index: {
      label: "Learn",
      title: "Learn: health insurance guides | Alleanza Insurance Corp.",
      description: "Educational health insurance guides with official sources, reviewed by a licensed agent.",
      eyebrow: "LEARN WHAT MATTERS",
      h1: "Understand your coverage before you choose it.",
    },
    block: { heading: "Guides", all: "See all guides" },
    breadcrumb: "Breadcrumb",
    updated: "Updated",
    reviewedBy: "Reviewed by",
    licensedAgent: "licensed agent",
    keyFacts: "Key facts",
    sources: "Sources",
    accessed: "Accessed",
    related: "Related guides",
    disclaimer: "General educational information. Review each plan’s terms.",
    notGovernment: "This website is not operated or endorsed by the federal government.",
    cta: "Talk to a licensed agent",
    nav: [{ href: "/en/health", label: "Health" }, { href: "/en/learn", label: "Learn" }, { href: "/en/agents", label: "Agents" }],
    headerCta: { href: "/en/health#contacto", label: "Talk to an advisor" },
  },
} as const;
