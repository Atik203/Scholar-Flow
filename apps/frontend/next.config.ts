import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Allow transpiling our shared packages in the monorepo
    // https://nextjs.org/docs/app/building-your-application/optimizing/packages
    // For Next 15, prefer the 'transpilePackages' option at the root level
  },
  transpilePackages: ["@scholar-flow/types", "@scholar-flow/seo"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
};

export default nextConfig;
