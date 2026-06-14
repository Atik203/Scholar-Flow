import { getRoleSlug } from "@/lib/auth/roles";
import { NextResponse } from "next/server";

// Define protected routes that require authentication
// Phase 3: Single dashboard root + admin subroute
const protectedRoutes = ["/dashboard"];

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

// Legacy role-segmented dashboard prefixes that need to redirect
// to the new (app)/ route group after Phase 3 restructure.
const legacyRoleSegments = [
  "/dashboard/researcher",
  "/dashboard/pro-researcher",
  "/dashboard/team-lead",
];

// Helper function to check if route matches pattern
function matchesRoute(routes: string[], path: string): boolean {
  return routes.some((route) => path === route || path.startsWith(route + "/"));
}

// Helper to check if user is authenticated via cookies
function isAuthenticated(request: Request): boolean {
  const cookieHeader = request.headers.get("cookie") || "";
  const hasSfAuth = cookieHeader.includes("sf_auth=1");
  const hasBetterAuth = cookieHeader.includes("better-auth.session_token");
  return hasSfAuth || hasBetterAuth;
}

// Helper to extract role from cookies (if available)
function getRoleFromCookies(request: Request): string | undefined {
  const cookieHeader = request.headers.get("cookie") || "";
  return undefined;
}

export function proxy(request: Request) {
  const url = new URL(request.url);
  const { pathname } = url;

  const createRedirect = (redirectPath: string) => {
    return NextResponse.redirect(new URL(redirectPath, request.url));
  };

  const authenticated = isAuthenticated(request);
  const userRole = getRoleFromCookies(request);

  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/static/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Backward-compat: rewrite legacy role-segmented URLs to the new shared
  // (app)/ route group. /dashboard/admin is preserved (still an admin route).
  if (pathname === "/dashboard/researcher" || pathname.startsWith("/dashboard/researcher/")) {
    const tail = pathname.slice("/dashboard/researcher".length);
    return createRedirect(`/dashboard${tail}${url.search}`);
  }
  if (pathname === "/dashboard/pro-researcher" || pathname.startsWith("/dashboard/pro-researcher/")) {
    const tail = pathname.slice("/dashboard/pro-researcher".length);
    return createRedirect(`/dashboard${tail}${url.search}`);
  }
  if (pathname === "/dashboard/team-lead" || pathname.startsWith("/dashboard/team-lead/")) {
    const tail = pathname.slice("/dashboard/team-lead".length);
    return createRedirect(`/dashboard${tail}${url.search}`);
  }

  const callbackUrl = url.searchParams.get("callbackUrl");

  if (authenticated && matchesRoute(authRoutes, pathname)) {
    if (callbackUrl) {
      return createRedirect(callbackUrl);
    }
    const roleSlug = getRoleSlug(userRole);
    const dashboardPath = `/dashboard/${roleSlug}`;
    return createRedirect(dashboardPath);
  }

  if (!authenticated && matchesRoute(protectedRoutes, pathname)) {
    return NextResponse.next();
  }

  if (matchesRoute(publicRoutes, pathname)) {
    return NextResponse.next();
  }

  if (pathname === "/") {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)",
  ],
};
