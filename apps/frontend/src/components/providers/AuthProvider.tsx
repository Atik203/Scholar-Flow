/**
 * Simple AuthProvider that handles auth initialization
 * Replaces NextAuth SessionProvider with Redux-based session management
 */

"use client";

import { useGetCurrentUserQuery } from "@/redux/auth/authApi";
import {
  selectAccessToken,
  selectAuthLoading,
  selectCurrentUser,
  selectIsAuthenticated,
  setCredentials,
  setLoading,
  updateUser,
} from "@/redux/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { ReactNode, useEffect } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectAuthLoading);
  const accessToken = useAppSelector(selectAccessToken);
  const currentUser = useAppSelector(selectCurrentUser);

  const shouldFetchUser = Boolean(accessToken || isAuthenticated);

  const { data: currentUserResponse } = useGetCurrentUserQuery(undefined, {
    skip: !shouldFetchUser,
    // Ensure we always have the freshest user after mutations invalidating the tag
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    const fetchedUser = currentUserResponse?.data?.user;

    if (!fetchedUser) {
      return;
    }

    if (currentUser) {
      dispatch(updateUser(fetchedUser));
      return;
    }

    if (accessToken) {
      dispatch(
        setCredentials({
          user: fetchedUser,
          accessToken,
        })
      );
    }
  }, [accessToken, currentUser, currentUserResponse?.data?.user, dispatch]);

  useEffect(() => {
    // After hydration, mark auth as ready
    // redux-persist will have already restored auth state
    if (isLoading) {
      dispatch(setLoading(false));
    }
  }, [dispatch, isLoading]);

  return <>{children}</>;
}
