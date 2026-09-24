import type { NextConfig } from "next";
import { academyUrl } from "./lib/config/contact";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/pc", destination: "/property-casualty", permanent: true },
      { source: "/academy", destination: academyUrl, permanent: false },
    ];
  },
};

export default nextConfig;
