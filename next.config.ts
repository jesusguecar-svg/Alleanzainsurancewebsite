import type { NextConfig } from "next";
import { academyUrl } from "./lib/config/contact";
import legacy from "./lib/config/legacy-redirects.json";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Render metadata in <head> for every client. By default Next.js streams it into the body
  // on dynamic routes (/health, /en/health) for clients it does not recognize as bots, which
  // crawlers and link-preview scrapers outside its list do not read.
  htmlLimitedBots: /.*/,
  // The legacy WordPress URLs end in "/". Next.js would first strip the slash (308) and only
  // then apply the legacy redirect (a second 308), so trailing slashes are handled here instead:
  // each legacy URL reaches its destination in one hop, and every other "/path/" still
  // permanently redirects to "/path", as before.
  // On Vercel the platform strips the slash before these rules run, so the same legacy map is
  // also written to vercel.json (scripts/sync-vercel-redirects.mjs), which Vercel applies first.
  skipTrailingSlashRedirect: true,
  async redirects() {
    return [
      { source: "/pc", destination: "/property-casualty", permanent: true },
      { source: "/academy", destination: academyUrl, permanent: false },
      ...legacy.redirects.flatMap(({ source, destination }) =>
        [source, `${source}/`].map((variant) => ({ source: variant, destination, permanent: true })),
      ),
      { source: "/:path+/", destination: "/:path+", permanent: true },
    ];
  },
};

export default nextConfig;
