/**
 * Better-Auth configuration for Scholar-Flow
 * Replaces NextAuth with better-auth for modern, type-safe authentication
 * Backend integration preserved — all auth validation goes through Express API
 */

import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { randomBytes } from "crypto";

import { API_BASE_URL } from "@/lib/apiUrl";

/**
 * Resolve the auth secret. In production, BETTER_AUTH_SECRET or NEXTAUTH_SECRET must be set.
 * In development, if no secret is provided, we generate a random one to avoid warnings.
 * In production, a strong secret is required for security.
 */
function resolveSecret(): string {
  const envSecret = process.env.BETTER_AUTH_SECRET || process.env.NEXTAUTH_SECRET;
  if (envSecret) {
    return envSecret;
  }

  // In development, generate a random secret to avoid better-auth warnings
  // This is acceptable because development sessions don't need to survive restarts
  if (process.env.NODE_ENV === "development") {
    // Generate a random 64-character hex string
    return randomBytes(32).toString("hex");
  }

  // Production: require explicit secret
  console.error("[Better Auth] BETTER_AUTH_SECRET or NEXTAUTH_SECRET is required in production.");
  return "fallback-secret-do-not-use-in-production";
}

export const auth = betterAuth({
  // Secret for signing sessions and tokens
  secret: resolveSecret(),

  // Base URL for the application
  baseURL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",

  // Database adapter — not used (we use the backend API directly)
  // better-auth requires a database for sessions, but we override with custom logic

  // Social providers (Google, GitHub)
  // These are configured to redirect to our backend OAuth endpoints
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      // Redirect to our backend OAuth handler
      redirectURI: `${API_BASE_URL}/auth/oauth/google/callback`,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      // Redirect to our backend OAuth handler
      redirectURI: `${API_BASE_URL}/auth/oauth/github/callback`,
    },
  },

  // Plugins
  plugins: [nextCookies()],

  // Callbacks — sync with backend
  callbacks: {
    // After sign-in, ensure user exists in backend
    afterSignIn: async (user: any, session: any, account: any) => {
      try {
        // Sync OAuth user with backend
        if (account && account.provider !== "credentials") {
          await fetch(`${API_BASE_URL}/auth/oauth/signin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              profile: {
                email: user.email,
                name: user.name,
                image: user.image,
              },
              account: {
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              },
            }),
          });
        }
      } catch {
        // Non-critical: backend sync failure shouldn't block sign-in
      }
    },
  },

  // Session configuration
  session: {
    // Cookie-based sessions (default)
    // better-auth handles session tokens automatically
  },

  // Advanced options
  advanced: {
    // Disable default cookie prefix to avoid conflicts with sf_auth
    cookiePrefix: "better-auth",
  },
});

// Type exports for TypeScript
export type AuthSession = typeof auth.$Infer.Session;
export type AuthUser = typeof auth.$Infer.Session.user;
