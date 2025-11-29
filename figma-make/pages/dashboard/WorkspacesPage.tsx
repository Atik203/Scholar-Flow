"use client";

import {
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
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
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
// Workspace Card Component
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
    whileHover={{ y: -2, borderColor: "var(--primary)" }}
    className="bg-card border rounded-xl p-4 hover:shadow-md transition-all"
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="font-medium text-sm truncate">{workspace.name}</h3>
            {workspace.isOwner && (
              <span className="px-1.5 py-0.5 text-xs rounded bg-secondary flex items-center gap-1">
                <Crown className="h-3 w-3" />
                Owner
              </span>
            )}
            <span
              className={cn(
                "px-1.5 py-0.5 text-xs rounded flex items-center gap-1",
                workspace.isPublic ? "bg-primary/10 text-primary" : "border"
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

          <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{workspace.memberCount} members</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              <span>{workspace.collectionCount} collections</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              <span>{workspace.paperCount} papers</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Created {formatDate(workspace.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 flex-shrink-0">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onView}
          className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm flex items-center gap-1"
        >
          <Eye className="h-4 w-4" />
          View
        </motion.button>
        {workspace.isOwner && (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onEdit}
              className="px-3 py-1.5 border rounded-lg text-sm flex items-center gap-1 hover:bg-accent transition-colors"
            >
              <Edit className="h-4 w-4" />
              Edit
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onDelete}
              className="px-3 py-1.5 bg-destructive text-white rounded-lg text-sm flex items-center gap-1"
            >
              <Trash2 className="h-4 w-4" />
              Delete
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCreate(name.trim());
      setName("");
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
              className="px-4 py-2 border rounded-lg flex items-center gap-2 hover:bg-accent transition-colors"
            >
              <Users className="h-4 w-4" />
              Browse Shared
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New Workspace
            </motion.button>
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
                  ? "All Workspaces"
                  : tab === "owned"
                    ? "Owned by Me"
                    : "Shared with Me"}
              </button>
            ))}
          </div>
        </div>

        {/* Workspaces List */}
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
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg flex items-center gap-2 mx-auto"
                  >
                    <Plus className="h-4 w-4" />
                    Create Workspace
                  </motion.button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
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
      </div>
    </DashboardLayout>
  );
}

export default WorkspacesPage;
