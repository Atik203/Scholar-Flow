/**
 * Utility function for handling sign out properly
 * Only manages Redux state and NextAuth session
 */

import { resetAppState } from "@/redux/storeAccess";
import { signOut as nextAuthSignOut } from "next-auth/react";

type SignOutResponse = { url?: string } | string | undefined;

/**
 * Sign out and redirect to home page
 * This clears Redux state and NextAuth session only
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
    // Reset Redux state only
    resetAppState();
  }

  if (typeof window !== "undefined") {
    try {
      const finalUrl = targetUrl || absoluteCallbackUrl || redirectUrl;
      // Navigate to the target URL
      window.location.href = finalUrl;
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Redirect error after sign out:", error);
      }
      window.location.replace(targetUrl || redirectUrl);
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
