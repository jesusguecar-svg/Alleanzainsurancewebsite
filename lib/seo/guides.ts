import type { Metadata } from "next";
import { breadcrumbLabel, getParentGuide, guideIndexPath, guidePath, type Guide, type GuideLocale } from "@/lib/content/guides";
import { guideCopy } from "@/components/guides/copy";
import { siteUrl } from "@/lib/config/site";
import { agents } from "@/lib/content/agents";
import { organizationRef, publisherRef } from "./schema";

const inLanguage = { es: "es-US", en: "en-US" } as const;

/** 1200 × 630 card for each guide, served by app/og/guides/[file]/route.tsx. */
export const guideImageSize = { width: 1200, height: 630 } as const;
export const guideImageFile = (guide: Pick<Guide, "id">, locale: GuideLocale) => `${guide.id}-${locale}.png`;
export const guideImagePath = (guide: Pick<Guide, "id">, locale: GuideLocale) => `/og/guides/${guideImageFile(guide, locale)}`;

const plainName = (name: string) => name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();

/** The author's agent profile, matched by name (accents ignored), in the guide's language. */
export function guideAuthorUrl(guide: Pick<Guide, "author">, locale: GuideLocale) {
  const agent = agents.find((candidate) => plainName(candidate.fullName) === plainName(guide.author));
  if (!agent) return undefined;
  return `${siteUrl}${locale === "es" ? "/agentes" : "/en/agents"}/${agent.slug}`;
}

/** Article dateModified: updatedAt, or the start of updatedDate in Central time when a draft has no timestamp. */
export function guideModifiedAt(guide: Pick<Guide, "updatedDate" | "updatedAt">) {
  if (guide.updatedAt) return guide.updatedAt;
  const offset = new Intl.DateTimeFormat("en-US", { timeZone: "America/Chicago", timeZoneName: "longOffset" })
    .formatToParts(new Date(`${guide.updatedDate}T12:00:00Z`))
    .find((part) => part.type === "timeZoneName")!.value.replace("GMT", "");
  return `${guide.updatedDate}T00:00:00${offset || "+00:00"}`;
}

export function guideMetadata(guide: Guide, locale: GuideLocale): Metadata {
  const copy = guide[locale];
  const path = guidePath(guide, locale);
  return {
    title: copy.title,
    description: copy.description,
    alternates: { canonical: path, languages: { "es-US": guidePath(guide, "es"), "en-US": guidePath(guide, "en"), "x-default": guidePath(guide, "es") } },
    openGraph: {
      type: "article",
      locale: locale === "es" ? "es_US" : "en_US",
      url: path,
      siteName: organizationRef.name,
      title: copy.title,
      description: copy.description,
      modifiedTime: guideModifiedAt(guide),
      images: [{ url: guideImagePath(guide, locale), ...guideImageSize, alt: copy.h1 }],
    },
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
    image: { "@type": "ImageObject", url: `${siteUrl}${guideImagePath(guide, locale)}`, ...guideImageSize },
    author: { "@type": "Person", name: guide.author, url: guideAuthorUrl(guide, locale) },
    publisher: publisherRef,
    dateModified: guideModifiedAt(guide),
    citation: copy.sources.map((source) => ({ "@type": "CreativeWork", name: source.label, url: source.url })),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
      reviewedBy: { "@type": "Person", name: guide.reviewer },
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
