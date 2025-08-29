import { apiSlice } from "./apiSlice";
import { User } from "@/types/user";

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

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get user profile
    getProfile: builder.query<User, void>({
      query: () => "/user/me",
      providesTags: ["User"],
    }),

    // Update user profile
    updateProfile: builder.mutation<UpdateProfileResponse, UpdateProfileRequest>({
      query: (data) => ({
        url: "/user/update-profile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    // Change password
    changePassword: builder.mutation<ChangePasswordResponse, ChangePasswordRequest>({
      query: (data) => ({
        url: "/user/change-password",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = userApi;
