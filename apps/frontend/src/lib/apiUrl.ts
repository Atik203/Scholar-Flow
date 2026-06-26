/**
 * Centralized API base URL resolver.
 *
 * **CRITICAL**: process.env.NEXT_PUBLIC_* vars are read at MODULE TOP LEVEL.
 * This is required for Next.js/Turbopack to inline them into the client bundle
 * at build time. Do NOT read them inside function bodies.
 *
 * Resolution order:
 *   1. NEXT_PUBLIC_API_BASE_URL (explicit — set in Vercel dashboard)
 *   2. NEXT_PUBLIC_SITE_URL + "/api" (derived)
 *   3. localhost:5000/api (development only)
 *
 * For Vercel production, set in Project Settings → Environment Variables:
 *   NEXT_PUBLIC_API_BASE_URL = https://scholar-flow-api.vercel.app/api
 *   NEXT_PUBLIC_SITE_URL     = https://scholar-flow-ai.vercel.app
 */

// Must be read at module TOP LEVEL for Next.js to inline into client bundles
const ENV_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const ENV_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;
const ENV_NODE_ENV = process.env.NODE_ENV;

let _cachedApiUrl: string | null = null;

function resolveApiBaseUrl(): string {
  if (ENV_API_BASE_URL) {
    return ENV_API_BASE_URL;
  }

  if (ENV_SITE_URL) {
    const derived = `${ENV_SITE_URL.replace(/\/+$/, "")}/api`;
    return derived;
  }

  // Only log in browser context (not during SSR)
  if (ENV_NODE_ENV === "production" && typeof window !== "undefined") {
    console.error(
      "[apiUrl] NEXT_PUBLIC_API_BASE_URL is not set! " +
        "API calls and OAuth will fail. " +
        "Set it in Vercel project settings."
    );
  }

  return "http://localhost:5000/api";
}

export function getApiBaseUrl(): string {
  if (_cachedApiUrl) return _cachedApiUrl;
  _cachedApiUrl = resolveApiBaseUrl();

  if (typeof window !== "undefined") {
    console.log(
      `[apiUrl] Resolved API URL: ${_cachedApiUrl} ` +
        `(NEXT_PUBLIC_API_BASE_URL=${ENV_API_BASE_URL || "unset"}, ` +
        `NEXT_PUBLIC_SITE_URL=${ENV_SITE_URL || "unset"})`
    );
  }

  return _cachedApiUrl;
}

/** Convenience export — the resolved API base URL string */
export const API_BASE_URL = getApiBaseUrl();
