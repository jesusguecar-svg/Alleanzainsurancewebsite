import assert from "node:assert/strict";
import { test } from "node:test";
import { allGuides, guidePath } from "@/lib/content/guides";
import { guideArticleSchema, guideBreadcrumbSchema, guideMetadata } from "@/lib/seo/guides";

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
