/**
 * AuthProvider that handles auth initialization
 * Syncs better-auth session with Redux-based session management
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
import { setAuthCookie, clearAuthCookie } from "@/lib/auth/authCookies";
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

  // Sync the proxy `sf_auth` cookie with persisted Redux state on the very
  // first render. Doing this synchronously (before any useEffect runs)
  // prevents the first child-rendered RTK Query request from firing with
  // a stale `sf_auth` cookie / null accessToken, which previously caused
  // a 401 cascade on hard reloads.
  if (!hasInitialized.current) {
    hasInitialized.current = true;
    if (isAuthenticated && accessToken) {
      setAuthCookie();
    } else {
      clearAuthCookie();
    }
    // `setLoading(false)` was previously dispatched inside a useEffect that
    // ran after the first render commit. Some RTK Query subscriptions in
    // child components could fire between the first render and that effect
    // and observe `isLoading=true` with `accessToken=null`. Dispatching
    // synchronously here ensures hydration is complete before the first
    // child commit.
    if (accessToken === null) {
      dispatch(setLoading(false));
    }
  }

  const shouldFetchUser = Boolean(accessToken && accessToken.length > 0);

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
    ? `${fetchedUser.id}:${fetchedUser.updatedAt ?? ""}:${fetchedUser.role ?? ""}:${fetchedUser.email ?? ""}`
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
    // If a token appeared (e.g., from rehydration on the same render), the
    // first-render branch above couldn't set isLoading=false. Mark loading
    // complete now that the token is present and child queries can fire.
    if (accessToken && hasInitialized.current) {
      dispatch(setLoading(false));
    }
  }, [accessToken, dispatch]);

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
