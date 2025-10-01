/**
 * Production-grade signout utility
 * Handles complete session cleanup without showing NextAuth confirmation page
 * Senior-level implementation with proper state management and error handling
 */

import { resetAppState } from "@/redux/storeAccess";

/**
 * Get CSRF token for NextAuth signout API call
 * This is required for the POST request to /api/auth/signout
 */
async function getCsrfToken(): Promise<string | null> {
  try {
    const response = await fetch("/api/auth/csrf");
    const data = await response.json();
    return data.csrfToken || null;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Failed to get CSRF token:", error);
    }
    return null;
  }
}

/**
 * Sign out user by calling NextAuth API directly
 * This bypasses the default NextAuth signout page completely
 *
 * @param redirectUrl - URL to redirect to after sign out (default: "/")
 */
export async function handleSignOut(redirectUrl: string = "/"): Promise<void> {
  // Step 1: Clear Redux state immediately (optimistic update)
  resetAppState();

  try {
    // Step 2: Get CSRF token for secure signout
    const csrfToken = await getCsrfToken();

    // Step 3: Call NextAuth signout API directly
    const signoutUrl = "/api/auth/signout";
    const body = new URLSearchParams({
      callbackUrl: redirectUrl,
      ...(csrfToken && { csrfToken }),
    });

    // Use fetch to call signout API directly (no redirect)
    await fetch(signoutUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
      credentials: "include", // Important: include cookies
    });

    // Step 4: Aggressively clear ALL NextAuth cookies with every possible attribute
    if (typeof document !== "undefined") {
      const cookiesToClear = [
        "next-auth.session-token",
        "__Secure-next-auth.session-token",
        "next-auth.callback-url",
        "__Secure-next-auth.callback-url",
        "next-auth.csrf-token",
        "__Host-next-auth.csrf-token",
      ];

      // Clear known NextAuth cookies
      cookiesToClear.forEach((cookieName) => {
        // Try every possible combination to ensure deletion
        const deletionStrings = [
          `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`,
          `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure;`,
          `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; samesite=lax;`,
          `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure; samesite=lax;`,
          `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`,
          `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}; secure;`,
          `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`,
          `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname}; secure;`,
        ];
        deletionStrings.forEach((str) => (document.cookie = str));
      });

      // Also scan and clear any cookie that looks like NextAuth
      document.cookie.split(";").forEach((cookie) => {
        const [name] = cookie.split("=");
        const trimmedName = name.trim();
        if (
          trimmedName.includes("next-auth") ||
          trimmedName.includes("__Secure-next-auth") ||
          trimmedName.includes("__Host-next-auth")
        ) {
          const deletionStrings = [
            `${trimmedName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`,
            `${trimmedName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure;`,
            `${trimmedName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`,
            `${trimmedName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}; secure;`,
            `${trimmedName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`,
          ];
          deletionStrings.forEach((str) => (document.cookie = str));
        }
      });
    }
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Signout API error:", error);
    }
    // Continue with redirect even if API call fails
  }

  // Step 5: Force navigation to clear any cached state
  if (typeof window !== "undefined") {
    // Use location.replace to prevent back button from returning to authenticated pages
    window.location.replace(redirectUrl);
  }
}

/**
 * Sign out with loading state management
 * Useful for UI components that need to show loading indicators
 *
 * @param setLoading - Function to update loading state
 * @param redirectUrl - URL to redirect to after sign out (default: "/")
 */
export async function handleSignOutWithLoading(
  setLoading: (loading: boolean) => void,
  redirectUrl: string = "/"
): Promise<void> {
  setLoading(true);
  try {
    await handleSignOut(redirectUrl);
    // Note: setLoading(false) won't be called because we redirect
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
