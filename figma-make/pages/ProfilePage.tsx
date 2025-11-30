"use client";

/**
 * ProfilePage - User Profile Management
 * Matches frontend/src/app/profile/page.tsx
 *
 * Enhanced with:
 * - Research interests tags UI
 * - Publication statistics section
 * - Collaboration network visualization
 * - Profile completeness meter
 */

import {
  AlertTriangle,
  Award,
  BookOpen,
  Camera,
  CheckCircle,
  Edit3,
  ExternalLink,
  FileText,
  GraduationCap,
  Link2,
  Loader2,
  Network,
  Plus,
  Quote,
  Save,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
  Users,
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
import { Progress } from "../components/ui/progress";

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
  orcid: "0000-0002-1234-5678",
  googleScholar: "https://scholar.google.com/citations?user=xyz",
  researchGate: "https://researchgate.net/profile/Sarah-Chen",
};

// Research interests tags
const mockResearchInterests = [
  { id: "1", name: "Machine Learning", color: "bg-blue-500" },
  { id: "2", name: "Natural Language Processing", color: "bg-purple-500" },
  { id: "3", name: "Computer Vision", color: "bg-green-500" },
  { id: "4", name: "Deep Learning", color: "bg-orange-500" },
  { id: "5", name: "AI Ethics", color: "bg-pink-500" },
];

// Publication statistics
const mockPublicationStats = {
  totalPapers: 47,
  totalCitations: 1234,
  hIndex: 18,
  i10Index: 24,
  recentPapers: 8,
  avgCitationsPerPaper: 26.3,
};

// Collaboration network data
const mockCollaborators = [
  {
    id: "1",
    name: "Dr. John Smith",
    institution: "MIT",
    papers: 12,
    avatar: "",
  },
  {
    id: "2",
    name: "Prof. Emily Watson",
    institution: "Harvard",
    papers: 8,
    avatar: "",
  },
  {
    id: "3",
    name: "Dr. Michael Lee",
    institution: "Berkeley",
    papers: 6,
    avatar: "",
  },
  {
    id: "4",
    name: "Dr. Anna Garcia",
    institution: "Oxford",
    papers: 5,
    avatar: "",
  },
  {
    id: "5",
    name: "Prof. David Kim",
    institution: "Stanford",
    papers: 4,
    avatar: "",
  },
];

// Profile completeness fields
const profileFields = [
  { name: "Basic Info", completed: true, weight: 20 },
  { name: "Institution", completed: true, weight: 15 },
  { name: "Field of Study", completed: true, weight: 15 },
  { name: "Research Interests", completed: true, weight: 15 },
  { name: "Profile Picture", completed: false, weight: 10 },
  { name: "ORCID ID", completed: true, weight: 10 },
  { name: "Google Scholar", completed: true, weight: 10 },
  { name: "Bio", completed: false, weight: 5 },
];

