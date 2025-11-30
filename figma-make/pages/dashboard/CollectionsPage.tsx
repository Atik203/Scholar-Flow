"use client";

import {
  BookOpen,
  Brain,
  Building2,
  Calendar,
  Check,
  ChevronDown,
  Edit,
  Eye,
  FileText,
  FolderOpen,
  Globe,
  GripVertical,
  Loader2,
  Lock,
  Plus,
  Search,
  Sparkles,
  Users,
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

interface CollectionsPageProps {
  onNavigate?: (path: string) => void;
  role?: UserRole;
}

// ============================================================================
// Dummy Data
// ============================================================================
const dummyWorkspaces = [
  { id: "ws-1", name: "Machine Learning Research" },
  { id: "ws-2", name: "NLP Papers" },
  { id: "ws-3", name: "Computer Vision Lab" },
];

const dummyCollections = [
  {
    id: "col-1",
    name: "Deep Learning Fundamentals",
    description:
      "Core papers on neural networks and deep learning architectures",
    isPublic: true,
    _count: { papers: 12 },
    createdAt: "2024-01-10T10:00:00Z",
    workspaceId: "ws-1",
    color: "blue",
    paperThumbnails: ["📄", "📑", "📃", "📋"],
    aiSuggested: false,
    lastUpdated: "2 hours ago",
  },
  {
    id: "col-2",
    name: "Transformer Papers",
    description: "Collection of influential transformer architecture papers",
    isPublic: true,
    _count: { papers: 8 },
    createdAt: "2024-01-08T14:30:00Z",
    workspaceId: "ws-1",
    color: "purple",
    paperThumbnails: ["📄", "📑", "📃"],
    aiSuggested: true,
    lastUpdated: "1 day ago",
  },
  {
    id: "col-3",
    name: "Private Research Notes",
    description: "Personal collection of research papers and notes",
    isPublic: false,
    _count: { papers: 5 },
    createdAt: "2024-01-05T09:15:00Z",
    workspaceId: "ws-2",
    color: "green",
    paperThumbnails: ["📄", "📑"],
    aiSuggested: false,
    lastUpdated: "3 days ago",
  },
  {
    id: "col-4",
    name: "Computer Vision Classics",
    description: "Essential papers in computer vision and image processing",
    isPublic: true,
    _count: { papers: 15 },
    createdAt: "2024-01-03T11:20:00Z",
    workspaceId: "ws-3",
    color: "orange",
    paperThumbnails: ["📄", "📑", "📃", "📋", "📝"],
    aiSuggested: true,
    lastUpdated: "5 hours ago",
  },
  {
    id: "col-5",
    name: "NLP Reading List",
    description: null,
    isPublic: false,
    _count: { papers: 3 },
    createdAt: "2024-01-01T16:45:00Z",
    workspaceId: "ws-2",
    color: "pink",
    paperThumbnails: ["📄"],
    aiSuggested: false,
    lastUpdated: "1 week ago",
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
// Stat Card Component
// ============================================================================
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBg: string;
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  iconBg,
  loading,
}) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-card border rounded-xl p-4"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold">
          {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : value}
        </p>
      </div>
      <div className={cn("rounded-full p-2", iconBg)}>{icon}</div>
    </div>
  </motion.div>
);

// ============================================================================
// Workspace Select Component
// ============================================================================
interface WorkspaceSelectProps {
  value: string;
  onChange: (value: string) => void;
  workspaces: typeof dummyWorkspaces;
}

