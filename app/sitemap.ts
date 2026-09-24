import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/config/site";
import { portalRoutes } from "@/lib/config/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: siteUrl, lastModified, changeFrequency: "monthly", priority: 1 },
    ...portalRoutes
      .filter((route) => !route.external)
      .map((route) => ({
        url: `${siteUrl}${route.href}`,
        lastModified,
        changeFrequency: "monthly" as const,
        priority: route.complete ? 0.9 : 0.5,
      })),
    ...["/privacidad", "/terminos", "/licencias"].map((path) => ({
      url: `${siteUrl}${path}`,
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
