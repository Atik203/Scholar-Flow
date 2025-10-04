"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { USER_ROLES } from "@/lib/auth/roles";
import { PropsWithChildren } from "react";

export default function ResearcherLayout({ children }: PropsWithChildren) {
  return (
    <ProtectedRoute requiredRole={USER_ROLES.RESEARCHER}>
      {children}
    </ProtectedRoute>
  );
}
