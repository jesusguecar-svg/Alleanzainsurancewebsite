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
  let current = "";
  try { current = readFileSync(vercelUrl, "utf8"); } catch {}
  if (current !== expected) {
    console.error("vercel.json does not match lib/config/legacy-redirects.json. Run `npm run sync:redirects`.");
    process.exit(1);
  }
} else {
  writeFileSync(vercelUrl, expected);
  console.log(`vercel.json: ${config.redirects.length} redirects`);
}
