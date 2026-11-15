import assert from "node:assert/strict";
import { test } from "node:test";
import { changedUrls, indexNowBatchSize, indexNowKeyPattern, indexNowPayloads, parseSitemap } from "@/lib/seo/indexnow";

const sitemap = (entries: [string, string?][]) =>
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries
    .map(([loc, lastmod]) => `<url><loc>${loc}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</url>`)
    .join("")}</urlset>`;
const host = "alleanzainsurance.org";

test("parseSitemap reads loc and lastmod, decoding XML entities", () => {
  const entries = parseSitemap(sitemap([["https://alleanzainsurance.org/a?x=1&amp;y=2", "2026-11-14"], ["https://alleanzainsurance.org/b"]]));
  assert.deepEqual(entries, [{ loc: "https://alleanzainsurance.org/a?x=1&y=2", lastmod: "2026-11-14" }, { loc: "https://alleanzainsurance.org/b" }]);
});

test("with a previous sitemap: new URLs and changed lastmod only", () => {
  const previous = parseSitemap(sitemap([["https://alleanzainsurance.org/a", "2026-11-13"], ["https://alleanzainsurance.org/b", "2026-11-01"], ["https://alleanzainsurance.org/gone"]]));
  const current = parseSitemap(sitemap([["https://alleanzainsurance.org/a", "2026-11-14"], ["https://alleanzainsurance.org/b", "2026-11-01"], ["https://alleanzainsurance.org/new"], ["https://other.example/x", "2026-11-14"]]));
  assert.deepEqual(changedUrls(current, host, previous), ["https://alleanzainsurance.org/a", "https://alleanzainsurance.org/new"]);
});

test("without a previous sitemap: lastmod on or after `since`; nothing without a date", () => {
  const current = parseSitemap(sitemap([["https://alleanzainsurance.org/a", "2026-11-14T10:00:00.000Z"], ["https://alleanzainsurance.org/b", "2026-11-01"], ["https://alleanzainsurance.org/c"]]));
  assert.deepEqual(changedUrls(current, host, null, "2026-11-13"), ["https://alleanzainsurance.org/a"]);
  assert.deepEqual(changedUrls(current, host, null), []);
});

test("payloads: batches of at most 10,000 URLs with host, key and keyLocation", () => {
  const urls = Array.from({ length: indexNowBatchSize + 1 }, (_, i) => `https://alleanzainsurance.org/p${i}`);
  const payloads = indexNowPayloads(urls, host, "abcdef1234567890", "https://alleanzainsurance.org/indexnow-key.txt");
  assert.deepEqual(payloads.map((p) => p.urlList.length), [indexNowBatchSize, 1]);
  assert.equal(payloads[0].keyLocation, "https://alleanzainsurance.org/indexnow-key.txt");
});

test("key format", () => {
  assert.ok(indexNowKeyPattern.test("0123456789abcdef0123456789abcdef"));
  assert.ok(!indexNowKeyPattern.test("short"));
  assert.ok(!indexNowKeyPattern.test("has space in it"));
});
