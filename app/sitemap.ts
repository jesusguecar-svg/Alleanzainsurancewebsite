import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/config/site";
import { portalRoutes } from "@/lib/config/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: siteUrl, lastModified, changeFrequency: "monthly", priority: 1 },
    ...portalRoutes.map((route) => ({
      url: `${siteUrl}${route.href}`,
      lastModified,
      changeFrequency: "monthly" as const,
      // Completed spokes outrank the shells still in preparation.
      priority: route.complete ? 0.9 : 0.5,
    })),
  ];
}
