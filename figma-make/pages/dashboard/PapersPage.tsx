"use client";

import {
  ArrowUpRight,
  BookOpen,
  Brain,
  Building2,
  Calendar,
  Check,
  CheckSquare,
  ChevronDown,
  Eye,
  FileText,
  Filter,
  Grid3X3,
  LayoutList,
  Play,
  Plus,
  Search,
  SortAsc,
  Sparkles,
  Square,
  Trash2,
  TrendingUp,
  Upload,
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
  role: "researcher" as UserRole,
};

interface PapersPageProps {
  onNavigate?: (path: string) => void;
  role?: UserRole; // Optional role prop for backwards compatibility
}

// ============================================================================
// Dummy Data
// ============================================================================
const dummyWorkspaces = [
  { id: "ws-1", name: "Machine Learning Research", role: "Owner" },
  { id: "ws-2", name: "NLP Papers", role: "Member" },
  { id: "ws-3", name: "Computer Vision Lab", role: "Viewer" },
];

const dummyPapers = [
  {
    id: "paper-1",
    title: "Attention Is All You Need",
    authors: ["Vaswani, A.", "Shazeer, N.", "Parmar, N."],
    year: 2017,
    processingStatus: "PROCESSED",
    file: { originalFilename: "attention.pdf", sizeBytes: 2457600 },
    createdAt: "2024-01-15T10:30:00Z",
    abstract:
      "We propose a new simple network architecture, the Transformer, based solely on attention mechanisms...",
    citations: 89000,
    aiRelevance: 98,
    tags: ["Transformers", "NLP", "Deep Learning"],
  },
  {
    id: "paper-2",
    title: "BERT: Pre-training of Deep Bidirectional Transformers",
    authors: ["Devlin, J.", "Chang, M.", "Lee, K."],
    year: 2018,
    processingStatus: "PROCESSING",
    file: { originalFilename: "bert.pdf", sizeBytes: 1843200 },
    createdAt: "2024-01-14T14:20:00Z",
    abstract:
      "We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations...",
    citations: 56000,
    aiRelevance: 95,
    tags: ["BERT", "NLP", "Pre-training"],
  },
  {
    id: "paper-3",
    title: "GPT-4 Technical Report",
    authors: ["OpenAI"],
    year: 2023,
    processingStatus: "UPLOADED",
    file: { originalFilename: "gpt4-report.pdf", sizeBytes: 5242880 },
    createdAt: "2024-01-13T09:15:00Z",
    abstract:
      "We report the development of GPT-4, a large-scale, multimodal model which can accept image and text inputs...",
    citations: 2500,
    aiRelevance: 92,
    tags: ["GPT-4", "LLM", "Multimodal"],
  },
  {
    id: "paper-4",
    title: "Generative Adversarial Networks",
    authors: ["Goodfellow, I.", "Pouget-Abadie, J."],
    year: 2014,
    processingStatus: "PROCESSED",
    file: { originalFilename: "gan.pdf", sizeBytes: 1024000 },
    createdAt: "2024-01-12T16:45:00Z",
    abstract:
      "We propose a new framework for estimating generative models via an adversarial process...",
    citations: 45000,
    aiRelevance: 88,
    tags: ["GANs", "Generative", "Deep Learning"],
  },
  {
    id: "paper-5",
    title: "Deep Residual Learning for Image Recognition",
    authors: ["He, K.", "Zhang, X.", "Ren, S."],
    year: 2016,
    processingStatus: "FAILED",
    file: { originalFilename: "resnet.pdf", sizeBytes: 3145728 },
    createdAt: "2024-01-11T11:00:00Z",
    abstract:
      "We present a residual learning framework to ease the training of networks that are substantially deeper...",
    citations: 120000,
    aiRelevance: 85,
    tags: ["ResNet", "Computer Vision", "CNN"],
  },
];

// ============================================================================
// Utility Functions
// ============================================================================
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

