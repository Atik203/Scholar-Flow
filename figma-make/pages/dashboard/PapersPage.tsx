"use client";

import {
  ArrowUpRight,
  BookOpen,
  Building2,
  Calendar,
  Check,
  ChevronDown,
  Eye,
  FileText,
  Filter,
  Play,
  Plus,
  Search,
  Trash2,
  Upload,
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
  },
  {
    id: "paper-2",
    title: "BERT: Pre-training of Deep Bidirectional Transformers",
    authors: ["Devlin, J.", "Chang, M.", "Lee, K."],
    year: 2018,
    processingStatus: "PROCESSING",
    file: { originalFilename: "bert.pdf", sizeBytes: 1843200 },
    createdAt: "2024-01-14T14:20:00Z",
  },
  {
    id: "paper-3",
    title: "GPT-4 Technical Report",
    authors: ["OpenAI"],
    year: 2023,
    processingStatus: "UPLOADED",
    file: { originalFilename: "gpt4-report.pdf", sizeBytes: 5242880 },
    createdAt: "2024-01-13T09:15:00Z",
  },
  {
    id: "paper-4",
    title: "Generative Adversarial Networks",
    authors: ["Goodfellow, I.", "Pouget-Abadie, J."],
    year: 2014,
    processingStatus: "PROCESSED",
    file: { originalFilename: "gan.pdf", sizeBytes: 1024000 },
    createdAt: "2024-01-12T16:45:00Z",
  },
  {
    id: "paper-5",
    title: "Deep Residual Learning for Image Recognition",
    authors: ["He, K.", "Zhang, X.", "Ren, S."],
    year: 2016,
    processingStatus: "FAILED",
    file: { originalFilename: "resnet.pdf", sizeBytes: 3145728 },
    createdAt: "2024-01-11T11:00:00Z",
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

        {/* Papers Library */}
        <div className="bg-card border rounded-xl">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="text-lg font-semibold">Papers Library</h2>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-3 py-1.5 border rounded-lg flex items-center gap-2 text-sm hover:bg-accent transition-colors"
            >
              <Filter className="h-4 w-4" />
              Filter
            </motion.button>
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

            <div className="border-t mb-6" />

            {/* Papers Table */}
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
      </div>
    </DashboardLayout>
  );
}

export default PapersPage;
