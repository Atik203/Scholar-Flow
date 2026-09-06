"use client";

import {
  showAuthErrorToast,
  showAuthSuccessToast,
  showLoadingToast,
} from "@/components/providers/ToastProvider";
import { completeOAuthSignIn } from "@/lib/auth/authHelpers";
import { useAppDispatch } from "@/redux/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const LOCK_KEY = "__sf_github_oauth_processing__";

const tryAcquireGlobalLock = (): boolean => {
  if (typeof window === "undefined") return false;

  if (sessionStorage.getItem(LOCK_KEY) === "true") {
    return false;
  }

  const globalWindow = window as typeof window & Record<string, boolean>;
  if (globalWindow.__sfGithubOAuthProcessing === true) {
    return false;
  }

  globalWindow.__sfGithubOAuthProcessing = true;
  sessionStorage.setItem(LOCK_KEY, "true");
  return true;
};

const releaseGlobalLock = (): void => {
  if (typeof window === "undefined") return;
  const globalWindow = window as typeof window & Record<string, boolean>;
  delete globalWindow.__sfGithubOAuthProcessing;
  sessionStorage.removeItem(LOCK_KEY);
};

export default function GitHubCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const hasProcessedRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const redirectToLogin = useCallback(() => {
    router.push("/login?error=oauth_failed");
  }, [router]);

  useEffect(() => {
    let lockAcquired = false;

    if (hasProcessedRef.current) return;

    if (!tryAcquireGlobalLock()) {
      redirectToLogin();
      return;
    }

    lockAcquired = true;
    hasProcessedRef.current = true;

    const handleCallback = async () => {
      try {
        const code = searchParams?.get("code");
        const errorParam = searchParams?.get("error");
        const state = searchParams?.get("state");

        if (errorParam) {
          setError(`GitHub authentication failed: ${errorParam}`);
          showAuthErrorToast(`Authentication failed: ${errorParam}`);
          timeoutRef.current = setTimeout(() => router.push("/login"), 2000);
          return;
        }

        if (!code) {
          setError("No authorization code received from GitHub");
          timeoutRef.current = setTimeout(() => router.push("/login"), 3000);
          return;
        }

        const processedCodeKey = `oauth_processed_${code.substring(0, 10)}`;
        const alreadyProcessed = localStorage.getItem(processedCodeKey);
        if (alreadyProcessed) {
          const callbackUrl = state ? decodeURIComponent(state) : "/dashboard";
          router.push(callbackUrl);
          return;
        }

        setIsProcessing(true);
        localStorage.setItem(processedCodeKey, Date.now().toString());

        const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith("oauth_processed_")) {
            const timestamp = parseInt(localStorage.getItem(key) || "0");
            if (timestamp < fiveMinutesAgo) {
              localStorage.removeItem(key);
            }
          }
        });

        showLoadingToast("Completing GitHub sign-in...");

        const result = await completeOAuthSignIn("github", code, dispatch);

        if (!result.success) {
          setError(result.error || "GitHub authentication failed");
          showAuthErrorToast(result.error || "Authentication failed");
          timeoutRef.current = setTimeout(() => router.push("/login"), 2000);
          return;
        }

        showAuthSuccessToast("Successfully signed in with GitHub!");
        await new Promise((resolve) => setTimeout(resolve, 300));

        const callbackUrl = state ? decodeURIComponent(state) : "/dashboard";
        const redirectTo = result.user?.onboardingCompleted
          ? callbackUrl
          : "/onboarding";
        // Hard navigation ensures a fresh Redux + persisted-state rehydration
        window.location.href = redirectTo;
      } finally {
        if (lockAcquired) {
          releaseGlobalLock();
        }
      }
    };

    handleCallback();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (lockAcquired) {
        releaseGlobalLock();
      }
    };
  }, [router, dispatch, searchParams, redirectToLogin]);

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
