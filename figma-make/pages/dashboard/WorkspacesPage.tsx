"use client";

import {
  Activity,
  BookOpen,
  Building2,
  Calendar,
  Crown,
  Edit,
  Eye,
  FileText,
  Globe,
  Lock,
  Plus,
  Search,
  Trash2,
  TrendingUp,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { useRole, type UserRole } from "../../components/context";
import { DashboardLayout } from "../../components/layout/DashboardLayout";

// ============================================================================
// Default User for Demo
// ============================================================================
const defaultUser = {
  name: "Demo Researcher",
  email: "demo@scholarflow.com",
  image: undefined,
  role: "researcher" as const,
};

interface WorkspacesPageProps {
  onNavigate?: (path: string) => void;
  role?: UserRole;
}

// ============================================================================
// Dummy Data
// ============================================================================
const dummyWorkspaces = [
  {
    id: "ws-1",
    name: "Machine Learning Research",
    isOwner: true,
    isPublic: false,
    memberCount: 5,
    collectionCount: 3,
    paperCount: 24,
    createdAt: "2024-01-01T10:00:00Z",
    activityThisWeek: 42,
    trendingUp: true,
    topContributors: ["Dr. Sarah Chen", "James Wilson", "Emily Zhang"],
    recentActivity: [3, 5, 8, 4, 12, 7, 3], // Last 7 days
    color: "blue",
  },
  {
    id: "ws-2",
    name: "NLP Papers",
    isOwner: true,
    isPublic: true,
    memberCount: 12,
    collectionCount: 5,
    paperCount: 48,
    createdAt: "2023-12-15T14:30:00Z",
    activityThisWeek: 78,
    trendingUp: true,
    topContributors: ["Prof. Lee", "Dr. Kumar", "Alex M."],
    recentActivity: [8, 12, 6, 15, 9, 11, 17], // Last 7 days
    color: "purple",
  },
  {
    id: "ws-3",
    name: "Computer Vision Lab",
    isOwner: false,
    isPublic: true,
    memberCount: 8,
    collectionCount: 4,
    paperCount: 32,
    createdAt: "2023-11-20T09:15:00Z",
    activityThisWeek: 23,
    trendingUp: false,
    topContributors: ["Dr. Wang", "Maria S."],
    recentActivity: [4, 3, 5, 2, 6, 4, 1], // Last 7 days
    color: "green",
  },
  {
    id: "ws-4",
    name: "Deep Learning Study Group",
    isOwner: false,
    isPublic: false,
    memberCount: 3,
    collectionCount: 2,
    paperCount: 15,
    createdAt: "2024-01-10T16:45:00Z",
    activityThisWeek: 8,
    trendingUp: true,
    topContributors: ["You"],
    recentActivity: [1, 2, 0, 1, 2, 1, 1], // Last 7 days
    color: "orange",
  },
];

// ============================================================================
// Utility Functions
// ============================================================================
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// ============================================================================
// Color Classes
// ============================================================================
const getWorkspaceColor = (color: string) => {
  const colors: Record<string, string> = {
    blue: "from-blue-500 to-indigo-600",
    purple: "from-purple-500 to-pink-600",
    green: "from-green-500 to-emerald-600",
    orange: "from-orange-500 to-red-600",
  };
  return colors[color] || colors.blue;
};

// ============================================================================
// Mini Activity Chart Component
// ============================================================================
const MiniActivityChart: React.FC<{ data: number[]; color: string }> = ({
  data,
  color,
}) => {
  const max = Math.max(...data, 1);
  const colorClass = getWorkspaceColor(color);

  return (
    <div className="flex items-end gap-0.5 h-8">
      {data.map((value, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={{ height: `${(value / max) * 100}%` }}
          transition={{ delay: i * 0.05, duration: 0.3 }}
          className={cn(
            "w-2 rounded-full bg-gradient-to-t min-h-[4px]",
            colorClass
          )}
          title={`${value} activities`}
        />
      ))}
    </div>
  );
};

// ============================================================================
// Workspace Card Component (Enhanced)
// ============================================================================
interface WorkspaceCardProps {
  workspace: (typeof dummyWorkspaces)[0];
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const WorkspaceCard: React.FC<WorkspaceCardProps> = ({
  workspace,
  onView,
  onEdit,
  onDelete,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -4, scale: 1.01 }}
    className="bg-card border rounded-2xl overflow-hidden hover:shadow-xl transition-all group"
  >
    {/* Color Header */}
    <div
      className={cn(
        "h-2 bg-gradient-to-r",
        getWorkspaceColor(workspace.color || "blue")
      )}
    />

    <div className="p-5">
      {/* Header Row */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg",
              getWorkspaceColor(workspace.color || "blue")
            )}
          >
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-base group-hover:text-primary transition-colors">
                {workspace.name}
              </h3>
              {workspace.isOwner && (
                <span className="px-1.5 py-0.5 text-xs rounded bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 flex items-center gap-1">
                  <Crown className="h-3 w-3" />
                  Owner
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "px-2 py-0.5 text-xs rounded-full flex items-center gap-1",
                  workspace.isPublic
                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                )}
              >
                {workspace.isPublic ? (
                  <>
                    <Globe className="h-3 w-3" /> Public
                  </>
                ) : (
                  <>
                    <Lock className="h-3 w-3" /> Private
                  </>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Activity Indicator */}
        <div className="text-right">
          <div
            className={cn(
              "flex items-center gap-1 text-xs font-medium",
              workspace.trendingUp
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            )}
          >
            {workspace.trendingUp ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <Activity className="h-3 w-3" />
            )}
            {workspace.activityThisWeek} this week
          </div>
        </div>
      </div>

      {/* Activity Chart */}
      <div className="mb-4 p-3 bg-muted/50 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">Weekly Activity</span>
          <span className="text-xs font-medium">
            {workspace.activityThisWeek} actions
          </span>
        </div>
        <MiniActivityChart
          data={workspace.recentActivity || []}
          color={workspace.color || "blue"}
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-2 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
            <Users className="h-3 w-3" />
          </div>
          <div className="text-lg font-bold">{workspace.memberCount}</div>
          <div className="text-xs text-muted-foreground">Members</div>
        </div>
        <div className="text-center p-2 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
            <BookOpen className="h-3 w-3" />
          </div>
          <div className="text-lg font-bold">{workspace.collectionCount}</div>
          <div className="text-xs text-muted-foreground">Collections</div>
        </div>
        <div className="text-center p-2 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
            <FileText className="h-3 w-3" />
          </div>
          <div className="text-lg font-bold">{workspace.paperCount}</div>
          <div className="text-xs text-muted-foreground">Papers</div>
        </div>
      </div>

      {/* Top Contributors */}
      {workspace.topContributors && workspace.topContributors.length > 0 && (
        <div className="mb-4">
          <div className="text-xs text-muted-foreground mb-2">
            Top Contributors
          </div>
          <div className="flex items-center gap-1">
            {workspace.topContributors.slice(0, 3).map((name, i) => (
              <div
                key={i}
                className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-xs font-medium border-2 border-background -ml-1 first:ml-0"
                title={name}
              >
                {name.charAt(0)}
              </div>
            ))}
            {workspace.topContributors.length > 3 && (
              <span className="text-xs text-muted-foreground ml-1">
                +{workspace.topContributors.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Footer with Date */}
      <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-3 mb-3">
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          Created {formatDate(workspace.createdAt)}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onView}
          className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium flex items-center justify-center gap-1"
        >
          <Eye className="h-4 w-4" />
          View
        </motion.button>
        {workspace.isOwner && (
          <>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onEdit}
              className="px-3 py-2 border rounded-lg flex items-center gap-1 hover:bg-accent transition-colors"
            >
              <Edit className="h-4 w-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onDelete}
              className="px-3 py-2 bg-red-600 text-white rounded-lg flex items-center gap-1"
            >
              <Trash2 className="h-4 w-4" />
            </motion.button>
          </>
        )}
      </div>
    </div>
  </motion.div>
);

// ============================================================================
// Loading Skeleton
// ============================================================================
const WorkspaceSkeleton = () => (
  <div className="space-y-3">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="bg-card border rounded-xl p-4 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted rounded w-1/3" />
            <div className="h-3 bg-muted rounded w-2/3" />
          </div>
          <div className="flex gap-2">
            <div className="w-16 h-8 bg-muted rounded" />
            <div className="w-16 h-8 bg-muted rounded" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

// ============================================================================
// Quick Invite Modal
// ============================================================================
interface QuickInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaces: typeof dummyWorkspaces;
}

const QuickInviteModal: React.FC<QuickInviteModalProps> = ({
  isOpen,
  onClose,
  workspaces,
}) => {
  const [email, setEmail] = useState("");
  const [selectedWorkspace, setSelectedWorkspace] = useState("");
  const [role, setRole] = useState<"viewer" | "editor" | "admin">("viewer");

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Invite:", { email, selectedWorkspace, role });
    setEmail("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div className="bg-background border rounded-xl shadow-lg">
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                    <UserPlus className="h-4 w-4 text-white" />
                  </div>
                  <h2 className="text-lg font-semibold">Quick Invite</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleInvite} className="p-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="colleague@university.edu"
                    required
                    className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Workspace</label>
                  <select
                    value={selectedWorkspace}
                    onChange={(e) => setSelectedWorkspace(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select workspace...</option>
                    {workspaces
                      .filter((w) => w.isOwner)
                      .map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Role</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["viewer", "editor", "admin"] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className={cn(
                          "py-2 px-3 rounded-lg text-sm font-medium transition-colors border",
                          role === r
                            ? "bg-primary text-primary-foreground border-primary"
                            : "hover:bg-accent"
                        )}
                      >
                        {r.charAt(0).toUpperCase() + r.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={!email.trim() || !selectedWorkspace}
                  className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium disabled:opacity-50"
                >
                  Send Invitation
                </motion.button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ============================================================================
// Create Workspace Modal
// ============================================================================
interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}

const CreateWorkspaceModal: React.FC<CreateModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedColor, setSelectedColor] = useState("blue");

  const colors = ["blue", "purple", "green", "orange", "pink"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCreate(name.trim());
      setName("");
      setDescription("");
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div className="bg-background border rounded-xl shadow-lg">
              <div className="p-4 border-b flex items-center justify-between">
                <h2 className="text-lg font-semibold">Create New Workspace</h2>
                <button
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Workspace Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter workspace name"
                    required
                    className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What's this workspace about?"
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Color Theme</label>
                  <div className="flex gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={cn(
                          "w-8 h-8 rounded-full transition-transform",
                          color === "blue" && "bg-blue-500",
                          color === "purple" && "bg-purple-500",
                          color === "green" && "bg-green-500",
                          color === "orange" && "bg-orange-500",
                          color === "pink" && "bg-pink-500",
                          selectedColor === color &&
                            "ring-2 ring-offset-2 ring-gray-400 scale-110"
                        )}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border rounded-lg hover:bg-accent transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={!name.trim()}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50"
                  >
                    Create Workspace
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ============================================================================
// Workspaces Page Component
// ============================================================================
export function WorkspacesPage({
  onNavigate,
  role: propRole,
}: WorkspacesPageProps) {
  const { role: contextRole } = useRole();
  const effectiveRole = propRole ?? contextRole;
  const user = { ...defaultUser, role: effectiveRole };

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "owned" | "shared">("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [isLoading] = useState(false);

  // Filter workspaces based on tab and search
  const filteredWorkspaces = dummyWorkspaces.filter((workspace) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "owned" && workspace.isOwner) ||
      (activeTab === "shared" && !workspace.isOwner);
    const matchesSearch = workspace.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Stats summary
  const stats = {
    total: dummyWorkspaces.length,
    owned: dummyWorkspaces.filter((w) => w.isOwner).length,
    shared: dummyWorkspaces.filter((w) => !w.isOwner).length,
    totalMembers: dummyWorkspaces.reduce((acc, w) => acc + w.memberCount, 0),
    totalPapers: dummyWorkspaces.reduce((acc, w) => acc + w.paperCount, 0),
  };

  return (
    <DashboardLayout
      user={user}
      onNavigate={onNavigate}
      currentPath="/workspaces"
    >
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Workspaces</h1>
            <p className="text-muted-foreground">
              Manage your research workspaces and collaborate with others
            </p>
          </div>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowInviteModal(true)}
              className="px-4 py-2 border rounded-lg flex items-center gap-2 hover:bg-accent transition-colors"
            >
              <UserPlus className="h-4 w-4" />
              Quick Invite
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New Workspace
            </motion.button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="bg-card border rounded-xl p-4 text-center">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-xs text-muted-foreground">
              Total Workspaces
            </div>
          </div>
          <div className="bg-card border rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-500">
              {stats.owned}
            </div>
            <div className="text-xs text-muted-foreground">Owned by You</div>
          </div>
          <div className="bg-card border rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-500">
              {stats.shared}
            </div>
            <div className="text-xs text-muted-foreground">Shared with You</div>
          </div>
          <div className="bg-card border rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-500">
              {stats.totalMembers}
            </div>
            <div className="text-xs text-muted-foreground">
              Total Collaborators
            </div>
          </div>
          <div className="bg-card border rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-orange-500">
              {stats.totalPapers}
            </div>
            <div className="text-xs text-muted-foreground">
              Papers Across All
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search workspaces..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="w-full">
          <div className="grid grid-cols-3 bg-muted rounded-lg p-1">
            {(["all", "owned", "shared"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "py-2 px-4 rounded-md text-sm font-medium transition-colors",
                  activeTab === tab
                    ? "bg-background shadow-sm"
                    : "hover:bg-background/50"
                )}
              >
                {tab === "all"
                  ? `All (${stats.total})`
                  : tab === "owned"
                    ? `Owned (${stats.owned})`
                    : `Shared (${stats.shared})`}
              </button>
            ))}
          </div>
        </div>

        {/* Workspaces Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2"
          >
            {isLoading ? (
              <WorkspaceSkeleton />
            ) : filteredWorkspaces.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  No workspaces found
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : "Create your first workspace to get started."}
                </p>
                {!searchTerm && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowCreateModal(true)}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg flex items-center gap-2 mx-auto"
                  >
                    <Plus className="h-4 w-4" />
                    Create Workspace
                  </motion.button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredWorkspaces.map((workspace) => (
                  <WorkspaceCard
                    key={workspace.id}
                    workspace={workspace}
                    onView={() => onNavigate?.(`/workspaces/${workspace.id}`)}
                    onEdit={() => console.log("Edit", workspace.id)}
                    onDelete={() => console.log("Delete", workspace.id)}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Create Modal */}
        <CreateWorkspaceModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreate={(name) => console.log("Create workspace:", name)}
        />

        {/* Quick Invite Modal */}
        <QuickInviteModal
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          workspaces={dummyWorkspaces}
        />
      </div>
    </DashboardLayout>
  );
}

export default WorkspacesPage;
