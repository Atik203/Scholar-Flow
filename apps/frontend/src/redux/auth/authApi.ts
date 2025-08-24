import type { TUser } from "@scholar-flow/types";
import { apiSlice } from "../api/apiSlice";

export interface OAuthSignInRequest {
  profile: {
    email: string;
    name?: string;
    image?: string;
    picture?: string;
    avatar_url?: string;
  };
  account: {
    type: string;
    provider: string;
    providerAccountId: string;
    refresh_token?: string;
    access_token?: string;
    expires_at?: number;
    token_type?: string;
    scope?: string;
    id_token?: string;
  };
}

export interface SessionValidationRequest {
  token: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: TUser;
  };
}

export interface SessionResponse {
  success: boolean;
  message: string;
  data: {
    valid: boolean;
    user?: TUser;
  };
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // OAuth sign-in
    oauthSignIn: builder.mutation<AuthResponse, OAuthSignInRequest>({
      query: (credentials) => ({
        url: "/auth/oauth/signin",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),

    // Validate session token
    validateSession: builder.mutation<
      SessionResponse,
      SessionValidationRequest
    >({
      query: (data) => ({
        url: "/auth/session/validate",
        method: "POST",
        body: data,
      }),
    }),

    // Get current user profile
    getCurrentUser: builder.query<
      { success: boolean; data: { user: TUser } },
      void
    >({
      query: () => "/auth/me",
      providesTags: ["User"],
    }),

    // Create session
    createSession: builder.mutation<
      { success: boolean; data: { session: any } },
      { userId: string; sessionToken: string; expires: string }
    >({
      query: (data) => ({
        url: "/auth/session/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    // Delete session (logout)
    deleteSession: builder.mutation<
      { success: boolean; message: string },
      { sessionToken: string }
    >({
      query: (data) => ({
        url: "/auth/session/delete",
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    // Get session by token
    getSession: builder.mutation<
      { success: boolean; data: { session: any } },
      { sessionToken: string }
    >({
      query: (data) => ({
        url: "/auth/session/get",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useOauthSignInMutation,
  useValidateSessionMutation,
  useGetCurrentUserQuery,
  useCreateSessionMutation,
  useDeleteSessionMutation,
  useGetSessionMutation,
} = authApi;
