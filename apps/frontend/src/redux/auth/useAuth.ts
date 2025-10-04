/**
 * Simple useAuth hook that reads from Redux store
 * Replaces NextAuth useSession with Redux-based auth state
 */

"use client";

import { useAppSelector } from "../hooks";
import {
  selectAccessToken,
  selectAuthLoading,
  selectCurrentUser,
  selectIsAuthenticated,
} from "./authSlice";

export function useAuth() {
  const user = useAppSelector(selectCurrentUser);
  const accessToken = useAppSelector(selectAccessToken);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectAuthLoading);

  return {
    user,
    accessToken,
    status: isLoading
      ? ("loading" as const)
      : isAuthenticated
        ? ("authenticated" as const)
        : ("unauthenticated" as const),
    isAuthenticated,
    isLoading,
    // Legacy compat: expose session-like object for components that expect it
    session: isAuthenticated && user ? { user, accessToken } : null,
    error: null,
  };
}
