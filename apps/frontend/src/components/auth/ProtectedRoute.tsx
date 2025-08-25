"use client";

import { showAccessDeniedToast } from "@/components/providers/ToastProvider";
import { hasPermission, hasRoleAccess } from "@/lib/auth/roles";
import { useAuth } from "@/redux/auth/useAuth";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string;
  requiredPermission?: string;
  fallback?: ReactNode;
  showToast?: boolean;
}

export function ProtectedRoute({
  children,
  requiredRole,
  requiredPermission,
  fallback,
  showToast = true,
}: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();

  // If not authenticated, show fallback or null
  if (!isAuthenticated || !user) {
    return fallback || null;
  }

  // Check role-based access
  if (requiredRole && !hasRoleAccess(user.role, requiredRole)) {
    if (showToast) {
      showAccessDeniedToast(requiredRole);
    }
    return fallback || null;
  }

  // Check permission-based access
  if (requiredPermission && !hasPermission(user.role, requiredPermission)) {
    if (showToast) {
      showAccessDeniedToast(`permission: ${requiredPermission}`);
    }
    return fallback || null;
  }

  return <>{children}</>;
}

interface RoleGateProps {
  children: ReactNode;
  allowedRoles: string[];
  fallback?: ReactNode;
  showToast?: boolean;
}

export function RoleGate({
  children,
  allowedRoles,
  fallback,
  showToast = false,
}: RoleGateProps) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user || !allowedRoles.includes(user.role)) {
    if (showToast && allowedRoles.length > 0) {
      showAccessDeniedToast(allowedRoles[0]);
    }
    return fallback || null;
  }

  return <>{children}</>;
}

interface PermissionGateProps {
  children: ReactNode;
  requiredPermissions: string[];
  requireAll?: boolean;
  fallback?: ReactNode;
  showToast?: boolean;
}

export function PermissionGate({
  children,
  requiredPermissions,
  requireAll = false,
  fallback,
  showToast = false,
}: PermissionGateProps) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return fallback || null;
  }

  const hasAccess = requireAll
    ? requiredPermissions.every((permission) =>
        hasPermission(user.role, permission)
      )
    : requiredPermissions.some((permission) =>
        hasPermission(user.role, permission)
      );

  if (!hasAccess) {
    if (showToast) {
      showAccessDeniedToast(`permissions: ${requiredPermissions.join(", ")}`);
    }
    return fallback || null;
  }

  return <>{children}</>;
}
