"use client";

/**
 * CollectionDetailsPage - Enhanced Collection Management
 *
 * Features:
 * - View toggles (Grid/List/Kanban)
 * - AI-powered paper suggestions
 * - Bulk operations with floating action bar
 * - Visual permission editor
 * - Drag-drop paper organization
 * - Inline paper preview
 * - Framer Motion animations
 */

import {
  ArrowLeft,
  CheckCircle,
  Copy,
  Download,
  Eye,
  FileText,
  Globe,
  Grid3X3,
  LayoutGrid,
  LayoutList,
  Lock,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Share2,
  Sparkles,
  Star,
  Trash2,
  TrendingUp,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useRole, type UserRole } from "../../../components/context";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";

// ============================================================================
// Types
// ============================================================================
interface CollectionDetailsPageProps {
  onNavigate?: (path: string) => void;
  collectionId?: string;
  role?: UserRole;
}

type ViewMode = "grid" | "list" | "kanban";
type PaperStatus = "to-read" | "reading" | "completed" | "archived";

interface Paper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  abstract: string;
  processingStatus: "PROCESSED" | "PROCESSING";
  addedAt: string;
  status: PaperStatus;
  isStarred: boolean;
  citationCount: number;
  tags: string[];
}

interface CollectionMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "OWNER" | "ADMIN" | "EDITOR" | "VIEWER";
  joinedAt: string;
}

interface AISuggestion {
  id: string;
  title: string;
  authors: string[];
  year: number;
  reason: string;
  similarity: number;
}

// ============================================================================
// Sample Data
// ============================================================================
const defaultUser = {
  name: "John Researcher",
  email: "john@example.com",
  image: undefined,
  role: "researcher" as const,
};

const dummyCollection = {
  id: "col-1",
  name: "Machine Learning Research",
  description:
    "A curated collection of foundational and cutting-edge machine learning papers covering deep learning, neural networks, and AI systems.",
  visibility: "private" as const,
  createdAt: "2024-01-10T10:00:00Z",
  updatedAt: "2024-01-25T15:30:00Z",
  owner: { id: "user-1", name: "John Researcher", email: "john@example.com" },
  paperCount: 12,
  memberCount: 3,
};

const dummyPapers: Paper[] = [
  {
    id: "paper-1",
    title: "Attention Is All You Need",
    authors: ["Ashish Vaswani", "Noam Shazeer", "Niki Parmar"],
    year: 2017,
    abstract:
      "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks...",
    processingStatus: "PROCESSED",
    addedAt: "2024-01-15T10:30:00Z",
    status: "completed",
    isStarred: true,
    citationCount: 89542,
    tags: ["transformers", "attention", "NLP"],
  },
  {
    id: "paper-2",
    title: "BERT: Pre-training of Deep Bidirectional Transformers",
    authors: ["Jacob Devlin", "Ming-Wei Chang", "Kenton Lee"],
    year: 2018,
    abstract: "We introduce a new language representation model called BERT...",
    processingStatus: "PROCESSED",
    addedAt: "2024-01-16T14:20:00Z",
    status: "reading",
    isStarred: false,
    citationCount: 67234,
    tags: ["BERT", "pre-training", "NLP"],
  },
  {
    id: "paper-3",
    title: "GPT-3: Language Models are Few-Shot Learners",
    authors: ["Tom B. Brown", "Benjamin Mann", "Nick Ryder"],
    year: 2020,
    abstract:
      "Recent work has demonstrated substantial gains on many NLP tasks...",
    processingStatus: "PROCESSED",
    addedAt: "2024-01-18T09:45:00Z",
    status: "to-read",
    isStarred: true,
    citationCount: 45123,
    tags: ["GPT", "few-shot", "LLM"],
  },
  {
    id: "paper-4",
    title: "Deep Residual Learning for Image Recognition",
    authors: ["Kaiming He", "Xiangyu Zhang", "Shaoqing Ren"],
    year: 2015,
    abstract: "Deeper neural networks are more difficult to train...",
    processingStatus: "PROCESSING",
    addedAt: "2024-01-20T11:00:00Z",
    status: "to-read",
    isStarred: false,
    citationCount: 123456,
    tags: ["ResNet", "computer-vision"],
  },
];

