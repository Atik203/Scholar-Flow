"use client";

import {
  BookOpen,
  Building2,
  Calendar,
  Check,
  ChevronDown,
  Edit,
  Eye,
  FileText,
  Globe,
  Loader2,
  Lock,
  Plus,
  Search,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useState } from "react";
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
  },
  {
    id: "col-2",
    name: "Transformer Papers",
    description: "Collection of influential transformer architecture papers",
    isPublic: true,
    _count: { papers: 8 },
    createdAt: "2024-01-08T14:30:00Z",
    workspaceId: "ws-1",
  },
  {
    id: "col-3",
    name: "Private Research Notes",
    description: "Personal collection of research papers and notes",
    isPublic: false,
    _count: { papers: 5 },
    createdAt: "2024-01-05T09:15:00Z",
    workspaceId: "ws-2",
  },
  {
    id: "col-4",
    name: "Computer Vision Classics",
    description: "Essential papers in computer vision and image processing",
    isPublic: true,
    _count: { papers: 15 },
    createdAt: "2024-01-03T11:20:00Z",
    workspaceId: "ws-3",
  },
  {
    id: "col-5",
    name: "NLP Reading List",
    description: null,
    isPublic: false,
    _count: { papers: 3 },
    createdAt: "2024-01-01T16:45:00Z",
    workspaceId: "ws-2",
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
// Collection Card Component
// ============================================================================
interface CollectionCardProps {
  collection: (typeof dummyCollections)[0];
  onView: () => void;
  onEdit: () => void;
}

const CollectionCard: React.FC<CollectionCardProps> = ({
  collection,
  onView,
  onEdit,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -2 }}
    className="border rounded-xl p-4 hover:shadow-md transition-all bg-card"
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <BookOpen className="h-5 w-5 text-muted-foreground flex-shrink-0" />
        <div className="min-w-0">
          <h3 className="font-medium text-lg truncate">{collection.name}</h3>
          <p className="text-sm text-muted-foreground truncate">
            {collection.description || "No description provided"}
          </p>
          <div className="flex items-center gap-6 mt-2 text-xs text-muted-foreground flex-wrap">
            <div className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              {collection._count.papers} papers
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Created {formatDate(collection.createdAt)}
            </div>
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
          </div>
        </div>
      </div>
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
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onEdit}
          className="px-3 py-1.5 border rounded-lg text-sm flex items-center gap-1 hover:bg-accent transition-colors"
        >
          <Edit className="h-4 w-4" />
          Edit
        </motion.button>
      </div>
    </div>
  </motion.div>
);

// ============================================================================
// Collections Page Component
// ============================================================================
export function CollectionsPage({ onNavigate }: CollectionsPageProps) {
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
      user={defaultUser}
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

        {/* Collections Content */}
        <AnimatePresence mode="wait">
          {activeTab === "my-collections" ? (
            <motion.div
              key="my-collections"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-card border rounded-xl"
            >
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">My Collections</h2>
              </div>
              <div className="p-4">
                {filteredCollections.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      {searchTerm
                        ? "No collections found"
                        : "No collections yet"}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {searchTerm
                        ? "Try adjusting your search terms"
                        : "Create your first collection to get started"}
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
                  <div className="space-y-3">
                    {filteredCollections.map((collection) => (
                      <CollectionCard
                        key={collection.id}
                        collection={collection}
                        onView={() => console.log("View", collection.id)}
                        onEdit={() => console.log("Edit", collection.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
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
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    Shared Collections
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    View collections shared with you by other users
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg flex items-center gap-2 mx-auto"
                  >
                    <Users className="h-4 w-4" />
                    View Shared Collections
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
