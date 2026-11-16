#!/usr/bin/env node
/**
 * Tells Bing (IndexNow) which public URLs are new or changed after a production deploy.
 *
 *   SITE=https://alleanzainsurance.org STATE=.indexnow/state.json node scripts/indexnow-submit.mjs
 *   DRY_RUN=1 ... prints what it would submit.
 *   FETCH_BASE=http://localhost:3100 DRY_RUN=1 ... reads a local production build instead of the live site.
 *
 * - Reads the key from the live key file (/indexnow-key.txt), so no secret is needed where this runs.
 *   The key itself is stored only in the INDEXNOW_KEY variable on Vercel.
 * - Reads every URL in the live sitemap, fetches each page and fingerprints its visible text (scripts,
 *   styles and build ids are ignored, so a redeploy with no content change submits nothing).
 * - Compares with the fingerprints saved in STATE by the previous run: new URLs and URLs whose text
 *   changed are submitted in one POST (IndexNow accepts up to 10,000). Then STATE is updated.
 * - The first run, with no STATE, submits every sitemap URL once.
 * Never fails a deploy: problems are printed and the script exits 0, except for a rejected submission.
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const SITE = (process.env.SITE || "https://alleanzainsurance.org").replace(/\/$/, "");
const STATE = process.env.STATE || ".indexnow/state.json";
const ENDPOINT = process.env.INDEXNOW_ENDPOINT || "https://www.bing.com/indexnow";
const DRY_RUN = process.env.DRY_RUN === "1";
const UA = "alleanza-indexnow/1.0";

const FETCH_BASE = (process.env.FETCH_BASE || SITE).replace(/\/$/, "");
const get = (url) => fetch(url.replace(SITE, FETCH_BASE), { headers: { "user-agent": UA }, redirect: "manual" });

const keyRes = await get(`${SITE}/indexnow-key.txt`);
const key = keyRes.ok ? (await keyRes.text()).trim() : "";
if (!/^[A-Za-z0-9-]{8,128}$/.test(key)) {
  console.log(`IndexNow: no key served at ${SITE}/indexnow-key.txt (status ${keyRes.status}); set INDEXNOW_KEY on Vercel Production. Skipping.`);
  process.exit(0);
}

const sitemap = await (await get(`${SITE}/sitemap.xml`)).text();
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim()).filter((u) => u.startsWith(SITE));
if (!urls.length) {
  console.log("IndexNow: sitemap has no URLs on this host. Skipping.");
  process.exit(0);
}

const visibleText = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const previous = existsSync(STATE) ? JSON.parse(readFileSync(STATE, "utf8")) : {};
const current = {};
const changed = [];
for (const url of urls) {
  const res = await get(url);
  if (res.status !== 200) {
    console.log(`IndexNow: ${url} returned ${res.status}; not submitted.`);
    continue;
  }
  const hash = createHash("sha256").update(visibleText(await res.text())).digest("hex");
  current[url] = hash;
  if (previous[url] !== hash) changed.push(url);
}

console.log(`IndexNow: ${urls.length} sitemap URLs, ${changed.length} new or changed${Object.keys(previous).length ? "" : " (first run: all)"}.`);
for (const url of changed) console.log(`  ${url}`);

if (changed.length && !DRY_RUN) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8", "user-agent": UA },
    body: JSON.stringify({ host: new URL(SITE).host, key, keyLocation: `${SITE}/indexnow-key.txt`, urlList: changed }),
  });
  console.log(`IndexNow: ${ENDPOINT} answered ${res.status}`);
  // 200 = accepted, 202 = accepted, key validation pending. Anything else: keep the old state so the next run retries.
  if (res.status !== 200 && res.status !== 202) process.exit(1);
}
if (!DRY_RUN) {
  mkdirSync(dirname(STATE), { recursive: true });
  writeFileSync(STATE, JSON.stringify(current, null, 1));
}
