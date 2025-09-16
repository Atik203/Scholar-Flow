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
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useDeleteAccountMutation,
} = userApi;
