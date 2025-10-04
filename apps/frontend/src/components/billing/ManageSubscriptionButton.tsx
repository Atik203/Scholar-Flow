"use client";

import { Button } from "@/components/ui/button";
import { apiSlice } from "@/redux/api/apiSlice";
import { useCreatePortalSessionMutation } from "@/redux/api/billingApi";
import { useAppDispatch } from "@/redux/hooks";
import { Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

interface ManageSubscriptionButtonProps {
  className?: string;
  variant?:
    | "default"
    | "outline"
    | "ghost"
    | "link"
    | "destructive"
    | "secondary";
}

/**
 * ManageSubscriptionButton Component
 * Opens Stripe Customer Portal for subscription management
 * Handles focus detection to refresh data when user returns from portal
 */
export function ManageSubscriptionButton({
  className,
  variant = "default",
}: ManageSubscriptionButtonProps) {
  const [createPortal, { isLoading }] = useCreatePortalSessionMutation();
  const dispatch = useAppDispatch();
  const hasOpenedPortalRef = useRef(false);
  const returnCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleManageSubscription = async () => {
    try {
      const response = (await createPortal({}).unwrap()) as any;

      if (response?.data?.url) {
        // Mark that portal was opened
        hasOpenedPortalRef.current = true;

        // Navigate to portal
        window.location.href = response.data.url;

        // Note: The visibility/focus detection will handle the return
      } else {
        throw new Error("No portal URL received");
      }
    } catch (error: any) {
      console.error("Error creating portal session:", error);
      toast.error(
        error?.data?.message ||
          "Failed to open subscription portal. Please try again."
      );
    }
  };

  // Detect when user returns from Stripe portal
  useEffect(() => {
    const handleVisibilityChange = () => {
      // Only trigger if portal was opened and page becomes visible again
      if (hasOpenedPortalRef.current && !document.hidden) {
        console.log(
          "[ManageSubscriptionButton] User returned from portal, refreshing data"
        );

        // Force refresh user and subscription data
        dispatch(apiSlice.util.invalidateTags(["User"]));

        // Reset flag after handling
        setTimeout(() => {
          hasOpenedPortalRef.current = false;
        }, 1000);
      }
    };

    const handleFocus = () => {
      // Backup detection via window focus
      if (hasOpenedPortalRef.current) {
        console.log(
          "[ManageSubscriptionButton] Window focused after portal, refreshing data"
        );
        dispatch(apiSlice.util.invalidateTags(["User"]));

        setTimeout(() => {
          hasOpenedPortalRef.current = false;
        }, 1000);
      }
    };

    // Listen for visibility change (more reliable)
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Listen for window focus (fallback)
    window.addEventListener("focus", handleFocus);

    // Store interval ref value for cleanup
    const intervalRef = returnCheckIntervalRef.current;

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);

      if (intervalRef) {
        clearInterval(intervalRef);
      }
    };
  }, [dispatch]);

  return (
    <Button
      onClick={handleManageSubscription}
      disabled={isLoading}
      className={className}
      variant={variant}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </>
      ) : (
        "Manage Subscription"
      )}
    </Button>
  );
}
