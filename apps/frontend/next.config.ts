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
    // Don't rewrite any API routes - handle them directly
    // NextAuth routes (/api/auth/*) stay on frontend
    // Custom API routes will be handled by direct fetch calls to backend
    return [];
  },
};

export default nextConfig;
