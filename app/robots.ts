import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/config/site";

/**
 * Preview and development deployments must not be indexed: duplicate copies of
 * the site competing with production is an SEO problem, and preview URLs are not
 * meant to be public entry points.
 */
const isProduction = process.env.VERCEL_ENV
  ? process.env.VERCEL_ENV === "production"
  : process.env.NODE_ENV === "production";

export default function robots(): MetadataRoute.Robots {
  if (!isProduction) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
