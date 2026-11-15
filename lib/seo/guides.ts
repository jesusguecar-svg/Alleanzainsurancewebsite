import type { Metadata } from "next";
import { breadcrumbLabel, getParentGuide, guideIndexPath, guidePath, type Guide, type GuideLocale } from "@/lib/content/guides";
import { guideCopy } from "@/components/guides/copy";
import { centralDateTime } from "@/lib/content/guides/dates";
import { agents } from "@/lib/content/agents";
import { siteUrl } from "@/lib/config/site";
import { organizationRef } from "./schema";

const inLanguage = { es: "es-US", en: "en-US" } as const;

/**
 * The Article image: the existing Salud social card in the page's language (app/(es)/health and
 * app/(en)/en/health opengraph-image.tsx). It is the agency's own artwork (official lockup on azul
 * marino, Inter under the OFL), 1200 x 630, with no people. The suffix is Next's hash of the file's
 * route-group path, not of its content, so it only changes if that file moves;
 * scripts/check-guides-rendered.mjs checks it against the live /health og:image.
 */
export const guideImage = {
  es: { url: `${siteUrl}/health/opengraph-image-2uyiiq`, alt: "Alleanza Insurance Corp. — Compara tus opciones. Te ayudamos a entenderlas." },
  en: { url: `${siteUrl}/en/health/opengraph-image-1pfqfd`, alt: "Alleanza Insurance Corp. — Compare your options. Understand them." },
} as const;
const guideImageSize = { width: 1200, height: 630 } as const;

const nameKey = (name: string) => name.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLocaleLowerCase("en").trim();

/** The agent profile URL for a guide's author or reviewer (matched by name, ignoring accents). */
export function agentProfileUrl(name: string, locale: GuideLocale) {
  const agent = agents.find((candidate) => nameKey(candidate.fullName) === nameKey(name));
  if (!agent) throw new Error(`No agent profile for "${name}"`);
  return `${siteUrl}${locale === "es" ? "/agentes" : "/en/agents"}/${agent.slug}`;
}

export function guideMetadata(guide: Guide, locale: GuideLocale): Metadata {
  const copy = guide[locale];
  const path = guidePath(guide, locale);
  return {
    title: copy.title,
    description: copy.description,
    alternates: { canonical: path, languages: { "es-US": guidePath(guide, "es"), "en-US": guidePath(guide, "en"), "x-default": guidePath(guide, "es") } },
    openGraph: { type: "article", locale: locale === "es" ? "es_US" : "en_US", url: path, siteName: organizationRef.name, title: copy.title, description: copy.description, modifiedTime: centralDateTime(guide.updatedDate), images: [{ ...guideImageSize, url: guideImage[locale].url, alt: guideImage[locale].alt }] },
  };
}

export function guideIndexMetadata(locale: GuideLocale): Metadata {
  const { index } = guideCopy[locale];
  return {
    title: index.title,
    description: index.description,
    alternates: { canonical: guideIndexPath[locale], languages: { "es-US": guideIndexPath.es, "en-US": guideIndexPath.en, "x-default": guideIndexPath.es } },
    openGraph: { type: "website", locale: locale === "es" ? "es_US" : "en_US", url: guideIndexPath[locale], siteName: organizationRef.name, title: index.title, description: index.description },
  };
}

/**
 * schema.org defines reviewedBy and lastReviewed on WebPage, not Article, so they sit on the
 * Article's mainEntityOfPage.
 */
export function guideArticleSchema(guide: Guide, locale: GuideLocale) {
  const copy = guide[locale];
  const url = `${siteUrl}${guidePath(guide, locale)}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: copy.h1,
    description: copy.description,
    inLanguage: inLanguage[locale],
    image: { "@type": "ImageObject", url: guideImage[locale].url, ...guideImageSize },
    author: { "@type": "Person", name: guide.author, url: agentProfileUrl(guide.author, locale) },
    publisher: organizationRef,
    dateModified: centralDateTime(guide.updatedDate),
    citation: copy.sources.map((source) => ({ "@type": "CreativeWork", name: source.label, url: source.url })),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
      reviewedBy: { "@type": "Person", name: guide.reviewer, url: agentProfileUrl(guide.reviewer, locale) },
      lastReviewed: guide.reviewedDate,
    },
  };
}

/** `shown` is the guides this build shows; a parent outside it is left out of the trail. */
export function guideBreadcrumbSchema(guide: Guide, locale: GuideLocale, shown?: readonly Guide[]) {
  const { health, index } = guideCopy[locale];
  const items: { name: string; url: string }[] = [
    { name: health.label, url: `${siteUrl}${health.href}` },
    { name: index.label, url: `${siteUrl}${guideIndexPath[locale]}` },
  ];
  const parent = getParentGuide(guide, shown);
  if (parent) items.push({ name: breadcrumbLabel(parent, locale), url: `${siteUrl}${guidePath(parent, locale)}` });
  items.push({ name: breadcrumbLabel(guide, locale), url: `${siteUrl}${guidePath(guide, locale)}` });
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, position) => ({ "@type": "ListItem", position: position + 1, name: item.name, item: item.url })),
  };
}
