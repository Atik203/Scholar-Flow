"use client";

import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function NotificationsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/notifications/center");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-sm text-muted-foreground animate-pulse">
          Redirecting to notification center...
        </p>
      </div>
    </div>
  );
}
