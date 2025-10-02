"use client";

import { Button } from "@/components/ui/button";
import { useCreatePortalSessionMutation } from "@/redux/api/billingApi";
import { Loader2 } from "lucide-react";
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
 * Following the example project pattern
 */
export function ManageSubscriptionButton({
  className,
  variant = "default",
}: ManageSubscriptionButtonProps) {
  const [createPortal, { isLoading }] = useCreatePortalSessionMutation();

  const handleManageSubscription = async () => {
    try {
      const response = (await createPortal({}).unwrap()) as any;

      if (response?.data?.url) {
        window.location.href = response.data.url;
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
