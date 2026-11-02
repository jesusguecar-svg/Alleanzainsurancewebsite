/**
 * Dates a page's content really changed, for sitemap.xml and the legal pages' "Última
 * actualización". Update the date when you change that page's content. A route with no entry
 * has no lastmod, which is better than a date that only says when the site was last built.
 */
export const contentDates = {
  "/privacidad": "2026-11-01",
  "/en/privacy": "2026-11-01",
  "/terminos": "2026-09-16",
  "/licencias": "2026-10-28",
} as const;

export function formatContentDate(date: string) {
  return new Intl.DateTimeFormat("es-US", { dateStyle: "long", timeZone: "UTC" }).format(new Date(date));
}
