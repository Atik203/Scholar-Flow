import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Compiler optimizations for production performance
  compiler: {
    // Remove console logs in production except errors and warnings
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
  },

  // Note: SWC minification is enabled by default in Next.js 15+
  // No need to explicitly set swcMinify anymore

  // Optimize package imports for better tree-shaking
  modularizeImports: {
    lodash: {
      transform: "lodash/{{member}}",
    },
    "date-fns": {
      transform: "date-fns/{{member}}",
    },
    "@radix-ui/react-icons": {
      transform: "@radix-ui/react-icons/dist/{{member}}",
    },
  },

  experimental: {
    // Optimize specific package imports automatically
    optimizePackageImports: [
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-popover",
      "@radix-ui/react-select",
      "@radix-ui/react-tabs",
      "@radix-ui/react-tooltip",
      "lucide-react",
    ],
    // Enable CSS optimization (inline critical CSS, defer non-critical)
    // Uses beasties (formerly critters) for critical CSS extraction
    optimizeCss: true,
  },

  // Image optimization configuration
  images: {
    // Use modern image formats for better compression
    formats: ["image/avif", "image/webp"],
    // Cache optimized images for 60 seconds minimum
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
        // Cache HTML pages with revalidation
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, must-revalidate",
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
