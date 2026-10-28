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
  // then apply the legacy redirect (a second 308), so the automatic slash redirect is off: each
  // legacy URL (with and without "/") reaches its destination in one hop from the rules below,
  // and every other "/path/" is sent to "/path" by middleware.ts, which runs after redirects.
  // Do not add a catch-all "/:path+/" redirect here: on Vercel the Next.js builder moves such a
  // rule ahead of every other redirect, which brought back the second hop.
  skipTrailingSlashRedirect: true,
  async redirects() {
    return [
      { source: "/pc", destination: "/property-casualty", permanent: true },
      { source: "/academy", destination: academyUrl, permanent: false },
      ...legacy.redirects.flatMap(({ source, destination }) =>
        [source, `${source}/`].map((variant) => ({ source: variant, destination, permanent: true })),
      ),
    ];
  },
};

export default nextConfig;
