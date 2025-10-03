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

    // Get all users (Admin only)
    getAllUsers: builder.query<
      {
        success: boolean;
        message: string;
        data: User[];
        meta: { page: number; limit: number; total: number; totalPage: number };
      },
      { page?: number; limit?: number; search?: string; role?: string }
    >({
      query: ({ page = 1, limit = 10, search, role } = {}) => ({
        url: "/user",
        params: { page, limit, search, role },
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((u) => ({ type: "User" as const, id: u.id })),
              { type: "User" as const, id: "LIST" },
            ]
          : [{ type: "User" as const, id: "LIST" }],
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
  }),
});

export const {
  useGetProfileQuery,
  useGetAllUsersQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useDeleteAccountMutation,
  useUploadProfilePictureMutation,
  useGetUserAnalyticsQuery,
} = userApi;
