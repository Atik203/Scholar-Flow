"use client";

import { getRoleSlug } from "./roles";

/**
 * Utility functions for handling authentication redirects and navigation
 */

/**
 * Get the role-based dashboard URL for a user
 * @param role - User's role
 * @returns Role-scoped dashboard path (e.g., /dashboard/researcher)
 */
export function getRoleDashboardUrl(role?: string): string {
  const roleSlug = getRoleSlug(role);
  return `/dashboard/${roleSlug}`;
}

/**
 * Get the callback URL from query parameters or use a default
 * Note: defaultUrl will be overridden with role-specific path if user session is available
 */
export function getCallbackUrl(
  searchParams?: URLSearchParams,
  defaultUrl: string = "/dashboard"
): string {
  if (typeof window === "undefined") return defaultUrl;

  // Try to get from search params first
  if (searchParams) {
    const callbackUrl = searchParams.get("callbackUrl");
    if (callbackUrl) {
      return validateCallbackUrl(callbackUrl, defaultUrl);
    }
  }

  // Try to get from current URL
  const urlParams = new URLSearchParams(window.location.search);
  const callbackUrl = urlParams.get("callbackUrl");

  if (callbackUrl) {
    return validateCallbackUrl(callbackUrl, defaultUrl);
  }

  return defaultUrl;
}

/**
 * Validate that a callback URL is safe and allowed
 */
export function validateCallbackUrl(
  url: string,
  fallback: string = "/dashboard"
): string {
  try {
    // Allow relative URLs
    if (url.startsWith("/")) {
      // Prevent open redirects - only allow our own paths
      const allowedPaths = [
        "/dashboard",
        "/dashboard/researcher",
        "/dashboard/pro-researcher",
        "/dashboard/team-lead",
        "/dashboard/admin",
        "/profile",
        "/papers",
        "/collections",
        "/collaborate",
        "/settings",
      ];

      const isAllowed = allowedPaths.some(
        (path) => url === path || url.startsWith(path + "/")
      );

      return isAllowed ? url : fallback;
    }

    // For absolute URLs, ensure they're from the same origin
    const parsedUrl = new URL(url);
    const currentOrigin = window.location.origin;

    if (parsedUrl.origin === currentOrigin) {
      return validateCallbackUrl(parsedUrl.pathname, fallback);
    }

    return fallback;
  } catch {
    return fallback;
  }
}

/**
 * Build a login URL with callback parameter
 */
export function buildLoginUrl(callbackUrl?: string): string {
  const loginUrl = new URL("/login", window.location.origin);

  if (callbackUrl) {
    const validatedCallback = validateCallbackUrl(callbackUrl);
    if (validatedCallback !== "/dashboard") {
      loginUrl.searchParams.set("callbackUrl", validatedCallback);
    }
  }

  return loginUrl.toString();
}

/**
 * Build a register URL with callback parameter
 */
export function buildRegisterUrl(callbackUrl?: string): string {
  const registerUrl = new URL("/register", window.location.origin);

  if (callbackUrl) {
    const validatedCallback = validateCallbackUrl(callbackUrl);
    if (validatedCallback !== "/dashboard") {
      registerUrl.searchParams.set("callbackUrl", validatedCallback);
    }
  }

  return registerUrl.toString();
}

/**
 * Handle post-authentication redirect
 * @param isSuccess - Whether authentication was successful
 * @param searchParams - URL search parameters that may contain callbackUrl
 * @param errorUrl - URL to redirect to on error
 * @param userRole - Optional user role to redirect to role-specific dashboard
 */
export function handleAuthRedirect(
  isSuccess: boolean,
  searchParams?: URLSearchParams,
  errorUrl: string = "/login",
  userRole?: string
): string {
  if (isSuccess) {
    const callbackUrl = getCallbackUrl(searchParams);

    // If callback is the generic /dashboard and we have a role, use role-specific dashboard
    if (callbackUrl === "/dashboard" && userRole) {
      return getRoleDashboardUrl(userRole);
    }

    return callbackUrl;
  }
  return errorUrl;
}

/**
 * Smart navigation based on authentication status
 * @param isAuthenticated - Whether the user is authenticated
 * @param currentPath - Current pathname
 * @param userRole - Optional user role for role-specific dashboard redirect
 */
export function getSmartRedirectUrl(
  isAuthenticated: boolean,
  currentPath: string,
  userRole?: string
): string | null {
  // If user is authenticated and on auth pages, redirect to dashboard
  if (
    isAuthenticated &&
    ["/login", "/register", "/auth/signin"].includes(currentPath)
  ) {
    // If we have a user role, redirect to role-specific dashboard
    if (userRole) {
      return getRoleDashboardUrl(userRole);
    }
    // Fallback to generic dashboard (middleware will redirect to role-specific)
    return "/dashboard";
  }

  // If user is not authenticated and on protected routes, redirect to login
  const protectedRoutes = [
    "/dashboard",
    "/dashboard/researcher",
    "/dashboard/pro-researcher",
    "/dashboard/team-lead",
    "/dashboard/admin",
    "/profile",
    "/papers",
    "/collections",
    "/collaborate",
    "/settings",
  ];
  const isProtectedRoute = protectedRoutes.some(
    (route) => currentPath === route || currentPath.startsWith(route + "/")
  );

  if (!isAuthenticated && isProtectedRoute) {
    return buildLoginUrl(currentPath);
  }

  return null;
}

/**
 * Enhanced "Get Started" navigation logic
 * @param isAuthenticated - Whether the user is authenticated
 * @param currentPath - Current pathname
 * @param userRole - Optional user role for role-specific dashboard redirect
 */
export function getGetStartedUrl(
  isAuthenticated: boolean,
  currentPath: string = "/",
  userRole?: string
): string {
  if (isAuthenticated) {
    // If we have a user role, redirect to role-specific dashboard
    if (userRole) {
      return getRoleDashboardUrl(userRole);
    }
    // Fallback to generic dashboard (middleware will redirect to role-specific)
    return "/dashboard";
  }

  // For unauthenticated users, go to login with callback if not on home page
  if (
    currentPath !== "/" &&
    currentPath !== "/login" &&
    currentPath !== "/register"
  ) {
    return buildLoginUrl(currentPath);
  }

  return "/login";
}
