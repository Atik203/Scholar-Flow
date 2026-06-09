"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useOnboardingGuard } from "@/hooks/useAuthGuard";
import { USER_ROLES } from "@/lib/auth/roles";
import { PropsWithChildren } from "react";

export default function ResearcherLayout({ children }: PropsWithChildren) {
  const { isLoading } = useOnboardingGuard();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-muted-foreground/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <ProtectedRoute requiredRole={USER_ROLES.RESEARCHER}>
      {children}
    </ProtectedRoute>
  );
}
