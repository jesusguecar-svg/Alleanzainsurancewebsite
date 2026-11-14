import assert from "node:assert/strict";
import { test } from "node:test";
import { allGuides } from "@/lib/content/guides";
import { links, parseInline, plainText } from "@/lib/content/guides/inline";
import type { Guide } from "@/lib/content/guides/types";
import { forbiddenMarkers, guidePublicationBlockers, inlineStrings, isPublishableGuide, unpublishedTargetErrors, validateGuides } from "@/lib/content/guides/validate";

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

test("release guard: no guide is approved, so production shows none of them", () => {
  // Remove this test, or update it, in the change that records Jesús's editorial approval.
  for (const guide of allGuides) {
    assert.equal(guide.editorialApprovedDate, undefined, `${guide.id} must stay preview-only until the release window`);
    assert.equal(isPublishableGuide(guide), false);
  }
  assert.deepEqual([...guidePublicationBlockers], []);
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

test("a published guide may not link to, or sit under, an unpublished guide", () => {
  const carrollton = allGuides.find((guide) => guide.id === "carrollton-2027")!;
  const errors = unpublishedTargetErrors([carrollton], allGuides);
  assert.ok(errors.some((e) => e.includes("parent texas-marketplace-2027 is not published")));
  assert.ok(errors.some((e) => e.includes("links to unpublished guide")));
  assert.deepEqual(unpublishedTargetErrors(allGuides, allGuides), []);
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
