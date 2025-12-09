"use client";

/**
 * OnboardingWorkspacePage - First Workspace Creation
 *
 * Guides new users through creating their first workspace with
 * templates, team invitations, and initial setup options.
 *
 * Features:
 * - Workspace templates (personal, academic, research lab)
 * - Team member invitation flow
 * - Initial collection setup
 * - Import existing papers option
 * - Animated step-by-step guide
 * - Mobile-responsive design
 */

import {
  ArrowRight,
  BookOpen,
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  FileUp,
  FlaskConical,
  FolderKanban,
  Globe,
  GraduationCap,
  Link2,
  Loader2,
  Lock,
  Mail,
  Palette,
  Plus,
  Sparkles,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

interface OnboardingWorkspacePageProps {
  onNavigate: (path: string) => void;
}

interface WorkspaceTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
  collections: string[];
  features: string[];
}

interface InvitedMember {
  email: string;
  role: "viewer" | "editor" | "admin";
}

// Workspace templates
const templates: WorkspaceTemplate[] = [
  {
    id: "personal",
    name: "Personal Research",
    description:
      "For individual researchers managing their own papers and notes",
    icon: BookOpen,
    color: "blue",
    gradient: "from-blue-500 to-blue-600",
    collections: ["Reading List", "Favorites", "To Review"],
    features: ["Personal library", "Private notes", "Reading tracker"],
  },
  {
    id: "academic",
    name: "Academic Project",
    description: "Perfect for thesis, dissertation, or academic coursework",
    icon: GraduationCap,
    color: "purple",
    gradient: "from-purple-500 to-purple-600",
    collections: ["Literature Review", "Methodology", "References", "Drafts"],
    features: [
      "Citation management",
      "Chapter organization",
      "Supervisor access",
    ],
  },
  {
    id: "lab",
    name: "Research Lab",
    description: "Collaborative workspace for research teams and labs",
    icon: FlaskConical,
    color: "emerald",
    gradient: "from-emerald-500 to-emerald-600",
    collections: ["Active Projects", "Published", "In Review", "Archive"],
    features: ["Team collaboration", "Project tracking", "Shared resources"],
  },
  {
    id: "organization",
    name: "Organization",
    description: "For departments, institutes, or large research organizations",
    icon: Building2,
    color: "amber",
    gradient: "from-amber-500 to-amber-600",
    collections: ["Departments", "Grants", "Publications", "Resources"],
    features: ["Multi-team support", "Analytics", "Admin controls"],
  },
];

// Color options for workspace
const colorOptions = [
  { name: "Blue", value: "blue", class: "bg-blue-500" },
  { name: "Purple", value: "purple", class: "bg-purple-500" },
  { name: "Emerald", value: "emerald", class: "bg-emerald-500" },
  { name: "Amber", value: "amber", class: "bg-amber-500" },
  { name: "Rose", value: "rose", class: "bg-rose-500" },
  { name: "Indigo", value: "indigo", class: "bg-indigo-500" },
];