const formatFileSize = (bytes?: number) => {
  if (!bytes) return "N/A";
  const mb = bytes / (1024 * 1024);
  return mb < 1 ? `${(bytes / 1024).toFixed(1)} KB` : `${mb.toFixed(1)} MB`;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getStatusBadge = (status: string) => {
  const statusMap: Record<string, { color: string; label: string }> = {
    UPLOADED: {
      color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
      label: "Uploaded",
    },
    PROCESSING: {
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      label: "Processing",
    },
    PROCESSED: {
      color:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      label: "Processed",
    },
    FAILED: {
      color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      label: "Failed",
    },
  };
  return statusMap[status] || statusMap.UPLOADED;
};

// ============================================================================
// Select Component
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
          "w-[300px] h-10 px-3 flex items-center justify-between",
          "bg-background border rounded-lg text-sm",
          "hover:border-primary/50 transition-colors",
          isOpen && "ring-2 ring-ring ring-offset-2"
        )}
      >
        <span
          className={selected ? "text-foreground" : "text-muted-foreground"}
        >
          {selected ? (
            <span className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              {selected.name}
              <span className="px-1.5 py-0.5 text-xs rounded bg-secondary">
                {selected.role}
              </span>
            </span>
          ) : (
            "Select a workspace to view papers"
          )}
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
                <Building2 className="h-4 w-4" />
                <span className="flex-1">{workspace.name}</span>
                <span className="px-1.5 py-0.5 text-xs rounded bg-secondary">
                  {workspace.role}
                </span>
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
// Stat Card Component
// ============================================================================
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBg: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, iconBg }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-card border rounded-xl p-4"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <div className={cn("rounded-full p-2", iconBg)}>{icon}</div>
    </div>
  </motion.div>
);

// ============================================================================
// Quick Action Card Component
// ============================================================================
interface QuickActionCardProps {
  title: string;
  description: string;
  buttonText: string;
  icon: React.ReactNode;
  iconBg: string;
  variant?: "primary" | "outline";
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({
  title,
  description,
  buttonText,
  icon,
  iconBg,
  variant = "outline",
}) => (
  <motion.div
    whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
    className="bg-card border rounded-xl p-4 group cursor-pointer"
  >
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <div className={cn("p-1.5 rounded-lg", iconBg)}>{icon}</div>
        <h3 className="font-medium">{title}</h3>
      </div>
      <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
    </div>
    <p className="text-sm text-muted-foreground mb-3">{description}</p>
    <button
      className={cn(
        "w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors",
        variant === "primary"
          ? "bg-primary text-primary-foreground hover:bg-primary/90"
          : "border hover:bg-accent"
      )}
    >
      {buttonText}
    </button>
  </motion.div>
);

// ============================================================================
// Paper Row Component
// ============================================================================
interface PaperRowProps {
  paper: (typeof dummyPapers)[0];
  onView: () => void;
  onProcess: () => void;
  onDelete: () => void;
}

const PaperRow: React.FC<PaperRowProps> = ({
  paper,
  onView,
  onProcess,
  onDelete,
}) => {
  const status = getStatusBadge(paper.processingStatus);

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="border-b hover:bg-muted/50 transition-colors"
    >
      <td className="py-4 px-4">
        <div className="flex flex-col">
          <span className="font-medium">{paper.title}</span>
          <span className="text-sm text-muted-foreground">
            {paper.authors.join(", ")}
          </span>
          <span className="text-sm text-muted-foreground">{paper.year}</span>
        </div>
      </td>
      <td className="py-4 px-4">
        <span
          className={cn(
            "px-2 py-1 rounded-full text-xs font-medium",
            status.color
          )}
        >
          {status.label}
        </span>
      </td>
      <td className="py-4 px-4">
        <div className="flex flex-col text-sm">
          <span>{paper.file.originalFilename}</span>
          <span className="text-muted-foreground">
            {formatFileSize(paper.file.sizeBytes)}
          </span>
        </div>
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center text-sm">
          <Calendar className="mr-1 h-3 w-3" />
          {formatDate(paper.createdAt)}
        </div>
      </td>
      <td className="py-4 px-4">
        <div className="flex justify-end gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onView}
            className="p-2 border rounded-lg hover:bg-accent transition-colors"
          >
            <Eye className="h-4 w-4" />
          </motion.button>
          {paper.processingStatus === "UPLOADED" && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onProcess}
              className="p-2 border rounded-lg hover:bg-accent transition-colors"
              title="Start PDF processing"
            >
              <Play className="h-4 w-4" />
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onDelete}
            className="p-2 border rounded-lg hover:bg-destructive hover:text-white transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </motion.button>
        </div>
      </td>
    </motion.tr>
  );
};

// ============================================================================
// Paper Card Component (New Grid View)
// ============================================================================
interface PaperCardProps {
  paper: (typeof dummyPapers)[0];
  isSelected: boolean;
  onSelect: () => void;
  onView: () => void;
  onProcess: () => void;
  onDelete: () => void;
}

