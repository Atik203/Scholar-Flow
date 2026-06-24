/**
 * Sign-out utility that performs a full purge of client-side auth state.
 *
 * Order of operations (matters for correctness):
 *  1. Reset RTK Query cache so no in-flight requests carry a stale token.
 *  2. Purge redux-persist localStorage so the next page load starts from
 *     a clean slate (avoids stale user/accessToken rehydration).
 *  3. Clear Redux auth credentials in memory.
 *  4. Clear the proxy `sf_auth` cookie and any stale better-auth cookies.
 *  5. Best-effort: invalidate the backend Session row.
 *  6. Hard navigation (window.location.href) so the next page mounts a
 *     fresh React tree — the only reliable way to flush all state.
 *
 * Note: we deliberately do NOT import `authClient` (better-auth/react) here,
 * because its transitive imports include server-only modules
 * (better-auth/next-js, node:crypto) which must not be bundled into the
 * client. Clearing the better-auth cookies directly via document.cookie is
 * sufficient and avoids the client/server boundary violation.
 */

import { clearAuthCookie } from "@/lib/auth/authCookies";
import { closeNotificationStream } from "@/hooks/useNotificationStream";
import { apiSlice } from "@/redux/api/apiSlice";
import { clearCredentials } from "@/redux/auth/authSlice";
import { getAppStore, getPersistor } from "@/redux/storeAccess";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

// better-auth cookies to clear. We only know the client-side names; the
// server-side Set-Cookie response is what better-auth uses to clear them.
const BETTER_AUTH_COOKIES = [
  "better-auth.session_token",
  "__Secure-better-auth.session_token",
  "better-auth.csrf_token",
  "__Host-better-auth.csrf_token",
  "better-auth.session-data",
  "better-auth.callback_url",
];

function clearBetterAuthCookies(): void {
  if (typeof document === "undefined") return;
  const hostname = window.location.hostname;
  const paths = ["/"];
  const expirations = [
    "Thu, 01 Jan 1970 00:00:00 GMT",
  ];
  for (const name of BETTER_AUTH_COOKIES) {
    for (const path of paths) {
      // standard
      document.cookie = `${name}=; expires=${expirations[0]}; path=${path};`;
      // secure
      document.cookie = `${name}=; expires=${expirations[0]}; path=${path}; secure;`;
      // host-scoped
      document.cookie = `${name}=; expires=${expirations[0]}; path=${path}; domain=${hostname};`;
    }
  }
}

async function purgePersistedState(): Promise<void> {
  const persistor = getPersistor();
  if (!persistor) return;
  await new Promise<void>((resolve) => {
    persistor.purge();
    // purge() is sync, but redux-persist schedules the localStorage write on
    // a microtask. Yield once so the write lands before navigation.
    setTimeout(resolve, 0);
  });
}

/**
 * Force redux-persist to write all pending state changes to localStorage.
 * Critical: must be called after any auth-state dispatch and BEFORE any
 * window.location navigation, otherwise the next page rehydrates stale state.
 */
async function flushPersistedState(): Promise<void> {
  const persistor = getPersistor();
  if (!persistor) return;
  await persistor.flush();
}

async function invalidateBackendSession(): Promise<void> {
  const store = getAppStore();
  if (!store) return;
  const token = store.getState().auth.accessToken;
  if (!token) return;
  // AbortController with a 2s timeout so a slow/unreachable backend never
  // blocks the user from signing out.
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2000);
  try {
    await fetch(`${API_BASE_URL}/auth/session/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ token }),
      signal: controller.signal,
    });
  } catch {
    // best-effort: sign-out must not be blocked by backend failures
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Sign out user by purging all client-side and backend auth state.
 * Ends with a hard navigation to ensure a fully fresh app instance.
 */
export async function handleSignOut(redirectUrl: string = "/"): Promise<void> {
  const store = getAppStore();
  if (store) {
    store.dispatch(apiSlice.util.resetApiState());
  }

  // Close the active SSE notification stream before we wipe auth state.
  // Without this, the previous EventSource stays alive on the old (now
  // invalidated) JWT and races against the next sign-in's connection,
  // eventually hitting the per-user connection cap (5).
  closeNotificationStream();

  await purgePersistedState();

  if (store) {
    store.dispatch(clearCredentials());
  }

  // Force the null auth state to be written to localStorage BEFORE navigation.
  // Without this, the next page rehydrates from the old (signed-in) state.
  await flushPersistedState();

  clearAuthCookie();
  clearBetterAuthCookies();

  await invalidateBackendSession();

  if (typeof window !== "undefined") {
    window.location.href = redirectUrl;
  }
}

/**
 * Sign out with loading state management.
 */
export async function handleSignOutWithLoading(
  setLoading: (loading: boolean) => void,
  redirectUrl: string = "/"
): Promise<void> {
  setLoading(true);
  try {
    await handleSignOut(redirectUrl);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Signout error:", error);
    }
    if (typeof window !== "undefined") {
      window.location.href = redirectUrl;
    }
  }
}
