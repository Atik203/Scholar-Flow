/**
 * Auth cookie helpers.
 * We use a lightweight `sf_auth` cookie (value = "1") solely to signal
 * to the Next.js middleware that the user is authenticated.
 * The actual access token lives in Redux-Persist (localStorage).
 */

const COOKIE_NAME = "sf_auth";
// 7-day expiry matching the refresh token lifetime
const MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

export function setAuthCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE_NAME}=1; path=/; max-age=${MAX_AGE_SECONDS}; SameSite=Lax`;
}

export function clearAuthCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}
