"use client";

/**
 * ProfilePage - User Profile Management
 * Matches frontend/src/app/profile/page.tsx
 */

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
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

// Role display names
const roleDisplayNames: Record<string, string> = {
  researcher: "Researcher",
  pro_researcher: "Pro Researcher",
  team_lead: "Team Lead",
  admin: "Administrator",
};

// Role descriptions
const ROLE_DESCRIPTIONS: Record<string, string> = {
  researcher: "Access to basic research tools and paper management",
  pro_researcher: "Advanced research capabilities with AI insights",
  team_lead: "Team management and collaboration features",
  admin: "Full system administration access",
};

interface ProfilePageProps {
  onNavigate: (path: string) => void;
  onShowToast?: (message: string, type: "error" | "success" | "info") => void;
}

// Mock user data for Figma Make
const mockUser = {
  id: "user_123",
  name: "Dr. Sarah Chen",
  firstName: "Sarah",
  lastName: "Chen",
  email: "sarah.chen@university.edu",
  image: "",
  role: "pro_researcher",
  emailVerified: new Date().toISOString(),
  institution: "Stanford University",
  fieldOfStudy: "Machine Learning & AI",
};

export function ProfilePage({ onNavigate, onShowToast }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: mockUser.name,
    firstName: mockUser.firstName,
    lastName: mockUser.lastName,
    institution: mockUser.institution,
    fieldOfStudy: mockUser.fieldOfStudy,
    image: mockUser.image,
  });

  const userRole = mockUser.role;
  const initials = mockUser.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    // Reset form to original values
    setFormData({
      name: mockUser.name,
      firstName: mockUser.firstName,
      lastName: mockUser.lastName,
      institution: mockUser.institution,
      fieldOfStudy: mockUser.fieldOfStudy,
      image: mockUser.image,
    });
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsUpdating(false);
    setIsEditing(false);
    onShowToast?.("Profile updated successfully", "success");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      onShowToast?.("File size must be less than 5MB", "error");
      return;
    }

    // Validate file type
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      onShowToast?.("Only JPEG, PNG, and WebP images are allowed", "error");
      return;
    }

    setIsUploading(true);
    // Simulate upload
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsUploading(false);
    onShowToast?.("Profile picture updated successfully", "success");

    // Reset input
    e.target.value = "";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Profile
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your account information and research profile
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Profile Card */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="relative group">
                    <div className="h-32 w-32 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden ring-4 ring-primary/20 transition-all duration-300 group-hover:ring-primary/40">
                      {mockUser.image ? (
                        <img
                          src={mockUser.image}
                          alt={mockUser.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-4xl font-bold text-primary">
                          {initials}
                        </span>
                      )}
                    </div>
                    <label
                      htmlFor="profile-picture-upload"
                      className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-all duration-300 shadow-lg hover:scale-110"
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
                      onChange={handleImageUpload}
                      disabled={isUploading}
                    />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {mockUser.name}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400">
                    {mockUser.email}
                  </p>
                  <div className="mt-3 flex flex-col items-center gap-2">
                    <Badge
                      variant="default"
                      className="bg-primary/10 text-primary hover:bg-primary/20"
                    >
                      {roleDisplayNames[userRole]}
                    </Badge>
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      {ROLE_DESCRIPTIONS[userRole]}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="h-4 w-4 text-gray-400 mt-0.5" />
                  {mockUser.emailVerified ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-green-600 dark:text-green-400 font-medium">
                        Verified on{" "}
                        {new Date(mockUser.emailVerified).toLocaleDateString()}
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
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 btn-hover-glow"
                          onClick={() => onNavigate("/verify-email")}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Verify Now
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Profile Information */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
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
                  <AnimatePresence mode="wait">
                    {!isEditing ? (
                      <motion.div
                        key="edit"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                      >
                        <Button
                          onClick={handleEdit}
                          variant="outline"
                          size="sm"
                          className="w-full sm:w-auto btn-hover-glow"
                        >
                          <Edit3 className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="actions"
                        className="flex gap-2 flex-wrap"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                      >
                        <Button
                          onClick={handleSubmit}
                          size="sm"
                          disabled={isUpdating}
                          className="flex-1 sm:flex-none btn-hover-glow"
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
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <AnimatePresence mode="wait">
                  {isEditing ? (
                    <motion.form
                      key="form"
                      onSubmit={handleSubmit}
                      className="space-y-6"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            value={formData.firstName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                firstName: e.target.value,
                              })
                            }
                            placeholder="Enter your first name"
                            className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={formData.lastName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                lastName: e.target.value,
                              })
                            }
                            placeholder="Enter your last name"
                            className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          placeholder="Enter your full name (optional if using first/last name)"
                          className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
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
                          className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="fieldOfStudy">Field of Study</Label>
                        <Input
                          id="fieldOfStudy"
                          value={formData.fieldOfStudy}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              fieldOfStudy: e.target.value,
                            })
                          }
                          placeholder="Your research area or field of study"
                          className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="image">Profile Image URL</Label>
                        <Input
                          id="image"
                          value={formData.image}
                          onChange={(e) =>
                            setFormData({ ...formData, image: e.target.value })
                          }
                          placeholder="https://example.com/avatar.jpg"
                          className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="display"
                      className="space-y-6"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            First Name
                          </Label>
                          <p className="mt-1 text-gray-900 dark:text-white">
                            {mockUser.firstName || "Not provided"}
                          </p>
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Last Name
                          </Label>
                          <p className="mt-1 text-gray-900 dark:text-white">
                            {mockUser.lastName || "Not provided"}
                          </p>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Full Name
                        </Label>
                        <p className="mt-1 text-gray-900 dark:text-white">
                          {mockUser.name || "Not provided"}
                        </p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Institution
                        </Label>
                        <p className="mt-1 text-gray-900 dark:text-white">
                          {mockUser.institution || "Not provided"}
                        </p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Field of Study
                        </Label>
                        <p className="mt-1 text-gray-900 dark:text-white">
                          {mockUser.fieldOfStudy || "Not provided"}
                        </p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Profile Image
                        </Label>
                        <p className="mt-1 text-gray-900 dark:text-white">
                          {mockUser.image ? (
                            <a
                              href={mockUser.image}
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>

            {/* Account Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
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
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200">
                    <div>
                      <Label className="text-sm font-medium text-gray-900 dark:text-white">
                        Email Notifications
                      </Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Receive updates about your research activity
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="btn-hover-glow"
                      onClick={() => onNavigate("/settings")}
                    >
                      Configure
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200">
                    <div>
                      <Label className="text-sm font-medium text-gray-900 dark:text-white">
                        Privacy Settings
                      </Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Control who can see your profile and research
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="btn-hover-glow"
                      onClick={() => onNavigate("/settings")}
                    >
                      Manage
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200">
                    <div>
                      <Label className="text-sm font-medium text-gray-900 dark:text-white">
                        Connected Accounts
                      </Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Link your social and academic profiles
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="btn-hover-glow"
                      onClick={() => onNavigate("/settings")}
                    >
                      Connect
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
