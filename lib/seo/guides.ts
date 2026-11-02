import type { Metadata } from "next";
import { guideIndexPath, guidePath, type Guide, type GuideLocale } from "@/lib/content/guides";
import { guideCopy } from "@/components/guides/copy";
import { siteUrl } from "@/lib/config/site";
import { organizationRef } from "./schema";

const inLanguage = { es: "es-US", en: "en-US" } as const;

export function guideMetadata(guide: Guide, locale: GuideLocale): Metadata {
  const copy = guide[locale];
  const path = guidePath(guide, locale);
  return {
    title: copy.title,
    description: copy.description,
    alternates: { canonical: path, languages: { "es-US": guidePath(guide, "es"), "en-US": guidePath(guide, "en"), "x-default": guidePath(guide, "es") } },
    openGraph: { type: "article", locale: locale === "es" ? "es_US" : "en_US", url: path, siteName: organizationRef.name, title: copy.title, description: copy.description, modifiedTime: guide.updatedDate },
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
    author: { "@type": "Person", name: guide.author },
    publisher: organizationRef,
    dateModified: guide.updatedDate,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
      reviewedBy: { "@type": "Person", name: guide.reviewer },
      lastReviewed: guide.reviewedDate,
    },
  };
}

export function guideBreadcrumbSchema(guide: Guide, locale: GuideLocale) {
  const { health, index } = guideCopy[locale];
  const items = [
    { name: health.label, url: `${siteUrl}${health.href}` },
    { name: index.label, url: `${siteUrl}${guideIndexPath[locale]}` },
    { name: guide[locale].h1, url: `${siteUrl}${guidePath(guide, locale)}` },
  ];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, position) => ({ "@type": "ListItem", position: position + 1, name: item.name, item: item.url })),
  };
}
