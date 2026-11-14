import { externalHrefProblem, internalPath, isInternalHref, linkableSiteRoutes, links, plainText } from "./inline";
import type { Guide, GuideCopy, GuideLocale } from "./types";

const placeholderMark = "TODO-CONTENT";
const slugPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/**
 * Draft markers that must never reach a page. Review notes such as [VERIFY] belong in the pull
 * request description, not in guide text.
 */
export const forbiddenMarkers = ["[VERIFY", "[DISCLOSURE]", "[COMPLIANCE", "TODO", "data/dfw", "Draft — not for publication", "Borrador, no publicar"] as const;

/** Sample text is never public: production builds leave these guides out (see ./index.ts). */
export function isPlaceholderGuide(guide: Guide) {
  return JSON.stringify(guide).includes(placeholderMark);
}

function isPastDate(value: unknown) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value) && date.getTime() <= Date.now();
}

/**
 * Open issues that keep every guide out of production, whatever its content. Empty: the former
 * "english-html-lang" entry was resolved by the locale root layouts (app/(en)/layout.tsx renders
 * <html lang="en">). Add an entry here to pull every guide from production at once.
 */
export const guidePublicationBlockers: readonly string[] = [];

/** Production shows a guide only with no placeholder text, editorial approval and no open blocker. */
export function isPublishableGuide(guide: Guide, blockers: readonly string[] = guidePublicationBlockers) {
  return !isPlaceholderGuide(guide) && Boolean(guide.editorialApprovedDate) && blockers.length === 0;
}

const hasText = (value: unknown) => typeof value === "string" && value.trim().length > 0;

export function guidePathFor(guide: Pick<Guide, "es" | "en">, locale: GuideLocale) {
  return locale === "es" ? `/health/${guide.es.slug}` : `/en/health/${guide.en.slug}`;
}

/** Every inline-text string in one language, for link and marker checks. */
export function inlineStrings(copy: GuideCopy): string[] {
  const strings: string[] = [];
  for (const section of copy.sections ?? []) {
    for (const block of section.blocks ?? []) {
      if (block.type === "paragraph") strings.push(block.text);
      else if (block.type === "list") strings.push(...block.items);
      else if (block.type === "table") strings.push(block.table.caption, ...block.table.columns, ...block.table.rows.flat());
      else if (block.type === "qa") strings.push(block.question, block.answer);
    }
  }
  return strings;
}

function blockErrors(copy: GuideCopy, label: string): string[] {
  const errors: string[] = [];
  if (!copy.sections?.length) return [`${label}: at least one section is required`];
  for (const section of copy.sections) {
    const where = `${label}: section "${section.heading ?? ""}"`;
    if (!hasText(section.heading)) errors.push(`${label}: every section needs a heading`);
    if (!section.blocks?.length) {
      errors.push(`${where} needs content`);
      continue;
    }
    for (const block of section.blocks) {
      if (block.type === "paragraph" && !hasText(block.text)) errors.push(`${where} has an empty paragraph`);
      if (block.type === "list" && (!block.items?.length || !block.items.every(hasText))) errors.push(`${where} has an empty list or list item`);
      if (block.type === "qa" && (!hasText(block.question) || !hasText(block.answer))) errors.push(`${where} has a question without an answer`);
      if (block.type === "table") {
        const { caption, columns, rows } = block.table ?? {};
        if (!hasText(caption)) errors.push(`${where}: tables need a caption`);
        if (!columns?.length || !columns.every(hasText)) errors.push(`${where}: tables need column headings`);
        if (!rows?.length || rows.some((row) => row.length !== columns?.length || !row.every(hasText))) errors.push(`${where}: every table row needs one non-empty cell per column`);
      }
    }
  }
  return errors;
}

function copyErrors(copy: GuideCopy | undefined, label: string): string[] {
  if (!copy) return [`${label}: missing translation`];
  const errors: string[] = [];
  if (!slugPattern.test(copy.slug ?? "")) errors.push(`${label}: slug must be lowercase words joined by hyphens`);
  for (const field of ["title", "description", "h1", "summary"] as const) {
    if (!hasText(copy[field])) errors.push(`${label}: ${field} is required`);
  }
  if ((copy.title ?? "").length > 60) errors.push(`${label}: title is ${copy.title.length} characters (60 at most)`);
  if ((copy.description ?? "").length > 155) errors.push(`${label}: description is ${copy.description.length} characters (155 at most)`);
  if (copy.breadcrumbLabel !== undefined && !hasText(copy.breadcrumbLabel)) errors.push(`${label}: breadcrumbLabel, when set, cannot be empty`);
  if ((copy.summary ?? "") !== plainText(copy.summary ?? "")) errors.push(`${label}: summary must be plain text (no links or bold)`);
  const sentences = (copy.summary ?? "").split(/[.!?]+(?:\s|$)/).filter((part) => part.trim()).length;
  if (sentences < 2 || sentences > 3) errors.push(`${label}: summary has ${sentences} sentence(s) (two or three required)`);
  errors.push(...blockErrors(copy, label));
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
  const serialized = JSON.stringify(copy);
  for (const marker of forbiddenMarkers) {
    if (serialized.includes(marker) && !(marker === "TODO" && serialized.includes(placeholderMark))) errors.push(`${label}: contains the draft marker "${marker}"`);
  }
  return errors;
}

