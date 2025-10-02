/**
 * Simple AuthProvider that handles auth initialization
 * Replaces NextAuth SessionProvider with Redux-based session management
 */

"use client";

import {
  selectAuthLoading,
  selectIsAuthenticated,
  setLoading,
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

  useEffect(() => {
    // After hydration, mark auth as ready
    // redux-persist will have already restored auth state
    if (isLoading) {
      dispatch(setLoading(false));
    }
  }, [dispatch, isLoading]);

  return <>{children}</>;
}
