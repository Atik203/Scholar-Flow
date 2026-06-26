/**
 * Simple auth helper functions for credentials and OAuth login
 * Uses Redux for state management instead of NextAuth
 */

import { setCredentials } from "@/redux/auth/authSlice";
import type { AppDispatch } from "@/redux/store";
import { getPersistor } from "@/redux/storeAccess";
import type { TUser } from "@/types/user";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    user: TUser;
    accessToken: string;
  };
}

/**
 * Sign in with email and password
 */
export async function signInWithCredentials(
  email: string,
  password: string,
  dispatch: AppDispatch
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data: AuthResponse = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.message || "Invalid email or password",
      };
    }

    if (!data.data?.user || !data.data?.accessToken) {
      return {
        success: false,
        error: "Authentication response was incomplete",
      };
    }

    // Store credentials in Redux (will be persisted automatically)
    dispatch(
      setCredentials({
        user: data.data.user,
        accessToken: data.data.accessToken,
      })
    );

    // Set last auth provider cookie
    document.cookie = `sf_last_auth=credentials; path=/; max-age=604800; samesite=lax`;

    // Force the new auth state to localStorage so a subsequent hard navigation
    // rehydrates the correct user/token instead of the previous account's.
    await flushAuthState();

    return { success: true };
  } catch (error) {
    console.error("Sign-in error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

/**
 * Initiate OAuth sign-in by redirecting to provider
 */
export function signInWithOAuth(
  provider: "google" | "github",
  callbackUrl?: string
): void {
  const callback =
    callbackUrl || window.location.origin + "/auth/callback/" + provider;

  // Redirect to backend OAuth endpoint which will handle the OAuth flow
  const oauthUrl = `${API_BASE_URL}/auth/oauth/${provider}?callbackUrl=${encodeURIComponent(callback)}`;
  window.location.href = oauthUrl;
}

/**
 * Complete OAuth sign-in after callback
 * This should be called in the OAuth callback route
 */
export async function completeOAuthSignIn(
  provider: "google" | "github",
  code: string,
  dispatch: AppDispatch
): Promise<{ success: boolean; error?: string; user?: TUser }> {
  try {
    console.log(`🔐 Completing ${provider} OAuth with code...`);

    const response = await fetch(
      `${API_BASE_URL}/auth/oauth/${provider}/callback`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      }
    );

    const data: AuthResponse = await response.json();
    console.log(`📥 ${provider} OAuth response:`, {
      success: data.success,
      hasUser: !!data.data?.user,
      hasToken: !!data.data?.accessToken,
    });

    if (!response.ok || !data.success) {
      console.error(`❌ ${provider} OAuth failed:`, data.message);
      return {
        success: false,
        error: data.message || `${provider} authentication failed`,
      };
    }

    if (!data.data?.user || !data.data?.accessToken) {
      console.error(`❌ ${provider} OAuth incomplete response:`, data);
      return {
        success: false,
        error: "Authentication response was incomplete",
      };
    }

    // Store credentials in Redux
    console.log(`✅ Storing ${provider} OAuth credentials in Redux`);
    dispatch(
      setCredentials({
        user: data.data.user,
        accessToken: data.data.accessToken,
      })
    );

    // Set last auth provider cookie
    document.cookie = `sf_last_auth=${provider}; path=/; max-age=604800; samesite=lax`;

    // Force the new auth state to localStorage so the upcoming hard navigation
    // rehydrates the correct user/token instead of the previous account's.
    await flushAuthState();

    return { success: true, user: data.data.user };
  } catch (error) {
    console.error(`${provider} OAuth error:`, error);
    return {
      success: false,
      error: "An unexpected error occurred during authentication",
    };
  }
}

/**
 * Force redux-persist to write all pending state changes to localStorage.
 * Must be called after any auth-state dispatch and BEFORE any hard navigation,
 * otherwise the next page rehydrates from the old persisted state.
 */
async function flushAuthState(): Promise<void> {
  const persistor = getPersistor();
  if (!persistor) return;
  try {
    await persistor.flush();
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[authHelpers] persistor.flush failed:", error);
    }
  }
}
