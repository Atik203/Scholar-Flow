"use client";

import { getRoleDashboardBasePath } from "@/lib/auth/roles";
import { useAuth } from "@/redux/auth/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardIndex() {
  const router = useRouter();
  const pathname = usePathname();
  const { session, status } = useAuth();

  useEffect(() => {
    if (status !== "unauthenticated") {
      return;
    }

    router.replace("/login?callbackUrl=/dashboard");
  }, [router, status]);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.role) {
      return;
    }

    const target = getRoleDashboardBasePath(session.user.role);
    if (router && pathname !== target) {
      router.replace(target);
    }
  }, [pathname, router, session?.user?.role, status]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="h-8 w-8 border-4 border-muted-foreground/30 border-t-primary rounded-full animate-spin" />
    </div>
  );
}