const dummyMembers: CollectionMember[] = [
  {
    id: "member-1",
    name: "John Researcher",
    email: "john@example.com",
    role: "OWNER",
    joinedAt: "2024-01-10T10:00:00Z",
  },
  {
    id: "member-2",
    name: "Dr. Sarah Chen",
    email: "sarah@university.edu",
    role: "EDITOR",
    joinedAt: "2024-01-12T14:30:00Z",
  },
  {
    id: "member-3",
    name: "Prof. Michael Lee",
    email: "michael@research.org",
    role: "VIEWER",
    joinedAt: "2024-01-15T09:00:00Z",
  },
];

const aiSuggestions: AISuggestion[] = [
  {
    id: "sug-1",
    title: "LoRA: Low-Rank Adaptation of Large Language Models",
    authors: ["Hu, E.", "Shen, Y."],
    year: 2021,
    reason: "Highly relevant to your transformer papers",
    similarity: 94,
  },
  {
    id: "sug-2",
    title: "Chain-of-Thought Prompting",
    authors: ["Wei, J.", "Wang, X."],
    year: 2022,
    reason: "Extends GPT-3 few-shot learning concepts",
    similarity: 89,
  },
  {
    id: "sug-3",
    title: "Vision Transformer (ViT)",
    authors: ["Dosovitskiy, A."],
    year: 2020,
    reason: "Applies transformers to computer vision",
    similarity: 85,
  },
];

// ============================================================================
// Utility Functions
// ============================================================================
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

// ============================================================================
// Components
// ============================================================================
const StatusBadge: React.FC<{ status: PaperStatus }> = ({ status }) => {
  const config = {
    "to-read": {
      label: "To Read",
      className:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    },
    reading: {
      label: "Reading",
      className:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    },
    completed: {
      label: "Completed",
      className:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    },
    archived: {
      label: "Archived",
      className:
        "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
    },
  };
  const statusConfig = config[status];
  return (
    <span
      className={cn(
        "px-2 py-0.5 rounded-full text-xs font-medium",
        statusConfig.className
      )}
    >
      {statusConfig.label}
    </span>
  );
};

