"use client";
import { showAuthErrorToast, showAuthSuccessToast } from "@/components/providers/ToastProvider";
import { handleAuthRedirect } from "@/lib/auth/redirects";
import { setCredentials } from "@/redux/auth/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

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
          dispatch(setCredentials({
            user: data.data.user,
            accessToken: data.data.accessToken,
          }));
          showAuthSuccessToast("Signed in successfully!");

          const redirectUrl = handleAuthRedirect(
            true,
            undefined,
            "/login",
            data.data.user.role
          );
          router.replace(redirectUrl);
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
