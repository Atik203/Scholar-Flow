/**
 * Simple sign-out utility using Redux
 * Clears auth state and resets API cache
 */

import { clearCredentials } from "@/redux/auth/authSlice";
import { resetAppState } from "@/redux/storeAccess";

/**
 * Sign out user by clearing Redux auth state
 */
export async function handleSignOut(redirectUrl: string = "/"): Promise<void> {
  // Reset API cache first
  resetAppState();

  // Clear auth credentials from Redux (and persisted storage)
  const store = await import("@/redux/storeAccess").then((m) => m.getAppStore());
  if (store) {
    store.dispatch(clearCredentials());
  }

  // Redirect to specified URL
  if (typeof window !== "undefined") {
    window.location.replace(redirectUrl);
  }
}

/**
 * Sign out with loading state management
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
    // Still redirect even on error
    if (typeof window !== "undefined") {
      window.location.replace(redirectUrl);
    }
  }
}