const WorkspaceSelect: React.FC<WorkspaceSelectProps> = ({
  value,
  onChange,
  workspaces,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selected = workspaces.find((w) => w.id === value);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full sm:w-64 h-10 px-3 flex items-center justify-between",
          "bg-background border rounded-lg text-sm",
          "hover:border-primary/50 transition-colors",
          isOpen && "ring-2 ring-ring ring-offset-2"
        )}
      >
        <span
          className={selected ? "text-foreground" : "text-muted-foreground"}
        >
          {value === "all"
            ? "All workspaces"
            : selected?.name || "Select workspace"}
        </span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-1 bg-popover border rounded-lg shadow-lg overflow-hidden"
          >
            <button
              onClick={() => {
                onChange("all");
                setIsOpen(false);
              }}
              className={cn(
                "w-full px-3 py-2 text-left text-sm flex items-center gap-2",
                "hover:bg-accent transition-colors",
                value === "all" && "bg-accent"
              )}
            >
              <span className="flex-1">All workspaces</span>
              {value === "all" && <Check className="h-4 w-4 text-primary" />}
            </button>
            {workspaces.map((workspace) => (
              <button
                key={workspace.id}
                onClick={() => {
                  onChange(workspace.id);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full px-3 py-2 text-left text-sm flex items-center gap-2",
                  "hover:bg-accent transition-colors",
                  value === workspace.id && "bg-accent"
                )}
              >
                <span className="flex-1">{workspace.name}</span>
                {value === workspace.id && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================================================
// Color Classes
// ============================================================================
const getColorClasses = (color: string) => {
  const colors: Record<string, { bg: string; border: string; text: string }> = {
    blue: {
      bg: "bg-blue-500",
      border: "border-blue-200 dark:border-blue-800",
      text: "text-blue-600 dark:text-blue-400",
    },
    purple: {
      bg: "bg-purple-500",
      border: "border-purple-200 dark:border-purple-800",
      text: "text-purple-600 dark:text-purple-400",
    },
    green: {
      bg: "bg-green-500",
      border: "border-green-200 dark:border-green-800",
      text: "text-green-600 dark:text-green-400",
    },
    orange: {
      bg: "bg-orange-500",
      border: "border-orange-200 dark:border-orange-800",
      text: "text-orange-600 dark:text-orange-400",
    },
    pink: {
      bg: "bg-pink-500",
      border: "border-pink-200 dark:border-pink-800",
      text: "text-pink-600 dark:text-pink-400",
    },
  };
  return colors[color] || colors.blue;
};

// ============================================================================
// Collection Card Component (Enhanced)
// ============================================================================
interface CollectionCardProps {
  collection: (typeof dummyCollections)[0];
  onView: () => void;
  onEdit: () => void;
  isDragging?: boolean;
}

const CollectionCard: React.FC<CollectionCardProps> = ({
  collection,
  onView,
  onEdit,
  isDragging = false,
}) => {
  const colorClasses = getColorClasses(collection.color || "blue");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className={cn(
        "border rounded-2xl overflow-hidden hover:shadow-xl transition-all bg-card group cursor-pointer",
        isDragging && "shadow-2xl ring-2 ring-primary"
      )}
    >
      {/* Visual Header with Paper Stack */}
      <div
        className={cn(
          "h-24 relative overflow-hidden",
          "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900"
        )}
      >
        {/* Color Strip */}
        <div
          className={cn("absolute top-0 left-0 right-0 h-1", colorClasses.bg)}
        />

        {/* Paper Stack Visual */}
        <div className="absolute inset-0 flex items-center justify-center gap-2">
          {collection.paperThumbnails?.slice(0, 4).map((thumb, i) => (
            <motion.div
              key={i}
              initial={{ rotate: 0 }}
              whileHover={{ rotate: [-5, 5, 0], y: -4 }}
              className="w-12 h-16 bg-white dark:bg-gray-700 rounded-lg shadow-md flex items-center justify-center text-2xl border border-gray-200 dark:border-gray-600"
              style={{
                transform: `rotate(${(i - 1.5) * 5}deg)`,
                zIndex: 4 - i,
              }}
            >
              {i < 3 ? (
                <FileText className="h-6 w-6 text-gray-400" />
              ) : (
                <span className="text-xs text-gray-500">
                  +{collection._count.papers - 3}
                </span>
              )}
            </motion.div>
          ))}
        </div>

        {/* AI Suggested Badge */}
        {collection.aiSuggested && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full font-medium">
            <Sparkles className="h-3 w-3" />
            AI Suggested
          </div>
        )}

        {/* Drag Handle */}
        <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
          <GripVertical className="h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span
            className={cn(
              "px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1",
              collection.isPublic
                ? "bg-primary/10 text-primary"
                : "bg-secondary text-secondary-foreground"
            )}
          >
            {collection.isPublic ? (
              <>
                <Globe className="h-3 w-3" /> Public
              </>
            ) : (
              <>
                <Lock className="h-3 w-3" /> Private
              </>
            )}
          </span>
          <span className="text-xs text-muted-foreground">
            {collection.lastUpdated}
          </span>
        </div>

        <h3 className="font-semibold text-base mb-1 group-hover:text-primary transition-colors line-clamp-1">
          {collection.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {collection.description || "No description provided"}
        </p>

        {/* Stats Row */}
        <div className="flex items-center justify-between border-t pt-3">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <FileText className="h-3.5 w-3.5" />
              <span className="font-semibold text-foreground">
                {collection._count.papers}
              </span>{" "}
              papers
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(collection.createdAt)}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onView}
            className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium flex items-center justify-center gap-1"
          >
            <Eye className="h-3.5 w-3.5" />
            View
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onEdit}
            className="px-3 py-2 border rounded-lg text-sm flex items-center gap-1 hover:bg-accent transition-colors"
          >
            <Edit className="h-3.5 w-3.5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// ============================================================================
// Collections Page Component
// ============================================================================
export function CollectionsPage({
  onNavigate,
  role: propRole,
}: CollectionsPageProps) {
  const { role: contextRole } = useRole();
  const effectiveRole = propRole ?? contextRole;
  const user = { ...defaultUser, role: effectiveRole };

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState("all");
  const [activeTab, setActiveTab] = useState<
    "my-collections" | "shared-collections"
  >("my-collections");

  // Filter collections based on workspace and search
  const filteredCollections = dummyCollections.filter((collection) => {
    const matchesWorkspace =
      selectedWorkspaceId === "all" ||
      collection.workspaceId === selectedWorkspaceId;
    const matchesSearch =
      collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (collection.description || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    return matchesWorkspace && matchesSearch;
  });

  // Calculate stats
  const totalCollections = filteredCollections.length;
  const publicCollections = filteredCollections.filter(
    (c) => c.isPublic
  ).length;
  const privateCollections = filteredCollections.filter(
    (c) => !c.isPublic
  ).length;
  const totalPapers = filteredCollections.reduce(
    (sum, c) => sum + c._count.papers,
    0
  );

  return (
    <DashboardLayout
      user={user}
      onNavigate={onNavigate}
      currentPath="/collections"
    >
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Collections</h1>
            <p className="text-muted-foreground">
              Organize and share your research papers
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Collection
          </motion.button>
        </div>

        {/* Workspace Selection */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            <label className="text-sm font-medium">Workspace:</label>
          </div>
          <WorkspaceSelect
            value={selectedWorkspaceId}
            onChange={setSelectedWorkspaceId}
            workspaces={dummyWorkspaces}
          />
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="My Collections"
            value={totalCollections}
            icon={
              <BookOpen className="h-4 w-4 text-blue-600 dark:text-white" />
            }
            iconBg="bg-blue-50 dark:bg-blue-950/20"
          />
          <StatCard
            title="Public Collections"
            value={publicCollections}
            icon={
              <Globe className="h-4 w-4 text-green-600 dark:text-green-400" />
            }
            iconBg="bg-green-50 dark:bg-green-950/20"
          />
          <StatCard
            title="Total Papers"
            value={totalPapers}
            icon={
              <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            }
            iconBg="bg-purple-50 dark:bg-purple-950/20"
          />
          <StatCard
            title="Private Collections"
            value={privateCollections}
            icon={
              <Lock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            }
            iconBg="bg-orange-50 dark:bg-orange-950/20"
          />
        </div>

        {/* AI Organization Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 border border-purple-200 dark:border-purple-800/50 rounded-2xl p-4"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-sm">
                  AI Collection Organizer
                </h3>
                <span className="px-2 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full font-medium">
                  PRO
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                We found{" "}
                <span className="font-medium text-primary">4 papers</span> that
                could be organized into a new collection:
                <span className="font-medium text-primary">
                  "Vision-Language Models"
                </span>
                . Also,{" "}
                <span className="font-medium text-primary">2 papers</span>
                in your library match the "Transformers" collection.
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-accent transition-colors"
              >
                Dismiss
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm font-medium flex items-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                Organize Now
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Tabs and Search */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex bg-muted rounded-lg p-1">
            <button
              onClick={() => setActiveTab("my-collections")}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2",
                activeTab === "my-collections"
                  ? "bg-background shadow-sm"
                  : "hover:bg-background/50"
              )}
            >
              <BookOpen className="h-4 w-4" />
              My Collections
            </button>
            <button
              onClick={() => setActiveTab("shared-collections")}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2",
                activeTab === "shared-collections"
                  ? "bg-background shadow-sm"
                  : "hover:bg-background/50"
              )}
            >
              <Users className="h-4 w-4" />
              Shared Collections
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search collections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.div
            whileHover={{ y: -2, scale: 1.01 }}
            className="bg-card border rounded-xl p-4 cursor-pointer hover:shadow-lg transition-all group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Plus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
                  Create Collection
                </h4>
                <p className="text-xs text-muted-foreground">
                  Start organizing papers
                </p>
              </div>
            </div>
          </motion.div>
          <motion.div
            whileHover={{ y: -2, scale: 1.01 }}
            className="bg-card border rounded-xl p-4 cursor-pointer hover:shadow-lg transition-all group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
                  AI Auto-Organize
                </h4>
                <p className="text-xs text-muted-foreground">
                  Let AI sort your papers
                </p>
              </div>
            </div>
          </motion.div>
          <motion.div
            whileHover={{ y: -2, scale: 1.01 }}
            className="bg-card border rounded-xl p-4 cursor-pointer hover:shadow-lg transition-all group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
                  Share Collection
                </h4>
                <p className="text-xs text-muted-foreground">
                  Collaborate with team
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Collections Content */}
        <AnimatePresence mode="wait">
          {activeTab === "my-collections" ? (
            <motion.div
              key="my-collections"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">My Collections</h2>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <GripVertical className="h-4 w-4" />
                  Drag to reorder
                </span>
              </div>

              {filteredCollections.length === 0 ? (
                <div className="bg-card border rounded-xl text-center py-12">
                  <FolderOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    {searchTerm ? "No collections found" : "No collections yet"}
                  </h3>
                  <p className="text-muted-foreground mb-4 max-w-sm mx-auto">
                    {searchTerm
                      ? "Try adjusting your search terms"
                      : "Create your first collection to organize your research papers"}
                  </p>
                  {!searchTerm && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg flex items-center gap-2 mx-auto"
                    >
                      <Plus className="h-4 w-4" />
                      Create Collection
                    </motion.button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCollections.map((collection) => (
                    <CollectionCard
                      key={collection.id}
                      collection={collection}
                      onView={() =>
                        onNavigate?.(`/collections/${collection.id}`)
                      }
                      onEdit={() => console.log("Edit", collection.id)}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="shared-collections"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-card border rounded-xl"
            >
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">Shared Collections</h2>
              </div>
              <div className="p-4">
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    Shared Collections
                  </h3>
                  <p className="text-muted-foreground mb-4 max-w-sm mx-auto">
                    View collections shared with you by other researchers
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg flex items-center gap-2 mx-auto"
                  >
                    <Users className="h-4 w-4" />
                    Browse Shared
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}

export default CollectionsPage;
