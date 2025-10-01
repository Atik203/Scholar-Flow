"use client";

import { useSessionSync } from "@/hooks/useSessionSync";

/**
 * Session synchronization component
 * Keeps Redux state in sync with NextAuth session
 * Must be used within both NextAuthProvider and ReduxProvider
 */
export function SessionSyncProvider() {
  useSessionSync();
  return null; // This component doesn't render anything
}
