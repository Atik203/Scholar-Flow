"use client";

import {
  showAuthErrorToast,
  showAuthSuccessToast,
} from "@/components/providers/ToastProvider";
import { handleAuthRedirect } from "@/lib/auth/redirects";
import { useAuth } from "@/redux/auth/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * OAuth Callback Handler
 *
 * This page handles the redirect after OAuth authentication.
 * It waits for the session to be established, then redirects to the
 * appropriate role-based dashboard.
 */
export default function AuthCallbackPage() {
  const router = useRouter();
  const { session, status } = useAuth();
  const [hasRedirected, setHasRedirected] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Only proceed when session is authenticated and we haven't redirected yet
    if (status === "authenticated" && session?.user && !hasRedirected) {
      setHasRedirected(true);

      // Show success toast
      showAuthSuccessToast("OAuth");

      const redirectUrl = handleAuthRedirect(
        true,
        searchParams ?? undefined,
        "/login",
        session.user.role
      );

      router.replace(redirectUrl);
    }

    // If authentication failed, redirect back to login
    if (status === "unauthenticated" && !hasRedirected) {
      setHasRedirected(true);
      showAuthErrorToast("OAuth session could not be established.");
      router.replace("/login");
    }
  }, [status, session, router, hasRedirected, searchParams]);

  // Show loading state while session is being established
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  );
}
