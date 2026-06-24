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
  "/invitation",
];

// Legacy role-segmented prefixes. Visiting any of these redirects to the
// canonical (un-prefixed) path. Examples:
//   /dashboard/researcher            -> /dashboard
//   /dashboard/team-lead/workspaces/abc -> /dashboard/workspaces/abc
const LEGACY_ROLE_SEGMENTS = [
  "/dashboard/researcher",
  "/dashboard/pro-researcher",
  "/dashboard/team-lead",
  "/dashboard/admin",
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

  // Backward-compat: redirect legacy role-segmented URLs to the shared
  // dashboard. Matches exact root + nested subpaths. Preserves the tail
  // (including any nested resource like /workspaces/:id) so deep links
  // resolve correctly without a 404 flash.
  for (const segment of LEGACY_ROLE_SEGMENTS) {
    if (pathname === segment || pathname.startsWith(segment + "/")) {
      const tail = pathname.slice(segment.length);
      // For the admin segment, keep the per-resource pages alive (the
      // (app)/admin/* tree still exists), but drop the role prefix from
      // any nested subpath. /dashboard/admin -> /dashboard (since
      // /dashboard/admin/* is what the (app) tree currently uses).
      // Specifically: if admin has a known top-level resource we route to
      // its canonical /dashboard/* home; otherwise fall back to /dashboard.
      let target: string;
      if (segment === "/dashboard/admin") {
        // Admin subtree lives at /dashboard/admin/* under (app). We only
        // want to strip the role prefix when the request is *not* hitting
        // an admin resource. We detect that by checking whether the next
        // path segment matches an admin-only resource.
        const rest = tail.startsWith("/") ? tail.slice(1) : tail;
        const firstSegment = rest.split("/")[0];
        const adminResources = new Set([
          "users",
          "subscriptions",
          "plans",
          "payments",
          "reports",
          "audit",
          "webhooks",
          "api-keys",
          "moderation",
          "alerts",
          "system",
          "settings",
          "analytics",
        ]);
        if (!firstSegment || !adminResources.has(firstSegment)) {
          target = `/dashboard${tail || ""}`;
        } else {
          // Keep the admin path intact.
          return NextResponse.next();
        }
      } else {
        target = `/dashboard${tail}`;
      }
      return createRedirect(`${target}${url.search}`);
    }
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
