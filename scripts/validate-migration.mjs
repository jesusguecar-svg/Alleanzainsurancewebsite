#!/usr/bin/env node
/**
 * Validates the alleanzainsurance.org migration against a running site.
 *
 *   npm run build && VERCEL_ENV=production npm start -- -p 3100
 *   BASE_URL=http://localhost:3100 npm run validate:migration
 *
 * After cutover:  BASE_URL=https://alleanzainsurance.org npm run validate:migration
 * Protected preview: also set VALIDATE_COOKIE (for example, the cookie a Vercel share link sets)
 * and EXPECT_INDEXABLE=0.
 *
 * Checks legacy redirects (permanent, single hop, no loops, intended destination), canonical
 * and Open Graph URLs, structured data, sitemap, robots.txt, internal links and in-page
 * anchors, and form validation (requests that are rejected before anything is sent).
 * Exits non-zero on any failure.
 */
import { readFileSync } from "node:fs";

const BASE = (process.env.BASE_URL || "http://localhost:3100").replace(/\/$/, "");
const CANONICAL = (process.env.EXPECT_CANONICAL || "https://alleanzainsurance.org").replace(/\/$/, "");
const EXPECT_INDEXABLE = process.env.EXPECT_INDEXABLE !== "0";
const legacy = JSON.parse(readFileSync(new URL("../lib/config/legacy-redirects.json", import.meta.url), "utf8"));

let failures = 0;
let passes = 0;
const warnings = [];
const pass = (msg) => { passes++; if (process.env.VERBOSE) console.log(`ok    ${msg}`); };
const fail = (msg) => { failures++; console.log(`FAIL  ${msg}`); };
const check = (cond, msg) => (cond ? pass(msg) : fail(msg));

// Optional Cookie header, e.g. a Vercel share-link cookie to validate a protected preview.
const COOKIE = process.env.VALIDATE_COOKIE;

async function get(path, init = {}) {
  const headers = COOKIE ? { cookie: COOKIE, ...init.headers } : init.headers;
  return fetch(path.startsWith("http") ? path : BASE + path, { redirect: "manual", ...init, headers });
}

/** Follow redirects by hand so every hop is visible. */
async function chain(path) {
  const hops = [];
  const seen = new Set();
  let url = BASE + path;
  for (let i = 0; i < 8; i++) {
    if (seen.has(url)) return { hops, loop: true };
    seen.add(url);
    const res = await get(url);
    const location = res.headers.get("location");
    hops.push({ url, status: res.status, location });
    if (res.status >= 300 && res.status < 400 && location) {
      url = new URL(location, url).href;
      continue;
    }
    return { hops, loop: false, final: res };
  }
  return { hops, loop: true };
}

const pathOf = (url) => { const u = new URL(url); return u.pathname + u.search; };

// ---------------------------------------------------------------- legacy redirects
console.log(`Validating ${BASE} (expected canonical host ${CANONICAL})\n`);
for (const { source, destination } of legacy.redirects) {
  const [destPath, destHash] = destination.split("#");
  for (const variant of [source, source + "/"]) {
    if (variant.endsWith(".xml/")) continue;
    const r = await chain(variant);
    const label = `redirect ${variant} -> ${destination}`;
    if (r.loop) { fail(`${label}: redirect loop ${r.hops.map((h) => h.url).join(" -> ")}`); continue; }
    const first = r.hops[0];
    check([301, 308].includes(first.status), `${label}: first hop is permanent (got ${first.status})`);
    check(r.hops.length - 1 <= 1, `${label}: single hop (got ${r.hops.length - 1})`);
    check(r.final?.status === 200, `${label}: final status 200 (got ${r.final?.status})`);
    check(pathOf(r.hops.at(-1).url) === destPath, `${label}: lands on ${destPath} (got ${pathOf(r.hops.at(-1).url)})`);
    if (destHash) {
      const lastLocation = r.hops.at(-2)?.location || "";
      check(lastLocation.endsWith(`#${destHash}`), `${label}: keeps #${destHash} (Location: ${lastLocation})`);
    }
  }
}
for (const { path } of legacy.pages) {
  for (const variant of path === "/" ? ["/"] : [path, path + "/"]) {
    const r = await chain(variant);
    check(!r.loop && r.final?.status === 200 && pathOf(r.hops.at(-1).url) === path && r.hops.length <= 2,
      `legacy page ${variant} serves ${path} (hops ${r.hops.length - 1}, status ${r.final?.status})`);
  }
}
for (const { path } of legacy.gone) {
  const r = await chain(path);
  check(r.final?.status === 404, `retired legacy URL ${path} returns 404 (got ${r.final?.status})`);
}

