/**
 * The guide inline-text format: `[label](href)` links and `**bold**`, nothing else.
 * Parsing lives here (not in the component) so the validator and tests use the same rules.
 */

export type InlineToken =
  | { kind: "text"; text: string }
  | { kind: "bold"; text: string }
  | { kind: "link"; label: string; href: string };

/** Hosts a guide may link to. Official sources plus the reference sources cited in the guides. */
export const allowedLinkHosts = [
  "healthcare.gov",
  "cuidadodesalud.gov",
  "cms.gov",
  "download.cms.gov",
  "medicaid.gov",
  "tdi.texas.gov",
  "hhs.texas.gov",
  "yourtexasbenefits.com",
  "irs.gov",
  "dol.gov",
  "census.gov",
  "www2.census.gov",
  "kff.org",
] as const;

/**
 * Site routes (outside the guides) that guide text may link to. Kept explicit so a typo or a page
 * that does not exist fails the build; tests/guides-links.test.ts checks each one has a page file.
 */
export const linkableSiteRoutes = [
  "/",
  "/health",
  "/en/health",
  "/life",
  "/employers",
  // Not "/contacto": a guide's own contact form sits below the article, and guides must not send
  // readers away from it (scripts/validate-migration.mjs checks this on the rendered page).
  "/agentes",
  "/en/agents",
  "/aprende",
  "/en/learn",
  "/licencias",
  "/nosotros",
  "/privacidad",
  "/en/privacy",
] as const;

const tokenPattern = /\[([^\]\n]+)\]\(([^)\s]+)\)|\*\*([^*\n]+)\*\*/g;

export function parseInline(text: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  let last = 0;
  for (const match of text.matchAll(tokenPattern)) {
    const index = match.index ?? 0;
    if (index > last) tokens.push({ kind: "text", text: text.slice(last, index) });
    if (match[1] !== undefined) tokens.push({ kind: "link", label: match[1], href: match[2] });
    else tokens.push({ kind: "bold", text: match[3] });
    last = index + match[0].length;
  }
  if (last < text.length) tokens.push({ kind: "text", text: text.slice(last) });
  return tokens;
}

/** The text a reader sees, without markers. */
export function plainText(text: string): string {
  return parseInline(text)
    .map((token) => (token.kind === "link" ? token.label : token.text))
    .join("");
}

export function links(text: string): { label: string; href: string }[] {
  return parseInline(text).flatMap((token) => (token.kind === "link" ? [{ label: token.label, href: token.href }] : []));
}

export function isInternalHref(href: string) {
  return href.startsWith("/") && !href.startsWith("//");
}

/** Path part of an internal href, without "#anchor" or "?query". */
export function internalPath(href: string) {
  return href.split(/[?#]/)[0] || "/";
}

/** null when allowed, otherwise the reason. Internal paths are checked against routes separately. */
export function externalHrefProblem(href: string): string | null {
  if (!URL.canParse(href)) return "is not a valid URL";
  const url = new URL(href);
  if (url.protocol !== "https:") return "must use https";
  const host = url.hostname.toLowerCase();
  const allowed = allowedLinkHosts.some((allowedHost) => host === allowedHost || host.endsWith(`.${allowedHost}`));
  return allowed ? null : `host ${host} is not in the guide link allowlist`;
}
