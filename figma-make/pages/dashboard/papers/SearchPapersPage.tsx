"use client";

import {
  ArrowLeft,
  Building2,
  CheckCircle,
  Clock,
  Eye,
  FileText,
  Search,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import React, { useMemo, useState } from "react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";

// ============================================================================
// Default User for Demo
// ============================================================================
const defaultUser = {
  name: "Demo Researcher",
  email: "demo@scholarflow.com",
  image: undefined,
  role: "researcher" as const,
};

interface SearchPapersPageProps {
  onNavigate?: (path: string) => void;
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
const dummyWorkspaces = [
  { id: "ws-1", name: "Personal Workspace" },
  { id: "ws-2", name: "Research Lab Alpha" },
  { id: "ws-3", name: "Team Collaboration" },
];

const dummyPapers = [
  {
    id: "paper-1",
    title: "Deep Learning in Natural Language Processing",
    authors: ["John Smith", "Jane Doe"],
    processingStatus: "PROCESSED",
    extractedText:
      "This paper explores deep learning techniques for NLP tasks including sentiment analysis, machine translation, and text summarization. We propose a novel transformer-based architecture that achieves state-of-the-art results...",
    createdAt: "2024-01-15",
    pageCount: 24,
    workspaceId: "ws-1",
  },
  {
    id: "paper-2",
    title: "Machine Learning for Healthcare",
    authors: ["Emily Chen", "Robert Brown"],
    processingStatus: "PROCESSED",
    extractedText:
      "Machine learning applications in healthcare have shown remarkable potential for disease prediction, diagnosis assistance, and treatment optimization. This study examines various ML algorithms...",
    createdAt: "2024-02-20",
    pageCount: 18,
    workspaceId: "ws-1",
  },
  {
    id: "paper-3",
    title: "Computer Vision Advances 2024",
    authors: ["Michael Lee"],
    processingStatus: "PROCESSING",
    extractedText: "",
    createdAt: "2024-03-10",
    pageCount: 15,
    workspaceId: "ws-2",
  },
  {
    id: "paper-4",
    title: "Quantum Computing Applications",
    authors: ["Sarah Johnson", "David Kim"],
    processingStatus: "UPLOADED",
    extractedText: "",
    createdAt: "2024-03-15",
    pageCount: 32,
    workspaceId: "ws-2",
  },
  {
    id: "paper-5",
    title: "Neural Network Optimization",
    authors: ["Alex Turner"],
    processingStatus: "FAILED",
    extractedText: "",
    createdAt: "2024-03-18",
    pageCount: 12,
    workspaceId: "ws-3",
  },
];

// ============================================================================
// Status Badge Component
// ============================================================================
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const config = {
    PROCESSED: {
      icon: CheckCircle,
      label: "Processed",
      className:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    },
    PROCESSING: {
      icon: Clock,
      label: "Processing",
      className:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    },
    UPLOADED: {
      icon: Clock,
      label: "Uploaded",
      className:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    },
    FAILED: {
      icon: XCircle,
      label: "Failed",
      className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    },
  };

  const statusConfig = config[status as keyof typeof config] || config.UPLOADED;
  const Icon = statusConfig.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
        statusConfig.className
      )}
    >
      <Icon className="h-3 w-3" />
      {statusConfig.label}
    </span>
  );
};

