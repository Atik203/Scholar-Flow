import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Define protected routes that require authentication
const protectedRoutes = ["/dashboard", "/profile", "/settings", "/admin"];

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
  // Products are public-facing marketing pages
  "/papers",
  "/collections",
  "/collaborate",
  "/ai-insights",
  "/products",
  // Company pages are public
  "/about",
  "/contact",
  "/company",
];

export default withAuth(
  function middleware(request) {
    const { pathname } = request.nextUrl;
    const token = (request as any).nextauth?.token;
    const isAuthenticated = !!token;

    // Helper function to create redirect response
    const createRedirect = (url: string) => {
      return NextResponse.redirect(new URL(url, request.url));
    };

    // Helper function to check if route matches pattern
    const matchesRoute = (routes: string[], path: string) => {
      return routes.some(
        (route) => path === route || path.startsWith(route + "/")
      );
    };

    // 1. Handle API routes - let them pass through
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
    if (isAuthenticated && matchesRoute(authRoutes, pathname)) {
      console.log(
        `🔄 Redirecting authenticated user from ${pathname} to /dashboard`
      );
      return createRedirect("/dashboard");
    }

    // 4. Handle protected routes when user is not authenticated
    if (!isAuthenticated && matchesRoute(protectedRoutes, pathname)) {
      console.log(
        `🔒 Redirecting unauthenticated user from ${pathname} to /login`
      );
      // Store the intended destination for post-login redirect
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // 5. Handle public routes - allow access regardless of auth status
    if (matchesRoute(publicRoutes, pathname)) {
      return NextResponse.next();
    }

    // 6. Handle root path based on authentication status
    if (pathname === "/") {
      if (isAuthenticated) {
        // Optionally redirect authenticated users to dashboard from home
        // For now, let them see the marketing page
        return NextResponse.next();
      }
      return NextResponse.next();
    }

    // 7. Default behavior for unmatched routes
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Always authorize for public routes and auth routes
        if (
          matchesRoute(publicRoutes, pathname) ||
          matchesRoute(authRoutes, pathname) ||
          pathname.startsWith("/api/") ||
          pathname.startsWith("/_next/") ||
          pathname.startsWith("/static/") ||
          pathname.includes(".")
        ) {
          return true;
        }

        // For protected routes, require token
        if (matchesRoute(protectedRoutes, pathname)) {
          return !!token;
        }

        // Default to allowing access
        return true;
      },
    },
  }
);

// Helper function used in callbacks
function matchesRoute(routes: string[], path: string): boolean {
  return routes.some((route) => path === route || path.startsWith(route + "/"));
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
