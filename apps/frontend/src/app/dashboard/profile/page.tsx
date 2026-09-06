"use client";

import { RoleBadge } from "@/components/auth/RoleBadge";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
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

const profileUpdateSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long").optional(),
  firstName: z.string().min(1, "First name is required").max(50, "First name too long").optional(),
  lastName: z.string().min(1, "Last name is required").max(50, "Last name too long").optional(),
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

export default function DashboardProfilePage() {
  const {
    data: profileData,
    isLoading: isProfileLoading,
    refetch,
  } = useGetProfileQuery();

  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [uploadProfilePicture, { isLoading: isUploading }] =
    useUploadProfilePictureMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
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

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.location.pathname === "/dashboard/profile"
    ) {
      const params = new URLSearchParams(window.location.search);
      if (params.get("verified")) {
        refetch();
      }
    }
  }, [refetch]);

  const [isEditing, setIsEditing] = useState(false);

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

  if (isProfileLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-32">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading profile...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const user = profileData?.data;
  const userRole = user?.role || USER_ROLES.RESEARCHER;

  const handleEdit = () => setIsEditing(true);

  const onSubmit = async (data: ProfileUpdateForm) => {
    try {
      const updateData = Object.fromEntries(
        Object.entries(data).filter(([, v]) => v !== "" && v !== undefined)
      );
      await updateProfile(updateData).unwrap();
      showSuccessToast("Profile Updated", "Your profile has been updated successfully");
      setIsEditing(false);
      refetch();
    } catch (error: any) {
      showErrorToast("Update Failed", error?.data?.message || "Failed to update profile. Please try again.");
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-12">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account information and research profile
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="relative group">
                    <Avatar className="h-32 w-32">
                      <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
                      <AvatarFallback className="text-4xl">
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <label
                      htmlFor="dashboard-profile-picture-upload"
                      className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors shadow-lg"
                    >
                      {isUploading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Camera className="h-5 w-5" />
                      )}
                    </label>
                    <input
                      id="dashboard-profile-picture-upload"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (file.size > 5 * 1024 * 1024) {
                          showErrorToast("File size must be less than 5MB");
                          return;
                        }
                        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
                          showErrorToast("Only JPEG, PNG, and WebP images are allowed");
                          return;
                        }
                        try {
                          const formData = new FormData();
                          formData.append("file", file);
                          await uploadProfilePicture(formData).unwrap();
                          showSuccessToast("Profile picture updated successfully");
                          refetch();
                        } catch (error: any) {
                          showErrorToast(error?.data?.message || "Failed to upload profile picture");
                        }
                        e.target.value = "";
                      }}
                      disabled={isUploading}
                    />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{user?.name || "User"}</h2>
                  <p className="text-muted-foreground">{user?.email}</p>
                  <div className="mt-3 flex flex-col gap-2">
                    <RoleBadge role={userRole} size="lg" />
                    <p className="text-xs text-muted-foreground">
                      {ROLE_DESCRIPTIONS[userRole as keyof typeof ROLE_DESCRIPTIONS]}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="h-4 w-4 text-muted-foreground mt-0.5" />
                  {user?.emailVerified ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-green-600 dark:text-green-400 font-medium">
                        Verified on{" "}
                        {(() => {
                          const dv = (user as any).emailVerified;
                          if (!dv) return "";
                          const d = typeof dv === "string" ? new Date(dv) : dv;
                          return d instanceof Date && !isNaN(d.getTime()) ? d.toLocaleDateString() : "";
                        })()}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        <span className="text-amber-600 dark:text-amber-400 font-medium">Email not verified</span>
                      </div>
                      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                        <p className="text-sm text-amber-800 dark:text-amber-200 mb-3">
                          Please verify your email address to access all features and receive important notifications.
                        </p>
                        <VerifyButton />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details and research information</CardDescription>
                </div>
                <div className="flex-shrink-0">
                  {!isEditing ? (
                    <Button onClick={handleEdit} variant="outline" size="sm" className="w-full sm:w-auto">
                      <Edit3 className="h-4 w-4 mr-2" />Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2 flex-wrap">
                      <Button onClick={handleSubmit(onSubmit)} size="sm" disabled={isUpdating || !isDirty}>
                        {isUpdating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                        {isUpdating ? "Saving..." : "Save"}
                      </Button>
                      <Button onClick={handleCancel} variant="outline" size="sm">
                        <X className="h-4 w-4 mr-2" />Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {isEditing ? (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" {...register("firstName")} placeholder="Enter your first name" />
                        {errors.firstName && <p className="text-sm text-red-500">{errors.firstName.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" {...register("lastName")} placeholder="Enter your last name" />
                        {errors.lastName && <p className="text-sm text-red-500">{errors.lastName.message}</p>}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" {...register("name")} placeholder="Enter your full name" />
                      {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="institution">Institution</Label>
                      <Input id="institution" {...register("institution")} placeholder="University or organization" />
                      {errors.institution && <p className="text-sm text-red-500">{errors.institution.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fieldOfStudy">Field of Study</Label>
                      <Input id="fieldOfStudy" {...register("fieldOfStudy")} placeholder="Your research area or field of study" />
                      {errors.fieldOfStudy && <p className="text-sm text-red-500">{errors.fieldOfStudy.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="image">Profile Image URL</Label>
                      <Input id="image" {...register("image")} placeholder="https://example.com/avatar.jpg" />
                      {errors.image && <p className="text-sm text-red-500">{errors.image.message}</p>}
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">First Name</Label>
                        <p className="mt-1">{profileData?.data.firstName || "Not provided"}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Last Name</Label>
                        <p className="mt-1">{profileData?.data.lastName || "Not provided"}</p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Full Name</Label>
                      <p className="mt-1">{profileData?.data.name || "Not provided"}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Institution</Label>
                      <p className="mt-1">{profileData?.data.institution || "Not provided"}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Field of Study</Label>
                      <p className="mt-1">{profileData?.data.fieldOfStudy || "Not provided"}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Profile Image</Label>
                      <p className="mt-1">
                        {profileData?.data.image ? (
                          <a href={profileData.data.image} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">View Image</a>
                        ) : "Not provided"}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
