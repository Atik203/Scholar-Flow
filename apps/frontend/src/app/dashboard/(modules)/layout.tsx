"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { NotificationStreamProvider } from "@/components/providers/NotificationStreamProvider";
import { useOnboardingGuard } from "@/hooks/useAuthGuard";
import { useSocketKeepAlive } from "@/hooks/useSocketKeepAlive";
import { PropsWithChildren, Suspense } from "react";

export default function ModulesDashboardLayout({ children }: PropsWithChildren) {
  const { isLoading } = useOnboardingGuard();
  // Research pages live under this layout — keep the Render socket server warm
  // here too, not just in the (app) group.
  useSocketKeepAlive();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-muted-foreground/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <NotificationStreamProvider>
      <DashboardLayout variant="app">
        <Suspense
          fallback={
            <div className="min-h-[60vh] flex items-center justify-center">
              <div className="h-8 w-8 border-4 border-muted-foreground/30 border-t-primary rounded-full animate-spin" />
            </div>
          }
        >
          {children}
        </Suspense>
      </DashboardLayout>
    </NotificationStreamProvider>
  );
}
