import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Compiler optimizations for production performance
  reactCompiler: true,
  compiler: {
    // Remove console logs in production except errors and warnings
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
  },

  // Note: SWC minification is enabled by default in Next.js 16+
  // No need to explicitly set swcMinify anymore

  // Turbopack is default in Next.js 16 — no flags needed
  turbopack: {
    // Modularize imports for better tree-shaking
    resolveAlias: {
      lodash: {
        browser: "lodash/{{member}}",
      },
      "date-fns": {
        browser: "date-fns/{{member}}",
      },
      "@radix-ui/react-icons": {
        browser: "@radix-ui/react-icons/dist/{{member}}",
      },
    },
  },

  experimental: {
    // Turbopack filesystem caching (beta) — faster dev restarts
    turbopackFileSystemCacheForDev: true,
  },

  // Production error handling - hide error overlay in production
  reactStrictMode: true,
  productionBrowserSourceMaps: false, // Disable source maps in production for security

  // Image optimization configuration
  images: {
    // Use modern image formats for better compression
    formats: ["image/avif", "image/webp"],
    // Cache optimized images for 60 seconds minimum (overrides v16 default of 4hrs)
    minimumCacheTTL: 60,
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

  // Add cache headers for static assets
  async headers() {
    return [
      {
        // Cache static assets aggressively
        source: "/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico|woff|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Cache HTML pages with revalidation (shorter TTL for fast UI updates)
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=60, must-revalidate",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },

  async rewrites() {
    // Don't rewrite any API routes - handle them directly
    // NextAuth routes (/api/auth/*) stay on frontend
    // Custom API routes will be handled by direct fetch calls to backend
    return [];
  },
};

export default nextConfig;
