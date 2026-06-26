/**
 * Centralized API base URL resolver.
 * Use this import instead of inlining process.env.NEXT_PUBLIC_API_BASE_URL.
 *
 * Resolution order:
 *   1. NEXT_PUBLIC_API_BASE_URL (explicit — set in Vercel dashboard for production)
 *   2. NEXT_PUBLIC_SITE_URL + "/api" (derived — works when backend is co-deployed)
 *   3. localhost:5000/api (development fallback only)
 *
 * For production, set NEXT_PUBLIC_API_BASE_URL to your backend URL.
 * Example: NEXT_PUBLIC_API_BASE_URL="https://scholar-flow-api.vercel.app/api"
 */

let _cachedApiUrl: string | undefined;

export function getApiBaseUrl(): string {
  if (_cachedApiUrl) return _cachedApiUrl;

  const explicit = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (explicit) {
    _cachedApiUrl = explicit;
    return explicit;
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl) {
    _cachedApiUrl = `${siteUrl.replace(/\/+$/, "")}/api`;
    if (typeof window !== "undefined") {
      console.log(
        `[apiUrl] Derived API URL from NEXT_PUBLIC_SITE_URL: ${_cachedApiUrl}`
      );
    }
    return _cachedApiUrl;
  }

  // Production: warn if no API URL configured
  if (
    process.env.NODE_ENV === "production" &&
    typeof window !== "undefined"
  ) {
    console.error(
      "[apiUrl] NEXT_PUBLIC_API_BASE_URL is not set! OAuth and API calls will fail. " +
        "Set it in your Vercel project settings."
    );
  }

  _cachedApiUrl = "http://localhost:5000/api";
  return _cachedApiUrl;
}

/** Convenience export — the resolved API base URL string */
export const API_BASE_URL = getApiBaseUrl();
