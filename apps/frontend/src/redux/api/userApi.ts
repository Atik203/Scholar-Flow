import { User, UserApiResponse } from "@/types/user";
import { apiSlice } from "./apiSlice";

// Profile update request interface
export interface UpdateProfileRequest {
  name?: string;
  firstName?: string;
  lastName?: string;
  institution?: string;
  fieldOfStudy?: string;
  image?: string;
}

// Profile update response interface
export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data: User;
}

// Change password request interface
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// Change password response interface
export interface ChangePasswordResponse {
  success: boolean;
  message: string;
  data: null;
}

// Delete account request interface
export interface DeleteAccountRequest {
  confirmDelete: boolean;
}

// Delete account response interface
export interface DeleteAccountResponse {
  success: boolean;
  message: string;
  data: {
    success: boolean;
    message: string;
    deletedAt: string;
  };
}

// Upload profile picture response interface
export interface UploadProfilePictureResponse {
  success: boolean;
  message: string;
  data: {
    imageUrl: string;
    message: string;
  };
}

// User analytics response interface
export interface UserAnalyticsResponse {
  success: boolean;
  message: string;
  data: {
    plan: "FREE" | "PRO";
    limits: {
      maxPapers: number;
      maxStorage: number;
      maxTokens: number;
      maxCollections: number;
    };
    usage: {
      papers: {
        total: number;
        limit: number;
        percentage: number;
      };
      collections: {
        total: number;
        limit: number;
        percentage: number;
      };
      storage: {
        used: number;
        limit: number;
        percentage: number;
        unit: string;
      };
      tokens: {
        used: number;
        limit: number;
        percentage: number;
      };
    };
    charts: {
      papersOverTime: Array<{ date: string; count: number }>;
      collectionsOverTime: Array<{ date: string; count: number }>;
      storageOverTime: Array<{ month: string; size: number }>;
      papersByStatus: Array<{ status: string; count: number }>;
    };
  };
}

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get user profile
    getProfile: builder.query<UserApiResponse, void>({
      query: () => "/user/me",
      providesTags: ["User"],
    }),

    // Update user profile
    updateProfile: builder.mutation<
      UpdateProfileResponse,
      UpdateProfileRequest
    >({
      query: (data) => ({
        url: "/user/update-profile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    // Change password
    changePassword: builder.mutation<
      ChangePasswordResponse,
      ChangePasswordRequest
    >({
      query: (data) => ({
        url: "/user/change-password",
        method: "POST",
        body: data,
      }),
    }),

    // Delete account
    deleteAccount: builder.mutation<
      DeleteAccountResponse,
      DeleteAccountRequest
    >({
      query: (data) => ({
        url: "/user/delete-account",
        method: "DELETE",
        body: data,
      }),
    }),

    // Upload profile picture
    uploadProfilePicture: builder.mutation<
      UploadProfilePictureResponse,
      FormData
    >({
      query: (formData) => ({
        url: "/user/upload-profile-picture",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["User"],
    }),

    // Get user analytics
    getUserAnalytics: builder.query<UserAnalyticsResponse, void>({
      query: () => "/user/analytics",
      providesTags: ["User"],
    }),

    // Get user preferences (Phase 3)
    getPreferences: builder.query<
      {
        success: boolean;
        message: string;
        data: {
          id: string;
          userId: string;
          theme: "light" | "dark" | "system";
          language: string;
          timezone: string;
          emailDigest: boolean;
          defaultCitationStyle: string;
          compactMode: boolean;
          metadata: Record<string, unknown> | null;
          createdAt: string;
          updatedAt: string;
        };
      },
      void
    >({
      query: () => "/user/preferences",
      providesTags: ["UserPreferences"],
    }),

    // Update user preferences (Phase 3)
    updatePreferences: builder.mutation<
      {
        success: boolean;
        message: string;
        data: {
          id: string;
          userId: string;
          theme: "light" | "dark" | "system";
          language: string;
          timezone: string;
          emailDigest: boolean;
          defaultCitationStyle: string;
          compactMode: boolean;
          metadata: Record<string, unknown> | null;
          createdAt: string;
          updatedAt: string;
        };
      },
      Partial<{
        theme: "light" | "dark" | "system";
        language: string;
        timezone: string;
        emailDigest: boolean;
        defaultCitationStyle:
          | "APA"
          | "MLA"
          | "CHICAGO"
          | "HARVARD"
          | "IEEE"
          | "BIBTEX"
          | "ENDNOTE";
        compactMode: boolean;
        metadata: Record<string, unknown>;
      }>
    >({
      query: (data) => ({
        url: "/user/preferences",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["UserPreferences"],
    }),

    // Get user activity feed (Phase 3)
    getActivity: builder.query<
      {
        success: boolean;
        message: string;
        data: Array<{
          id: string;
          entity: string;
          entityId: string;
          action: string;
          details: Record<string, unknown> | null;
          severity: "INFO" | "WARNING" | "ERROR" | "CRITICAL";
          workspaceId: string | null;
          createdAt: string;
        }>;
        meta: { page: number; limit: number; total: number; totalPage: number };
      },
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: "/user/activity",
        params: { page, limit },
      }),
      providesTags: ["UserActivity"],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useDeleteAccountMutation,
  useUploadProfilePictureMutation,
  useGetPreferencesQuery,
  useUpdatePreferencesMutation,
  useGetActivityQuery,
  useGetUserAnalyticsQuery,
} = userApi;
