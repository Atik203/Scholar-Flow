"use client";

import { USER_ROLES, getRoleDashboardBasePath } from "@/lib/auth/roles";
import { useAuth } from "@/redux/auth/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

export default function DashboardIndex() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  const target = useMemo(() => {
    const role = user?.role || USER_ROLES.RESEARCHER;
    return getRoleDashboardBasePath(role);
  }, [user?.role]);

  useEffect(() => {
    // Don't do anything while still loading authentication state
    if (isLoading) return;

    // Only redirect to login if we're SURE the user is not authenticated
    // This prevents redirect loops during sign-in
    if (!isAuthenticated) {
      router.replace("/login?callbackUrl=/dashboard");
      return;
    }

    // Redirect to role-specific dashboard
    router.replace(target);
  }, [isLoading, isAuthenticated, target, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="h-8 w-8 border-4 border-muted-foreground/30 border-t-primary rounded-full animate-spin" />
    </div>
  );
}
