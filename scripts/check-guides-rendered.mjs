#!/usr/bin/env node
/**
 * Rendered-HTML checks for the guides (OE2027 ship package §4.3), against a running build.
 *
 *   BASE=http://localhost:3100 MODE=preview    node scripts/check-guides-rendered.mjs   # every guide served, noindex
 *   BASE=http://localhost:3100 MODE=production node scripts/check-guides-rendered.mjs   # only approved guides, indexable
 *   BASE=https://alleanzainsurance.org MODE=production node scripts/check-guides-rendered.mjs
 *
 * MODE=production expects exactly the guides isPublishableGuide() accepts (lib/content/guides/validate.ts):
 * those return 200, are indexable and in the sitemap; the others return 404 and are not linked.
 * Complements scripts/validate-migration.mjs; Lighthouse and schema validators are run separately.
 */
import { register } from "node:module";
import { readdirSync } from "node:fs";

// Node runs the guide TypeScript files directly through the test resolve hooks.
register("../tests/resolve-hooks.mjs", import.meta.url);

const BASE = (process.env.BASE || "http://localhost:3100").replace(/\/$/, "");
const CANON = (process.env.EXPECT_CANONICAL || "https://alleanzainsurance.org").replace(/\/$/, "");
const MODE = process.env.MODE || "preview";
if (!["preview", "production"].includes(MODE)) throw new Error(`MODE must be preview or production (got ${MODE})`);
const guidesDir = new URL("../lib/content/guides/", import.meta.url);
const v = await import(new URL("validate.ts", guidesDir).href);
const inline = await import(new URL("inline.ts", guidesDir).href);
const allGuides = [];
for (const file of readdirSync(new URL("entries/", guidesDir)).sort()) allGuides.push((await import(new URL(`entries/${file}`, guidesDir).href)).default);
const shown = MODE === "production" ? allGuides.filter((g) => v.isPublishableGuide(g)) : allGuides;
const hidden = allGuides.filter((g) => !shown.includes(g));
const paths = (g) => ({ es: v.guidePathFor(g, "es"), en: v.guidePathFor(g, "en") });
const hiddenPaths = hidden.flatMap((g) => Object.values(paths(g)));
// Exact path match: "/en/health/texas-marketplace-2027" is a prefix of ".../texas-marketplace-2027-faq".
const linksTo = (html, path) => new RegExp(`href="${path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["?#]`).test(html);

