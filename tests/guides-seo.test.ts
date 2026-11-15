import assert from "node:assert/strict";
import { test } from "node:test";
import { allGuides, guidePath } from "@/lib/content/guides";
import { centralDateTime } from "@/lib/content/guides/dates";
import { siteUrl } from "@/lib/config/site";
import { guideArticleSchema, guideBreadcrumbSchema, guideImage, guideMetadata } from "@/lib/seo/guides";

// In tests (not a production deploy) every guide is shown, so parents and paths resolve.

test("canonical is the page itself; hreflang pairs are reciprocal with x-default = Spanish", () => {
  for (const guide of allGuides) {
    const es = guideMetadata(guide, "es");
    const en = guideMetadata(guide, "en");
    assert.equal(es.alternates?.canonical, guidePath(guide, "es"));
    assert.equal(en.alternates?.canonical, guidePath(guide, "en"));
    const expected = { "es-US": guidePath(guide, "es"), "en-US": guidePath(guide, "en"), "x-default": guidePath(guide, "es") };
    assert.deepEqual(es.alternates?.languages, expected, guide.id);
    assert.deepEqual(en.alternates?.languages, expected, guide.id);
    assert.equal(es.title, guide.es.title);
    assert.equal(en.description, guide.en.description);
  }
});

test("structured data is Article and BreadcrumbList only: no FAQPage, Offer or Product", () => {
  for (const guide of allGuides) {
    for (const locale of ["es", "en"] as const) {
      const nodes = [guideArticleSchema(guide, locale), guideBreadcrumbSchema(guide, locale)];
      assert.deepEqual(nodes.map((node) => node["@type"]), ["Article", "BreadcrumbList"]);
      const serialized = JSON.stringify(nodes);
      for (const forbidden of ["FAQPage", "Offer", "Product", "GovernmentService", "AggregateRating"]) assert.ok(!serialized.includes(forbidden), `${guide.id} ${forbidden}`);
      const article = nodes[0] as ReturnType<typeof guideArticleSchema>;
      assert.equal(article.publisher["@type"], "InsuranceAgency");
      assert.equal(article.inLanguage, `${locale}-US`);
      assert.equal(article.mainEntityOfPage.reviewedBy.name, guide.reviewer);
      // Article citation lists the page's Sources, in order.
      assert.deepEqual(article.citation.map((item) => item.url), guide[locale].sources.map((source) => source.url));
    }
  }
});

test("breadcrumbs: Health › Learn › (parent) › guide, using breadcrumb labels", () => {
  const byId = new Map(allGuides.map((guide) => [guide.id, guide]));
  const names = (id: string, locale: "es" | "en") => guideBreadcrumbSchema(byId.get(id)!, locale).itemListElement.map((item) => item.name);
  assert.deepEqual(names("texas-marketplace-2027", "en"), ["Health", "Learn", "Texas Marketplace 2027"]);
  assert.deepEqual(names("carrollton-2027", "en"), ["Health", "Learn", "Texas Marketplace 2027", "Carrollton"]);
  assert.deepEqual(names("dallas-county-2027", "es"), ["Salud", "Aprende", "Marketplace de Texas 2027", "Condado de Dallas"]);
  const crumbs = guideBreadcrumbSchema(byId.get("texas-marketplace-2027-faq")!, "es").itemListElement;
  assert.ok(crumbs.at(-1)!.item.endsWith(guidePath(byId.get("texas-marketplace-2027-faq")!, "es")));
  assert.deepEqual(crumbs.map((item) => item.position), [1, 2, 3, 4]);
});

test("dates: a guide day is local midnight in Central time, with the daylight-saving offset", () => {
  assert.equal(centralDateTime("2026-11-14"), "2026-11-14T00:00:00-06:00");
  assert.equal(centralDateTime("2026-07-01"), "2026-07-01T00:00:00-05:00");
  // 2026 changes: 8 March (spring forward at 02:00) and 1 November (fall back at 02:00).
  assert.equal(centralDateTime("2026-03-07"), "2026-03-07T00:00:00-06:00");
  assert.equal(centralDateTime("2026-03-08"), "2026-03-08T00:00:00-06:00");
  assert.equal(centralDateTime("2026-03-09"), "2026-03-09T00:00:00-05:00");
  assert.equal(centralDateTime("2026-11-01"), "2026-11-01T00:00:00-05:00");
  assert.equal(centralDateTime("2026-11-02"), "2026-11-02T00:00:00-06:00");
  assert.throws(() => centralDateTime("2026-11-14T00:00:00Z"));
});

test("Article: full datetime with offset, author and reviewer link to the agent profile, image set", () => {
  for (const guide of allGuides) {
    for (const locale of ["es", "en"] as const) {
      const article = guideArticleSchema(guide, locale);
      assert.match(article.dateModified, /^\d{4}-\d{2}-\d{2}T00:00:00-0[56]:00$/);
      // Same day as the sitemap lastmod (updatedDate).
      assert.ok(article.dateModified.startsWith(`${guide.updatedDate}T`), guide.id);
      assert.ok(!("datePublished" in article));
      const profile = `${siteUrl}${locale === "es" ? "/agentes" : "/en/agents"}/jesus-esteban-guerra`;
      assert.equal(article.author.url, profile);
      assert.equal(article.mainEntityOfPage.reviewedBy.url, profile);
      assert.equal(article.image.url, guideImage[locale].url);
      assert.ok(article.image.width >= 1200);
      const og = guideMetadata(guide, locale).openGraph as { modifiedTime?: string; images?: { url: string }[] };
      assert.equal(og.modifiedTime, article.dateModified);
      assert.equal(og.images?.[0]?.url, article.image.url);
    }
  }
});
