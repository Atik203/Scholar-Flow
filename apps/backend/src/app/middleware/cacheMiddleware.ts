import crypto from "crypto";
import { NextFunction, Request, Response } from "express";

/**
 * HTTP Cache Middleware for API responses
 * Implements ETag support and Cache-Control headers
 */

interface CacheOptions {
  maxAge?: number; // in seconds
  sMaxAge?: number; // CDN cache duration
  staleWhileRevalidate?: number;
  staleIfError?: number;
  public?: boolean;
  private?: boolean;
  noCache?: boolean;
  noStore?: boolean;
  mustRevalidate?: boolean;
}

/**
 * Generate ETag from response body
 */
function generateETag(body: string | Buffer): string {
  return `"${crypto.createHash("md5").update(body).digest("hex")}"`;
}

/**
 * Build Cache-Control header value
 */
function buildCacheControl(options: CacheOptions): string {
  const directives: string[] = [];

  if (options.noStore) {
    directives.push("no-store");
    return directives.join(", ");
  }

  if (options.noCache) {
    directives.push("no-cache");
  }

  if (options.public) {
    directives.push("public");
  } else if (options.private) {
    directives.push("private");
  }

  if (options.maxAge !== undefined) {
    directives.push(`max-age=${options.maxAge}`);
  }

  if (options.sMaxAge !== undefined) {
    directives.push(`s-maxage=${options.sMaxAge}`);
  }

  if (options.staleWhileRevalidate !== undefined) {
    directives.push(`stale-while-revalidate=${options.staleWhileRevalidate}`);
  }

  if (options.staleIfError !== undefined) {
    directives.push(`stale-if-error=${options.staleIfError}`);
  }

  if (options.mustRevalidate) {
    directives.push("must-revalidate");
  }

  return directives.join(", ");
}

/**
 * Cache middleware factory
 * @param options Cache configuration options
 */
export function cacheMiddleware(options: CacheOptions) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== "GET") {
      return next();
    }

    // Store original json method
    const originalJson = res.json.bind(res);

    // Override json method to add caching headers
    res.json = function (body: any) {
      // Generate ETag if not already set
      if (!res.getHeader("ETag")) {
        const bodyString =
          typeof body === "string" ? body : JSON.stringify(body);
        const etag = generateETag(bodyString);
        res.setHeader("ETag", etag);

        // Check if client has current version
        const clientETag = req.headers["if-none-match"];
        if (clientETag === etag) {
          res.status(304);
          return res.end();
        }
      }

      // Set Cache-Control header
      const cacheControl = buildCacheControl(options);
      if (cacheControl) {
        res.setHeader("Cache-Control", cacheControl);
      }

      // Set Vary header for content negotiation
      res.setHeader("Vary", "Accept-Encoding, Accept");

      // Call original json method
      return originalJson(body);
    };

    next();
  };
}

/**
 * Preset cache configurations
 */
export const CachePresets = {
  // No caching for dynamic content
  noCache: (): ReturnType<typeof cacheMiddleware> =>
    cacheMiddleware({
      noCache: true,
      mustRevalidate: true,
    }),

  // Short cache for frequently changing data (30 seconds)
  short: (): ReturnType<typeof cacheMiddleware> =>
    cacheMiddleware({
      public: true,
      maxAge: 30,
      sMaxAge: 60,
      staleWhileRevalidate: 30,
    }),

  // Medium cache for semi-static data (5 minutes)
  medium: (): ReturnType<typeof cacheMiddleware> =>
    cacheMiddleware({
      public: true,
      maxAge: 300,
      sMaxAge: 600,
      staleWhileRevalidate: 300,
    }),

  // Long cache for static data (1 hour)
  long: (): ReturnType<typeof cacheMiddleware> =>
    cacheMiddleware({
      public: true,
      maxAge: 3600,
      sMaxAge: 7200,
      staleWhileRevalidate: 3600,
    }),

  // Private cache for user-specific data (5 minutes)
  private: (): ReturnType<typeof cacheMiddleware> =>
    cacheMiddleware({
      private: true,
      maxAge: 300,
      mustRevalidate: true,
    }),
};
