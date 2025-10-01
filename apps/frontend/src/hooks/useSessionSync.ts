"use client";

import { clearCredentials } from "@/redux/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Production-grade session synchronization hook
 * Ensures Redux state stays in sync with NextAuth session
 * Prevents stale user data from persisting after signout
 * Smart enough to not interfere with login/OAuth flows
 *
 * This hook should be used in the root layout or a top-level provider
 */
export function useSessionSync() {
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();
  const reduxUser = useAppSelector((state) => state.auth.user);
  const pathname = usePathname();
  const lastSessionRef = useRef<string | null>(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    // CRITICAL: Don't sync on auth pages to avoid clearing during login/OAuth
    const authPages = ["/login", "/register", "/auth"];
    const isAuthPage = authPages.some((page) => pathname?.startsWith(page));

    // CRITICAL: Wait for NextAuth to finish loading before making decisions
    if (status === "loading") {
      return;
    }

    // On initial mount, give NextAuth extra time to initialize (1 second)
    // This prevents clearing state during login flow
    if (isInitialMount.current) {
      isInitialMount.current = false;
      const timer = setTimeout(() => {
        // Re-check after delay, but don't clear if on auth page
        if (
          status === "unauthenticated" &&
          !session &&
          reduxUser &&
          !isAuthPage
        ) {
          console.log(
            "[SessionSync] Initial mount: No session after delay, clearing Redux"
          );
          dispatch(clearCredentials());
        }
      }, 1000); // Increased to 1 second
      return () => clearTimeout(timer);
    }

    const currentSessionId = session?.user?.id || null;

    // Case 1: Session is explicitly unauthenticated (not loading, not authenticated)
    // AND Redux still has user data - this is stale data that needs clearing
    // BUT don't clear if on auth page (login in progress)
    if (status === "unauthenticated" && !session && reduxUser && !isAuthPage) {
      console.log(
        "[SessionSync] NextAuth status is 'unauthenticated', clearing Redux state"
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
  }, [session, status, reduxUser, dispatch, pathname]);

  return {
    isAuthenticated: !!session,
    isSyncing: status === "loading",
  };
}
