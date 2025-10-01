"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { getCallbackUrl, getRoleDashboardUrl } from "@/lib/auth/redirects";

interface UseAuthGuardOptions {
  redirectTo?: string;
  requireAuth?: boolean;
  redirectAuthenticatedTo?: string;
}

/**
 * Auth guard hook for client-side route protection
 * @param options Configuration options for the auth guard
 * @returns Authentication status and loading state
 */
export function useAuthGuard(options: UseAuthGuardOptions = {}) {
  const {
    redirectTo = "/login",
    requireAuth = true,
    redirectAuthenticatedTo,
  } = options;

  const { data: session, status } = useSession();
  const router = useRouter();
  const isLoading = status === "loading";
  const isAuthenticated = !!session;

  useEffect(() => {
    if (isLoading) return; // Don't redirect while session is loading

    // Redirect unauthenticated users from protected routes
    if (requireAuth && !isAuthenticated) {
      const currentPath = window.location.pathname;
      const loginUrl = new URL(redirectTo, window.location.origin);

      // Add callback URL for post-login redirect
      if (currentPath !== "/" && currentPath !== redirectTo) {
        loginUrl.searchParams.set("callbackUrl", currentPath);
      }

      router.replace(loginUrl.toString());
      return;
    }

    // Redirect authenticated users from auth routes
    if (!requireAuth && isAuthenticated && redirectAuthenticatedTo) {
      let destination = redirectAuthenticatedTo;

      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const callback = getCallbackUrl(params, destination);
        if (callback) {
          destination = callback;
        }
      }

      if (
        session?.user?.role &&
        (destination === "/dashboard" || destination === "/dashboard/")
      ) {
        destination = getRoleDashboardUrl(session.user.role);
      }

      router.replace(destination);
      return;
    }
  }, [
    isAuthenticated,
    isLoading,
    requireAuth,
    redirectTo,
    redirectAuthenticatedTo,
    router,
    session?.user?.role,
  ]);

  return {
    isAuthenticated,
    isLoading,
    session,
    user: session?.user || null,
  };
}

/**
 * Auth guard for protected pages - redirects to login if not authenticated
 */
export function useProtectedRoute(redirectTo: string = "/login") {
  return useAuthGuard({
    requireAuth: true,
    redirectTo,
  });
}

/**
 * Auth guard for auth pages - redirects to dashboard if already authenticated
 */
export function useAuthRoute(redirectTo: string = "/dashboard") {
  return useAuthGuard({
    requireAuth: false,
    redirectAuthenticatedTo: redirectTo,
  });
}

/**
 * Public route guard - allows access regardless of auth status
 */
export function usePublicRoute() {
  const { data: session, status } = useSession();

  return {
    isAuthenticated: !!session,
    isLoading: status === "loading",
    session,
    user: session?.user || null,
  };
}
