import type { MetadataRoute } from "next";
import { isProductionDeploy, siteUrl } from "@/lib/config/site";

/**
 * Crawlers that power search results and user-requested answers. Named so the policy stays explicit;
 * a crawler obeys only the group that names it, so these are unaffected by the training rule below.
 */
const searchCrawlers = [
  "Googlebot",
  "Bingbot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
];

/** Model-training crawlers. Google-Extended stays allowed for OE2027 (management decision). */
const trainingCrawlers = ["GPTBot", "ClaudeBot"];

/**
 * Not for crawlers: form endpoints and the old WordPress admin paths (those answer 403). A crawler
 * obeys only the group that names it, so every allowing group repeats this list.
 */
const privatePaths = ["/api/", "/wp-admin/", "/wp-login.php"];

/**
 * Preview, development, and local production builds must not be indexed.
 * HTML also carries noindex unless VERCEL_ENV is production (see app/layout.tsx).
 */
export default function robots(): MetadataRoute.Robots {
  if (!isProductionDeploy) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [
      { userAgent: searchCrawlers, allow: "/", disallow: privatePaths },
      { userAgent: "Google-Extended", allow: "/", disallow: privatePaths },
      { userAgent: trainingCrawlers, disallow: "/" },
      { userAgent: "*", allow: "/", disallow: privatePaths },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
