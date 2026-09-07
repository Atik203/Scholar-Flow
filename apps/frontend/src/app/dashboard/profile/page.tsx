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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
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
  GraduationCap,
  Loader2,
  Mail,
  Save,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

function ProfileLoadingSkeleton() {
  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-muted rounded-md animate-pulse" />
          <div className="h-4 w-80 bg-muted rounded-md animate-pulse" />
        </div>

        <Card className="overflow-hidden">
          <div className="h-32 bg-muted/50" />
          <CardContent className="px-6 pb-6 -mt-10">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <div className="h-24 w-24 rounded-full bg-muted border-4 border-background animate-pulse" />
              <div className="space-y-2 pb-1">
                <div className="h-6 w-40 bg-muted rounded-md animate-pulse" />
                <div className="h-4 w-56 bg-muted rounded-md animate-pulse" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="h-5 w-40 bg-muted rounded-md animate-pulse" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-24 bg-muted rounded-md animate-pulse" />
                  <div className="h-9 w-full bg-muted rounded-md animate-pulse" />
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="h-5 w-36 bg-muted rounded-md animate-pulse" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-20 bg-muted rounded-md animate-pulse" />
                  <div className="h-9 w-full bg-muted rounded-md animate-pulse" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function DashboardProfilePage() {
  const {
    data: profileData,
    isLoading: isProfileLoading,
    refetch,
  } = useGetProfileQuery();

  const [updateProfile, { isLoading: isUpdating }] =
    useUpdateProfileMutation();
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
    return <ProfileLoadingSkeleton />;
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
      showSuccessToast(
        "Profile Updated",
        "Your profile has been updated successfully"
      );
      setIsEditing(false);
      refetch();
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      showErrorToast(
        "Update Failed",
        err?.data?.message || "Failed to update profile. Please try again."
      );
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const emailVerifiedDate = (() => {
    const dv = (user as unknown as Record<string, unknown>)?.emailVerified;
    if (!dv) return null;
    const d = typeof dv === "string" ? new Date(dv) : dv;
    if (d instanceof Date && !isNaN(d.getTime())) return d.toLocaleDateString();
    return null;
  })();

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account information and research profile
          </p>
        </div>

        {/* Profile Banner Card */}
        <Card className="overflow-hidden">
          {/* Banner Background */}
          <div className="h-28 sm:h-32 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent" />

          <CardContent className="px-6 pb-6 -mt-10 sm:-mt-12">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              {/* Avatar */}
              <div className="relative group shrink-0">
                <Avatar className="h-24 w-24 sm:h-28 sm:w-28 border-4 border-background shadow-lg">
                  <AvatarImage
                    src={user?.image || ""}
                    alt={user?.name || "User"}
                  />
                  <AvatarFallback className="text-3xl font-semibold bg-muted">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="dashboard-profile-picture-upload"
                  className="absolute bottom-1 right-1 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors shadow-md opacity-0 group-hover:opacity-100"
                >
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Camera className="h-4 w-4" />
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
                      showSuccessToast("Profile picture updated successfully");
                      refetch();
                    } catch (error: unknown) {
                      const err = error as { data?: { message?: string } };
                      showErrorToast(
                        err?.data?.message ||
                          "Failed to upload profile picture"
                      );
                    }
                    e.target.value = "";
                  }}
                  disabled={isUploading}
                />
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0 pb-1">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                  {user?.name || "User"}
                </h2>
                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                  <Mail className="h-4 w-4 shrink-0" />
                  <span className="text-sm truncate">{user?.email}</span>
                </div>
              </div>

              {/* Role Badge */}
              <div className="flex items-center gap-3 pb-1 shrink-0">
                <RoleBadge role={userRole} size="md" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email Verification Banner */}
        {!user?.emailVerified && (
          <div className="flex items-start gap-3 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 px-4 py-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                Email not verified
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-0.5">
                Verify your email to access all features and receive important
                notifications.
              </p>
            </div>
            <Link href="/verify-email">
              <Button
                size="sm"
                variant="outline"
                className="shrink-0 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40"
              >
                <ExternalLink className="h-4 w-4 mr-1.5" />
                Verify
              </Button>
            </Link>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Information — Left Column */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-lg">Personal Information</CardTitle>
              </div>
              <div>
                {!isEditing ? (
                  <Button
                    onClick={handleEdit}
                    variant="outline"
                    size="sm"
                  >
                    <Edit3 className="h-4 w-4 mr-1.5" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSubmit(onSubmit)}
                      size="sm"
                      disabled={isUpdating || !isDirty}
                    >
                      {isUpdating ? (
                        <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 mr-1.5" />
                      )}
                      {isUpdating ? "Saving..." : "Save"}
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      size="sm"
                    >
                      <X className="h-4 w-4 mr-1.5" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>

            <Separator />

            <CardContent className="pt-6">
              {isEditing ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        {...register("firstName")}
                        placeholder="Enter your first name"
                      />
                      {errors.firstName && (
                        <p className="text-sm text-destructive">
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
                        <p className="text-sm text-destructive">
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
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="institution">Institution</Label>
                      <Input
                        id="institution"
                        {...register("institution")}
                        placeholder="University or organization"
                      />
                      {errors.institution && (
                        <p className="text-sm text-destructive">
                          {errors.institution.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fieldOfStudy">Field of Study</Label>
                      <Input
                        id="fieldOfStudy"
                        {...register("fieldOfStudy")}
                        placeholder="Your research area"
                      />
                      {errors.fieldOfStudy && (
                        <p className="text-sm text-destructive">
                          {errors.fieldOfStudy.message}
                        </p>
                      )}
                    </div>
                  </div>
                </form>
              ) : (
                <div className="space-y-0">
                  <ProfileField
                    label="First Name"
                    value={profileData?.data.firstName}
                  />
                  <ProfileField
                    label="Last Name"
                    value={profileData?.data.lastName}
                  />
                  <ProfileField
                    label="Full Name"
                    value={profileData?.data.name}
                    last
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Right Column — Academic Info + Account */}
          <div className="space-y-6">
            {/* Academic Information */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-4">
                <GraduationCap className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-lg">
                  Academic Information
                </CardTitle>
              </CardHeader>

              <Separator />

              <CardContent className="pt-6">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="institution-edit">Institution</Label>
                      <Input
                        id="institution-edit"
                        {...register("institution")}
                        placeholder="University or organization"
                      />
                      {errors.institution && (
                        <p className="text-sm text-destructive">
                          {errors.institution.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fieldOfStudy-edit">
                        Field of Study
                      </Label>
                      <Input
                        id="fieldOfStudy-edit"
                        {...register("fieldOfStudy")}
                        placeholder="Your research area"
                      />
                      {errors.fieldOfStudy && (
                        <p className="text-sm text-destructive">
                          {errors.fieldOfStudy.message}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-0">
                    <ProfileField
                      label="Institution"
                      value={profileData?.data.institution}
                    />
                    <ProfileField
                      label="Field of Study"
                      value={profileData?.data.fieldOfStudy}
                      last
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Account Details */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-4">
                <User className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-lg">Account</CardTitle>
              </CardHeader>

              <Separator />

              <CardContent className="pt-6">
                <div className="space-y-0">
                  <ProfileField label="Email" value={user?.email} />
                  <ProfileField label="Role">
                    <RoleBadge role={userRole} size="sm" />
                  </ProfileField>
                  <ProfileField
                    label="Status"
                    last
                  >
                    {user?.emailVerified ? (
                      <div className="flex items-center gap-1.5">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                          Verified
                          {emailVerifiedDate && (
                            <span className="font-normal text-muted-foreground ml-1">
                              {emailVerifiedDate}
                            </span>
                          )}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        <span className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                          Not verified
                        </span>
                      </div>
                    )}
                  </ProfileField>
                </div>

                <p className="text-xs text-muted-foreground mt-4 pt-4 border-t">
                  {ROLE_DESCRIPTIONS[userRole as keyof typeof ROLE_DESCRIPTIONS]}
                </p>
              </CardContent>
            </Card>

            {/* Profile Image (read-only) */}
            {!isEditing && profileData?.data.image && (
              <Card>
                <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-4">
                  <Camera className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg">Profile Image</CardTitle>
                </CardHeader>

                <Separator />

                <CardContent className="pt-6">
                  <a
                    href={profileData.data.image}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline inline-flex items-center gap-1.5"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    View Image
                  </a>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

/* ---------- Shared Field Component ---------- */

function ProfileField({
  label,
  value,
  children,
  last = false,
}: {
  label: string;
  value?: string | null;
  children?: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-2.5 ${
        !last ? "border-b border-border" : ""
      }`}
    >
      <span className="text-sm font-medium text-muted-foreground sm:w-36 shrink-0">
        {label}
      </span>
      <span className="text-sm">
        {children || value || (
          <span className="text-muted-foreground">Not provided</span>
        )}
      </span>
    </div>
  );
}
