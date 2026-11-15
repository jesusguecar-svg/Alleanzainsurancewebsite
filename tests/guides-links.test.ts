import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { test } from "node:test";
import { allGuides } from "@/lib/content/guides";
import { externalHrefProblem, internalPath, isInternalHref, linkableSiteRoutes, links } from "@/lib/content/guides/inline";
import { guidePathFor, inlineStrings } from "@/lib/content/guides/validate";

const root = new URL("../", import.meta.url);

/** The page file that serves a route: Spanish routes live in app/(es), English ones in app/(en). */
function pageFileFor(route: string) {
  const group = route === "/en" || route.startsWith("/en/") ? "(en)" : "(es)";
  const segments = route === "/" ? "" : route.slice(1);
  return new URL(`app/${group}/${segments ? `${segments}/` : ""}page.tsx`, root);
}

test("every linkable site route has a page file", () => {
  for (const route of linkableSiteRoutes) assert.ok(existsSync(pageFileFor(route)), `${route} → ${pageFileFor(route).pathname}`);
});

test("guide routes are served by the dynamic health routes", () => {
  assert.ok(existsSync(new URL("app/(es)/health/[slug]/page.tsx", root)));
  assert.ok(existsSync(new URL("app/(en)/en/health/[slug]/page.tsx", root)));
});

test("every internal link in a guide resolves to a site route or a guide; external links are allowlisted https", () => {
  const guidePaths = new Set(allGuides.flatMap((guide) => [guidePathFor(guide, "es"), guidePathFor(guide, "en")]));
  const routes = new Set<string>(linkableSiteRoutes);
  for (const guide of allGuides) {
    for (const locale of ["es", "en"] as const) {
      for (const text of inlineStrings(guide[locale])) {
        for (const { href } of links(text)) {
          if (isInternalHref(href)) {
            const path = internalPath(href);
            assert.ok(routes.has(path) || guidePaths.has(path), `${guide.id} (${locale}): ${href}`);
            // English pages link to English routes, Spanish pages to Spanish ones.
            const isEnglishPath = path === "/en" || path.startsWith("/en/");
            assert.equal(isEnglishPath, locale === "en", `${guide.id} (${locale}) links across languages: ${href}`);
          } else {
            assert.equal(externalHrefProblem(href), null, `${guide.id} (${locale}): ${href}`);
          }
        }
      }
    }
  }
});

test("no guide links to /contacto (the guide's own form sits below the article)", () => {
  for (const guide of allGuides) assert.ok(!JSON.stringify(guide).includes("](/contacto"), guide.id);
});

test("related guides and parents form the planned structure", () => {
  const byId = new Map(allGuides.map((guide) => [guide.id, guide]));
  assert.equal(byId.get("texas-marketplace-2027")?.parentGuideId, undefined);
  for (const id of ["dallas-county-2027", "texas-marketplace-2027-faq", "carrollton-2027"]) assert.equal(byId.get(id)?.parentGuideId, "texas-marketplace-2027", id);
  for (const guide of allGuides) assert.equal(guide.relatedGuides.length, allGuides.length - 1, guide.id);
});
