"use client";

/**
 * Utility functions for handling authentication redirects and navigation
 */

/**
 * Get the callback URL from query parameters or use a default
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
        "/profile",
        "/papers",
        "/collections",
        "/collaborate",
        "/settings",
        "/admin",
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
 */
export function handleAuthRedirect(
  isSuccess: boolean,
  searchParams?: URLSearchParams,
  errorUrl: string = "/login"
): string {
  if (isSuccess) {
    return getCallbackUrl(searchParams);
  }
  return errorUrl;
}

/**
 * Smart navigation based on authentication status
 */
export function getSmartRedirectUrl(
  isAuthenticated: boolean,
  currentPath: string
): string | null {
  // If user is authenticated and on auth pages, redirect to dashboard
  if (
    isAuthenticated &&
    ["/login", "/register", "/auth/signin"].includes(currentPath)
  ) {
    return "/dashboard";
  }

  // If user is not authenticated and on protected routes, redirect to login
  const protectedRoutes = [
    "/dashboard",
    "/profile",
    "/papers",
    "/collections",
    "/collaborate",
    "/settings",
    "/admin",
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
 */
export function getGetStartedUrl(
  isAuthenticated: boolean,
  currentPath: string = "/"
): string {
  if (isAuthenticated) {
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
