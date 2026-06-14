"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { USER_ROLES } from "@/lib/auth/roles";
import { PropsWithChildren } from "react";

export default function AdminDashboardLayout({ children }: PropsWithChildren) {
  return (
    <ProtectedRoute requiredRole={USER_ROLES.ADMIN}>
      <DashboardLayout variant="admin">{children}</DashboardLayout>
    </ProtectedRoute>
  );
}
