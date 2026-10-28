#!/usr/bin/env node
/**
 * Writes the legacy WordPress redirects into vercel.json.
 *
 * On Vercel, the platform strips a trailing slash (308) before the redirects in next.config.ts
 * run, so "/trabajo/" took two hops: /trabajo/ -> /trabajo -> /work. Redirects in vercel.json
 * are applied first, so listing both variants there sends each legacy URL to its destination
 * in one permanent hop. next.config.ts keeps the same rules for `next start` and other hosts.
 *
 *   npm run sync:redirects            regenerate vercel.json from lib/config/legacy-redirects.json
 *   node scripts/sync-vercel-redirects.mjs --check   exit 1 if vercel.json is out of date (prebuild)
 */
import { readFileSync, writeFileSync } from "node:fs";

const legacyUrl = new URL("../lib/config/legacy-redirects.json", import.meta.url);
const vercelUrl = new URL("../vercel.json", import.meta.url);
const legacy = JSON.parse(readFileSync(legacyUrl, "utf8"));

const config = {
  $schema: "https://openapi.vercel.sh/vercel.json",
  redirects: legacy.redirects.flatMap(({ source, destination }) =>
    [source, `${source}/`].map((variant) => ({ source: variant, destination, permanent: true })),
  ),
};
const expected = `${JSON.stringify(config, null, 2)}\n`;

if (process.argv.includes("--check")) {
  // Compare the redirect rules, not the file text: Vercel's build may rewrite vercel.json after
  // reading it. A missing file during a Vercel build means the platform already consumed it.
  let current;
  try { current = JSON.parse(readFileSync(vercelUrl, "utf8")); } catch (error) {
    if (process.env.VERCEL) { console.warn(`vercel.json not readable during the Vercel build (${error.code ?? error.name}); skipping the check.`); process.exit(0); }
    console.error("vercel.json is missing or invalid. Run `npm run sync:redirects`."); process.exit(1);
  }
  const rules = (list) => JSON.stringify((list ?? []).map(({ source, destination, permanent }) => ({ source, destination, permanent })));
  if (rules(current.redirects) !== rules(config.redirects)) {
    const index = config.redirects.findIndex((rule, i) => rules([rule]) !== rules([current.redirects?.[i]]));
    console.error(`vercel.json redirects do not match lib/config/legacy-redirects.json (${current.redirects?.length ?? 0} vs ${config.redirects.length}). Run \`npm run sync:redirects\`.`);
    console.error(`First difference at #${index}: expected ${JSON.stringify(config.redirects[index])}, found ${JSON.stringify(current.redirects?.[index])}`);
    process.exit(1);
  }
} else {
  writeFileSync(vercelUrl, expected);
  console.log(`vercel.json: ${config.redirects.length} redirects`);
}
