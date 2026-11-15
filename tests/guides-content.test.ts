import assert from "node:assert/strict";
import { test } from "node:test";
import { allGuides } from "@/lib/content/guides";
import { internalPath, isInternalHref, linkableSiteRoutes, links, parseInline, plainText, renderedTokens } from "@/lib/content/guides/inline";
import type { Guide } from "@/lib/content/guides/types";
import { forbiddenMarkers, guidePathFor, guidePublicationBlockers, hiddenGuidePathsFor, inlineStrings, isPublishableGuide, shownParentOf, shownRelatedOf, validateGuides } from "@/lib/content/guides/validate";
import { guideBreadcrumbSchema } from "@/lib/seo/guides";
import { siteUrl } from "@/lib/config/site";

const clone = (guide: Guide): Guide => JSON.parse(JSON.stringify(guide));

test("the registered guides pass validation", () => {
  assert.deepEqual(validateGuides(allGuides), []);
  assert.equal(allGuides.length, 4);
});

test("no draft markers, titles ≤60, descriptions ≤155, summaries of 2–3 plain sentences", () => {
  for (const guide of allGuides) {
    for (const locale of ["es", "en"] as const) {
      const copy = guide[locale];
      const label = `${guide.id} (${locale})`;
      const serialized = JSON.stringify(copy);
      for (const marker of forbiddenMarkers) assert.ok(!serialized.includes(marker), `${label} contains ${marker}`);
      assert.ok(copy.title.length <= 60, `${label} title ${copy.title.length}`);
      assert.ok(copy.description.length <= 155, `${label} description ${copy.description.length}`);
      assert.equal(copy.summary, plainText(copy.summary), `${label} summary has markup`);
      const sentences = copy.summary.split(/[.!?]+(?:\s|$)/).filter((part) => part.trim()).length;
      assert.ok(sentences >= 2 && sentences <= 3, `${label} summary has ${sentences} sentences`);
    }
  }
});

test("each guide has matching EN/ES structure and an official source", () => {
  for (const guide of allGuides) {
    assert.equal(guide.es.sections.length, guide.en.sections.length, guide.id);
    assert.equal(guide.es.keyFacts.length, guide.en.keyFacts.length, guide.id);
    for (const locale of ["es", "en"] as const) {
      assert.ok(guide[locale].sources.some((source) => new URL(source.url).hostname.endsWith(".gov")), `${guide.id} (${locale}) .gov source`);
      // Every link cited in the text appears in the Sources list.
      const cited = new Set(inlineStrings(guide[locale]).flatMap((text) => links(text).map((link) => link.href)).filter((href) => href.startsWith("https://")));
      const listed = new Set(guide[locale].sources.map((source) => source.url));
      for (const href of cited) assert.ok(listed.has(href), `${guide.id} (${locale}) cites ${href} without listing it`);
    }
  }
});

test("release: the four guides were approved together on 2026-11-14 and are publishable", () => {
  // Approved by Jesús Esteban Guerra as reviewer, excluding immigration content (see the next test).
  for (const guide of allGuides) {
    assert.equal(guide.editorialApprovedDate, "2026-11-14", guide.id);
    assert.equal(isPublishableGuide(guide), true, guide.id);
  }
  assert.deepEqual([...guidePublicationBlockers], []);
});

test("no immigration-status interpretation: only the neutral pointer to the official immigrant pages", () => {
  // Approval excluded immigration content. Guides may say savings depend on immigration status and link
  // the official page; they must not say which statuses qualify.
  const interpretation = /\bLPRs?\b|green card|\bCOFA\b|Compact of Free Association|Pacto de Libre Asociación|cuban|haitian|cubanas?|haitianas?|undocumented|indocumentad|lawfully present|presencia legal|\bTPS\b|asyl|asilad|\basilo\b|refugee|refugiad|residentes? permanentes?/i;
  const pointer = { en: "https://www.healthcare.gov/immigrants/", es: "https://www.cuidadodesalud.gov/es/immigrants/" } as const;
  for (const guide of allGuides) {
    for (const locale of ["es", "en"] as const) {
      const serialized = JSON.stringify(guide[locale]);
      assert.doesNotMatch(serialized, interpretation, `${guide.id} (${locale})`);
      for (const old of ["/immigrants/coverage/", "/immigrants/lawfully-present-immigrants/"]) assert.ok(!serialized.includes(old), `${guide.id} (${locale}) ${old}`);
      // Any mention of immigration comes with the official page in the right language.
      if (/immigra|migratori/i.test(serialized)) assert.ok(serialized.includes(pointer[locale]), `${guide.id} (${locale}) mentions immigration without the official page`);
    }
  }
});

