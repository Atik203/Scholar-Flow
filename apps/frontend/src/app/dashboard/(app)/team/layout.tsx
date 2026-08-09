"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { USER_ROLES } from "@/lib/auth/roles";

/**
 * Team pages require TEAM_LEAD+ — the backend enforces this on every
 * /team/* endpoint; this guard stops the 403 storm in the browser first.
 */
export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredRole={USER_ROLES.TEAM_LEAD}>{children}</ProtectedRoute>
  );
}
