"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getCallbackUrl, getRoleDashboardUrl } from "@/lib/auth/redirects";
import { useAuth } from "@/redux/auth/useAuth";

interface UseAuthGuardOptions {
  redirectTo?: string;
  requireAuth?: boolean;
  redirectAuthenticatedTo?: string;
}

/**
 * Simplified auth guard hook using Redux auth state
 */
export function useAuthGuard(options: UseAuthGuardOptions = {}) {
  const {
    redirectTo = "/login",
    requireAuth = true,
    redirectAuthenticatedTo,
  } = options;

  const { user, status, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    // Redirect unauthenticated users from protected routes
    if (requireAuth && !isAuthenticated) {
      const currentPath = window.location.pathname;
      const loginUrl = new URL(redirectTo, window.location.origin);

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
        user?.role &&
        (destination === "/dashboard" || destination === "/dashboard/")
      ) {
        destination = getRoleDashboardUrl(user.role);
      }

      router.replace(destination);
      return;
    }
  }, [isAuthenticated, status, requireAuth, redirectTo, redirectAuthenticatedTo, router, user?.role]);

  return {
    isAuthenticated,
    status,
    isLoading,
    session: isAuthenticated ? { user } : null,
    user: isAuthenticated ? user : null,
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
  const { user, isAuthenticated, isLoading, status } = useAuth();

  return {
    isAuthenticated,
    isLoading,
    status,
    session: isAuthenticated ? { user } : null,
    user: isAuthenticated ? user : null,
  };
}
