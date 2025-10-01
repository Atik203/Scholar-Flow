"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useGetCurrentUserQuery } from "./authApi";
import { clearCredentials, setCredentials } from "./authSlice";

export function useAuth() {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();

  const {
    data: userData,
    isLoading: isUserLoading,
    error: userError,
  } = useGetCurrentUserQuery(undefined, {
    skip: !session?.accessToken,
  });

  useEffect(() => {
    if (session?.accessToken && userData?.data?.user) {
      dispatch(
        setCredentials({
          user: userData.data.user,
          accessToken: session.accessToken,
        })
      );
    } else if (status === "unauthenticated" && !isUserLoading) {
      // Only clear credentials if we're sure the user is unauthenticated
      // AND we're not currently loading user data
      dispatch(clearCredentials());
    } else if (userError && !isUserLoading) {
      // Clear credentials if there's an error fetching user (e.g., account deleted)
      console.warn("User fetch failed, clearing credentials:", userError);
      dispatch(clearCredentials());
    }
  }, [session, userData, status, dispatch, isUserLoading, userError]);

  return {
    user: userData?.data?.user || null,
    isLoading: status === "loading" || isUserLoading,
    isAuthenticated: !!session && !!userData?.data?.user,
    error: userError,
    session,
  };
}

export function useAuthSync() {
  const { data: session } = useSession();
  const dispatch = useDispatch();

  useEffect(() => {
    if (session?.user && session?.accessToken) {
      dispatch(
        setCredentials({
          user: {
            id: session.user.id || "",
            email: session.user.email || "",
            name: session.user.name || null,
            firstName: null,
            lastName: null,
            institution: null,
            fieldOfStudy: null,
            image: session.user.image || null,
            role: (session.user as any).role || "RESEARCHER",
          },
          accessToken: session.accessToken,
        })
      );
    } else {
      dispatch(clearCredentials());
    }
  }, [session, dispatch]);
}
