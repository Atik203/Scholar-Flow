"use client";

import {
  showAuthErrorToast,
  showAuthSuccessToast,
  showLoadingToast,
} from "@/components/providers/ToastProvider";
import { completeOAuthSignIn } from "@/lib/auth/authHelpers";
import { useAppDispatch } from "@/redux/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

// Module-level lock survives React StrictMode unmount/remount
let _moduleLock = false;

const tryAcquireGlobalLock = (): boolean => {
  if (typeof window === "undefined") return true;

  const globalWindow = window as typeof window & Record<string, boolean>;
  const lockInWindow = globalWindow.__sfGoogleOAuthProcessing === true;
  const lockInStorage = sessionStorage.getItem("__sf_google_oauth_processing__") === "true";

  if (_moduleLock || lockInWindow || lockInStorage) {
    return false;
  }

  _moduleLock = true;
  globalWindow.__sfGoogleOAuthProcessing = true;
  sessionStorage.setItem("__sf_google_oauth_processing__", "true");
  return true;
};

const releaseGlobalLock = (): void => {
  _moduleLock = false;
  if (typeof window === "undefined") return;

  const globalWindow = window as typeof window & Record<string, boolean>;
  delete globalWindow.__sfGoogleOAuthProcessing;
  sessionStorage.removeItem("__sf_google_oauth_processing__");
};

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!tryAcquireGlobalLock()) {
      return;
    }

    const handleCallback = async () => {
      try {
        const code = searchParams?.get("code");
        const errorParam = searchParams?.get("error");
        const state = searchParams?.get("state");

        if (!code) {
          if (errorParam) {
            setError(`Google authentication failed: ${errorParam}`);
            showAuthErrorToast(`Authentication failed: ${errorParam}`);
            setTimeout(() => router.push("/login"), 2000);
          }
          return;
        }

        const callbackUrl = state ? decodeURIComponent(state) : "/dashboard";

        // Deduplicate: if this code was already processed, skip
        const processedCodeKey = `oauth_processed_${code.substring(0, 10)}`;
        if (localStorage.getItem(processedCodeKey)) {
          router.push(callbackUrl);
          return;
        }

        setIsProcessing(true);
        localStorage.setItem(processedCodeKey, Date.now().toString());

        // Clean up old processed codes (older than 5 minutes)
        const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith("oauth_processed_") && parseInt(localStorage.getItem(key) || "0") < fiveMinutesAgo) {
            localStorage.removeItem(key);
          }
        });

        showLoadingToast("Completing Google sign-in...");

        const result = await completeOAuthSignIn("google", code, dispatch);

        if (!result.success) {
          console.error("❌ Google OAuth failed:", result.error);
          setError(result.error || "Google authentication failed");
          showAuthErrorToast(result.error || "Authentication failed");
          setTimeout(() => router.push("/login"), 2000);
          return;
        }

        showAuthSuccessToast("Successfully signed in with Google!");
        await new Promise((resolve) => setTimeout(resolve, 300));
        router.push(callbackUrl);
      } finally {
        releaseGlobalLock();
      }
    };

    handleCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          Completing Google sign-in...
        </h2>
        <p className="text-muted-foreground">
          Please wait while we authenticate you.
        </p>
      </div>
    </div>
  );
}
