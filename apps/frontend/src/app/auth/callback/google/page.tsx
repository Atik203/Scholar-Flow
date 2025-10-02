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

const GLOBAL_LOCK_STORAGE_KEY = "__sf_google_oauth_processing__";
const GLOBAL_LOCK_WINDOW_PROP = "__sfGoogleOAuthProcessing";

const tryAcquireGlobalLock = (): boolean => {
  if (typeof window === "undefined") return true;

  const globalWindow = window as typeof window & Record<string, boolean>;
  const lockInWindow = globalWindow[GLOBAL_LOCK_WINDOW_PROP] === true;
  const lockInSession =
    sessionStorage.getItem(GLOBAL_LOCK_STORAGE_KEY) === "true";

  if (lockInWindow || lockInSession) {
    return false;
  }

  globalWindow[GLOBAL_LOCK_WINDOW_PROP] = true;
  sessionStorage.setItem(GLOBAL_LOCK_STORAGE_KEY, "true");
  return true;
};

const releaseGlobalLock = (): void => {
  if (typeof window === "undefined") return;

  const globalWindow = window as typeof window & Record<string, boolean>;
  delete globalWindow[GLOBAL_LOCK_WINDOW_PROP];
  sessionStorage.removeItem(GLOBAL_LOCK_STORAGE_KEY);
};

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const hasProcessedRef = useRef(false);

  useEffect(() => {
    let lockAcquired = tryAcquireGlobalLock();

    if (!lockAcquired) {
      console.log(
        "🔒 [GLOBAL] Google OAuth already processing in another instance, skipping..."
      );
      return;
    }

    // Prevent duplicate processing at component level
    if (hasProcessedRef.current || isProcessing) {
      console.log(
        "🔒 [LOCAL] Google OAuth callback already processing, skipping..."
      );
      releaseGlobalLock();
      lockAcquired = false;
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

        // **CRITICAL DEDUPLICATION CHECK** - Prevent processing same code twice
        const processedCodeKey = `oauth_processed_${code.substring(0, 10)}`;
        const alreadyProcessed = localStorage.getItem(processedCodeKey);

        if (alreadyProcessed) {
          console.log("🔒 OAuth code already processed, skipping...");
          const callbackUrl = state ? decodeURIComponent(state) : "/dashboard";
          router.push(callbackUrl);
          return;
        }

        hasProcessedRef.current = true;
        setIsProcessing(true);
        localStorage.setItem(processedCodeKey, Date.now().toString());

        console.log("✅ OAuth processing lock acquired:", {
          windowLock: true,
          ref: hasProcessedRef.current,
          storageKey: processedCodeKey,
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

        console.log("🔐 Processing Google OAuth callback...", {
          hasCode: !!code,
          callbackUrl,
        });

        if (errorParam) {
          setError(`Google authentication failed: ${errorParam}`);
          showAuthErrorToast(`Authentication failed: ${errorParam}`);
          setTimeout(() => router.push("/login"), 2000);
          return;
        }

        showLoadingToast("Completing Google sign-in...");

        const result = await completeOAuthSignIn("google", code, dispatch);

        if (!result.success) {
          console.error("❌ Google OAuth failed:", result.error);
          setError(result.error || "Google authentication failed");
          showAuthErrorToast(result.error || "Authentication failed");
          setTimeout(() => router.push("/login"), 2000);
          return;
        }

        // Success!
        console.log("✅ Google OAuth successful, redirecting to:", callbackUrl);
        showAuthSuccessToast("Successfully signed in with Google!");

        await new Promise((resolve) => setTimeout(resolve, 300));
        router.push(callbackUrl);
      } finally {
        if (lockAcquired) {
          releaseGlobalLock();
          lockAcquired = false;
        }
      }
    };

    handleCallback();

    return () => {
      if (lockAcquired) {
        releaseGlobalLock();
        lockAcquired = false;
      }
    };
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
          Completing Google sign-in...
        </h2>
        <p className="text-muted-foreground">
          Please wait while we authenticate you.
        </p>
      </div>
    </div>
  );
}