export function ProfilePage({ onNavigate, onShowToast }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [researchInterests, setResearchInterests] = useState(
    mockResearchInterests
  );
  const [newInterest, setNewInterest] = useState("");
  const [showAddInterest, setShowAddInterest] = useState(false);

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

  // Calculate profile completeness
  const profileCompleteness = profileFields.reduce(
    (acc, field) => acc + (field.completed ? field.weight : 0),
    0
  );

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

  const handleAddInterest = () => {
    if (newInterest.trim()) {
      const colors = [
        "bg-blue-500",
        "bg-purple-500",
        "bg-green-500",
        "bg-orange-500",
        "bg-pink-500",
        "bg-cyan-500",
        "bg-indigo-500",
      ];
      setResearchInterests([
        ...researchInterests,
        {
          id: Date.now().toString(),
          name: newInterest.trim(),
          color: colors[Math.floor(Math.random() * colors.length)],
        },
      ]);
      setNewInterest("");
      setShowAddInterest(false);
      onShowToast?.("Research interest added", "success");
    }
  };

  const handleRemoveInterest = (id: string) => {
    setResearchInterests(researchInterests.filter((i) => i.id !== id));
    onShowToast?.("Research interest removed", "info");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        {/* Profile Completeness Meter */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          <Card className="dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-chart-1/20 flex items-center justify-center">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Profile Completeness
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Complete your profile to increase visibility
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold text-primary">
                    {profileCompleteness}%
                  </span>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {profileCompleteness === 100
                      ? "Complete!"
                      : `${100 - profileCompleteness}% remaining`}
                  </p>
                </div>
              </div>
              <div className="relative">
                <Progress value={profileCompleteness} className="h-3" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0 animate-shimmer" />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {profileFields
                  .filter((f) => !f.completed)
                  .map((field) => (
                    <Badge
                      key={field.name}
                      variant="outline"
                      className="text-amber-600 border-amber-300 dark:border-amber-700"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add {field.name}
                    </Badge>
                  ))}
              </div>
            </div>
          </Card>
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

        {/* Publication Statistics Section */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <CardTitle className="dark:text-white">
                      Publication Statistics
                    </CardTitle>
                    <CardDescription className="dark:text-gray-400">
                      Your research impact at a glance
                    </CardDescription>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="btn-hover-glow">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Full Analytics
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <motion.div
                  className="text-center p-4 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-center mb-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-3xl font-bold text-primary">
                    {mockPublicationStats.totalPapers}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Total Papers
                  </p>
                </motion.div>
                <motion.div
                  className="text-center p-4 rounded-xl bg-gradient-to-br from-green-500/5 to-green-500/10 border border-green-500/20"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-center mb-2">
                    <Quote className="h-5 w-5 text-green-500" />
                  </div>
                  <p className="text-3xl font-bold text-green-600">
                    {mockPublicationStats.totalCitations.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Citations
                  </p>
                </motion.div>
                <motion.div
                  className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-500/5 to-purple-500/10 border border-purple-500/20"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-center mb-2">
                    <TrendingUp className="h-5 w-5 text-purple-500" />
                  </div>
                  <p className="text-3xl font-bold text-purple-600">
                    {mockPublicationStats.hIndex}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    h-index
                  </p>
                </motion.div>
                <motion.div
                  className="text-center p-4 rounded-xl bg-gradient-to-br from-orange-500/5 to-orange-500/10 border border-orange-500/20"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-center mb-2">
                    <Star className="h-5 w-5 text-orange-500" />
                  </div>
                  <p className="text-3xl font-bold text-orange-600">
                    {mockPublicationStats.i10Index}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    i10-index
                  </p>
                </motion.div>
                <motion.div
                  className="text-center p-4 rounded-xl bg-gradient-to-br from-cyan-500/5 to-cyan-500/10 border border-cyan-500/20"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-center mb-2">
                    <Sparkles className="h-5 w-5 text-cyan-500" />
                  </div>
                  <p className="text-3xl font-bold text-cyan-600">
                    {mockPublicationStats.recentPapers}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    This Year
                  </p>
                </motion.div>
                <motion.div
                  className="text-center p-4 rounded-xl bg-gradient-to-br from-pink-500/5 to-pink-500/10 border border-pink-500/20"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-center mb-2">
                    <GraduationCap className="h-5 w-5 text-pink-500" />
                  </div>
                  <p className="text-3xl font-bold text-pink-600">
                    {mockPublicationStats.avgCitationsPerPaper}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Avg Citations
                  </p>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Research Interests Tags */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <CardTitle className="dark:text-white">
                      Research Interests
                    </CardTitle>
                    <CardDescription className="dark:text-gray-400">
                      Topics and areas you specialize in
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <AnimatePresence mode="popLayout">
                  {researchInterests.map((interest) => (
                    <motion.div
                      key={interest.id}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <Badge
                        variant="secondary"
                        className={`${interest.color} text-white px-3 py-1.5 text-sm font-medium group cursor-pointer hover:opacity-90 transition-opacity`}
                      >
                        {interest.name}
                        <button
                          onClick={() => handleRemoveInterest(interest.id)}
                          className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {showAddInterest ? (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    className="flex items-center gap-2"
                  >
                    <Input
                      value={newInterest}
                      onChange={(e) => setNewInterest(e.target.value)}
                      placeholder="Add interest..."
                      className="h-8 w-40"
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleAddInterest()
                      }
                      autoFocus
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleAddInterest}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowAddInterest(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-dashed"
                    onClick={() => setShowAddInterest(true)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Interest
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Collaboration Network */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500/20 to-blue-500/20 flex items-center justify-center">
                    <Network className="h-5 w-5 text-indigo-500" />
                  </div>
                  <div>
                    <CardTitle className="dark:text-white">
                      Collaboration Network
                    </CardTitle>
                    <CardDescription className="dark:text-gray-400">
                      Researchers you've collaborated with
                    </CardDescription>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="btn-hover-glow">
                  <Users className="h-4 w-4 mr-2" />
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {mockCollaborators.map((collaborator, index) => (
                  <motion.div
                    key={collaborator.id}
                    className="flex flex-col items-center p-4 rounded-xl border bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 dark:border-gray-700 hover:border-primary/50 transition-all cursor-pointer group"
                    whileHover={{ y: -4 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-3 ring-2 ring-transparent group-hover:ring-primary/30 transition-all">
                      <span className="text-xl font-bold text-primary">
                        {collaborator.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <h4 className="font-medium text-center text-gray-900 dark:text-white text-sm">
                      {collaborator.name}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      {collaborator.institution}
                    </p>
                    <div className="mt-2 flex items-center gap-1 text-xs text-primary">
                      <Link2 className="h-3 w-3" />
                      <span>{collaborator.papers} papers</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Academic Profiles */}
        <motion.div
          className="mt-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        >
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">
                Academic Profiles
              </CardTitle>
              <CardDescription className="dark:text-gray-400">
                Connect your academic identities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center justify-between p-4 rounded-xl border bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        ORCID
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {mockUser.orcid}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-green-500 text-green-600"
                  >
                    Connected
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl border bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Google Scholar
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[150px]">
                        Connected
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-blue-500 text-blue-600"
                  >
                    Connected
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl border dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gray-500/20 flex items-center justify-center">
                      <Link2 className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        ResearchGate
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Not connected
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Connect
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