const RoleBadge: React.FC<{ role: CollectionMember["role"] }> = ({ role }) => {
  const config = {
    OWNER: {
      label: "Owner",
      className:
        "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    },
    ADMIN: {
      label: "Admin",
      className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    },
    EDITOR: {
      label: "Editor",
      className:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    },
    VIEWER: {
      label: "Viewer",
      className:
        "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
    },
  };
  const roleConfig = config[role];
  return (
    <span
      className={cn(
        "px-2 py-0.5 rounded-full text-xs font-medium",
        roleConfig.className
      )}
    >
      {roleConfig.label}
    </span>
  );
};

// ============================================================================
// Collection Details Page Component
// ============================================================================
export function CollectionDetailsPage({
  onNavigate,
  role: propRole,
}: CollectionDetailsPageProps) {
  const { role: contextRole } = useRole();
  const effectiveRole = propRole ?? contextRole;
  const user = { ...defaultUser, role: effectiveRole };

  // State
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPapers, setSelectedPapers] = useState<string[]>([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAddPapersModal, setShowAddPapersModal] = useState(false);
  const [showAISuggestions, setShowAISuggestions] = useState(true);
  const [activeTab, setActiveTab] = useState<"papers" | "members" | "settings">(
    "papers"
  );
  const [previewPaper, setPreviewPaper] = useState<Paper | null>(null);
  const [statusFilter, setStatusFilter] = useState<PaperStatus | "all">("all");

  // Filter papers
  const filteredPapers = dummyPapers.filter((paper) => {
    if (statusFilter !== "all" && paper.status !== statusFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        paper.title.toLowerCase().includes(query) ||
        paper.authors.some((a) => a.toLowerCase().includes(query))
      );
    }
    return true;
  });

  const togglePaperSelection = (paperId: string) => {
    setSelectedPapers((prev) =>
      prev.includes(paperId)
        ? prev.filter((id) => id !== paperId)
        : [...prev, paperId]
    );
  };

  const selectAllPapers = () => {
    setSelectedPapers(filteredPapers.map((p) => p.id));
  };

  const clearSelection = () => {
    setSelectedPapers([]);
  };

  const isPremiumUser =
    effectiveRole === "pro_researcher" ||
    effectiveRole === "team_lead" ||
    effectiveRole === "admin";

  return (
    <DashboardLayout
      user={user}
      onNavigate={onNavigate}
      currentPath="/collections/details"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate?.("/collections")}
              className="inline-flex items-center px-3 py-2 text-sm border rounded-lg hover:bg-muted transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </motion.button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight">
                  {dummyCollection.name}
                </h1>
                {dummyCollection.visibility === "private" ? (
                  <Lock className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <Globe className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <p className="text-muted-foreground mt-1 line-clamp-1">
                {dummyCollection.description}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted"
            >
              <Share2 className="h-4 w-4" />
              Share
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAddPapersModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg"
            >
              <Plus className="h-4 w-4" />
              Add Papers
            </motion.button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Papers",
              value: dummyCollection.paperCount,
              icon: FileText,
              color: "text-blue-500",
            },
            {
              label: "Members",
              value: dummyCollection.memberCount,
              icon: Users,
              color: "text-green-500",
            },
            {
              label: "Completed",
              value: dummyPapers.filter((p) => p.status === "completed").length,
              icon: CheckCircle,
              color: "text-purple-500",
            },
            {
              label: "Citations",
              value: "325K",
              icon: TrendingUp,
              color: "text-orange-500",
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border rounded-xl p-4"
            >
              <div className="flex items-center gap-2">
                <stat.icon className={cn("h-5 w-5", stat.color)} />
                <span className="text-sm text-muted-foreground">
                  {stat.label}
                </span>
              </div>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="border-b">
          <div className="flex gap-1">
            {[
              { key: "papers", label: "Papers", icon: FileText },
              { key: "members", label: "Members", icon: Users },
              { key: "settings", label: "Settings", icon: Settings },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                  activeTab === tab.key
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Papers Tab */}
        {activeTab === "papers" && (
          <div className="grid gap-6 lg:grid-cols-4">
            <div className="lg:col-span-3 space-y-4">
              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search papers..."
                      className="pl-9 pr-4 py-2 w-64 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Status Filter */}
                  <select
                    value={statusFilter}
                    onChange={(e) =>
                      setStatusFilter(e.target.value as typeof statusFilter)
                    }
                    className="px-3 py-2 border rounded-lg bg-background text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="to-read">To Read</option>
                    <option value="reading">Reading</option>
                    <option value="completed">Completed</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                {/* View Toggle */}
                <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
                  {[
                    { key: "grid", icon: LayoutGrid },
                    { key: "list", icon: LayoutList },
                    { key: "kanban", icon: Grid3X3 },
                  ].map((v) => (
                    <button
                      key={v.key}
                      onClick={() => setViewMode(v.key as ViewMode)}
                      className={cn(
                        "p-2 rounded-md transition-colors",
                        viewMode === v.key
                          ? "bg-background shadow"
                          : "hover:bg-background/50"
                      )}
                    >
                      <v.icon className="h-4 w-4" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Bulk Selection Bar */}
              <AnimatePresence>
                {selectedPapers.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex items-center justify-between p-3 bg-primary/10 border border-primary/30 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">
                        {selectedPapers.length} selected
                      </span>
                      <button
                        onClick={selectAllPapers}
                        className="text-sm text-primary hover:underline"
                      >
                        Select all
                      </button>
                      <button
                        onClick={clearSelection}
                        className="text-sm text-muted-foreground hover:underline"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 px-3 py-1.5 bg-background border rounded-lg text-sm"
                      >
                        <Download className="h-4 w-4" />
                        Export
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 px-3 py-1.5 bg-background border rounded-lg text-sm"
                      >
                        <Copy className="h-4 w-4" />
                        Move
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Papers Grid/List */}
              {viewMode === "grid" && (
                <div className="grid gap-4 md:grid-cols-2">
                  {filteredPapers.map((paper, index) => (
                    <motion.div
                      key={paper.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -2 }}
                      className={cn(
                        "bg-card border rounded-xl p-4 cursor-pointer transition-all hover:shadow-md",
                        selectedPapers.includes(paper.id) &&
                          "ring-2 ring-primary"
                      )}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <input
                          type="checkbox"
                          checked={selectedPapers.includes(paper.id)}
                          onChange={() => togglePaperSelection(paper.id)}
                          className="rounded border-gray-300 text-primary focus:ring-primary mt-1"
                        />
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              /* toggle star */
                            }}
                            className="p-1 hover:bg-muted rounded"
                          >
                            <Star
                              className={cn(
                                "h-4 w-4",
                                paper.isStarred
                                  ? "fill-yellow-500 text-yellow-500"
                                  : "text-muted-foreground"
                              )}
                            />
                          </button>
                          <button className="p-1 hover:bg-muted rounded">
                            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                          </button>
                        </div>
                      </div>
                      <h3
                        className="font-semibold text-base line-clamp-2 hover:text-primary transition-colors"
                        onClick={() => setPreviewPaper(paper)}
                      >
                        {paper.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {paper.authors.slice(0, 2).join(", ")}
                        {paper.authors.length > 2 &&
                          ` +${paper.authors.length - 2}`}{" "}
                        • {paper.year}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {paper.abstract}
                      </p>
                      <div className="flex items-center justify-between mt-4">
                        <StatusBadge status={paper.status} />
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            {(paper.citationCount / 1000).toFixed(0)}K
                          </span>
                          <button
                            onClick={() => setPreviewPaper(paper)}
                            className="flex items-center gap-1 hover:text-primary"
                          >
                            <Eye className="h-3 w-3" />
                            View
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {viewMode === "list" && (
                <div className="bg-card border rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted/50 border-b">
                      <tr>
                        <th className="w-10 p-3">
                          <input type="checkbox" className="rounded" />
                        </th>
                        <th className="text-left p-3 text-sm font-medium">
                          Title
                        </th>
                        <th className="text-left p-3 text-sm font-medium">
                          Authors
                        </th>
                        <th className="text-left p-3 text-sm font-medium">
                          Year
                        </th>
                        <th className="text-left p-3 text-sm font-medium">
                          Status
                        </th>
                        <th className="text-left p-3 text-sm font-medium">
                          Citations
                        </th>
                        <th className="w-20 p-3"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPapers.map((paper) => (
                        <tr
                          key={paper.id}
                          className="border-b hover:bg-muted/30 transition-colors"
                        >
                          <td className="p-3">
                            <input
                              type="checkbox"
                              checked={selectedPapers.includes(paper.id)}
                              onChange={() => togglePaperSelection(paper.id)}
                              className="rounded"
                            />
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              {paper.isStarred && (
                                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                              )}
                              <span className="font-medium text-sm line-clamp-1">
                                {paper.title}
                              </span>
                            </div>
                          </td>
                          <td className="p-3 text-sm text-muted-foreground">
                            {paper.authors[0]}
                            {paper.authors.length > 1 &&
                              ` +${paper.authors.length - 1}`}
                          </td>
                          <td className="p-3 text-sm">{paper.year}</td>
                          <td className="p-3">
                            <StatusBadge status={paper.status} />
                          </td>
                          <td className="p-3 text-sm">
                            {(paper.citationCount / 1000).toFixed(0)}K
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => setPreviewPaper(paper)}
                              className="p-2 hover:bg-muted rounded"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {viewMode === "kanban" && (
                <div className="grid grid-cols-4 gap-4">
                  {(
                    [
                      "to-read",
                      "reading",
                      "completed",
                      "archived",
                    ] as PaperStatus[]
                  ).map((status) => (
                    <div key={status} className="bg-muted/30 rounded-xl p-3">
                      <h3 className="font-medium text-sm mb-3 flex items-center justify-between">
                        <StatusBadge status={status} />
                        <span className="text-muted-foreground">
                          {
                            filteredPapers.filter((p) => p.status === status)
                              .length
                          }
                        </span>
                      </h3>
                      <div className="space-y-2">
                        {filteredPapers
                          .filter((p) => p.status === status)
                          .map((paper) => (
                            <motion.div
                              key={paper.id}
                              whileHover={{ scale: 1.02 }}
                              className="bg-card border rounded-lg p-3 cursor-pointer"
                              onClick={() => setPreviewPaper(paper)}
                            >
                              <h4 className="font-medium text-sm line-clamp-2">
                                {paper.title}
                              </h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                {paper.authors[0]}
                              </p>
                            </motion.div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* AI Suggestions */}
              {showAISuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold flex items-center gap-2 text-purple-900 dark:text-purple-100">
                      <Sparkles className="h-4 w-4" />
                      AI Suggestions
                    </h3>
                    {!isPremiumUser && (
                      <span className="px-1.5 py-0.5 text-xs rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium">
                        PRO
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-purple-700 dark:text-purple-300 mb-3">
                    Papers similar to your collection
                  </p>
                  <div className="space-y-2">
                    {aiSuggestions.map((suggestion) => (
                      <div
                        key={suggestion.id}
                        className="bg-white/50 dark:bg-gray-900/50 rounded-lg p-2"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm line-clamp-1">
                              {suggestion.title}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {suggestion.authors[0]} • {suggestion.year}
                            </p>
                          </div>
                          <span className="text-xs font-medium text-purple-600">
                            {suggestion.similarity}%
                          </span>
                        </div>
                        <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                          {suggestion.reason}
                        </p>
                        <button className="w-full mt-2 py-1 text-xs font-medium text-purple-700 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded">
                          + Add to Collection
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Preview Panel */}
              <AnimatePresence mode="wait">
                {previewPaper && (
                  <motion.div
                    key={previewPaper.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-card border rounded-xl overflow-hidden"
                  >
                    <div className="p-4 border-b bg-muted/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-muted-foreground">
                          Preview
                        </span>
                        <button
                          onClick={() => setPreviewPaper(null)}
                          className="p-1 hover:bg-muted rounded"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <h3 className="font-semibold line-clamp-2">
                        {previewPaper.title}
                      </h3>
                    </div>
                    <div className="aspect-[3/4] bg-muted/50 flex items-center justify-center">
                      <div className="text-center p-6">
                        <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground">
                          PDF Preview
                        </p>
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() =>
                          onNavigate?.(`/papers/${previewPaper.id}`)
                        }
                        className="w-full py-2 bg-primary text-primary-foreground rounded-lg font-medium flex items-center justify-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        Open Paper
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Members Tab */}
        {activeTab === "members" && (
          <div className="bg-card border rounded-xl overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold">Members ({dummyMembers.length})</h3>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm"
              >
                <UserPlus className="h-4 w-4" />
                Invite
              </motion.button>
            </div>
            <div className="divide-y">
              {dummyMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {member.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <RoleBadge role={member.role} />
                    <button className="p-2 hover:bg-muted rounded">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="max-w-2xl space-y-6">
            <div className="bg-card border rounded-xl p-6">
              <h3 className="font-semibold mb-4">Collection Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <input
                    type="text"
                    defaultValue={dummyCollection.name}
                    className="mt-1.5 w-full px-3 py-2 border rounded-lg bg-background"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    defaultValue={dummyCollection.description}
                    rows={3}
                    className="mt-1.5 w-full px-3 py-2 border rounded-lg bg-background resize-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Visibility</label>
                  <div className="flex gap-3 mt-1.5">
                    <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-muted">
                      <input
                        type="radio"
                        name="visibility"
                        defaultChecked
                        className="text-primary"
                      />
                      <Lock className="h-4 w-4" />
                      <span className="text-sm">Private</span>
                    </label>
                    <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-muted">
                      <input
                        type="radio"
                        name="visibility"
                        className="text-primary"
                      />
                      <Globe className="h-4 w-4" />
                      <span className="text-sm">Public</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
                >
                  Save Changes
                </motion.button>
              </div>
            </div>
            <div className="bg-card border border-destructive/50 rounded-xl p-6">
              <h3 className="font-semibold text-destructive mb-2">
                Danger Zone
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Permanently delete this collection and all its data.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center gap-2 hover:bg-red-700 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Delete Collection
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default CollectionDetailsPage;