const PaperCard: React.FC<PaperCardProps> = ({
  paper,
  isSelected,
  onSelect,
  onView,
  onProcess,
  onDelete,
}) => {
  const status = getStatusBadge(paper.processingStatus);
  const [showPreview, setShowPreview] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={cn(
        "bg-card border rounded-xl overflow-hidden hover:shadow-xl transition-all relative group",
        isSelected && "ring-2 ring-primary border-primary"
      )}
    >
      {/* Selection Checkbox */}
      <div className="absolute top-3 left-3 z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className={cn(
            "w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
            isSelected
              ? "bg-primary border-primary text-white"
              : "bg-white/80 border-gray-300 dark:bg-gray-800/80 dark:border-gray-600 opacity-0 group-hover:opacity-100"
          )}
        >
          {isSelected && <Check className="h-3 w-3" />}
        </button>
      </div>

      {/* AI Relevance Badge */}
      <div className="absolute top-3 right-3 z-10">
        <div className="flex items-center gap-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-medium">
          <Sparkles className="h-3 w-3" />
          <span>{paper.aiRelevance}% match</span>
        </div>
      </div>

      {/* Paper Preview Thumbnail */}
      <div
        className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center cursor-pointer relative overflow-hidden"
        onClick={() => setShowPreview(true)}
      >
        <FileText className="h-12 w-12 text-muted-foreground" />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Eye className="h-8 w-8 text-white" />
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span
            className={cn(
              "px-2 py-0.5 rounded-full text-xs font-medium",
              status.color
            )}
          >
            {status.label}
          </span>
          <span className="text-xs text-muted-foreground">{paper.year}</span>
        </div>

        <h3 className="font-semibold text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {paper.title}
        </h3>

        <p className="text-xs text-muted-foreground mb-3">
          {paper.authors.slice(0, 2).join(", ")}
          {paper.authors.length > 2 && ` +${paper.authors.length - 2} more`}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {paper.tags?.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-secondary text-secondary-foreground text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
          <div className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            <span>{paper.citations?.toLocaleString() || 0} citations</span>
          </div>
          <span>{formatFileSize(paper.file.sizeBytes)}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onView}
            className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium flex items-center justify-center gap-1"
          >
            <Eye className="h-3 w-3" />
            View
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onDelete}
            className="p-2 bg-red-600 text-white rounded-lg"
          >
            <Trash2 className="h-3 w-3" />
          </motion.button>
        </div>
      </div>

      {/* Inline Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b flex items-center justify-between">
                <h3 className="font-semibold text-lg">Paper Preview</h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 hover:bg-muted rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <h2 className="text-xl font-bold mb-3">{paper.title}</h2>
                <p className="text-muted-foreground text-sm mb-4">
                  {paper.authors.join(", ")} • {paper.year}
                </p>
                <div className="bg-muted/50 rounded-xl p-4 mb-4">
                  <h4 className="font-medium text-sm mb-2">Abstract</h4>
                  <p className="text-sm text-muted-foreground">
                    {paper.abstract}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {paper.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-4 border-t flex justify-end gap-3">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-muted"
                >
                  Close
                </button>
                <button
                  onClick={onView}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Open Full Details
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ============================================================================
// Bulk Actions Toolbar
// ============================================================================
interface BulkActionsProps {
  selectedCount: number;
  onClearSelection: () => void;
  onDelete: () => void;
  onAddToCollection: () => void;
  onExport: () => void;
}

const BulkActionsToolbar: React.FC<BulkActionsProps> = ({
  selectedCount,
  onClearSelection,
  onDelete,
  onAddToCollection,
  onExport,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 20 }}
    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
  >
    <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-2xl shadow-2xl px-6 py-3 flex items-center gap-6">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-sm font-bold">
          {selectedCount}
        </div>
        <span className="text-sm font-medium">papers selected</span>
      </div>
      <div className="h-6 w-px bg-gray-700 dark:bg-gray-300" />
      <div className="flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAddToCollection}
          className="px-4 py-2 bg-gray-700 dark:bg-gray-200 hover:bg-gray-600 dark:hover:bg-gray-300 rounded-lg text-sm flex items-center gap-2 transition-colors"
        >
          <BookOpen className="h-4 w-4" />
          Add to Collection
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onExport}
          className="px-4 py-2 bg-gray-700 dark:bg-gray-200 hover:bg-gray-600 dark:hover:bg-gray-300 rounded-lg text-sm flex items-center gap-2 transition-colors"
        >
          <ArrowUpRight className="h-4 w-4" />
          Export
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onDelete}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm flex items-center gap-2 transition-colors text-white"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </motion.button>
      </div>
      <button
        onClick={onClearSelection}
        className="p-2 hover:bg-gray-700 dark:hover:bg-gray-200 rounded-lg transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  </motion.div>
);

// ============================================================================
// AI Sort Options
// ============================================================================
const sortOptions = [
  { id: "ai-relevance", label: "AI Relevance", icon: Sparkles },
  { id: "recent", label: "Most Recent", icon: Calendar },
  { id: "citations", label: "Most Cited", icon: TrendingUp },
  { id: "title", label: "Title A-Z", icon: SortAsc },
];

// ============================================================================
// Papers Page Component
// ============================================================================
export function PapersPage({ onNavigate, role: propRole }: PapersPageProps) {
  // Use role from context, fallback to prop, then default
  const { role: contextRole } = useRole();
  const effectiveRole = propRole ?? contextRole;

  // Create user with correct role
  const user = {
    ...defaultUser,
    role: effectiveRole,
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(
    dummyWorkspaces[0].id
  );
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [selectedPapers, setSelectedPapers] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("ai-relevance");
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Calculate stats
  const totalPapers = dummyPapers.length;
  const processedPapers = dummyPapers.filter(
    (p) => p.processingStatus === "PROCESSED"
  ).length;
  const processingPapers = dummyPapers.filter(
    (p) => p.processingStatus === "PROCESSING"
  ).length;
  const totalSize = dummyPapers.reduce(
    (acc, paper) => acc + (paper.file?.sizeBytes || 0),
    0
  );

  // Filter papers
  const filteredPapers = dummyPapers.filter(
    (paper) =>
      paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paper.authors.some((a) =>
        a.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <DashboardLayout user={user} onNavigate={onNavigate} currentPath="/papers">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Research Papers
            </h1>
            <p className="text-muted-foreground">
              Manage, organize, and explore your research collection
            </p>
          </div>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 border rounded-lg flex items-center gap-2 hover:bg-accent transition-colors"
            >
              <Search className="h-4 w-4" />
              Advanced Search
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload Paper
            </motion.button>
          </div>
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
            title="Total Papers"
            value={totalPapers}
            icon={
              <FileText className="h-4 w-4 text-blue-600 dark:text-white" />
            }
            iconBg="bg-blue-50 dark:bg-blue-950/20"
          />
          <StatCard
            title="Processed"
            value={processedPapers}
            icon={
              <BookOpen className="h-4 w-4 text-green-600 dark:text-green-400" />
            }
            iconBg="bg-green-50 dark:bg-green-950/20"
          />
          <StatCard
            title="Processing"
            value={processingPapers}
            icon={
              <Upload className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            }
            iconBg="bg-yellow-50 dark:bg-yellow-950/20"
          />
          <StatCard
            title="Storage"
            value={`${Math.round(totalSize / (1024 * 1024))}MB`}
            icon={
              <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            }
            iconBg="bg-purple-50 dark:bg-purple-950/20"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickActionCard
            title="Upload New Paper"
            description="Add research papers to your workspace with automatic processing"
            buttonText="Get Started"
            icon={<Plus className="h-4 w-4 text-blue-600 dark:text-white" />}
            iconBg="bg-blue-100 dark:bg-blue-900/20"
            variant="primary"
          />
          <QuickActionCard
            title="Advanced Search"
            description="Find papers with powerful filters and AI-powered search"
            buttonText="Search Papers"
            icon={
              <Search className="h-4 w-4 text-green-600 dark:text-green-400" />
            }
            iconBg="bg-green-100 dark:bg-green-900/20"
          />
          <QuickActionCard
            title="Collections"
            description="Organize papers into collections for better management"
            buttonText="Manage Collections"
            icon={
              <BookOpen className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            }
            iconBg="bg-purple-100 dark:bg-purple-900/20"
          />
        </div>

        {/* AI Insights Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 border border-purple-200 dark:border-purple-800/50 rounded-2xl p-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-sm">AI Research Assistant</h3>
                <span className="px-2 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full font-medium">
                  PRO
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Based on your library, we recommend exploring{" "}
                <span className="font-medium text-primary">
                  3 related papers
                </span>{" "}
                on transformer architectures. Your most-read topic this month is{" "}
                <span className="font-medium text-primary">Deep Learning</span>.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm font-medium flex items-center gap-2 flex-shrink-0"
            >
              <Sparkles className="h-4 w-4" />
              Discover Papers
            </motion.button>
          </div>
        </motion.div>

        {/* Papers Library */}
        <div className="bg-card border rounded-xl">
          <div className="p-4 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold">Papers Library</h2>
              {selectedPapers.length > 0 && (
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-medium">
                  {selectedPapers.length} selected
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="flex items-center bg-muted rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "p-2 rounded-md transition-colors",
                    viewMode === "grid"
                      ? "bg-background shadow-sm"
                      : "hover:bg-background/50"
                  )}
                  title="Grid view"
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "p-2 rounded-md transition-colors",
                    viewMode === "list"
                      ? "bg-background shadow-sm"
                      : "hover:bg-background/50"
                  )}
                  title="List view"
                >
                  <LayoutList className="h-4 w-4" />
                </button>
              </div>

              {/* AI Sort */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowSortMenu(!showSortMenu)}
                  className="px-3 py-2 border rounded-lg flex items-center gap-2 text-sm hover:bg-accent transition-colors"
                >
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  {sortOptions.find((s) => s.id === sortBy)?.label}
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform",
                      showSortMenu && "rotate-180"
                    )}
                  />
                </motion.button>

                <AnimatePresence>
                  {showSortMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-popover border rounded-lg shadow-lg z-50 overflow-hidden"
                    >
                      {sortOptions.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => {
                            setSortBy(option.id);
                            setShowSortMenu(false);
                          }}
                          className={cn(
                            "w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-accent transition-colors",
                            sortBy === option.id && "bg-accent"
                          )}
                        >
                          <option.icon
                            className={cn(
                              "h-4 w-4",
                              option.id === "ai-relevance" && "text-purple-500"
                            )}
                          />
                          {option.label}
                          {sortBy === option.id && (
                            <Check className="h-4 w-4 ml-auto" />
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-3 py-2 border rounded-lg flex items-center gap-2 text-sm hover:bg-accent transition-colors"
              >
                <Filter className="h-4 w-4" />
                Filter
              </motion.button>
            </div>
          </div>

          <div className="p-4">
            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search papers by title, author, or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Select All (for grid view) */}
            {viewMode === "grid" && (
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => {
                    if (selectedPapers.length === filteredPapers.length) {
                      setSelectedPapers([]);
                    } else {
                      setSelectedPapers(filteredPapers.map((p) => p.id));
                    }
                  }}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {selectedPapers.length === filteredPapers.length ? (
                    <CheckSquare className="h-4 w-4 text-primary" />
                  ) : (
                    <Square className="h-4 w-4" />
                  )}
                  Select All
                </button>
                <span className="text-sm text-muted-foreground">
                  {filteredPapers.length} papers
                </span>
              </div>
            )}

            {/* Grid View */}
            <AnimatePresence mode="wait">
              {viewMode === "grid" ? (
                <motion.div
                  key="grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {filteredPapers.map((paper) => (
                    <PaperCard
                      key={paper.id}
                      paper={paper}
                      isSelected={selectedPapers.includes(paper.id)}
                      onSelect={() => {
                        setSelectedPapers((prev) =>
                          prev.includes(paper.id)
                            ? prev.filter((id) => id !== paper.id)
                            : [...prev, paper.id]
                        );
                      }}
                      onView={() => onNavigate?.(`/papers/${paper.id}`)}
                      onProcess={() => console.log("Process", paper.id)}
                      onDelete={() => console.log("Delete", paper.id)}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">
                            Title
                          </th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">
                            Status
                          </th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">
                            File Info
                          </th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">
                            Created
                          </th>
                          <th className="py-3 px-4 text-right text-sm font-medium text-muted-foreground">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPapers.map((paper) => (
                          <PaperRow
                            key={paper.id}
                            paper={paper}
                            onView={() => onNavigate?.(`/papers/${paper.id}`)}
                            onProcess={() => console.log("Process", paper.id)}
                            onDelete={() => console.log("Delete", paper.id)}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6 pt-6 border-t">
              <div className="text-sm text-muted-foreground">
                Page 1 of 1 • {filteredPapers.length} total papers
              </div>
              <div className="flex gap-2">
                <button
                  disabled
                  className="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  disabled
                  className="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Actions Toolbar */}
        <AnimatePresence>
          {selectedPapers.length > 0 && (
            <BulkActionsToolbar
              selectedCount={selectedPapers.length}
              onClearSelection={() => setSelectedPapers([])}
              onDelete={() => console.log("Delete selected:", selectedPapers)}
              onAddToCollection={() =>
                console.log("Add to collection:", selectedPapers)
              }
              onExport={() => console.log("Export:", selectedPapers)}
            />
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}

export default PapersPage;