/** Problems with the links in one language, given every guide path that exists. */
function linkErrors(copy: GuideCopy, label: string, guidePaths: ReadonlySet<string>): string[] {
  const errors: string[] = [];
  const routes = new Set<string>(linkableSiteRoutes);
  for (const text of inlineStrings(copy)) {
    for (const { href } of links(text)) {
      if (isInternalHref(href)) {
        const path = internalPath(href);
        if (!routes.has(path) && !guidePaths.has(path)) errors.push(`${label}: link ${href} does not match a site route or guide`);
      } else {
        const problem = externalHrefProblem(href);
        if (problem) errors.push(`${label}: link ${href} ${problem}`);
      }
    }
  }
  return errors;
}

/** Returns every problem in the guide list; an empty list means they can be published. */
export function validateGuides(guides: readonly Guide[]): string[] {
  const errors: string[] = [];
  const ids = new Set(guides.map((guide) => guide.id));
  if (ids.size !== guides.length) errors.push("guide ids must be unique");
  const guidePaths = new Set(guides.flatMap((guide) => (guide.es && guide.en ? [guidePathFor(guide, "es"), guidePathFor(guide, "en")] : [])));
  const byId = new Map(guides.map((guide) => [guide.id, guide]));

  for (const guide of guides) {
    const label = `guide ${guide.id}`;
    errors.push(...copyErrors(guide.es, `${label} (es)`), ...copyErrors(guide.en, `${label} (en)`));
    if (guide.es) errors.push(...linkErrors(guide.es, `${label} (es)`, guidePaths));
    if (guide.en) errors.push(...linkErrors(guide.en, `${label} (en)`, guidePaths));
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
    if (guide.editorialApprovedDate !== undefined && !isPastDate(guide.editorialApprovedDate)) errors.push(`${label}: editorialApprovedDate must be YYYY-MM-DD, not in the future`);
    if (!Array.isArray(guide.relatedGuides)) errors.push(`${label}: relatedGuides is required (it may be empty)`);
    for (const id of guide.relatedGuides ?? []) {
      if (id === guide.id || !ids.has(id)) errors.push(`${label}: related guide ${id} does not exist`);
    }
    if (guide.parentGuideId !== undefined) {
      const parent = byId.get(guide.parentGuideId);
      if (guide.parentGuideId === guide.id || !parent) errors.push(`${label}: parent guide ${guide.parentGuideId} does not exist`);
      else if (parent.parentGuideId !== undefined) errors.push(`${label}: parent guide ${parent.id} has its own parent (one level only)`);
    }
  }

  for (const locale of ["es", "en"] as const) {
    const slugs = guides.map((guide) => guide[locale]?.slug);
    if (new Set(slugs).size !== slugs.length) errors.push(`${locale} slugs must be unique`);
  }
  return errors;
}

/**
 * Links and breadcrumb parents that point at a guide which exists but is not published. Checked on
 * the guides a build actually shows, so production never links to a page that returns 404.
 */
export function unpublishedTargetErrors(published: readonly Guide[], all: readonly Guide[]): string[] {
  const publishedIds = new Set(published.map((guide) => guide.id));
  const hidden = all.filter((guide) => !publishedIds.has(guide.id));
  const hiddenPaths = new Map(hidden.flatMap((guide) => [[guidePathFor(guide, "es"), guide.id], [guidePathFor(guide, "en"), guide.id]] as const));
  const errors: string[] = [];
  for (const guide of published) {
    if (guide.parentGuideId && !publishedIds.has(guide.parentGuideId)) errors.push(`guide ${guide.id}: parent ${guide.parentGuideId} is not published`);
    for (const locale of ["es", "en"] as const) {
      for (const text of inlineStrings(guide[locale])) {
        for (const { href } of links(text)) {
          const target = isInternalHref(href) ? hiddenPaths.get(internalPath(href)) : undefined;
          if (target) errors.push(`guide ${guide.id} (${locale}): links to unpublished guide ${target}`);
        }
      }
    }
  }
  return errors;
}