test("the validator rejects draft markers, long titles, bad links and bad parents", () => {
  const base = allGuides.find((guide) => guide.id === "carrollton-2027")!;
  const withText = (text: string) => {
    const guide = clone(base);
    guide.en.sections[0].blocks.push({ type: "paragraph", text });
    return validateGuides([...allGuides.filter((g) => g.id !== base.id), guide]);
  };
  assert.ok(withText("Check this [VERIFY: carrier].").some((e) => e.includes('"[VERIFY"')));
  assert.ok(withText("See [Tarrant](/en/health/tarrant-county-health-insurance-2027).").some((e) => e.includes("does not match a site route or guide")));
  assert.ok(withText("See [us](/contacto).").some((e) => e.includes("/contacto")));
  assert.ok(withText("See [x](http://www.healthcare.gov/).").some((e) => e.includes("must use https")));
  assert.ok(withText("See [x](https://example.com/).").some((e) => e.includes("allowlist")));
  // A valid internal link with an anchor and an allowlisted https link pass the validator.
  assert.deepEqual(withText("See [the Texas guide](/en/health/texas-marketplace-2027#key-dates-for-2027) and [HealthCare.gov](https://www.healthcare.gov/)."), []);

  const longTitle = clone(base);
  longTitle.es.title = "x".repeat(61);
  assert.ok(validateGuides([...allGuides.filter((g) => g.id !== base.id), longTitle]).some((e) => e.includes("title is 61 characters")));

  const badParent = clone(base);
  badParent.parentGuideId = "nope";
  assert.ok(validateGuides([...allGuides.filter((g) => g.id !== base.id), badParent]).some((e) => e.includes("parent guide nope does not exist")));
});

/** Every non-empty set of approved guides (15 for 4 guides). */
const approvalSets = (): Guide[][] =>
  Array.from({ length: 2 ** allGuides.length - 1 }, (_, mask) => allGuides.filter((_, index) => ((mask + 1) >> index) & 1));

test("partial approval: a production build showing only some guides links to no unpublished guide", () => {
  const routes = new Set<string>(linkableSiteRoutes);
  for (const shown of approvalSets()) {
    const set = shown.map((guide) => guide.id).join("+");
    // What index.ts does at build time: validate everything, then show the approved subset. No throw.
    assert.deepEqual(validateGuides(allGuides), [], set);
    const hidden = hiddenGuidePathsFor(shown, allGuides);
    const shownPaths = new Set(shown.flatMap((guide) => [guidePathFor(guide, "es"), guidePathFor(guide, "en")]));
    for (const guide of shown) {
      for (const locale of ["es", "en"] as const) {
        const where = `${set}: ${guide.id} (${locale})`;
        for (const text of inlineStrings(guide[locale])) {
          const tokens = renderedTokens(text, hidden);
          // The reader still sees every word: an unlinked guide link keeps its label.
          assert.equal(tokens.map((token) => (token.kind === "link" ? token.label : token.text)).join(""), plainText(text), where);
          for (const token of tokens) {
            if (token.kind !== "link" || !isInternalHref(token.href)) continue;
            const path = internalPath(token.href);
            assert.ok(routes.has(path) || shownPaths.has(path), `${where} links to ${token.href}, which this build does not serve`);
          }
        }
        // Visible breadcrumb parent and JSON-LD breadcrumb: an unpublished parent is left out.
        const parent = shownParentOf(guide, shown);
        if (parent) assert.ok(shown.includes(parent), where);
        const crumbs = guideBreadcrumbSchema(guide, locale, shown).itemListElement;
        assert.equal(crumbs.length, parent ? 4 : 3, where);
        assert.deepEqual(crumbs.map((item) => item.position), crumbs.map((_, index) => index + 1), where);
        for (const item of crumbs) assert.ok(!hidden.has(item.item.slice(siteUrl.length)), `${where} breadcrumb points at ${item.item}`);
        for (const other of shownRelatedOf(guide, shown)) assert.ok(shown.includes(other) && other !== guide, where);
      }
    }
  }
});

test("partial approval: the review's three cases degrade instead of failing", () => {
  const byId = new Map(allGuides.map((guide) => [guide.id, guide]));
  const pick = (...ids: string[]) => ids.map((id) => byId.get(id)!);
  const unlinkedCount = (shown: Guide[]) => {
    const hidden = hiddenGuidePathsFor(shown, allGuides);
    return shown.flatMap((guide) => [...inlineStrings(guide.es), ...inlineStrings(guide.en)])
      .reduce((count, text) => count + links(text).filter((link) => isInternalHref(link.href) && hidden.has(internalPath(link.href))).length, 0);
  };
  // Texas only, and Texas + Dallas: links to the left-out guides become plain text.
  assert.ok(unlinkedCount(pick("texas-marketplace-2027")) > 0);
  assert.ok(unlinkedCount(pick("texas-marketplace-2027", "dallas-county-2027")) > 0);
  // Carrollton alone: its Texas parent is dropped from the breadcrumb.
  const carrollton = byId.get("carrollton-2027")!;
  const alone = pick("carrollton-2027");
  assert.equal(shownParentOf(carrollton, alone), undefined);
  assert.deepEqual(guideBreadcrumbSchema(carrollton, "en", alone).itemListElement.map((item) => item.name), ["Health", "Learn", "Carrollton"]);
  assert.deepEqual(shownRelatedOf(carrollton, alone), []);
  // With every guide shown, nothing is unlinked.
  assert.equal(unlinkedCount([...allGuides]), 0);
});

test("inline parser: links and bold only", () => {
  assert.deepEqual(parseInline("A [b](/health) and **c**."), [
    { kind: "text", text: "A " },
    { kind: "link", label: "b", href: "/health" },
    { kind: "text", text: " and " },
    { kind: "bold", text: "c" },
    { kind: "text", text: "." },
  ]);
  assert.equal(plainText("See [HealthCare.gov](https://www.healthcare.gov/) **now**"), "See HealthCare.gov now");
});
