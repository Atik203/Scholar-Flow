import { NextResponse } from "next/server";

// Define protected routes that require authentication
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
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/onboarding",
  "/papers",
  "/collections",
  "/workspaces",
  "/research",
  "/collaborate",
  "/ai-insights",
  "/products",
  "/resources",
  "/company",
  "/enterprise",
  "/careers",
  "/integrations",
  "/support",
  "/press",
  "/legal",
  "/license",
  "/security",
  "/simple",
  "/slides",
  "/teams-feature",
  "/test-button",
  "/test-session",
  "/debug-auth",
  "/dev",
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

export function proxy(request: Request) {
  const url = new URL(request.url);
  const { pathname } = url;

  const createRedirect = (redirectPath: string) => {
    return NextResponse.redirect(new URL(redirectPath, request.url));
  };

  const authenticated = isAuthenticated(request);

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

  // Backward-compat: redirect legacy role-segmented URLs to shared dashboard
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
    return createRedirect("/dashboard");
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