export function OnboardingWorkspacePage({
  onNavigate,
}: OnboardingWorkspacePageProps) {
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceColor, setWorkspaceColor] = useState("blue");
  const [visibility, setVisibility] = useState<"private" | "team" | "public">(
    "private"
  );
  const [invitedMembers, setInvitedMembers] = useState<InvitedMember[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"viewer" | "editor" | "admin">(
    "editor"
  );
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [customCollection, setCustomCollection] = useState("");
  const [importOption, setImportOption] = useState<
    "skip" | "upload" | "import"
  >("skip");
  const [isCreating, setIsCreating] = useState(false);

  const selectedTemplateData = templates.find((t) => t.id === selectedTemplate);

  const handleAddMember = () => {
    if (inviteEmail && !invitedMembers.find((m) => m.email === inviteEmail)) {
      setInvitedMembers([
        ...invitedMembers,
        { email: inviteEmail, role: inviteRole },
      ]);
      setInviteEmail("");
    }
  };

  const handleRemoveMember = (email: string) => {
    setInvitedMembers(invitedMembers.filter((m) => m.email !== email));
  };

  const handleAddCollection = () => {
    if (customCollection && !selectedCollections.includes(customCollection)) {
      setSelectedCollections([...selectedCollections, customCollection]);
      setCustomCollection("");
    }
  };

  const handleToggleCollection = (collection: string) => {
    if (selectedCollections.includes(collection)) {
      setSelectedCollections(
        selectedCollections.filter((c) => c !== collection)
      );
    } else {
      setSelectedCollections([...selectedCollections, collection]);
    }
  };

  const handleCreateWorkspace = async () => {
    setIsCreating(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsCreating(false);
    onNavigate("/dashboard");
  };

  const canProceedStep1 = selectedTemplate !== null;
  const canProceedStep2 = workspaceName.length >= 3;
  const canProceedStep3 = true; // Collections are optional

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Choose a Template
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              Start with a template that fits your research style. You can
              customize everything later.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {templates.map((template) => {
                const Icon = template.icon;
                const isSelected = selectedTemplate === template.id;

                return (
                  <motion.div
                    key={template.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedTemplate(template.id);
                      setWorkspaceColor(template.color);
                      setSelectedCollections(template.collections);
                    }}
                    className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-600"
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}

                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-r ${template.gradient} flex items-center justify-center mb-4`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                      {template.name}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                      {template.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {template.features.map((feature, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Blank workspace option */}
            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setSelectedTemplate("blank");
                  setSelectedCollections([]);
                }}
                className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              >
                Or start with a blank workspace
              </button>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Customize Your Workspace
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              Give your workspace a name and choose its appearance.
            </p>

            <div className="space-y-6">
              {/* Workspace Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Workspace Name
                </label>
                <input
                  type="text"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  placeholder="e.g., My Research Hub"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  <Palette className="w-4 h-4 inline mr-2" />
                  Workspace Color
                </label>
                <div className="flex gap-3">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setWorkspaceColor(color.value)}
                      className={`w-10 h-10 rounded-full ${color.class} transition-transform ${
                        workspaceColor === color.value
                          ? "scale-110 ring-2 ring-offset-2 ring-slate-300 dark:ring-slate-600"
                          : "hover:scale-105"
                      }`}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Visibility */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Visibility
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      id: "private",
                      icon: Lock,
                      label: "Private",
                      desc: "Only you",
                    },
                    {
                      id: "team",
                      icon: Users,
                      label: "Team",
                      desc: "Invited members",
                    },
                    {
                      id: "public",
                      icon: Globe,
                      label: "Public",
                      desc: "Anyone can view",
                    },
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() =>
                        setVisibility(option.id as typeof visibility)
                      }
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        visibility === option.id
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                      }`}
                    >
                      <option.icon
                        className={`w-5 h-5 mb-2 ${
                          visibility === option.id
                            ? "text-blue-500"
                            : "text-slate-400"
                        }`}
                      />
                      <div className="font-medium text-slate-900 dark:text-white text-sm">
                        {option.label}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {option.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Team Invitations (show only if visibility is team or public) */}
              {visibility !== "private" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    <UserPlus className="w-4 h-4 inline mr-2" />
                    Invite Team Members
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="colleague@university.edu"
                      className="flex-1 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                    <select
                      value={inviteRole}
                      onChange={(e) =>
                        setInviteRole(e.target.value as typeof inviteRole)
                      }
                      className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    >
                      <option value="viewer">Viewer</option>
                      <option value="editor">Editor</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button
                      onClick={handleAddMember}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>

                  {invitedMembers.length > 0 && (
                    <div className="space-y-2">
                      {invitedMembers.map((member) => (
                        <div
                          key={member.email}
                          className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                              <Mail className="w-4 h-4 text-blue-500" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-slate-900 dark:text-white">
                                {member.email}
                              </div>
                              <div className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                                {member.role}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveMember(member.email)}
                            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                          >
                            <X className="w-4 h-4 text-slate-400" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Preview */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                  Preview
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg bg-${workspaceColor}-500 flex items-center justify-center`}
                  >
                    <FolderKanban className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white">
                      {workspaceName || "Your Workspace"}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      {visibility === "private" && <Lock className="w-3 h-3" />}
                      {visibility === "team" && <Users className="w-3 h-3" />}
                      {visibility === "public" && <Globe className="w-3 h-3" />}
                      {visibility.charAt(0).toUpperCase() + visibility.slice(1)}
                      {invitedMembers.length > 0 && (
                        <span>• {invitedMembers.length} invited</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Set Up Collections
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              Collections help organize your papers. We've suggested some based
              on your template.
            </p>

            <div className="space-y-6">
              {/* Suggested Collections */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  Suggested Collections
                </label>
                <div className="flex flex-wrap gap-2">
                  {selectedTemplateData?.collections.map((collection) => (
                    <button
                      key={collection}
                      onClick={() => handleToggleCollection(collection)}
                      className={`px-4 py-2 rounded-full border transition-all ${
                        selectedCollections.includes(collection)
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                          : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-300"
                      }`}
                    >
                      {selectedCollections.includes(collection) && (
                        <Check className="w-4 h-4 inline mr-1" />
                      )}
                      {collection}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Collections */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Add Custom Collection
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customCollection}
                    onChange={(e) => setCustomCollection(e.target.value)}
                    placeholder="e.g., Machine Learning"
                    className="flex-1 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleAddCollection()
                    }
                  />
                  <button
                    onClick={handleAddCollection}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Selected Collections Preview */}
              {selectedCollections.length > 0 && (
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                    {selectedCollections.length} collection(s) will be created
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {selectedCollections.map((collection) => (
                      <div
                        key={collection}
                        className="flex items-center gap-2 p-2 bg-white dark:bg-slate-900 rounded-lg"
                      >
                        <FolderKanban className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-slate-900 dark:text-white truncate">
                          {collection}
                        </span>
                        <button
                          onClick={() => handleToggleCollection(collection)}
                          className="ml-auto p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                        >
                          <X className="w-3 h-3 text-slate-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Import Options */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  Import Existing Papers
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      id: "skip",
                      icon: ArrowRight,
                      label: "Skip for now",
                      desc: "I'll add papers later",
                    },
                    {
                      id: "upload",
                      icon: FileUp,
                      label: "Upload PDFs",
                      desc: "Drag & drop files",
                    },
                    {
                      id: "import",
                      icon: Link2,
                      label: "Import from",
                      desc: "Zotero, Mendeley, etc.",
                    },
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() =>
                        setImportOption(option.id as typeof importOption)
                      }
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        importOption === option.id
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                      }`}
                    >
                      <option.icon
                        className={`w-5 h-5 mb-2 ${
                          importOption === option.id
                            ? "text-blue-500"
                            : "text-slate-400"
                        }`}
                      />
                      <div className="font-medium text-slate-900 dark:text-white text-sm">
                        {option.label}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {option.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="text-center py-12"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-6"
            >
              <Sparkles className="w-12 h-12 text-white" />
            </motion.div>

            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              You're All Set!
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
              Your workspace "{workspaceName}" is ready. Let's start your
              research journey.
            </p>

            {/* Summary */}
            <div className="max-w-md mx-auto mb-8">
              <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 text-left">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
                  Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">
                      Workspace
                    </span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {workspaceName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">
                      Template
                    </span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {selectedTemplateData?.name || "Blank"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">
                      Collections
                    </span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {selectedCollections.length}
                    </span>
                  </div>
                  {invitedMembers.length > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-400">
                        Team Members
                      </span>
                      <span className="font-medium text-slate-900 dark:text-white">
                        {invitedMembers.length} invited
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={handleCreateWorkspace}
              disabled={isCreating}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium text-lg hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Workspace...
                </>
              ) : (
                <>
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() =>
                step > 1 ? setStep(step - 1) : onNavigate("/onboarding/role")
              }
              className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>

            {/* Progress Steps */}
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      s < step
                        ? "bg-blue-500 text-white"
                        : s === step
                          ? "bg-blue-500 text-white"
                          : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {s < step ? <Check className="w-4 h-4" /> : s}
                  </div>
                  {s < 4 && (
                    <div
                      className={`w-8 h-1 rounded-full ${
                        s < step
                          ? "bg-blue-500"
                          : "bg-slate-200 dark:bg-slate-700"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="text-sm text-slate-500 dark:text-slate-400">
              Step {step} of 4
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>

        {/* Navigation */}
        {step < 4 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-between mt-12"
          >
            <button
              onClick={() =>
                step > 1 ? setStep(step - 1) : onNavigate("/onboarding/role")
              }
              className="flex items-center gap-2 px-6 py-3 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>

            <button
              onClick={() => setStep(step + 1)}
              disabled={
                (step === 1 && !canProceedStep1) ||
                (step === 2 && !canProceedStep2) ||
                (step === 3 && !canProceedStep3)
              }
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                (step === 1 && canProceedStep1) ||
                (step === 2 && canProceedStep2) ||
                (step === 3 && canProceedStep3)
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed"
              }`}
            >
              {step === 3 ? "Finish Setup" : "Continue"}
              <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
