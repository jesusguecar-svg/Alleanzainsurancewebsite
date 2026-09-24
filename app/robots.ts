import type { MetadataRoute } from "next";
import { isProductionDeploy, siteUrl } from "@/lib/config/site";

/**
 * Preview, development, and local production builds must not be indexed.
 * HTML also carries noindex unless VERCEL_ENV is production (see app/layout.tsx).
 */
export default function robots(): MetadataRoute.Robots {
  if (!isProductionDeploy) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
