/**
 * Simple AuthProvider that handles auth initialization
 * Replaces NextAuth SessionProvider with Redux-based session management
 */

"use client";

import { apiSlice } from "@/redux/api/apiSlice";
import { useGetCurrentUserQuery } from "@/redux/auth/authApi";
import {
  selectAccessToken,
  selectCurrentUser,
  selectIsAuthenticated,
  setCredentials,
  setLoading,
  updateUser,
} from "@/redux/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { ReactNode, useEffect, useMemo, useRef } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const accessToken = useAppSelector(selectAccessToken);
  const currentUser = useAppSelector(selectCurrentUser);
  const hasInitialized = useRef(false);
  const lastSyncedUserVersion = useRef<string | null>(null);
  const previousRoleRef = useRef<string | null>(null);

  const shouldFetchUser = Boolean(accessToken || isAuthenticated);

  const { data: currentUserResponse } = useGetCurrentUserQuery(undefined, {
    skip: !shouldFetchUser,
    // Ensure we always have the freshest user after mutations invalidating the tag
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
    // Poll for changes every 30 seconds if authenticated (for subscription updates)
    pollingInterval: isAuthenticated ? 30000 : undefined,
  });

  const fetchedUser = currentUserResponse?.data?.user;
  const fetchedUserVersionKey = fetchedUser
    ? `${fetchedUser.id}:${fetchedUser.updatedAt ?? ""}:${fetchedUser.role ?? ""}`
    : null;
  const currentUserId = currentUser?.id ?? null;
  const stableFetchedUser = useMemo(
    () => (fetchedUserVersionKey ? (fetchedUser ?? null) : null),
    [fetchedUser, fetchedUserVersionKey]
  );

  useEffect(() => {
    if (!accessToken) {
      lastSyncedUserVersion.current = null;
    }
  }, [accessToken]);

  // Initialize auth state once on mount
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      // After hydration, mark auth as ready (run once on mount)
      // redux-persist will have already restored auth state
      dispatch(setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  // Update user data when fetched
  useEffect(() => {
    if (!fetchedUserVersionKey || !accessToken || !stableFetchedUser) {
      return;
    }

    const fetchedVersionKey = fetchedUserVersionKey;

    if (lastSyncedUserVersion.current === fetchedVersionKey) {
      return;
    }

    // Detect role changes for logging/notifications
    const fetchedRole = stableFetchedUser.role;
    const hadRoleChange =
      previousRoleRef.current !== null &&
      previousRoleRef.current !== fetchedRole;

    if (hadRoleChange) {
      console.log("[AuthProvider] User role changed:", {
        from: previousRoleRef.current,
        to: fetchedRole,
      });

      // Force invalidate all cached data to reflect role changes
      dispatch(
        apiSlice.util.invalidateTags(["User", "Collection", "Workspace"])
      );
    }

    // Update role reference
    previousRoleRef.current = fetchedRole || null;

    if (!currentUserId || currentUserId !== stableFetchedUser.id) {
      dispatch(
        setCredentials({
          user: stableFetchedUser,
          accessToken,
        })
      );
    } else {
      dispatch(updateUser(stableFetchedUser));
    }

    lastSyncedUserVersion.current = fetchedVersionKey;
  }, [
    accessToken,
    currentUserId,
    dispatch,
    fetchedUserVersionKey,
    stableFetchedUser,
  ]);

  return <>{children}</>;
}
