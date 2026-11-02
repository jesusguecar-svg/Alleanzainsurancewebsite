export type GuideLocale = "es" | "en";

export type GuideSection = { heading: string; paragraphs: string[] };
export type GuideFact = { label: string; value: string };
export type GuideSource = { label: string; url: string; /** YYYY-MM-DD */ accessed: string };

/** Everything a reader sees in one language. */
export type GuideCopy = {
  slug: string;
  title: string;
  /** 155 characters at most. */
  description: string;
  h1: string;
  /** Answer-first summary: two or three sentences. */
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
};
