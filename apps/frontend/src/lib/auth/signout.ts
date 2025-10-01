/**
 * Utility function for handling sign out properly
 * Ensures complete session cleanup on both client and server
 */

import { resetAppState } from "@/redux/storeAccess";
import { signOut as nextAuthSignOut } from "next-auth/react";

type SignOutResponse = { url?: string } | string | undefined;

function clearNextAuthCookies() {
  if (typeof document === "undefined") {
    return;
  }

  const cookieNames = [
    "next-auth.session-token",
    "__Secure-next-auth.session-token",
    "next-auth.callback-url",
    "__Secure-next-auth.callback-url",
    "next-auth.csrf-token",
    "__Secure-next-auth.csrf-token",
  ];

  const expiration = "Thu, 01 Jan 1970 00:00:00 GMT";
  const isSecure =
    typeof window !== "undefined" && window.location.protocol === "https:";
  const baseAttributes = `path=/; expires=${expiration}; SameSite=Lax${
    isSecure ? "; Secure" : ""
  }`;
  cookieNames.forEach((cookieName) => {
    try {
      document.cookie = `${cookieName}=; ${baseAttributes}`;

      if (typeof window !== "undefined" && window.location.hostname) {
        document.cookie = `${cookieName}=; path=/; domain=${window.location.hostname}; expires=${expiration}; SameSite=Lax${
          isSecure ? "; Secure" : ""
        }`;
      }
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`Failed to clear cookie ${cookieName}:`, error);
      }
    }
  });
}

/**
 * Clear all service worker caches
 */
async function clearServiceWorkerCaches() {
  if (typeof window === "undefined" || !("caches" in window)) {
    return;
  }

  try {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map((cacheName) => {
        if (process.env.NODE_ENV !== "production") {
          console.log(`Clearing cache: ${cacheName}`);
        }
        return caches.delete(cacheName);
      })
    );
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Failed to clear service worker caches:", error);
    }
  }
}

/**
 * Sign out and redirect to home page with full page reload
 * This ensures all client-side state and session data is cleared
 *
 * @param redirectUrl - URL to redirect to after sign out (default: "/")
 */
export async function handleSignOut(redirectUrl: string = "/"): Promise<void> {
  const absoluteCallbackUrl = (() => {
    if (typeof window === "undefined") {
      return redirectUrl;
    }
    try {
      return new URL(redirectUrl, window.location.origin).toString();
    } catch {
      return redirectUrl;
    }
  })();

  let targetUrl: string | undefined = absoluteCallbackUrl;

  try {
    const response = (await nextAuthSignOut({
      redirect: false,
      callbackUrl: absoluteCallbackUrl,
    })) as SignOutResponse;

    if (response) {
      if (typeof response === "string") {
        targetUrl = response;
      } else if (typeof response === "object" && response.url) {
        targetUrl = response.url;
      }
    }
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Sign out API error:", error);
    }
  } finally {
    try {
      await resetAppState();
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("Failed to reset app state during sign out:", error);
      }
    }

    clearNextAuthCookies();

    await clearServiceWorkerCaches();
  }

  if (typeof window !== "undefined") {
    try {
      const finalUrl = targetUrl || absoluteCallbackUrl || redirectUrl;
      // Use location.href with hard reload to clear all cached state
      window.location.href = finalUrl;
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Redirect error after sign out:", error);
      }
      window.location.replace(targetUrl);
    }
  }
}

/**
 * Sign out with a loading state callback
 * Useful for UI components that need to show loading state
 *
 * @param setLoading - Function to set loading state
 * @param redirectUrl - URL to redirect to after sign out (default: "/")
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
      console.error("Sign out error with loading state:", error);
    }
    setLoading(false);
  }
}
