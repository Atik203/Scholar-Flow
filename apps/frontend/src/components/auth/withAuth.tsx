"use client";

import {
  useAuthRoute,
  useProtectedRoute,
  usePublicRoute,
} from "@/hooks/useAuthGuard";
import { ComponentType } from "react";

/**
 * Loading component displayed while checking authentication
 */
const AuthLoadingComponent = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

/**
 * Higher-order component that protects a route and requires authentication
 */
export function withAuthProtection<P extends object>(
  Component: ComponentType<P>,
  options?: {
    redirectTo?: string;
    loadingComponent?: ComponentType;
  }
) {
  const {
    redirectTo = "/login",
    loadingComponent: LoadingComponent = AuthLoadingComponent,
  } = options || {};

  return function AuthProtectedComponent(props: P) {
    const { isLoading } = useProtectedRoute(redirectTo);

    if (isLoading) {
      return <LoadingComponent />;
    }

    return <Component {...props} />;
  };
}

/**
 * Higher-order component that protects auth routes (login/register)
 * and redirects authenticated users to dashboard
 */
export function withAuthRedirection<P extends object>(
  Component: ComponentType<P>,
  options?: {
    redirectTo?: string;
    loadingComponent?: ComponentType;
  }
) {
  const {
    redirectTo = "/dashboard",
    loadingComponent: LoadingComponent = AuthLoadingComponent,
  } = options || {};

  return function AuthRedirectedComponent(props: P) {
    const { isLoading } = useAuthRoute(redirectTo);

    if (isLoading) {
      return <LoadingComponent />;
    }

    return <Component {...props} />;
  };
}

/**
 * Higher-order component for public routes that don't require auth checks
 * but still provide auth context
 */
export function withPublicRoute<P extends object>(Component: ComponentType<P>) {
  return function PublicRouteComponent(props: P) {
    // Public routes don't need loading states or redirects
    return <Component {...props} />;
  };
}

/**
 * Export the original hooks for direct use
 */
export { useAuthRoute, useProtectedRoute, usePublicRoute };
