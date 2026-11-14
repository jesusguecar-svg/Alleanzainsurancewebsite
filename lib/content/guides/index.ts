import { isProductionDeploy } from "@/lib/config/site";
import carrollton2027 from "./entries/carrollton-2027";
import dallasCounty2027 from "./entries/dallas-county-2027";
import texasMarketplace2027 from "./entries/texas-marketplace-2027";
import texasMarketplace2027Faq from "./entries/texas-marketplace-2027-faq";
import type { Guide, GuideLocale } from "./types";
import { guidePathFor, isPublishableGuide, unpublishedTargetErrors, validateGuides } from "./validate";

export type { Guide, GuideBlock, GuideCopy, GuideLocale, GuideSection, GuideTable } from "./types";

/** Add new guides here. */
export const allGuides: readonly Guide[] = [texasMarketplace2027, dallasCounty2027, texasMarketplace2027Faq, carrollton2027];

// Importing this module during `next build` is what makes a bad guide fail the build.
const problems = validateGuides(allGuides);
if (problems.length) throw new Error(`Invalid guide content:\n- ${problems.join("\n- ")}`);

/** Previews show every guide. Production shows only publishable ones (see ./validate.ts). */
export const guides = allGuides.filter((guide) => !isProductionDeploy || isPublishableGuide(guide));

// A published guide must not link to, or sit under, a guide this build leaves out.
const hiddenTargets = unpublishedTargetErrors(guides, allGuides);
if (hiddenTargets.length) throw new Error(`Published guides point at unpublished guides:\n- ${hiddenTargets.join("\n- ")}`);

export function guidePath(guide: Guide, locale: GuideLocale) {
  return guidePathFor(guide, locale);
}

export const guideIndexPath = { es: "/aprende", en: "/en/learn" } as const;

export function getGuide(locale: GuideLocale, slug: string) {
  return guides.find((guide) => guide[locale].slug === slug);
}

/** The guide this one sits under in the breadcrumb, when that guide is shown in this build. */
export function getParentGuide(guide: Guide) {
  return guide.parentGuideId ? guides.find((other) => other.id === guide.parentGuideId) : undefined;
}

export function breadcrumbLabel(guide: Guide, locale: GuideLocale) {
  return guide[locale].breadcrumbLabel ?? guide[locale].h1;
}

export function formatGuideDate(date: string, locale: GuideLocale) {
  return new Intl.DateTimeFormat(locale === "es" ? "es-US" : "en-US", { dateStyle: "long", timeZone: "UTC" }).format(new Date(date));
}

/** Newest guide update, used as the index pages' lastmod. */
export function latestGuideUpdate() {
  return guides.map((guide) => guide.updatedDate).sort().at(-1);
}
