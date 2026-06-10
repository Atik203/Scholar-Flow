"use client";

/**
 * Better-Auth client hooks for Scholar-Flow
 * Provides session management that syncs with Redux auth state
 */

import { auth } from "@/lib/auth/better-auth";
import { createAuthClient } from "better-auth/react";

// Create the auth client with the correct base URL
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
});

// Export commonly used hooks
export const { useSession, signIn, signOut } = authClient;

// Re-export session type for convenience
export type { AuthSession, AuthUser } from "@/lib/auth/better-auth";
