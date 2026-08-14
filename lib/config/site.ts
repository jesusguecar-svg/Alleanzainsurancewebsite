/**
 * Absolute base URL for canonical links, Open Graph tags, robots and sitemap.
 *
 * Resolution order:
 *  1. NEXT_PUBLIC_SITE_URL — set this to the final custom domain once it exists.
 *  2. VERCEL_PROJECT_PRODUCTION_URL — injected by Vercel, the stable production
 *     domain for the project (not the per-deployment preview URL).
 *  3. localhost, for local development.
 *
 * No production domain is hardcoded: an incorrect canonical URL is worse than
 * an absent one, so this must be configured rather than guessed.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}

export const siteUrl = resolveSiteUrl();

/** True once a real production domain is configured, rather than the local fallback. */
export const hasPublicSiteUrl = siteUrl.startsWith("https://");
