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
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async rewrites() {
    const backend =
      process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL;
    if (!backend) return [];
    return [
      {
        source: "/api/:path*",
        destination: `${backend.replace(/\/$/, "")}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
