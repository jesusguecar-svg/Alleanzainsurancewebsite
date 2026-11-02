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
 * Preview, development, and local production builds must not be indexed.
 * HTML also carries noindex unless VERCEL_ENV is production (see app/layout.tsx).
 */
export default function robots(): MetadataRoute.Robots {
  if (!isProductionDeploy) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [
      { userAgent: searchCrawlers, allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: trainingCrawlers, disallow: "/" },
      { userAgent: "*", allow: "/" },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
