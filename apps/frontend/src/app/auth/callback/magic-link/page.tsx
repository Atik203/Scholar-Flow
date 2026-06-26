"use client";
import { showAuthErrorToast, showAuthSuccessToast } from "@/components/providers/ToastProvider";
import { setCredentials } from "@/redux/auth/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import type { TUser } from "@/types/user";

import { API_BASE_URL } from "@/lib/apiUrl";

export default function MagicLinkCallbackPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const token = searchParams.get("token");
    if (!token) {
      showAuthErrorToast("Invalid magic link");
      router.replace("/login");
      return;
    }

    const verifyMagicLink = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/magic-link/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          showAuthErrorToast(data.message || "Magic link expired or invalid");
          router.replace("/login");
          return;
        }

        if (data.data?.user && data.data?.accessToken) {
          const user = data.data.user as TUser;

          dispatch(setCredentials({
            user,
            accessToken: data.data.accessToken,
          }));
          showAuthSuccessToast("Signed in successfully!");

          const redirectTo = user.onboardingCompleted
            ? "/dashboard"
            : "/onboarding";
          router.replace(redirectTo);
        }
      } catch {
        showAuthErrorToast("Failed to verify magic link");
        router.replace("/login");
      }
    };

    verifyMagicLink();
  }, [router, dispatch, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
        <p className="text-muted-foreground">Signing you in...</p>
      </div>
    </div>
  );
}
