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

// Global flag to prevent duplicate processing across component remounts
let globalProcessingFlag = false;

export default function GitHubCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const hasProcessedRef = useRef(false);

  useEffect(() => {
    // CRITICAL: Check global flag FIRST to prevent race conditions
    if (globalProcessingFlag) {
      console.log(
        "🔒 [GLOBAL] GitHub OAuth already processing globally, skipping..."
      );
      return;
    }

    // Prevent duplicate processing at component level
    if (hasProcessedRef.current || isProcessing) {
      console.log(
        "🔒 [LOCAL] GitHub OAuth callback already processing, skipping..."
      );
      return;
    }

    const handleCallback = async () => {
      const code = searchParams?.get("code");
      const errorParam = searchParams?.get("error");
      const state = searchParams?.get("state");

      if (!code) {
        if (errorParam) {
          setError(`GitHub authentication failed: ${errorParam}`);
          showAuthErrorToast(`Authentication failed: ${errorParam}`);
          setTimeout(() => router.push("/login"), 2000);
        }
        return;
      }

      // **CRITICAL DEDUPLICATION CHECK** - Prevent processing same code twice
      const processedCodeKey = `oauth_processed_${code.substring(0, 10)}`;
      const alreadyProcessed = localStorage.getItem(processedCodeKey);

      if (alreadyProcessed) {
        console.log("🔒 OAuth code already processed, skipping...");
        // Code was already used, redirect to dashboard
        const callbackUrl = state ? decodeURIComponent(state) : "/dashboard";
        router.push(callbackUrl);
        return;
      }

      // Mark as processing immediately - GLOBAL FLAG FIRST!
      globalProcessingFlag = true;
      hasProcessedRef.current = true;
      setIsProcessing(true);
      localStorage.setItem(processedCodeKey, Date.now().toString());

      console.log("✅ All processing flags set:", {
        global: globalProcessingFlag,
        ref: hasProcessedRef.current,
        state: true,
        localStorage: processedCodeKey,
      });

      // Clean up old processed codes (older than 5 minutes)
      const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("oauth_processed_")) {
          const timestamp = parseInt(localStorage.getItem(key) || "0");
          if (timestamp < fiveMinutesAgo) {
            localStorage.removeItem(key);
          }
        }
      });

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
