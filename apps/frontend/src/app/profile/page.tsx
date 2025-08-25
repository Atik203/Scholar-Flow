"use client";

import { RoleBadge } from "@/components/auth/RoleBadge";
import { showSuccessToast } from "@/components/providers/ToastProvider";
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
import { Textarea } from "@/components/ui/textarea";
import { useProtectedRoute } from "@/hooks/useAuthGuard";
import { ROLE_DESCRIPTIONS, USER_ROLES } from "@/lib/auth/roles";
import {
  Calendar,
  Camera,
  Edit3,
  Globe,
  Mail,
  MapPin,
  Save,
  Shield,
  X,
} from "lucide-react";
import { useState } from "react";

export default function ProfilePage() {
  // Protected route guard
  const { isLoading, user } = useProtectedRoute();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    institution: "",
    researchInterests: "",
    location: "",
    website: "",
    orcid: "",
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const userRole = user?.role || USER_ROLES.RESEARCHER;
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || "U";

  const handleEdit = () => {
    setFormData({
      name: user?.name || "",
      bio: "",
      institution: "",
      researchInterests: "",
      location: "",
      website: "",
      orcid: "",
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    // TODO: Implement save functionality with backend API
    console.log("Saving profile data:", formData);
    showSuccessToast(
      "Profile Updated",
      "Your profile has been updated successfully"
    );
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: "",
      bio: "",
      institution: "",
      researchInterests: "",
      location: "",
      website: "",
      orcid: "",
    });
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
                <div className="relative mx-auto">
                  <Avatar className="h-24 w-24 ring-4 ring-primary/20">
                    <AvatarImage
                      src={user?.image || ""}
                      alt={user?.name || "User"}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg dark:bg-primary/20">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 dark:border-gray-600"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
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
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">
                    {user?.email}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Joined August 2025
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Account verified
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Information */}
          <div className="lg:col-span-3">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="dark:text-white">
                    Personal Information
                  </CardTitle>
                  <CardDescription className="dark:text-gray-400">
                    Update your personal details and research information
                  </CardDescription>
                </div>
                {!isEditing ? (
                  <Button onClick={handleEdit} variant="outline" size="sm">
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={handleSave} size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button onClick={handleCancel} variant="outline" size="sm">
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                {isEditing ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="institution">Institution</Label>
                      <Input
                        id="institution"
                        value={formData.institution}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            institution: e.target.value,
                          })
                        }
                        placeholder="University or organization"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) =>
                          setFormData({ ...formData, bio: e.target.value })
                        }
                        placeholder="Tell us about yourself and your research"
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="interests">Research Interests</Label>
                      <Textarea
                        id="interests"
                        value={formData.researchInterests}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            researchInterests: e.target.value,
                          })
                        }
                        placeholder="List your research areas and interests"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              location: e.target.value,
                            })
                          }
                          placeholder="City, Country"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          value={formData.website}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              website: e.target.value,
                            })
                          }
                          placeholder="https://yourwebsite.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="orcid">ORCID iD</Label>
                      <Input
                        id="orcid"
                        value={formData.orcid}
                        onChange={(e) =>
                          setFormData({ ...formData, orcid: e.target.value })
                        }
                        placeholder="0000-0000-0000-0000"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Full Name
                      </Label>
                      <p className="mt-1 text-gray-900 dark:text-white">
                        {user?.name || "Not provided"}
                      </p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Institution
                      </Label>
                      <p className="mt-1 text-gray-900 dark:text-white">
                        Not provided
                      </p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Bio
                      </Label>
                      <p className="mt-1 text-gray-900 dark:text-white">
                        No bio available yet. Click edit to add your bio.
                      </p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Research Interests
                      </Label>
                      <p className="mt-1 text-gray-900 dark:text-white">
                        No research interests listed yet.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          <MapPin className="inline h-4 w-4 mr-1" />
                          Location
                        </Label>
                        <p className="mt-1 text-gray-900 dark:text-white">
                          Not provided
                        </p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          <Globe className="inline h-4 w-4 mr-1" />
                          Website
                        </Label>
                        <p className="mt-1 text-gray-900 dark:text-white">
                          Not provided
                        </p>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        ORCID iD
                      </Label>
                      <p className="mt-1 text-gray-900 dark:text-white">
                        Not provided
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
