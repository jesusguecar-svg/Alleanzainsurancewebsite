#!/usr/bin/env node
/**
 * Post-deploy IndexNow submission (docs/seo/indexnow.md). Run by .github/workflows/indexnow.yml
 * after a successful Production deployment; can also be run by hand.
 *
 *   INDEXNOW_KEY=… node scripts/indexnow-submit.mjs
 *
 * Environment:
 *   INDEXNOW_KEY       required. Never printed.
 *   SITE               default https://alleanzainsurance.org
 *   PREVIOUS_SITEMAP   file with the sitemap of the previous run. When it exists, submits new URLs and
 *                      URLs whose lastmod changed; afterwards the current sitemap is written there.
 *   SINCE              YYYY-MM-DD fallback when there is no previous sitemap (default: two days ago).
 *   URLS               optional, space-separated: submit exactly these URLs instead (manual runs).
 *   DRY_RUN=1          print what would be submitted, send nothing.
 *
 * Safety: refuses to submit unless SITE/indexnow-key.txt serves exactly INDEXNOW_KEY, and only
 * submits URLs on SITE's host.
 */
import { register } from "node:module";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

register("../tests/resolve-hooks.mjs", import.meta.url);
const { changedUrls, indexNowEndpoint, indexNowKeyPath, indexNowKeyPattern, indexNowPayloads, parseSitemap } = await import(
  new URL("../lib/seo/indexnow.ts", import.meta.url).href
);

const key = process.env.INDEXNOW_KEY?.trim() ?? "";
const site = (process.env.SITE || "https://alleanzainsurance.org").replace(/\/$/, "");
const host = new URL(site).host;
const keyLocation = `${site}${indexNowKeyPath}`;
const dryRun = process.env.DRY_RUN === "1";
const fail = (message) => {
  console.error(`indexnow: ${message}`);
  process.exit(1);
};

if (!indexNowKeyPattern.test(key)) fail("INDEXNOW_KEY is missing or not 8-128 characters of a-z, A-Z, 0-9, -");

const served = await fetch(keyLocation, { redirect: "manual" });
if (served.status !== 200 || (await served.text()).trim() !== key) fail(`${keyLocation} does not serve the key (status ${served.status}); nothing submitted`);

const sitemapResponse = await fetch(`${site}/sitemap.xml`);
if (!sitemapResponse.ok) fail(`sitemap.xml returned ${sitemapResponse.status}`);
const sitemapXml = await sitemapResponse.text();
const current = parseSitemap(sitemapXml);

let urls;
if (process.env.URLS) {
  urls = process.env.URLS.split(/\s+/).filter(Boolean).filter((url) => {
    try {
      return new URL(url).host === host;
    } catch {
      return false;
    }
  });
} else {
  const previousPath = process.env.PREVIOUS_SITEMAP;
  const previous = previousPath && existsSync(previousPath) ? parseSitemap(readFileSync(previousPath, "utf8")) : null;
  const since = process.env.SINCE || new Date(Date.now() - 2 * 86_400_000).toISOString().slice(0, 10);
  urls = changedUrls(current, host, previous, since);
  console.log(`indexnow: ${current.length} URLs in sitemap; compared with ${previous ? "the previous sitemap" : `lastmod >= ${since}`}`);
}

console.log(`indexnow: ${urls.length} URL(s) to submit${dryRun ? " (dry run)" : ""}`);
for (const url of urls) console.log(`  ${url}`);

if (!dryRun) {
  for (const payload of indexNowPayloads(urls, host, key, keyLocation)) {
    const response = await fetch(indexNowEndpoint, { method: "POST", headers: { "content-type": "application/json; charset=utf-8" }, body: JSON.stringify(payload) });
    // 200 OK and 202 Accepted are success; 400/403/422/429 are not (indexnow.org/documentation).
    if (response.status !== 200 && response.status !== 202) fail(`IndexNow answered ${response.status} for ${payload.urlList.length} URL(s)`);
    console.log(`indexnow: submitted ${payload.urlList.length} URL(s): HTTP ${response.status}`);
  }
}

if (process.env.PREVIOUS_SITEMAP && !process.env.URLS && !dryRun) {
  mkdirSync(dirname(process.env.PREVIOUS_SITEMAP), { recursive: true });
  writeFileSync(process.env.PREVIOUS_SITEMAP, sitemapXml);
}
