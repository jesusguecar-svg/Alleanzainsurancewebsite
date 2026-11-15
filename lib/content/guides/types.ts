export type GuideLocale = "es" | "en";

/**
 * Inline text. Supports two markers, nothing else:
 *  - `[label](href)`: a link. href is an internal path ("/health", "/en/health/...", optional
 *    "#anchor") or an https URL on an allowlisted host (see ./inline.ts).
 *  - `**bold**`.
 * Anything else renders as plain text.
 */
export type InlineText = string;

export type GuideTable = {
  /** Read by screen readers; also shown above the table. */
  caption: InlineText;
  columns: InlineText[];
  /** Every row has one cell per column; the first cell is the row header. */
  rows: InlineText[][];
};

export type GuideBlock =
  | { type: "paragraph"; text: InlineText }
  | { type: "list"; items: InlineText[]; ordered?: boolean }
  | { type: "table"; table: GuideTable }
  /** A question and its answer (rendered as an <h3> and a paragraph). Never FAQPage markup. */
  | { type: "qa"; question: InlineText; answer: InlineText };

export type GuideSection = { heading: string; blocks: GuideBlock[] };
export type GuideFact = { label: string; value: string };
export type GuideSource = { label: string; url: string; /** YYYY-MM-DD */ accessed: string };

/** Everything a reader sees in one language. */
export type GuideCopy = {
  slug: string;
  /** 60 characters at most. */
  title: string;
  /** 155 characters at most. */
  description: string;
  h1: string;
  /** Short name used in breadcrumbs, when the h1 is long. Defaults to the h1. */
  breadcrumbLabel?: string;
  /** Answer-first summary: two or three sentences, plain text. */
  summary: string;
  sections: GuideSection[];
  keyFacts: GuideFact[];
  /** At least one must be an official (.gov) page. */
  sources: GuideSource[];
};

/** One guide, in both languages: a guide cannot be published in only one. */
export type Guide = {
  id: string;
  es: GuideCopy;
  en: GuideCopy;
  author: string;
  /** The licensed agent's name. No NPN. */
  reviewer: string;
  /** YYYY-MM-DD */
  reviewedDate: string;
  /** YYYY-MM-DD. Becomes the sitemap lastmod and the Article dateModified. */
  updatedDate: string;
  /** YYYY-MM-DD, set only after editorial approval. Without it the guide stays out of production. */
  editorialApprovedDate?: string;
  /** Ids of other guides. May be empty. */
  relatedGuides: string[];
  /** Id of the guide this one sits under in the breadcrumb (Health › Learn › parent › this guide). */
  parentGuideId?: string;
};
