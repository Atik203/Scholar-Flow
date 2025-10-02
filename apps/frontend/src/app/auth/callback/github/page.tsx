"use client";

import {
  showAuthErrorToast,
  showAuthSuccessToast,
  showLoadingToast,
} from "@/components/providers/ToastProvider";
import { completeOAuthSignIn } from "@/lib/auth/authHelpers";
import { useAppDispatch } from "@/redux/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function GitHubCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const hasProcessedRef = useRef(false);

  useEffect(() => {
    // Prevent duplicate processing
    if (hasProcessedRef.current || isProcessing) {
      console.log("🔒 GitHub OAuth callback already processing, skipping...");
      return;
    }

    const handleCallback = async () => {
      // Mark as processing immediately
      hasProcessedRef.current = true;
      setIsProcessing(true);

      const code = searchParams?.get("code");
      const errorParam = searchParams?.get("error");
      const state = searchParams?.get("state");

      // Decode the state parameter to get the original callback URL
      const callbackUrl = state ? decodeURIComponent(state) : "/dashboard";

      console.log("🔐 Processing GitHub OAuth callback...", {
        hasCode: !!code,
        callbackUrl,
      });

      if (errorParam) {
        setError(`GitHub authentication failed: ${errorParam}`);
        showAuthErrorToast(`Authentication failed: ${errorParam}`);
        setTimeout(() => router.push("/login"), 2000);
        return;
      }

      if (!code) {
        setError("No authorization code received from GitHub");
        showAuthErrorToast("Authentication failed: No authorization code");
        setTimeout(() => router.push("/login"), 2000);
        return;
      }

      showLoadingToast("Completing GitHub sign-in...");

      const result = await completeOAuthSignIn("github", code, dispatch);

      if (!result.success) {
        console.error("❌ GitHub OAuth failed:", result.error);
        setError(result.error || "GitHub authentication failed");
        showAuthErrorToast(result.error || "Authentication failed");
        setTimeout(() => router.push("/login"), 2000);
        return;
      }

      // Success!
      console.log("✅ GitHub OAuth successful, redirecting to:", callbackUrl);
      showAuthSuccessToast("Successfully signed in with GitHub!");

      // Wait for Redux persist and toast to show
      await new Promise((resolve) => setTimeout(resolve, 300));
      router.push(callbackUrl);
    };

    handleCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once on mount

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-destructive">
            <svg
              className="h-12 w-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Authentication Failed</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <p className="text-sm text-muted-foreground">
            Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold mb-2">
          Completing GitHub sign-in...
        </h2>
        <p className="text-muted-foreground">
          Please wait while we authenticate you.
        </p>
      </div>
    </div>
  );
}
