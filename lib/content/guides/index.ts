import { isProductionDeploy } from "@/lib/config/site";
import carrollton2027 from "./entries/carrollton-2027";
import collinCounty2027 from "./entries/collin-county-2027";
import dallas2027 from "./entries/dallas-2027";
import december15Deadline2027 from "./entries/december-15-deadline-2027";
import dallasCounty2027 from "./entries/dallas-county-2027";
import dentonCounty2027 from "./entries/denton-county-2027";
import tarrantCounty2027 from "./entries/tarrant-county-2027";
import fortWorth2027 from "./entries/fort-worth-2027";
import frisco2027 from "./entries/frisco-2027";
import grandPrairie2027 from "./entries/grand-prairie-2027";
import texasMarketplace2027 from "./entries/texas-marketplace-2027";
import texasMarketplace2027Faq from "./entries/texas-marketplace-2027-faq";
import type { Guide, GuideLocale } from "./types";
import { guidePathFor, hiddenGuidePathsFor, isPublishableGuide, shownParentOf, validateGuides } from "./validate";

export type { Guide, GuideBlock, GuideCopy, GuideLocale, GuideSection, GuideTable } from "./types";

/** Add new guides here. */
export const allGuides: readonly Guide[] = [
  texasMarketplace2027,
  dallasCounty2027,
  texasMarketplace2027Faq,
  carrollton2027,
  // Preview only until approved (no reviewedDate / editorialApprovedDate): production leaves them out.
  tarrantCounty2027,
  collinCounty2027,
  dentonCounty2027,
  dallas2027,
  fortWorth2027,
  grandPrairie2027,
  frisco2027,
  december15Deadline2027,
];

// Importing this module during `next build` is what makes a bad guide fail the build.
const problems = validateGuides(allGuides);
if (problems.length) throw new Error(`Invalid guide content:\n- ${problems.join("\n- ")}`);

/** Previews show every guide. Production shows only publishable ones (see ./validate.ts). */
export const guides = allGuides.filter((guide) => !isProductionDeploy || isPublishableGuide(guide));

/**
 * Paths of guides this build leaves out. Guides may be approved one at a time: links to these render
 * as plain text (components/guides/InlineText.tsx), so production never links to a 404.
 */
export const hiddenGuidePaths = hiddenGuidePathsFor(guides, allGuides);

export function guidePath(guide: Guide, locale: GuideLocale) {
  return guidePathFor(guide, locale);
}

export const guideIndexPath = { es: "/aprende", en: "/en/learn" } as const;

export function getGuide(locale: GuideLocale, slug: string) {
  return guides.find((guide) => guide[locale].slug === slug);
}

/** The guide this one sits under in the breadcrumb, when that guide is shown in this build; otherwise none. */
export function getParentGuide(guide: Guide, shown: readonly Guide[] = guides) {
  return shownParentOf(guide, shown);
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