// ============================================================================
// Search Papers Page Component
// ============================================================================
export function SearchPapersPage({ onNavigate }: SearchPapersPageProps) {
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPaperId, setSelectedPaperId] = useState<string | null>(null);

  // Filter papers
  const filteredPapers = useMemo(() => {
    return dummyPapers.filter((paper) => {
      // Workspace filter
      if (selectedWorkspaceId && paper.workspaceId !== selectedWorkspaceId) {
        return false;
      }
      // Status filter
      if (statusFilter !== "all" && paper.processingStatus !== statusFilter) {
        return false;
      }
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = paper.title.toLowerCase().includes(query);
        const matchesAuthors = paper.authors.some((a) =>
          a.toLowerCase().includes(query)
        );
        const matchesText = paper.extractedText.toLowerCase().includes(query);
        return matchesTitle || matchesAuthors || matchesText;
      }
      return true;
    });
  }, [selectedWorkspaceId, statusFilter, searchQuery]);

  // Stats
  const stats = {
    total: filteredPapers.length,
    processed: filteredPapers.filter((p) => p.processingStatus === "PROCESSED")
      .length,
    processing: filteredPapers.filter(
      (p) => p.processingStatus === "PROCESSING"
    ).length,
    failed: filteredPapers.filter((p) => p.processingStatus === "FAILED")
      .length,
  };

  const selectedPaper = dummyPapers.find((p) => p.id === selectedPaperId);

  return (
    <DashboardLayout
      user={defaultUser}
      onNavigate={onNavigate}
      currentPath="/papers/search"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center px-3 py-2 text-sm border rounded-lg hover:bg-muted transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Papers
            </motion.button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Advanced Search
              </h1>
              <p className="text-muted-foreground">
                Search through extracted text content from your papers
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-muted-foreground" />
            <label className="text-sm font-medium">Workspace:</label>
          </div>
          <select
            value={selectedWorkspaceId}
            onChange={(e) => setSelectedWorkspaceId(e.target.value)}
            className="w-[300px] px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Workspaces</option>
            {dummyWorkspaces.map((ws) => (
              <option key={ws.id} value={ws.id}>
                {ws.name}
              </option>
            ))}
          </select>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border bg-card p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Total Papers
              </span>
            </div>
            <p className="text-2xl font-bold mt-1">{stats.total}</p>
          </div>
          <div className="rounded-xl border bg-card p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm text-muted-foreground">Processed</span>
            </div>
            <p className="text-2xl font-bold mt-1">{stats.processed}</p>
          </div>
          <div className="rounded-xl border bg-card p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <span className="text-sm text-muted-foreground">Processing</span>
            </div>
            <p className="text-2xl font-bold mt-1">{stats.processing}</p>
          </div>
          <div className="rounded-xl border bg-card p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <span className="text-sm text-muted-foreground">Failed</span>
            </div>
            <p className="text-2xl font-bold mt-1">{stats.failed}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Papers List */}
          <div className="lg:col-span-1 rounded-xl border bg-card">
            <div className="p-4 border-b">
              <h3 className="font-semibold flex items-center gap-2 mb-3">
                <FileText className="h-5 w-5" />
                Papers ({filteredPapers.length})
              </h3>
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search papers..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              {/* Status Filter */}
              <div className="flex gap-2 mt-3">
                {["all", "PROCESSED", "PROCESSING", "FAILED"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={cn(
                      "px-3 py-1 text-xs rounded-full border transition-colors",
                      statusFilter === status
                        ? "bg-primary text-primary-foreground border-primary"
                        : "hover:bg-muted"
                    )}
                  >
                    {status === "all" ? "All" : status}
                  </button>
                ))}
              </div>
            </div>
            <div className="max-h-[500px] overflow-y-auto">
              {filteredPapers.map((paper) => (
                <motion.div
                  key={paper.id}
                  whileHover={{ backgroundColor: "var(--muted)" }}
                  onClick={() => setSelectedPaperId(paper.id)}
                  className={cn(
                    "p-4 border-b cursor-pointer transition-colors",
                    selectedPaperId === paper.id && "bg-muted"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium text-sm line-clamp-2">
                      {paper.title}
                    </h4>
                    <StatusBadge status={paper.processingStatus} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {paper.authors.join(", ")}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {paper.pageCount} pages • {paper.createdAt}
                  </p>
                </motion.div>
              ))}
              {filteredPapers.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                  <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No papers found</p>
                </div>
              )}
            </div>
          </div>

          {/* Extracted Text Preview */}
          <div className="lg:col-span-2 rounded-xl border bg-card">
            <div className="p-4 border-b">
              <h3 className="font-semibold flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Extracted Text Preview
              </h3>
            </div>
            <div className="p-4">
              {selectedPaper ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold">
                      {selectedPaper.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      By {selectedPaper.authors.join(", ")}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <StatusBadge status={selectedPaper.processingStatus} />
                      <span className="text-xs text-muted-foreground">
                        {selectedPaper.pageCount} pages
                      </span>
                    </div>
                  </div>
                  {selectedPaper.processingStatus === "PROCESSED" ? (
                    <div className="p-4 bg-muted rounded-lg">
                      <h5 className="text-sm font-medium mb-2">
                        Extracted Content:
                      </h5>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {selectedPaper.extractedText}
                      </p>
                      {searchQuery &&
                        selectedPaper.extractedText
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase()) && (
                          <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                            <p className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                              ✓ Search term &quot;{searchQuery}&quot; found in
                              this document
                            </p>
                          </div>
                        )}
                    </div>
                  ) : selectedPaper.processingStatus === "PROCESSING" ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4" />
                      <p className="text-muted-foreground">
                        Text extraction in progress...
                      </p>
                    </div>
                  ) : selectedPaper.processingStatus === "FAILED" ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <XCircle className="h-12 w-12 text-red-500 mb-4" />
                      <p className="text-muted-foreground">
                        Text extraction failed. Please try re-uploading the
                        paper.
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg"
                      >
                        Retry Extraction
                      </motion.button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Clock className="h-12 w-12 text-yellow-500 mb-4" />
                      <p className="text-muted-foreground">
                        Paper uploaded. Processing will begin shortly.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                  <Search className="h-12 w-12 mb-4 opacity-50" />
                  <p className="text-lg font-medium">Select a paper to view</p>
                  <p className="text-sm mt-1">
                    Choose a paper from the list to view its extracted text
                    content
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default SearchPapersPage;
