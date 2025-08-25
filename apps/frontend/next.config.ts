import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Allow transpiling our shared packages in the monorepo
    // https://nextjs.org/docs/app/building-your-application/optimizing/packages
    // For Next 15, prefer the 'transpilePackages' option at the root level
  },
  // transpilePackages removed as we're no longer using workspace packages
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
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!apiBaseUrl) return [];

    // Extract backend URL from API base URL (remove /api suffix)
    const backend = apiBaseUrl.replace(/\/api$/, "");

    return [
      {
        source: "/api/:path*",
        destination: `${backend}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
