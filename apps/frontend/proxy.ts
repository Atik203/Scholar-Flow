import { getRoleBySlug, getRoleSlug } from "@/lib/auth/roles";
import { NextResponse } from "next/server";

// Define protected routes that require authentication
const protectedRoutes = [
  "/dashboard",
  "/dashboard/researcher",
  "/dashboard/pro-researcher",
  "/dashboard/team-lead",
  "/dashboard/admin",
];

// Define auth routes that should redirect to dashboard if user is already logged in
const authRoutes = ["/login", "/register", "/auth/signin"];

// Define public routes that don't require authentication
const publicRoutes = [
  "/",
  "/about",
  "/features",
  "/how-it-works",
  "/pricing",
  "/contact",
  "/faq",
  "/terms",
  "/privacy",
  "/papers",
  "/collections",
  "/workspaces",
  "/research",
  "/collaborations",
  "/collaborate",
  "/ai-insights",
  "/products",
  "/company",
];

// Helper function to check if route matches pattern
function matchesRoute(routes: string[], path: string): boolean {
  return routes.some((route) => path === route || path.startsWith(route + "/"));
}

// Helper to check if user is authenticated via cookies
function isAuthenticated(request: Request): boolean {
  const cookieHeader = request.headers.get("cookie") || "";
  // Check for our lightweight auth cookie (set by Redux authSlice)
  const hasSfAuth = cookieHeader.includes("sf_auth=1");
  // Check for better-auth session cookie
  const hasBetterAuth = cookieHeader.includes("better-auth.session_token");
  return hasSfAuth || hasBetterAuth;
}

// Helper to extract role from cookies (if available)
function getRoleFromCookies(request: Request): string | undefined {
  const cookieHeader = request.headers.get("cookie") || "";
  // Try to extract role from better-auth cookie data
  // This is a simplified check — the actual role is managed by Redux on the client
  return undefined;
}

export function proxy(request: Request) {
  const url = new URL(request.url);
  const { pathname } = url;

  // Helper function to create redirect response
  const createRedirect = (redirectPath: string) => {
    return NextResponse.redirect(new URL(redirectPath, request.url));
  };

  const authenticated = isAuthenticated(request);
  const userRole = getRoleFromCookies(request);

  // 1. Handle API routes - let them pass through (especially auth endpoints)
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // 2. Handle static files and Next.js internals
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/static/") ||
    pathname.includes(".") // files with extensions
  ) {
    return NextResponse.next();
  }

  // 3. Handle auth routes when user is already authenticated
  const callbackUrl = url.searchParams.get("callbackUrl");

  if (authenticated && matchesRoute(authRoutes, pathname)) {
    // If user is authenticated and on auth page with callbackUrl, redirect to callback
    if (callbackUrl) {
      return createRedirect(callbackUrl);
    }

    // If user is authenticated on auth page without callback, redirect to dashboard
    const roleSlug = getRoleSlug(userRole);
    const dashboardPath = `/dashboard/${roleSlug}`;
    return createRedirect(dashboardPath);
  }

  // 4. Handle protected routes when user is not authenticated
  // DISABLED: Let client-side useAuthGuard handle this to avoid race conditions
  // after login when the cookie isn't immediately available in middleware
  if (!authenticated && matchesRoute(protectedRoutes, pathname)) {
    // Allow the request through - client-side guards will handle redirect if needed
    return NextResponse.next();
  }

  // 5. Handle public routes - allow access regardless of auth status
  if (matchesRoute(publicRoutes, pathname)) {
    return NextResponse.next();
  }

  // 5.1. Redirect legacy dashboard routes without role segment
  if (authenticated && pathname.startsWith("/dashboard/")) {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length > 1) {
      const maybeRoleSlug = segments[1];
      const hasRoleSegment = !!getRoleBySlug(maybeRoleSlug);

      if (!hasRoleSegment) {
        const roleSlug = getRoleSlug(userRole);
        const newPath = ["/dashboard", roleSlug, ...segments.slice(1)].join(
          "/"
        );
        const redirectUrl = new URL(
          newPath + url.search,
          request.url
        );
        return NextResponse.redirect(redirectUrl);
      }
    }
  }

  // 6. Handle root path based on authentication status
  if (pathname === "/") {
    return NextResponse.next();
  }

  // 7. Default behavior for unmatched routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)",
  ],
};