// ---------------------------------------------------------------- robots + sitemap
const robots = await (await get("/robots.txt")).text();
if (EXPECT_INDEXABLE) {
  check(robots.includes(`Sitemap: ${CANONICAL}/sitemap.xml`), "robots.txt points to the canonical sitemap");
  check(robots.includes(`Host: ${CANONICAL}`), "robots.txt Host is the canonical host");
  check(/Allow: \//.test(robots) && !/Disallow: \/\s*$/m.test(robots), "robots.txt allows crawling");
} else {
  check(/Disallow: \//.test(robots), "robots.txt disallows crawling on a non-production deployment");
}
check(!robots.includes("vercel.app"), "robots.txt has no vercel.app reference");

const sitemap = await (await get("/sitemap.xml")).text();
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
check(locs.length > 0, `sitemap lists ${locs.length} URLs`);
check(locs.every((l) => l === CANONICAL || l.startsWith(CANONICAL + "/")), "every sitemap URL uses the canonical host");
check(!sitemap.includes("vercel.app"), "sitemap has no vercel.app reference");
for (const required of ["/contacto", "/nosotros", "/health", "/life", "/work"]) {
  check(locs.includes(CANONICAL + required), `sitemap includes ${required}`);
}

// ---------------------------------------------------------------- pages: metadata, links
const pages = [...new Set(locs.map((l) => pathOf(l.replace(CANONICAL, BASE)) || "/"))];
const internalLinks = new Map(); // path -> Set(referrer)
const anchorRefs = []; // { page, target, hash }
const htmlCache = new Map();

for (const path of pages) {
  const res = await get(path);
  check(res.status === 200, `sitemap page ${path} returns 200 (got ${res.status})`);
  if (res.status !== 200) continue;
  const html = await res.text();
  htmlCache.set(path, html);
  const head = html.split("</head>")[0];
  const canonical = head.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  const expected = CANONICAL + (path === "/" ? "" : path);
  check(canonical === expected || canonical === expected + "/", `${path}: canonical ${canonical}`);
  const og = head.match(/<meta property="og:url" content="([^"]+)"/)?.[1];
  if (og) check(og === expected || og === expected + "/", `${path}: og:url ${og}`);
  const ogImage = head.match(/<meta property="og:image" content="([^"]+)"/)?.[1];
  if (ogImage) check(ogImage.startsWith(CANONICAL + "/"), `${path}: og:image on canonical host (${ogImage})`);
  check(/<meta name="description" content="[^"]{50,}"/.test(head), `${path}: meta description in <head>`);
  check(/<title>[^<]{10,}<\/title>/.test(head), `${path}: <title> in <head>`);
  for (const alt of head.matchAll(/<link rel="alternate" hrefLang="([^"]+)" href="([^"]+)"/g)) {
    check(alt[2].startsWith(CANONICAL), `${path}: hreflang ${alt[1]} on canonical host`);
  }
  if (EXPECT_INDEXABLE) check(!/<meta name="robots" content="noindex/.test(head), `${path}: indexable`);
  check(!html.includes("vercel.app"), `${path}: no vercel.app reference in HTML`);
  for (const block of html.matchAll(/<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)) {
    let data;
    try { data = JSON.parse(block[1]); } catch { fail(`${path}: JSON-LD parses`); continue; }
    const urls = JSON.stringify(data).match(/https?:\/\/[^"]+/g) || [];
    const own = urls.filter((u) => !/schema\.org|google\.com|nipr\.com|bbb\.org|instagram\.com|healthcare\.gov/.test(u));
    check(own.every((u) => u.startsWith(CANONICAL)), `${path}: JSON-LD URLs on canonical host (${own.length})`);
  }
  for (const m of html.matchAll(/href="([^"]+)"/g)) {
    let href = m[1].replace(/&amp;/g, "&");
    if (href.startsWith(CANONICAL)) href = href.slice(CANONICAL.length) || "/";
    if (/^(mailto:|tel:|https?:|\/\/|data:)/.test(href)) continue;
    if (href.startsWith("/_next/") || /\.(css|js|svg|png|jpe?g|webp|ico|woff2?|ttf|xml|txt)(\?|$)/.test(href)) continue;
    if (href.startsWith("#")) { if (href.length > 1) anchorRefs.push({ page: path, target: path, hash: href.slice(1) }); continue; }
    const [p, hash] = href.split("#");
    if (!internalLinks.has(p)) internalLinks.set(p, new Set());
    internalLinks.get(p).add(path);
    if (hash) anchorRefs.push({ page: path, target: p, hash });
  }
}

for (const [link, from] of internalLinks) {
  const r = await chain(link);
  const ok = !r.loop && r.final?.status === 200;
  check(ok, `internal link ${link} resolves (status ${r.final?.status}, from ${[...from].slice(0, 3).join(", ")})`);
  if (ok && !htmlCache.has(link) && r.final.headers.get("content-type")?.includes("text/html")) {
    htmlCache.set(link, await r.final.text());
  }
}
const seenAnchors = new Set();
for (const { page, target, hash } of anchorRefs) {
  const key = `${target}#${hash}`;
  if (seenAnchors.has(key)) continue;
  seenAnchors.add(key);
  const html = htmlCache.get(target);
  if (!html) continue;
  if (!html.includes(`id="${hash}"`)) warnings.push(`anchor ${key} (linked from ${page}) has no element in the server HTML`);
}
for (const { destination } of legacy.redirects) {
  const [p, hash] = destination.split("#");
  if (!hash) continue;
  const html = htmlCache.get(p) ?? (await (await get(p)).text());
  check(html.includes(`id="${hash}"`), `redirect anchor ${destination} exists on the page`);
}

// ---------------------------------------------------------------- forms (rejected before sending)
// Every request below is invalid, so none of them sends an email, even against production.
const post = (path, body, headers = {}) => get(path, { method: "POST", headers: { "content-type": "application/json", ...headers }, body });
const contactEmpty = await post("/api/contacto", "{}");
check([422, 503].includes(contactEmpty.status), `/api/contacto rejects an empty submission (${contactEmpty.status}${contactEmpty.status === 503 ? ": Resend not configured" : ""})`);
if (contactEmpty.status === 503) warnings.push("/api/contacto: RESEND_API_KEY or RESEND_FROM/CONTACT_FROM (on the RESEND_SENDING_DOMAIN, forms.alleanzainsurance.org by default) is not configured, so the contact form cannot deliver leads");
const contactCross = await post("/api/contacto", "{}", { origin: "https://evil.example" });
check(contactCross.status === 403, `/api/contacto rejects cross-origin requests (${contactCross.status})`);
if (contactEmpty.status !== 503) {
  const contactJunk = await post("/api/contacto", "not json");
  check(contactJunk.status === 400, `/api/contacto rejects malformed JSON (${contactJunk.status})`);
  const contactHuge = await post("/api/contacto", JSON.stringify({ message: "x".repeat(9000) }));
  check(contactHuge.status === 413, `/api/contacto rejects an oversized body (${contactHuge.status})`);
  const contactBot = await post("/api/contacto", JSON.stringify({ name: "Bot", phone: "5550100000", consent: true, company_fax_hp: "x" }));
  check(contactBot.status === 400, `/api/contacto rejects a filled honeypot (${contactBot.status})`);
}
const healthBad = await post("/api/health/contact", JSON.stringify({ name: "x", email: "no", phone: "1", state: "48", service: "aca", consent: true }));
check(healthBad.status === 422, `/api/health/contact rejects invalid input (${healthBad.status})`);
const healthCross = await post("/api/health/contact", "{}", { origin: "https://evil.example" });
check(healthCross.status === 403, `/api/health/contact rejects cross-origin requests (${healthCross.status})`);
const healthJunk = await post("/api/health/contact", "not json");
check(healthJunk.status === 400, `/api/health/contact rejects malformed JSON (${healthJunk.status})`);
const healthHuge = await post("/api/health/contact", JSON.stringify({ name: "x".repeat(9000) }));
check(healthHuge.status === 413, `/api/health/contact rejects an oversized body (${healthHuge.status})`);

console.log(`\n${passes} passed, ${failures} failed, ${warnings.length} warning(s)`);
for (const w of warnings) console.log(`warn  ${w}`);
process.exit(failures ? 1 : 0);
