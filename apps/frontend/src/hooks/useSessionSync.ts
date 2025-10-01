"use client";

import { clearCredentials } from "@/redux/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";

/**
 * Production-grade session synchronization hook
 * Ensures Redux state stays in sync with NextAuth session
 * Prevents stale user data from persisting after signout
 *
 * This hook should be used in the root layout or a top-level provider
 */
export function useSessionSync() {
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();
  const reduxUser = useAppSelector((state) => state.auth.user);
  const lastSessionRef = useRef<string | null>(null);

  useEffect(() => {
    // Don't do anything while loading
    if (status === "loading") {
      return;
    }

    const currentSessionId = session?.user?.id || null;

    // Case 1: No NextAuth session but Redux has user data
    // This means user signed out or session expired - clear Redux
    if (!session && reduxUser) {
      console.log(
        "[SessionSync] No NextAuth session detected, clearing Redux state"
      );
      dispatch(clearCredentials());
      lastSessionRef.current = null;
      return;
    }

    // Case 2: NextAuth session exists but differs from last known session
    // This handles session switches (e.g., different user logged in)
    if (
      session &&
      currentSessionId &&
      lastSessionRef.current &&
      lastSessionRef.current !== currentSessionId
    ) {
      console.log("[SessionSync] Session changed, clearing old Redux state", {
        old: lastSessionRef.current,
        new: currentSessionId,
      });
      dispatch(clearCredentials());
    }

    // Update ref to current session
    lastSessionRef.current = currentSessionId;
  }, [session, status, reduxUser, dispatch]);

  return {
    isAuthenticated: !!session,
    isSyncing: status === "loading",
  };
}
