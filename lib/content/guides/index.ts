import { isProductionDeploy } from "@/lib/config/site";
import openEnrollment2027 from "./entries/open-enrollment-2027";
import type { Guide, GuideLocale } from "./types";
import { isPublishableGuide, validateGuides } from "./validate";

export type { Guide, GuideCopy, GuideLocale } from "./types";

/** Add new guides here. */
const allGuides: readonly Guide[] = [openEnrollment2027];

// Importing this module during `next build` is what makes a bad guide fail the build.
const problems = validateGuides(allGuides);
if (problems.length) throw new Error(`Invalid guide content:\n- ${problems.join("\n- ")}`);

/** Previews show every guide. Production shows only publishable ones (see ./validate.ts). */
export const guides = allGuides.filter((guide) => !isProductionDeploy || isPublishableGuide(guide));

export function guidePath(guide: Guide, locale: GuideLocale) {
  return locale === "es" ? `/health/${guide.es.slug}` : `/en/health/${guide.en.slug}`;
}

export const guideIndexPath = { es: "/aprende", en: "/en/learn" } as const;

export function getGuide(locale: GuideLocale, slug: string) {
  return guides.find((guide) => guide[locale].slug === slug);
}

export function formatGuideDate(date: string, locale: GuideLocale) {
  return new Intl.DateTimeFormat(locale === "es" ? "es-US" : "en-US", { dateStyle: "long", timeZone: "UTC" }).format(new Date(date));
}

/** Newest guide update, used as the index pages' lastmod. */
export function latestGuideUpdate() {
  return guides.map((guide) => guide.updatedDate).sort().at(-1);
}
