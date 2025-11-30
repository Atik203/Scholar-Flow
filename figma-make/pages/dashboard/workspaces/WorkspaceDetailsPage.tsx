"use client";

import {
  ArrowLeft,
  BookOpen,
  Building2,
  Calendar,
  Copy,
  Crown,
  Edit,
  FileText,
  Folder,
  Globe,
  Lock,
  Plus,
  Settings,
  Trash2,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useRole, type UserRole } from "../../../components/context";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";

// ============================================================================
// Default User for Demo
// ============================================================================
const defaultUser = {
  name: "John Researcher",
  email: "john@example.com",
  image: undefined,
  role: "researcher" as const,
};

interface WorkspaceDetailsPageProps {
  onNavigate?: (path: string) => void;
  workspaceId?: string;
  role?: UserRole;
}

// ============================================================================
// Utility Functions
// ============================================================================
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

// ============================================================================
// Dummy Data
// ============================================================================
const dummyWorkspace = {
  id: "ws-1",
  name: "AI Research Lab",
  description:
    "Collaborative workspace for artificial intelligence and machine learning research projects. This workspace brings together researchers working on cutting-edge AI technologies.",
  visibility: "private" as const,
  createdAt: "2024-01-05T08:00:00Z",
  updatedAt: "2024-01-28T14:30:00Z",
  owner: {
    id: "user-1",
    name: "John Researcher",
    email: "john@example.com",
  },
};

const dummyStats = {
  papers: 24,
  collections: 5,
  members: 8,
  storage: "256 MB",
};

const dummyCollections = [
  {
    id: "col-1",
    name: "Machine Learning Papers",
    paperCount: 12,
    visibility: "private",
  },
  { id: "col-2", name: "NLP Research", paperCount: 8, visibility: "private" },
  { id: "col-3", name: "Computer Vision", paperCount: 4, visibility: "public" },
];

const dummyRecentPapers = [
  {
    id: "paper-1",
    title: "Attention Is All You Need",
    authors: ["Vaswani et al."],
    addedAt: "2024-01-25",
  },
  {
    id: "paper-2",
    title: "BERT: Pre-training of Deep Bidirectional Transformers",
    authors: ["Devlin et al."],
    addedAt: "2024-01-24",
  },
  {
    id: "paper-3",
    title: "GPT-3: Language Models are Few-Shot Learners",
    authors: ["Brown et al."],
    addedAt: "2024-01-23",
  },
];

const dummyMembers = [
  {
    id: "m-1",
    name: "John Researcher",
    email: "john@example.com",
    role: "OWNER",
    avatar: undefined,
  },
  {
    id: "m-2",
    name: "Dr. Sarah Chen",
    email: "sarah@university.edu",
    role: "ADMIN",
    avatar: undefined,
  },
  {
    id: "m-3",
    name: "Prof. Michael Lee",
    email: "michael@research.org",
    role: "MEMBER",
    avatar: undefined,
  },
  {
    id: "m-4",
    name: "Alice Johnson",
    email: "alice@lab.com",
    role: "MEMBER",
    avatar: undefined,
  },
  {
    id: "m-5",
    name: "Bob Williams",
    email: "bob@institute.edu",
    role: "MEMBER",
    avatar: undefined,
  },
];

type TabType = "overview" | "collections" | "papers" | "members" | "settings";