let pass = 0, fail = 0;
const check = (ok, msg) => { if (ok) pass++; else { fail++; console.log(`FAIL  ${msg}`); } };
const cache = new Map();
async function get(path) {
  if (cache.has(path)) return cache.get(path);
  const r = await fetch(BASE + path, { redirect: "manual" });
  const out = { status: r.status, html: await r.text(), robotsHeader: r.headers.get("x-robots-tag") ?? "" };
  cache.set(path, out);
  return out;
}
const decode = (s) => s.replace(/<!-- -->/g, "").replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ");
const attr = (tag, name) => tag.match(new RegExp(`${name}="([^"]*)"`))?.[1];
const hreflangs = (html) => new Map([...html.matchAll(/<link[^>]+hreflang="[^"]+"[^>]*>/gi)].map((m) => [m[0].match(/hreflang="([^"]*)"/i)[1], m[0].match(/\shref="([^"]*)"/)[1]]));
const jsonLd = (html) => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap((m) => { const d = JSON.parse(m[1]); return d["@graph"] ?? (Array.isArray(d) ? d : [d]); });

const sitemap = (await get("/sitemap.xml")).html;
const lastmod = (url) => sitemap.split("<url>").find((b) => b.includes(`<loc>${url}</loc>`))?.match(/<lastmod>([^<]+)</)?.[1];
const internal = new Set();

for (const g of shown) {
  const p = paths(g);
  for (const locale of ["es", "en"]) {
    const path = p[locale], c = g[locale], where = `${path}`;
    const { status, html } = await get(path);
    check(status === 200, `${where}: 200 (got ${status})`);
    const text = decode(html);
    const h1s = [...html.matchAll(/<h1[\s>][\s\S]*?<\/h1>/g)];
    check(h1s.length === 1 && decode(h1s[0][0].replace(/<[^>]+>/g, "")) === c.h1, `${where}: exactly one <h1> with the h1 text`);
    check(text.includes(c.summary), `${where}: summary in server HTML`);
    check(new RegExp(`<html[^>]*lang="${locale}"`).test(html), `${where}: <html lang="${locale}">`);
    const canon = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
    check(canon === CANON + path, `${where}: self canonical (${canon})`);
    const hl = hreflangs(html);
    check(hl.get("es-US") === CANON + p.es && hl.get("en-US") === CANON + p.en && hl.get("x-default") === CANON + p.es, `${where}: hreflang es-US/en-US/x-default`);
    const pair = hreflangs((await get(locale === "es" ? p.en : p.es)).html);
    check(pair.get(locale === "es" ? "es-US" : "en-US") === CANON + path, `${where}: hreflang reciprocal`);
    for (const m of ["[VERIFY", "[DISCLOSURE]", "[COMPLIANCE", "TODO", "data/dfw"]) check(!html.includes(m), `${where}: no ${m}`);
    // The retired number must never appear.
    check(!/757[-.\s)]*5553|7577553/.test(html), `${where}: no retired phone number`);
    if (MODE === "production") check(!(await get(path)).robotsHeader.includes("noindex"), `${where}: no X-Robots-Tag noindex`);
    const robots = html.match(/<meta name="robots" content="([^"]+)"/)?.[1] ?? "";
    check(MODE === "production" ? !robots.includes("noindex") : robots.includes("noindex"), `${where}: robots ${MODE === "production" ? "indexable" : "noindex"} (${robots})`);
    const nodes = jsonLd(html);
    const types = nodes.map((n) => n["@type"]);
    check(types.includes("Article") && types.includes("BreadcrumbList"), `${where}: Article + BreadcrumbList`);
    check(!types.some((t) => ["FAQPage", "Offer", "Product", "AggregateRating"].includes(t)), `${where}: no FAQPage/Offer/Product (${types})`);
    const article = nodes.find((n) => n["@type"] === "Article");
    check(JSON.stringify(article?.citation?.map((x) => x.url)) === JSON.stringify(c.sources.map((s) => s.url)), `${where}: Article citation = Sources`);
    const crumbs = nodes.find((n) => n["@type"] === "BreadcrumbList")?.itemListElement ?? [];
    const parentShown = g.parentGuideId && shown.some((o) => o.id === g.parentGuideId);
    check(crumbs.length === (parentShown ? 4 : 3) && crumbs.at(-1)?.item === CANON + path, `${where}: breadcrumb trail (${crumbs.map((x) => x.name).join(" › ")})`);
    check(crumbs.every((x) => !hiddenPaths.includes(x.item.slice(CANON.length))), `${where}: JSON-LD breadcrumb has no unpublished guide`);
    const nav = html.match(/<nav aria-label="[^"]*"[^>]*>[\s\S]*?<\/nav>/g)?.find((n) => n.includes('aria-current="page"')) ?? "";
    check((nav.match(/<li/g)?.length ?? 0) === crumbs.length, `${where}: visible breadcrumb matches JSON-LD`);
    check(hiddenPaths.every((h) => !linksTo(html, h)), `${where}: no href to an unpublished guide`);
    // Every word still there: link labels to hidden guides render as text.
    for (const s of v.inlineStrings(c)) for (const l of inline.links(s)) if (hiddenPaths.includes(inline.internalPath(l.href))) check(text.includes(l.label), `${where}: unlinked label "${l.label}" still shown`);
    for (const sec of c.sections) check(text.includes(sec.heading), `${where}: no-JS section "${sec.heading.slice(0, 30)}"`);
    check(c.keyFacts.every((f) => text.includes(f.label) && text.includes(f.value)), `${where}: no-JS key facts`);
    // React escapes "&" in attributes, so a source URL with a query string appears as "&amp;".
    check(c.sources.every((s) => html.includes(`href="${s.url.replace(/&/g, "&amp;")}"`)), `${where}: Sources listed`);
    check(html.includes(`href="${p.es}"`) && html.includes(`href="${p.en}"`), `${where}: language switch links`);
    const article_ = html.split('id="contacto"')[0];
    const articleOnly = html.match(/<article[^>]*data-cta-location="guide"[\s\S]*?<\/article>/)?.[0] ?? "";
    const blank = articleOnly.match(/<a [^>]*target="_blank"[^>]*>[\s\S]*?<\/a>/g) ?? [];
    const hint = locale === "es" ? "(se abre en una pestaña nueva)" : "(opens in a new tab)";
    check(blank.length > 0 && blank.every((a) => a.includes(hint)), `${where}: ${blank.length} new-tab links carry the hint`);
    const tables = article_.match(/<table[\s\S]*?<\/table>/g) ?? [];
    check(tables.every((t) => /<th[^>]*scope="(row|col)"/.test(t)), `${where}: tables use th scope`);
    check(tables.slice(1).every((t) => t.includes("<caption")), `${where}: content tables have captions`);
    const heads = [...article_.matchAll(/<h([1-6])[\s>]/g)].map((m) => +m[1]);
    check(heads[0] === 1 && heads.every((h, i) => i === 0 || h <= heads[i - 1] + 1) && heads.every((h) => h <= 3), `${where}: heading order H1→H2→H3`);
    for (const m of html.matchAll(/href="(\/[^"#?]*)/g)) if (!m[1].startsWith("/_next")) internal.add(m[1]);
    const lm = lastmod(CANON + path);
    check(lm?.startsWith(g.updatedDate), `${where}: sitemap lastmod = updatedDate (${lm})`);
  }
}
for (const path of hiddenPaths) {
  check((await get(path)).status === 404, `${path}: unpublished guide returns 404`);
  check(!sitemap.includes(`${CANON}${path}<`), `${path}: unpublished guide not in sitemap`);
}
for (const path of ["/health/open-enrollment-2027", "/en/health/open-enrollment-2027"]) check((await get(path)).status === 404, `${path}: old slug 404`);
for (const path of ["/aprende", "/en/learn"]) {
  const { status, html } = await get(path);
  check(shown.length ? status === 200 && sitemap.includes(`${CANON}${path}<`) : status === 404 && !sitemap.includes(`${CANON}${path}<`), `${path}: index ${shown.length ? "served + in sitemap" : "404 + not in sitemap"} (${status})`);
  if (shown.length) check(hiddenPaths.every((h) => !linksTo(html, h)), `${path}: no link to an unpublished guide`);
}
for (const path of ["/health", "/en/health"]) {
  const { html } = await get(path);
  check(hiddenPaths.every((h) => !linksTo(html, h)), `${path}: guides block lists no unpublished guide`);
}
for (const path of internal) {
  const r = await fetch(BASE + path, { redirect: "follow" });
  check(r.status === 200, `internal link ${path}: 200 (got ${r.status})`);
}
console.log(`§4.3 [${MODE}; shown: ${shown.map((g) => g.id).join(", ") || "none"}]: ${pass} passed, ${fail} failed; ${internal.size} internal links crawled`);
process.exit(fail ? 1 : 0);
