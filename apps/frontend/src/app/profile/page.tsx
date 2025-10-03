"use client";

import { RoleBadge } from "@/components/auth/RoleBadge";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/providers/ToastProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProtectedRoute } from "@/hooks/useAuthGuard";
import { ROLE_DESCRIPTIONS, USER_ROLES } from "@/lib/auth/roles";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUploadProfilePictureMutation,
} from "@/redux/api/userApi";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  Camera,
  CheckCircle,
  Edit3,
  ExternalLink,
  Loader2,
  Save,
  Shield,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Profile update validation schema
const profileUpdateSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name too long")
    .optional(),
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name too long")
    .optional(),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name too long")
    .optional(),
  institution: z.string().max(200, "Institution name too long").optional(),
  fieldOfStudy: z.string().max(200, "Field of study too long").optional(),
  image: z.string().url("Invalid image URL").optional().or(z.literal("")),
});

type ProfileUpdateForm = z.infer<typeof profileUpdateSchema>;

function VerifyButton() {
  return (
    <Link href="/verify-email">
      <Button
        size="sm"
        variant="outline"
        className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
      >
        <ExternalLink className="h-4 w-4 mr-2" />
        Verify Now
      </Button>
    </Link>
  );
}

export default function ProfilePage() {
  // Protected route guard
  const { isLoading: isAuthLoading, user: authUser } = useProtectedRoute();

  // API hooks
  const {
    data: profileData,
    isLoading: isProfileLoading,
    refetch,
  } = useGetProfileQuery();

  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [uploadProfilePicture, { isLoading: isUploading }] =
    useUploadProfilePictureMutation();

  // Form handling with react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
  } = useForm<ProfileUpdateForm>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      name: "",
      firstName: "",
      lastName: "",
      institution: "",
      fieldOfStudy: "",
      image: "",
    },
  });

  // Refetch profile if redirected from verification
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.location.pathname === "/profile"
    ) {
      const params = new URLSearchParams(window.location.search);
      if (params.get("verified")) {
        refetch();
      }
    }
  }, [refetch]);

  const [isEditing, setIsEditing] = useState(false);

  // Update form data when profile data changes
  useEffect(() => {
    if (profileData) {
      reset({
        name: profileData.data.name || "",
        firstName: profileData.data.firstName || "",
        lastName: profileData.data.lastName || "",
        institution: profileData.data.institution || "",
        fieldOfStudy: profileData.data.fieldOfStudy || "",
        image: profileData.data.image || "",
      });
    }
  }, [profileData, reset]);

  if (isAuthLoading || isProfileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  // Use profile data from API if available, fallback to auth user
  const user = profileData?.data || authUser;
  const userRole = user?.role || USER_ROLES.RESEARCHER;

  const initials = profileData?.data.name
    ? profileData.data.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : profileData?.data.email?.[0]?.toUpperCase() || "U";

  const handleEdit = () => {
    setIsEditing(true);
  };

  const onSubmit = async (data: ProfileUpdateForm) => {
    try {
      // Filter out empty strings and undefined values
      const updateData = Object.fromEntries(
        Object.entries(data).filter(
          ([_, value]) => value !== "" && value !== undefined
        )
      );

      await updateProfile(updateData).unwrap();

      showSuccessToast(
        "Profile Updated",
        "Your profile has been updated successfully"
      );

      setIsEditing(false);
      refetch(); // Refresh profile data
    } catch (error: any) {
      console.error("Profile update error:", error);
      const errorMessage =
        error?.data?.message || "Failed to update profile. Please try again.";
      showErrorToast("Update Failed", errorMessage);
    }
  };

  const handleCancel = () => {
    // Reset form to original values
    reset();
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Profile
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your account information and research profile
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="relative group">
                    <Avatar className="h-32 w-32">
                      <AvatarImage
                        src={user?.image || ""}
                        alt={user?.name || "User"}
                      />
                      <AvatarFallback className="text-4xl">
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <label
                      htmlFor="profile-picture-upload"
                      className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors shadow-lg"
                    >
                      {isUploading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Camera className="h-5 w-5" />
                      )}
                    </label>
                    <input
                      id="profile-picture-upload"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        // Validate file size (5MB limit)
                        if (file.size > 5 * 1024 * 1024) {
                          showErrorToast("File size must be less than 5MB");
                          return;
                        }

                        // Validate file type
                        if (
                          !["image/jpeg", "image/png", "image/webp"].includes(
                            file.type
                          )
                        ) {
                          showErrorToast(
                            "Only JPEG, PNG, and WebP images are allowed"
                          );
                          return;
                        }

                        try {
                          const formData = new FormData();
                          formData.append("file", file);

                          await uploadProfilePicture(formData).unwrap();
                          showSuccessToast(
                            "Profile picture updated successfully"
                          );
                          refetch();
                        } catch (error: any) {
                          showErrorToast(
                            error?.data?.message ||
                              "Failed to upload profile picture"
                          );
                        }

                        // Reset input
                        e.target.value = "";
                      }}
                      disabled={isUploading}
                    />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {user?.name || "User"}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400">
                    {user?.email}
                  </p>
                  <div className="mt-3 flex flex-col gap-2">
                    <RoleBadge role={userRole} size="lg" />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {
                        ROLE_DESCRIPTIONS[
                          userRole as keyof typeof ROLE_DESCRIPTIONS
                        ]
                      }
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="h-4 w-4 text-gray-400 mt-0.5" />
                  {(() => {
                    const emailVerified = (user as import("@/types/user").TUser)
                      ?.emailVerified;
                    console.log(
                      "[Profile Debug] emailVerified value:",
                      emailVerified
                    );
                    return emailVerified && emailVerified !== "null";
                  })() ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-green-600 dark:text-green-400 font-medium">
                        Verified on{" "}
                        {(() => {
                          const dateVal = (user as import("@/types/user").TUser)
                            .emailVerified;
                          if (!dateVal || dateVal === "null") return "";
                          const dateObj =
                            typeof dateVal === "string"
                              ? new Date(dateVal)
                              : dateVal;
                          return dateObj instanceof Date &&
                            !isNaN(dateObj.getTime())
                            ? dateObj.toLocaleDateString()
                            : "";
                        })()}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        <span className="text-amber-600 dark:text-amber-400 font-medium">
                          Email not verified
                        </span>
                      </div>
                      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                        <p className="text-sm text-amber-800 dark:text-amber-200 mb-3">
                          Please verify your email address to access all
                          features and receive important notifications.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <VerifyButton />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Information */}
          <div className="lg:col-span-3">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <CardTitle className="dark:text-white">
                    Personal Information
                  </CardTitle>
                  <CardDescription className="dark:text-gray-400">
                    Update your personal details and research information
                  </CardDescription>
                </div>
                <div className="flex-shrink-0">
                  {!isEditing ? (
                    <Button
                      onClick={handleEdit}
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto"
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        onClick={handleSubmit(onSubmit)}
                        size="sm"
                        disabled={isUpdating || !isDirty}
                        className="flex-1 sm:flex-none"
                      >
                        {isUpdating ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4 mr-2" />
                        )}
                        {isUpdating ? "Saving..." : "Save"}
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        size="sm"
                        className="flex-1 sm:flex-none"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {isEditing ? (
                  <>
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            {...register("firstName")}
                            placeholder="Enter your first name"
                          />
                          {errors.firstName && (
                            <p className="text-sm text-red-500">
                              {errors.firstName.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            {...register("lastName")}
                            placeholder="Enter your last name"
                          />
                          {errors.lastName && (
                            <p className="text-sm text-red-500">
                              {errors.lastName.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          {...register("name")}
                          placeholder="Enter your full name (optional if using first/last name)"
                        />
                        {errors.name && (
                          <p className="text-sm text-red-500">
                            {errors.name.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="institution">Institution</Label>
                        <Input
                          id="institution"
                          {...register("institution")}
                          placeholder="University or organization"
                        />
                        {errors.institution && (
                          <p className="text-sm text-red-500">
                            {errors.institution.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="fieldOfStudy">Field of Study</Label>
                        <Input
                          id="fieldOfStudy"
                          {...register("fieldOfStudy")}
                          placeholder="Your research area or field of study"
                        />
                        {errors.fieldOfStudy && (
                          <p className="text-sm text-red-500">
                            {errors.fieldOfStudy.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="image">Profile Image URL</Label>
                        <Input
                          id="image"
                          {...register("image")}
                          placeholder="https://example.com/avatar.jpg"
                        />
                        {errors.image && (
                          <p className="text-sm text-red-500">
                            {errors.image.message}
                          </p>
                        )}
                      </div>
                    </form>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          First Name
                        </Label>
                        <p className="mt-1 text-gray-900 dark:text-white">
                          {profileData?.data.firstName || "Not provided"}
                        </p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Last Name
                        </Label>
                        <p className="mt-1 text-gray-900 dark:text-white">
                          {profileData?.data.lastName || "Not provided"}
                        </p>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Full Name
                      </Label>
                      <p className="mt-1 text-gray-900 dark:text-white">
                        {profileData?.data.name || "Not provided"}
                      </p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Institution
                      </Label>
                      <p className="mt-1 text-gray-900 dark:text-white">
                        {profileData?.data.institution || "Not provided"}
                      </p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Field of Study
                      </Label>
                      <p className="mt-1 text-gray-900 dark:text-white">
                        {profileData?.data.fieldOfStudy || "Not provided"}
                      </p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Profile Image
                      </Label>
                      <p className="mt-1 text-gray-900 dark:text-white">
                        {profileData?.data.image ? (
                          <a
                            href={profileData.data.image}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            View Image
                          </a>
                        ) : (
                          "Not provided"
                        )}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Account Settings */}
            <Card className="mt-8 dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">
                  Account Settings
                </CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Manage your account preferences and security
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-gray-900 dark:text-white">
                      Email Notifications
                    </Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Receive updates about your research activity
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-gray-900 dark:text-white">
                      Privacy Settings
                    </Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Control who can see your profile and research
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-gray-900 dark:text-white">
                      Connected Accounts
                    </Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Link your social and academic profiles
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Connect
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
