import type { MetadataRoute } from "next";
import { contentDates } from "@/lib/config/content-dates";
import { siteUrl } from "@/lib/config/site";
import { activePortalRoutes, companyRoutes, legalRoutes } from "@/lib/config/routes";
import { agents } from "@/lib/content/agents";
import { guideIndexPath, guidePath, guides, latestGuideUpdate } from "@/lib/content/guides";

const dates: Readonly<Record<string, string>> = contentDates;

function entry(path: string): MetadataRoute.Sitemap[number] {
  const lastModified = dates[path];
  return { url: `${siteUrl}${path}`, ...(lastModified ? { lastModified } : {}) };
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl },
    ...activePortalRoutes.filter((route) => !route.external).map((route) => entry(route.href)),
    ...companyRoutes.map((route) => entry(route.href)),
    ...legalRoutes.map((route) => entry(route.href)),
    entry("/en/privacy"),
    entry("/agentes"),
    entry("/en/agents"),
    entry("/en/health"),
    ...agents.map((agent) => entry(`/agentes/${agent.slug}`)),
    ...agents.map((agent) => entry(`/en/agents/${agent.slug}`)),
    ...(guides.length
      ? Object.values(guideIndexPath).map((path) => ({ url: `${siteUrl}${path}`, lastModified: latestGuideUpdate() }))
      : []),
    ...guides.flatMap((guide) => (["es", "en"] as const).map((locale) => ({ url: `${siteUrl}${guidePath(guide, locale)}`, lastModified: guide.updatedDate }))),
  ];
}
