/**
 * Middleware with server-side route protection.
 * NOTE: Redux-Persist stores auth in localStorage (not cookies), so we use
 * a lightweight `sf_auth` cookie (set by the auth helpers on login/logout)
 * to detect authentication status at the server/edge level.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // 1. Handle API routes - let them pass through
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // 2. Handle static files and Next.js internals
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/static/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 3. Protect dashboard routes — require authentication token cookie
  if (pathname.startsWith("/dashboard")) {
    // Check for our lightweight auth presence cookie
    // This cookie is set by auth helpers (see lib/auth/authCookies.ts) on login/logout
    const authCookie = request.cookies.get("sf_auth")?.value;

    if (!authCookie) {
      // Only redirect if we are not already being redirected (prevents loops)
      const callbackUrl = searchParams.get("callbackUrl");
      if (!callbackUrl) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
      }
    }
  }

  // 4. Redirect authenticated users away from auth pages (only if cookie present)
  if (pathname === "/login" || pathname === "/register") {
    const authCookie = request.cookies.get("sf_auth")?.value;
    if (authCookie) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)",
  ],
};

