import type { Guide, GuideCopy } from "./types";

const placeholderMark = "TODO-CONTENT";
const slugPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** Sample text is never public: production builds leave these guides out (see ./index.ts). */
export function isPlaceholderGuide(guide: Guide) {
  return JSON.stringify(guide).includes(placeholderMark);
}

function isPastDate(value: unknown) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value) && date.getTime() <= Date.now();
}

const hasText = (value: unknown) => typeof value === "string" && value.trim().length > 0;

function copyErrors(copy: GuideCopy | undefined, label: string): string[] {
  if (!copy) return [`${label}: missing translation`];
  const errors: string[] = [];
  if (!slugPattern.test(copy.slug ?? "")) errors.push(`${label}: slug must be lowercase words joined by hyphens`);
  for (const field of ["title", "description", "h1", "summary"] as const) {
    if (!hasText(copy[field])) errors.push(`${label}: ${field} is required`);
  }
  if ((copy.description ?? "").length > 155) errors.push(`${label}: description is ${copy.description.length} characters (155 at most)`);
  const sentences = (copy.summary ?? "").split(/[.!?]+(?:\s|$)/).filter((part) => part.trim()).length;
  if (sentences < 2 || sentences > 3) errors.push(`${label}: summary has ${sentences} sentence(s) (two or three required)`);
  if (!copy.sections?.length || copy.sections.some((section) => !hasText(section.heading) || !section.paragraphs?.length || !section.paragraphs.every(hasText))) {
    errors.push(`${label}: sections need a heading and text`);
  }
  if (!copy.keyFacts?.length || copy.keyFacts.some((fact) => !hasText(fact.label) || !hasText(fact.value))) {
    errors.push(`${label}: keyFacts table needs at least one complete row`);
  }
  const sources = copy.sources ?? [];
  if (!sources.length) errors.push(`${label}: at least one source is required`);
  for (const source of sources) {
    if (!hasText(source.label)) errors.push(`${label}: source ${source.url} needs a label`);
    if (!isPastDate(source.accessed)) errors.push(`${label}: source ${source.url} needs an access date (YYYY-MM-DD, not in the future)`);
    if (!URL.canParse(source.url) || new URL(source.url).protocol !== "https:") errors.push(`${label}: source ${source.url} must be an https URL`);
  }
  if (sources.length && !sources.some((source) => URL.canParse(source.url) && new URL(source.url).hostname.endsWith(".gov"))) {
    errors.push(`${label}: at least one source must be an official .gov URL`);
  }
  return errors;
}

/** Returns every problem in the guide list; an empty list means they can be published. */
export function validateGuides(guides: readonly Guide[]): string[] {
  const errors: string[] = [];
  const ids = new Set(guides.map((guide) => guide.id));
  if (ids.size !== guides.length) errors.push("guide ids must be unique");

  for (const guide of guides) {
    const label = `guide ${guide.id}`;
    errors.push(...copyErrors(guide.es, `${label} (es)`), ...copyErrors(guide.en, `${label} (en)`));
    if (guide.es && guide.en) {
      for (const list of ["sections", "keyFacts"] as const) {
        if (guide.es[list]?.length !== guide.en[list]?.length) errors.push(`${label}: ${list} differ between languages`);
      }
    }
    if (!hasText(guide.author)) errors.push(`${label}: author is required`);
    if (!hasText(guide.reviewer)) errors.push(`${label}: reviewer is required`);
    if (/\d/.test(guide.reviewer ?? "")) errors.push(`${label}: reviewer must be a name only`);
    if (/\bNPN\b/i.test(JSON.stringify(guide))) errors.push(`${label}: NPNs are not published`);
    if (!isPastDate(guide.reviewedDate)) errors.push(`${label}: reviewedDate must be YYYY-MM-DD, not in the future`);
    if (!isPastDate(guide.updatedDate)) errors.push(`${label}: updatedDate must be YYYY-MM-DD, not in the future`);
    if (!Array.isArray(guide.relatedGuides)) errors.push(`${label}: relatedGuides is required (it may be empty)`);
    for (const id of guide.relatedGuides ?? []) {
      if (id === guide.id || !ids.has(id)) errors.push(`${label}: related guide ${id} does not exist`);
    }
  }

  for (const locale of ["es", "en"] as const) {
    const slugs = guides.map((guide) => guide[locale]?.slug);
    if (new Set(slugs).size !== slugs.length) errors.push(`${locale} slugs must be unique`);
  }
  return errors;
}
