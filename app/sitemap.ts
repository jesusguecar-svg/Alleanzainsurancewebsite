import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/config/site";
import { portalRoutes } from "@/lib/config/routes";
import { agents } from "@/lib/content/agents";

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
    { url: `${siteUrl}/agentes`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/en/agents`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/en/health`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    ...agents.map((agent) => ({
      url: `${siteUrl}/agentes/${agent.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
    ...agents.map((agent) => ({
      url: `${siteUrl}/en/agents/${agent.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
  ];
}
