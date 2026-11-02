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
 * Also checks SEO foundations: one H1 per route, reciprocal hreflang, one robots tag, consistent
 * JSON-LD @ids, truthful sitemap fields, and that the address and hours live only in contact.ts.
 * Also checks guides: required fields and translation parity from the content files, then each
 * published guide's rendered page. To check the sample guide, build without VERCEL_ENV=production
 * and set EXPECT_INDEXABLE=0: production builds leave out guides that still say TODO-CONTENT.
 * Exits non-zero on any failure.
 */
import { readdirSync, readFileSync } from "node:fs";

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
  check(!/^Host:/mi.test(robots), "robots.txt has no Host line");
  // A crawler obeys the group that names it, so each is checked against its own group.
  const robotsGroups = robots.split(/\n\s*\n/).map((block) => ({
    agents: [...block.matchAll(/^User-Agent:\s*(.+)$/gim)].map((m) => m[1].trim().toLowerCase()),
    allowed: /^Allow: \/\s*$/m.test(block),
    blocked: /^Disallow: \/\s*$/m.test(block),
  }));
  const robotsGroup = (agent) => robotsGroups.filter((group) => group.agents.includes(agent.toLowerCase()));
  for (const agent of ["*", "Googlebot", "Bingbot", "OAI-SearchBot", "ChatGPT-User", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Perplexity-User", "Google-Extended"]) {
    const groups = robotsGroup(agent);
    check(groups.length === 1 && groups[0].allowed && !groups[0].blocked, `robots.txt allows ${agent}`);
  }
  for (const agent of ["GPTBot", "ClaudeBot"]) {
    const groups = robotsGroup(agent);
    check(groups.length === 1 && groups[0].blocked && !groups[0].allowed, `robots.txt disallows ${agent}`);
  }
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
check(!/<changefreq>|<priority>/.test(sitemap), "sitemap has no changefreq or priority");

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

// ---------------------------------------------------------------- SEO foundations
const robotsTags = (html) => [...html.split("</head>")[0].matchAll(/<meta name="robots"/g)].length;
const hreflangs = (html) => new Map([...html.split("</head>")[0].matchAll(/<link rel="alternate" hrefLang="([^"]+)" href="([^"]+)"/g)].map((m) => [m[1], m[2]]));
const jsonLd = (html) => [...html.matchAll(/<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)].flatMap((m) => {
  try { return [JSON.parse(m[1])]; } catch { return []; }
});
const organizationId = `${CANONICAL}/#organization`;
const fullOrganizationPages = new Set(["/", "/contacto", "/nosotros"]);
const fullOrganizations = [];

const noindexPage = await (await get("/property-casualty")).text();
for (const [path, html] of [...htmlCache, ["/property-casualty", noindexPage]]) {
  const h1s = html.match(/<h1[\s>]/g)?.length ?? 0;
  check(h1s === 1, `${path}: exactly one <h1> (got ${h1s})`);
  check(robotsTags(html) === 1, `${path}: one robots meta tag (got ${robotsTags(html)})`);
  const nodes = jsonLd(html);
  const organizations = nodes.filter((node) => node["@type"] === "InsuranceAgency");
  check(organizations.length === (fullOrganizationPages.has(path) ? 1 : 0), `${path}: full agency node only on ${[...fullOrganizationPages].join(", ")} (got ${organizations.length})`);
  fullOrganizations.push(...organizations);
  const raw = JSON.stringify(nodes);
  check(!/aggregateRating|"review"|Villard|Globe Life|npn/i.test(raw), `${path}: JSON-LD has no listing, review or NPN data`);
  check(!raw.includes("areaServed"), `${path}: JSON-LD makes no areaServed claim`);
  const ids = [...raw.matchAll(/"@id":"([^"]+#organization)"/g)].map((m) => m[1]);
  check(ids.every((id) => id === organizationId), `${path}: JSON-LD uses one organization @id`);
  for (const node of nodes.filter((n) => n["@type"] === "Person")) {
    check(node.worksFor?.["@id"] === organizationId, `${path}: Person.worksFor references the organization`);
  }
}
for (const path of ["/health", "/en/health"]) {
  const page = jsonLd(htmlCache.get(path) ?? "").find((node) => node["@type"] === "WebPage");
  check(page?.about?.["@id"] === organizationId, `${path}: references the organization by @id`);
}
check(fullOrganizations.length === fullOrganizationPages.size && new Set(fullOrganizations.map((node) => JSON.stringify(node))).size === 1, "full agency node is identical on every page that emits it");
check(jsonLd(htmlCache.get("/") ?? "").some((node) => node["@type"] === "WebSite"), "/: has a WebSite node");
check(!/(seis|cinco) formas de orientarte/i.test(htmlCache.get("/") ?? ""), "/: no count in the service-category wording");
const homeDirectory = (htmlCache.get("/") ?? "").split('class="home-directory"')[1]?.split("</section>")[0] ?? "";
check(homeDirectory.includes('href="/health"') && !homeDirectory.includes('href="/property-casualty"'), "/: home directory lists live lines and not Property & Casualty");

// ---------------------------------------------------------------- guides
// Node runs these TypeScript files directly: they import only types.
const guidesDir = new URL("../lib/content/guides/", import.meta.url);
const { validateGuides, isPlaceholderGuide } = await import(new URL("validate.ts", guidesDir).href);
const guideRegistry = readFileSync(new URL("index.ts", guidesDir), "utf8");
const allGuides = [];
for (const file of readdirSync(new URL("entries/", guidesDir))) {
  allGuides.push((await import(new URL(`entries/${file}`, guidesDir).href)).default);
  check(guideRegistry.includes(`./entries/${file.replace(/\.ts$/, "")}"`), `guide file ${file} is registered in lib/content/guides/index.ts`);
}
for (const problem of validateGuides(allGuides)) fail(`guide content: ${problem}`);
check(allGuides.length > 0, `guide content checked (${allGuides.length})`);

const guidePathsOf = (guide) => ({ es: `/health/${guide.es.slug}`, en: `/en/health/${guide.en.slug}` });
// Sample guides are public only outside production.
const publicGuides = allGuides.filter((guide) => !EXPECT_INDEXABLE || !isPlaceholderGuide(guide));
const lastmodOf = (path) => sitemap.split("<url>").find((block) => block.includes(`<loc>${CANONICAL}${path}</loc>`))?.match(/<lastmod>([^<]+)</)?.[1] ?? "";
const guideLabels = {
  es: { line: "Revisado por", agent: "agente con licencia", disclaimer: "Información educativa general", notice: "no pertenece al gobierno federal", index: "/aprende", health: "/health" },
  en: { line: "Reviewed by", agent: "licensed agent", disclaimer: "General educational information", notice: "not operated or endorsed by the federal government", index: "/en/learn", health: "/en/health" },
};

for (const guide of allGuides.filter((candidate) => !publicGuides.includes(candidate))) {
  for (const path of Object.values(guidePathsOf(guide))) {
    check((await get(path)).status === 404, `${path}: sample guide is not public in production`);
    check(!locs.includes(CANONICAL + path), `${path}: sample guide is not in the sitemap`);
  }
}
for (const [path, html] of htmlCache) {
  if (EXPECT_INDEXABLE) check(!html.includes("TODO-CONTENT"), `${path}: no TODO-CONTENT in production`);
}
if (!publicGuides.length) {
  for (const path of ["/aprende", "/en/learn"]) {
    check((await get(path)).status === 404, `${path}: no guide index until a guide is published`);
    check(!locs.includes(CANONICAL + path), `${path}: not in the sitemap until a guide is published`);
  }
}
for (const guide of publicGuides) {
  const paths = guidePathsOf(guide);
  for (const locale of ["es", "en"]) {
    const path = paths[locale];
    const labels = guideLabels[locale];
    const content = guide[locale];
    const html = htmlCache.get(path) ?? "";
    check(locs.includes(CANONICAL + path), `${path}: in the sitemap`);
    check(lastmodOf(path).startsWith(guide.updatedDate), `${path}: lastmod is updatedDate (${lastmodOf(path)})`);
    const own = hreflangs(html);
    check(own.get("es-US") === CANONICAL + paths.es && own.get("en-US") === CANONICAL + paths.en && own.get("x-default") === CANONICAL + paths.es, `${path}: hreflang pair`);
    check((html.match(/<h1[\s>]/g)?.length ?? 0) === 1, `${path}: exactly one <h1>`);
    const visible = html.replace(/<!-- -->/g, "");
    check(visible.includes(`${labels.line} ${guide.reviewer}, ${labels.agent}`), `${path}: visible reviewer line`);
    check(visible.includes(labels.disclaimer) && visible.includes(labels.notice), `${path}: disclaimer and government notice`);
    check(content.sources.every((source) => html.includes(source.url)), `${path}: sources listed`);
    const nodes = jsonLd(html);
    const article = nodes.find((node) => node["@type"] === "Article");
    check(article?.publisher?.["@id"] === organizationId, `${path}: Article JSON-LD publisher references the organization`);
    check(article?.author?.name === guide.author && article?.mainEntityOfPage?.reviewedBy?.name === guide.reviewer, `${path}: Article JSON-LD author and reviewer`);
    check(article?.dateModified === guide.updatedDate && article?.inLanguage === `${locale}-US`, `${path}: Article JSON-LD dateModified and inLanguage`);
    const crumbs = nodes.find((node) => node["@type"] === "BreadcrumbList")?.itemListElement ?? [];
    check(crumbs.at(-1)?.item === CANONICAL + path, `${path}: BreadcrumbList ends on the guide`);
    check(!nodes.some((node) => node["@type"] === "FAQPage"), `${path}: no FAQPage`);
    if (locale === "es") check(/href="\/contacto"[^>]*data-cta="guide_agent"/.test(html), `${path}: CTA goes to /contacto`);
    else check(html.includes('id="contacto"') && html.includes('name="consent"') && /href="#contacto"[^>]*data-cta="guide_agent"/.test(html), `${path}: CTA goes to the health contact form`);
    check((htmlCache.get(labels.index) ?? "").includes(`href="${path}"`), `${labels.index}: lists ${path}`);
    check((htmlCache.get(labels.health) ?? "").includes(`href="${path}"`), `${labels.health}: Guides block lists ${path}`);
  }
}
for (const index of publicGuides.length ? ["/aprende", "/en/learn"] : []) {
  check(locs.includes(CANONICAL + index), `${index}: in the sitemap`);
  check(/^\d{4}-/.test(lastmodOf(index)), `${index}: has a lastmod`);
}

for (const [path, html] of htmlCache) {
  const own = hreflangs(html);
  if (!own.size) continue;
  const self = CANONICAL + (path === "/" ? "" : path);
  check([...own.values()].includes(self), `${path}: hreflang includes itself`);
  for (const [lang, url] of own) {
    const target = url.slice(CANONICAL.length) || "/";
    const other = htmlCache.get(target) ?? (await (await get(target)).text());
    check([...hreflangs(other).values()].includes(self), `${path}: hreflang ${lang} -> ${target} links back`);
  }
}

const missing = await get("/ruta-que-no-existe-validacion");
const missingHtml = await missing.text();
check(missing.status === 404, `unknown route returns 404 (got ${missing.status})`);
check(robotsTags(missingHtml) === 1 && /<meta name="robots" content="noindex/.test(missingHtml), `404 page: one noindex robots tag (got ${robotsTags(missingHtml)})`);
check(!/<link rel="canonical"/.test(missingHtml), "404 page: no canonical");
check((missingHtml.match(/<h1[\s>]/g)?.length ?? 0) === 1, "404 page: exactly one <h1>");

// The address and hours may be written only in lib/config/contact.ts.
const napLiteral = /Midcourt|75006|\b\d{1,2}:00\b|Lunes a viernes|Monday.Friday/;
const sourceFiles = (dir) => readdirSync(new URL(`../${dir}/`, import.meta.url), { recursive: true, withFileTypes: true })
  .filter((entry) => entry.isFile() && /\.tsx?$/.test(entry.name))
  .map((entry) => `${entry.parentPath ?? entry.path}/${entry.name}`);
for (const file of ["app", "components", "lib"].flatMap(sourceFiles)) {
  if (file.endsWith("lib/config/contact.ts")) continue;
  check(!napLiteral.test(readFileSync(file, "utf8")), `${file}: address and hours come from contact.ts`);
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
