/**
 * The official public domain. Canonical links, Open Graph URLs, robots.txt,
 * sitemap.xml and structured data all point here, including on the vercel.app
 * production URL and preview deployments, so search engines consolidate every
 * copy of a page onto the official domain.
 */
export const productionSiteUrl = "https://alleanzainsurance.org";

/**
 * Absolute base URL for canonical links, Open Graph tags, robots and sitemap.
 *
 * Resolution order:
 *  1. NEXT_PUBLIC_SITE_URL — explicit override (no trailing slash), e.g. to
 *     validate a local build against a different host.
 *  2. productionSiteUrl — every production build (`next build`), on Vercel or
 *     locally.
 *  3. localhost, for `next dev`.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  if (process.env.NODE_ENV === "production") return productionSiteUrl;

  return "http://localhost:3000";
}

export const siteUrl = resolveSiteUrl();

/** Public Instagram profile for Alleanza Insurance Corp. */
export const instagramProfileUrl = "https://www.instagram.com/alleanzainsurancecorp/";

/** True once a real production domain is configured, rather than the local fallback. */
export const hasPublicSiteUrl = siteUrl.startsWith("https://");

/**
 * Only the Vercel production deployment may be indexed. Preview, development,
 * and a local `next start` copy are noindex even when NODE_ENV is production.
 */
export const isProductionDeploy = process.env.VERCEL_ENV === "production";