// ============================================================================
// Workspace Details Page Component
// ============================================================================
export function WorkspaceDetailsPage({
  onNavigate,
  workspaceId,
  role: propRole,
}: WorkspaceDetailsPageProps) {
  const { role: contextRole } = useRole();
  const effectiveRole = propRole ?? contextRole;
  const user = { ...defaultUser, role: effectiveRole };

  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCreateCollectionDialog, setShowCreateCollectionDialog] =
    useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"MEMBER" | "ADMIN">("MEMBER");
  const [editName, setEditName] = useState(dummyWorkspace.name);
  const [editDescription, setEditDescription] = useState(
    dummyWorkspace.description
  );
  const [newCollectionName, setNewCollectionName] = useState("");
  const [newCollectionDescription, setNewCollectionDescription] = useState("");
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const tabs = [
    { id: "overview" as const, label: "Overview", icon: Building2 },
    { id: "collections" as const, label: "Collections", icon: Folder },
    { id: "papers" as const, label: "Papers", icon: FileText },
    { id: "members" as const, label: "Members", icon: Users },
    { id: "settings" as const, label: "Settings", icon: Settings },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getRoleBadge = (role: string) => {
    const roleMap = {
      OWNER: {
        color:
          "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
        label: "Owner",
        icon: Crown,
      },
      ADMIN: {
        color:
          "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
        label: "Admin",
        icon: Settings,
      },
      MEMBER: {
        color:
          "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
        label: "Member",
        icon: User,
      },
    };
    return roleMap[role as keyof typeof roleMap] || roleMap.MEMBER;
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(
      `https://scholarflow.com/workspaces/${dummyWorkspace.id}/join`
    );
  };

  return (
    <DashboardLayout
      user={user}
      onNavigate={onNavigate}
      currentPath="/workspaces/details"
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate?.("/workspaces")}
              className="inline-flex items-center px-3 py-2 text-sm border rounded-lg hover:bg-muted transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Workspaces
            </motion.button>
          </div>
          <div className="flex flex-wrap gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowInviteDialog(true)}
              className="inline-flex items-center px-4 py-2 border rounded-lg hover:bg-muted"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Invite
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowEditDialog(true)}
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </motion.button>
          </div>
        </div>

        {/* Workspace Hero Card */}
        <div className="rounded-xl border bg-gradient-to-r from-background via-primary/5 to-blue-500/10 p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-4 bg-primary/10 rounded-xl">
                <Building2 className="h-10 w-10 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl font-bold">{dummyWorkspace.name}</h1>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium",
                      dummyWorkspace.visibility === "private"
                        ? "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                        : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    )}
                  >
                    {dummyWorkspace.visibility === "private" ? (
                      <Lock className="h-3 w-3" />
                    ) : (
                      <Globe className="h-3 w-3" />
                    )}
                    {dummyWorkspace.visibility === "private"
                      ? "Private"
                      : "Public"}
                  </span>
                </div>
                <p className="text-muted-foreground max-w-2xl">
                  {dummyWorkspace.description}
                </p>
                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    Created by {dummyWorkspace.owner.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(dummyWorkspace.createdAt)}
                  </span>
                </div>
              </div>
            </div>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-background/50 rounded-lg border">
                <p className="text-2xl font-bold text-primary">
                  {dummyStats.papers}
                </p>
                <p className="text-xs text-muted-foreground">Papers</p>
              </div>
              <div className="text-center p-3 bg-background/50 rounded-lg border">
                <p className="text-2xl font-bold text-primary">
                  {dummyStats.collections}
                </p>
                <p className="text-xs text-muted-foreground">Collections</p>
              </div>
              <div className="text-center p-3 bg-background/50 rounded-lg border">
                <p className="text-2xl font-bold text-primary">
                  {dummyStats.members}
                </p>
                <p className="text-xs text-muted-foreground">Members</p>
              </div>
              <div className="text-center p-3 bg-background/50 rounded-lg border">
                <p className="text-2xl font-bold text-primary">
                  {dummyStats.storage}
                </p>
                <p className="text-xs text-muted-foreground">Storage</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 py-3 px-4 border-b-2 font-medium text-sm transition-colors whitespace-nowrap",
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Papers */}
              <div className="lg:col-span-2 rounded-xl border bg-card">
                <div className="p-4 border-b flex items-center justify-between">
                  <h3 className="font-semibold flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Recent Papers
                  </h3>
                  <button
                    onClick={() => setActiveTab("papers")}
                    className="text-sm text-primary hover:underline"
                  >
                    View all →
                  </button>
                </div>
                <div className="p-4 space-y-3">
                  {dummyRecentPapers.map((paper) => (
                    <motion.div
                      key={paper.id}
                      whileHover={{ scale: 1.01 }}
                      className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => onNavigate?.(`/papers/${paper.id}`)}
                    >
                      <p className="font-medium text-sm line-clamp-1">
                        {paper.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {paper.authors.join(", ")} • Added {paper.addedAt}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-6">
                <div className="rounded-xl border bg-card p-4">
                  <h3 className="font-semibold mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onNavigate?.("/papers/upload")}
                      className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-lg text-sm inline-flex items-center justify-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Upload Paper
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowCreateCollectionDialog(true)}
                      className="w-full py-2 px-4 border rounded-lg text-sm hover:bg-muted transition-colors inline-flex items-center justify-center gap-2"
                    >
                      <Folder className="h-4 w-4" />
                      Create Collection
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowInviteDialog(true)}
                      className="w-full py-2 px-4 border rounded-lg text-sm hover:bg-muted transition-colors inline-flex items-center justify-center gap-2"
                    >
                      <UserPlus className="h-4 w-4" />
                      Invite Member
                    </motion.button>
                  </div>
                </div>

                {/* Collections Preview */}
                <div className="rounded-xl border bg-card">
                  <div className="p-4 border-b flex items-center justify-between">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Folder className="h-5 w-5" />
                      Collections
                    </h3>
                    <button
                      onClick={() => setActiveTab("collections")}
                      className="text-sm text-primary hover:underline"
                    >
                      View all →
                    </button>
                  </div>
                  <div className="p-4 space-y-2">
                    {dummyCollections.slice(0, 3).map((col) => (
                      <div
                        key={col.id}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-muted cursor-pointer"
                        onClick={() => onNavigate?.(`/collections/${col.id}`)}
                      >
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">
                            {col.name}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {col.paperCount} papers
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Collections Tab */}
          {activeTab === "collections" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">All Collections</h2>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCreateCollectionDialog(true)}
                  className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Collection
                </motion.button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dummyCollections.map((col) => (
                  <motion.div
                    key={col.id}
                    whileHover={{ scale: 1.02 }}
                    className="rounded-xl border bg-card p-4 hover:shadow-md cursor-pointer transition-shadow"
                    onClick={() => onNavigate?.(`/collections/${col.id}`)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium",
                          col.visibility === "private"
                            ? "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                            : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        )}
                      >
                        {col.visibility === "private" ? (
                          <Lock className="h-3 w-3" />
                        ) : (
                          <Globe className="h-3 w-3" />
                        )}
                        {col.visibility}
                      </span>
                    </div>
                    <h3 className="font-semibold mb-1">{col.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {col.paperCount} papers
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Papers Tab */}
          {activeTab === "papers" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">All Papers</h2>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate?.("/papers/upload")}
                  className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Upload Paper
                </motion.button>
              </div>
              <div className="space-y-3">
                {dummyRecentPapers.map((paper) => (
                  <motion.div
                    key={paper.id}
                    whileHover={{ scale: 1.01 }}
                    className="rounded-xl border bg-card p-4 hover:shadow-md cursor-pointer transition-shadow"
                    onClick={() => onNavigate?.(`/papers/${paper.id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{paper.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {paper.authors.join(", ")}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {paper.addedAt}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Members Tab */}
          {activeTab === "members" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  Team Members ({dummyMembers.length})
                </h2>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowInviteDialog(true)}
                  className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Invite Member
                </motion.button>
              </div>
              <div className="rounded-xl border bg-card divide-y">
                {dummyMembers.map((member) => {
                  const roleBadge = getRoleBadge(member.role);
                  const RoleIcon = roleBadge.icon;
                  return (
                    <div
                      key={member.id}
                      className="p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {member.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium",
                            roleBadge.color
                          )}
                        >
                          <RoleIcon className="h-3 w-3" />
                          {roleBadge.label}
                        </span>
                        {member.role !== "OWNER" && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 hover:bg-destructive/10 text-destructive rounded-lg"
                          >
                            <Trash2 className="h-4 w-4" />
                          </motion.button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="max-w-2xl space-y-6">
              <div className="rounded-xl border bg-card p-6">
                <h3 className="font-semibold mb-4">Workspace Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">
                      Workspace Name
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="mt-1.5 w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      rows={3}
                      className="mt-1.5 w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
                  >
                    Save Changes
                  </motion.button>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="rounded-xl border border-destructive/50 bg-destructive/5 p-6">
                <h3 className="font-semibold text-destructive mb-2">
                  Danger Zone
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Once you delete a workspace, there is no going back. Please be
                  certain.
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowDeleteDialog(true)}
                  className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Workspace
                </motion.button>
              </div>
            </div>
          )}
        </div>

        {/* Invite Dialog */}
        <AnimatePresence>
          {showInviteDialog && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
              onClick={() => setShowInviteDialog(false)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-background border rounded-xl p-6 w-full max-w-md"
              >
                <h3 className="text-lg font-semibold mb-4">
                  Invite Team Member
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Email Address</label>
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="colleague@university.edu"
                      className="mt-1.5 w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Role</label>
                    <select
                      value={inviteRole}
                      onChange={(e) =>
                        setInviteRole(e.target.value as "MEMBER" | "ADMIN")
                      }
                      className="mt-1.5 w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="MEMBER">Member - Can view and edit</option>
                      <option value="ADMIN">Admin - Full access</option>
                    </select>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">
                      Or share invite link:
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={`https://scholarflow.com/workspaces/${dummyWorkspace.id}/join`}
                        className="flex-1 px-3 py-2 border rounded-lg bg-background text-xs"
                      />
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={copyInviteLink}
                        className="px-3 py-2 bg-secondary text-secondary-foreground rounded-lg"
                      >
                        <Copy className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 justify-end mt-6">
                  <button
                    onClick={() => setShowInviteDialog(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowInviteDialog(false);
                      setInviteEmail("");
                    }}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
                  >
                    Send Invite
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Dialog */}
        <AnimatePresence>
          {showEditDialog && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
              onClick={() => setShowEditDialog(false)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-background border rounded-xl p-6 w-full max-w-md"
              >
                <h3 className="text-lg font-semibold mb-4">Edit Workspace</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="mt-1.5 w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      rows={3}
                      className="mt-1.5 w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  </div>
                </div>
                <div className="flex gap-2 justify-end mt-6">
                  <button
                    onClick={() => setShowEditDialog(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setShowEditDialog(false)}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
                  >
                    Save Changes
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Create Collection Dialog */}
        <AnimatePresence>
          {showCreateCollectionDialog && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
              onClick={() => setShowCreateCollectionDialog(false)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-background border rounded-xl p-6 w-full max-w-md"
              >
                <h3 className="text-lg font-semibold mb-4">
                  Create Collection
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <input
                      type="text"
                      value={newCollectionName}
                      onChange={(e) => setNewCollectionName(e.target.value)}
                      placeholder="Collection name"
                      className="mt-1.5 w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      Description (optional)
                    </label>
                    <textarea
                      value={newCollectionDescription}
                      onChange={(e) =>
                        setNewCollectionDescription(e.target.value)
                      }
                      rows={2}
                      placeholder="Describe this collection..."
                      className="mt-1.5 w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  </div>
                </div>
                <div className="flex gap-2 justify-end mt-6">
                  <button
                    onClick={() => setShowCreateCollectionDialog(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowCreateCollectionDialog(false);
                      setNewCollectionName("");
                      setNewCollectionDescription("");
                    }}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
                  >
                    Create
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Dialog */}
        <AnimatePresence>
          {showDeleteDialog && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
              onClick={() => setShowDeleteDialog(false)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-background border rounded-xl p-6 w-full max-w-md"
              >
                <h3 className="text-lg font-semibold text-destructive mb-2">
                  Delete Workspace
                </h3>
                <p className="text-muted-foreground mb-4">
                  This will permanently delete{" "}
                  <strong>{dummyWorkspace.name}</strong> and all its contents.
                  This action cannot be undone.
                </p>
                <div className="mb-4">
                  <label className="text-sm font-medium">
                    Type <strong>{dummyWorkspace.name}</strong> to confirm:
                  </label>
                  <input
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    className="mt-1.5 w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-destructive"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setShowDeleteDialog(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteDialog(false);
                      onNavigate?.("/workspaces");
                    }}
                    disabled={deleteConfirmText !== dummyWorkspace.name}
                    className={cn(
                      "px-4 py-2 rounded-lg",
                      deleteConfirmText === dummyWorkspace.name
                        ? "bg-destructive text-white"
                        : "bg-muted text-muted-foreground cursor-not-allowed"
                    )}
                  >
                    Delete Workspace
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}

export default WorkspaceDetailsPage;
