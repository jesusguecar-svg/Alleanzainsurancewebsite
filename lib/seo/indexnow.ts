/**
 * IndexNow (Bing, Yandex, Seznam, Naver…): tells search engines which URLs are new or changed.
 * Pure helpers shared by app/indexnow-key.txt/route.ts and scripts/indexnow-submit.mjs.
 * See docs/seo/indexnow.md for where the key lives and how the post-deploy step runs.
 */

/** IndexNow keys: 8–128 characters, a–z, A–Z, 0–9 and "-" (indexnow.org/documentation). */
export const indexNowKeyPattern = /^[a-zA-Z0-9-]{8,128}$/;

/** Served from the site root; its body is the key. Passed to IndexNow as keyLocation. */
export const indexNowKeyPath = "/indexnow-key.txt";

/** The shared endpoint: one submission reaches every participating engine, Bing included. */
export const indexNowEndpoint = "https://api.indexnow.org/indexnow";

/** IndexNow accepts at most 10,000 URLs per request. */
export const indexNowBatchSize = 10_000;

export type SitemapEntry = { loc: string; lastmod?: string };

const decodeXml = (value: string) =>
  value.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, "&");

/** Reads <url><loc>…</loc><lastmod>…</lastmod></url> entries from a sitemap. */
export function parseSitemap(xml: string): SitemapEntry[] {
  return [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].flatMap(([, block]) => {
    const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1]?.trim();
    if (!loc) return [];
    const lastmod = block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1]?.trim();
    return [{ loc: decodeXml(loc), ...(lastmod ? { lastmod } : {}) }];
  });
}

/**
 * URLs to submit after a deploy:
 *  - with the previous deploy's sitemap: URLs that are new, or whose lastmod changed;
 *  - without it (first run, cache miss): URLs whose lastmod is on or after `since` (YYYY-MM-DD).
 * Only URLs on `host` are returned; removed URLs are not submitted (they answer 404/410 and
 * engines drop them on recrawl).
 */
export function changedUrls(current: SitemapEntry[], host: string, previous?: SitemapEntry[] | null, since?: string): string[] {
  const onHost = current.filter((entry) => {
    try {
      return new URL(entry.loc).host === host;
    } catch {
      return false;
    }
  });
  if (previous) {
    const before = new Map(previous.map((entry) => [entry.loc, entry.lastmod]));
    return onHost.filter((entry) => !before.has(entry.loc) || before.get(entry.loc) !== entry.lastmod).map((entry) => entry.loc);
  }
  if (!since) return [];
  return onHost.filter((entry) => entry.lastmod !== undefined && entry.lastmod.slice(0, 10) >= since).map((entry) => entry.loc);
}

/** Request bodies for the IndexNow endpoint, at most indexNowBatchSize URLs each. */
export function indexNowPayloads(urls: string[], host: string, key: string, keyLocation: string) {
  const payloads: { host: string; key: string; keyLocation: string; urlList: string[] }[] = [];
  for (let start = 0; start < urls.length; start += indexNowBatchSize) {
    payloads.push({ host, key, keyLocation, urlList: urls.slice(start, start + indexNowBatchSize) });
  }
  return payloads;
}
