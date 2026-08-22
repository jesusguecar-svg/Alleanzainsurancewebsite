import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // Short alias for the property & casualty spoke.
      { source: "/pc", destination: "/property-casualty", permanent: true },
    ];
  },
};

export default nextConfig;
