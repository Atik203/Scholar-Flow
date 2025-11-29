"use client";

import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Eye,
  FileSearch,
  FileText,
  RefreshCw,
  Search,
  TextCursor,
  XCircle,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import React, { useMemo, useState } from "react";
import { useRole, type UserRole } from "../../../components/context";
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

interface PdfExtractionPageProps {
  onNavigate?: (path: string) => void;
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
const dummyWorkspaces = [
  { id: "ws-1", name: "Personal Workspace" },
  { id: "ws-2", name: "Research Lab Alpha" },
];

const dummyPapers = [
  {
    id: "paper-1",
    title: "Deep Learning in Natural Language Processing",
    processingStatus: "PROCESSED",
    fileName: "deep_learning_nlp.pdf",
    pageCount: 24,
    extractedChunks: [
      {
        id: "c1",
        page: 1,
        text: "Abstract: This paper explores deep learning techniques for NLP...",
      },
      {
        id: "c2",
        page: 2,
        text: "Introduction: Natural language processing has evolved...",
      },
      {
        id: "c3",
        page: 5,
        text: "Methodology: We propose a transformer-based architecture...",
      },
      {
        id: "c4",
        page: 10,
        text: "Results: Our experiments show significant improvements...",
      },
      {
        id: "c5",
        page: 15,
        text: "Discussion: The implications of these findings...",
      },
      {
        id: "c6",
        page: 20,
        text: "Conclusion: This work demonstrates the effectiveness...",
      },
    ],
  },
  {
    id: "paper-2",
    title: "Machine Learning for Healthcare",
    processingStatus: "PROCESSED",
    fileName: "ml_healthcare.pdf",
    pageCount: 18,
    extractedChunks: [
      {
        id: "c7",
        page: 1,
        text: "Abstract: Machine learning in healthcare...",
      },
      {
        id: "c8",
        page: 3,
        text: "Background: Healthcare systems generate vast amounts...",
      },
    ],
  },
  {
    id: "paper-3",
    title: "Computer Vision Advances",
    processingStatus: "PROCESSING",
    fileName: "cv_advances.pdf",
    pageCount: 15,
    extractedChunks: [],
  },
  {
    id: "paper-4",
    title: "Quantum Computing",
    processingStatus: "FAILED",
    fileName: "quantum_computing.pdf",
    pageCount: 32,
    extractedChunks: [],
  },
];

// ============================================================================
// Status Badge Component
// ============================================================================
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const config = {
    PROCESSED: {
      icon: CheckCircle,
      label: "Ready",
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
// PDF Extraction Page Component
// ============================================================================
export function PdfExtractionPage({
  onNavigate,
  role: propRole,
}: PdfExtractionPageProps) {
  const { role: contextRole } = useRole();
  const effectiveRole = propRole ?? contextRole;
  const user = { ...defaultUser, role: effectiveRole };

  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState("");
  const [selectedPaperId, setSelectedPaperId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterByPage, setFilterByPage] = useState<number | "all">("all");
  const [activeTab, setActiveTab] = useState<"extract" | "search" | "bulk">(
    "extract"
  );
  const [viewMode, setViewMode] = useState<"preview" | "extraction">("preview");

  const selectedPaper = dummyPapers.find((p) => p.id === selectedPaperId);

  // Filter chunks based on search and page
  const filteredChunks = useMemo(() => {
    if (!selectedPaper) return [];
    let chunks = selectedPaper.extractedChunks;

    if (filterByPage !== "all") {
      chunks = chunks.filter((c) => c.page === filterByPage);
    }

    if (searchQuery) {
      chunks = chunks.filter((c) =>
        c.text.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return chunks;
  }, [selectedPaper, filterByPage, searchQuery]);

  // Stats
  const stats = {
    total: dummyPapers.length,
    processed: dummyPapers.filter((p) => p.processingStatus === "PROCESSED")
      .length,
    processing: dummyPapers.filter((p) => p.processingStatus === "PROCESSING")
      .length,
    failed: dummyPapers.filter((p) => p.processingStatus === "FAILED").length,
  };

  // Unique pages for filtering
  const uniquePages =
    selectedPaper?.extractedChunks
      .map((c) => c.page)
      .filter((v, i, a) => a.indexOf(v) === i)
      .sort((a, b) => a - b) || [];

  return (
    <DashboardLayout
      user={user}
      onNavigate={onNavigate}
      currentPath="/research/pdf-extraction"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-background to-muted/30 p-6 rounded-lg border">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center px-3 py-2 text-sm hover:bg-white/80 rounded-lg transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Research Tools
            </motion.button>
            <div className="h-6 border-l border-border" />
            <div>
              <h1 className="text-xl font-semibold flex items-center gap-2">
                <TextCursor className="h-5 w-5" />
                PDF Text Extraction
              </h1>
              <p className="text-sm text-muted-foreground">
                Extract and process text from your research papers
              </p>
            </div>
          </div>
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
              <span className="text-sm text-muted-foreground">Ready</span>
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

        {/* Tabs */}
        <div className="flex gap-2 border-b">
          {[
            { id: "extract", label: "Extract Text", icon: TextCursor },
            { id: "search", label: "Search Content", icon: Search },
            { id: "bulk", label: "Bulk Operations", icon: Zap },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors",
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Papers List */}
          <div className="lg:col-span-1 rounded-xl border bg-card">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <FileSearch className="h-5 w-5" />
                  Select Paper
                </h3>
                <motion.button
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.3 }}
                  className="p-1 hover:bg-muted rounded"
                >
                  <RefreshCw className="h-4 w-4 text-muted-foreground" />
                </motion.button>
              </div>
              {/* Workspace Filter */}
              <select
                value={selectedWorkspaceId}
                onChange={(e) => setSelectedWorkspaceId(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Workspaces</option>
                {dummyWorkspaces.map((ws) => (
                  <option key={ws.id} value={ws.id}>
                    {ws.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              {dummyPapers.map((paper) => (
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
                    {paper.fileName} • {paper.pageCount} pages
                  </p>
                  {paper.processingStatus === "PROCESSED" && (
                    <p className="text-xs text-green-600 mt-1">
                      {paper.extractedChunks.length} chunks extracted
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Extraction View */}
          <div className="lg:col-span-2 rounded-xl border bg-card">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <Eye className="h-5 w-5" />
                {viewMode === "preview" ? "Document Preview" : "Extracted Text"}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("preview")}
                  className={cn(
                    "px-3 py-1 text-xs rounded-lg border transition-colors",
                    viewMode === "preview"
                      ? "bg-primary text-primary-foreground border-primary"
                      : "hover:bg-muted"
                  )}
                >
                  Preview
                </button>
                <button
                  onClick={() => setViewMode("extraction")}
                  className={cn(
                    "px-3 py-1 text-xs rounded-lg border transition-colors",
                    viewMode === "extraction"
                      ? "bg-primary text-primary-foreground border-primary"
                      : "hover:bg-muted"
                  )}
                >
                  Extracted
                </button>
              </div>
            </div>
            <div className="p-4">
              {selectedPaper ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold">
                      {selectedPaper.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-2">
                      <StatusBadge status={selectedPaper.processingStatus} />
                      <span className="text-xs text-muted-foreground">
                        {selectedPaper.pageCount} pages
                      </span>
                    </div>
                  </div>

                  {selectedPaper.processingStatus === "PROCESSED" &&
                    viewMode === "extraction" && (
                      <>
                        {/* Filters */}
                        <div className="flex gap-4 flex-wrap">
                          <div className="relative flex-1 min-w-[200px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                              type="text"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              placeholder="Search in extracted text..."
                              className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                          <select
                            value={filterByPage}
                            onChange={(e) =>
                              setFilterByPage(
                                e.target.value === "all"
                                  ? "all"
                                  : parseInt(e.target.value)
                              )
                            }
                            className="px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            <option value="all">All Pages</option>
                            {uniquePages.map((page) => (
                              <option key={page} value={page}>
                                Page {page}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Chunks */}
                        <div className="space-y-3 max-h-[400px] overflow-y-auto">
                          {filteredChunks.map((chunk) => (
                            <div
                              key={chunk.id}
                              className="p-4 bg-muted rounded-lg"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium text-primary">
                                  Page {chunk.page}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {chunk.text}
                              </p>
                            </div>
                          ))}
                          {filteredChunks.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                              <p>No matching text found</p>
                            </div>
                          )}
                        </div>
                      </>
                    )}

                  {selectedPaper.processingStatus === "PROCESSED" &&
                    viewMode === "preview" && (
                      <div className="flex items-center justify-center py-16 bg-muted rounded-lg">
                        <div className="text-center">
                          <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                          <p className="text-muted-foreground">
                            PDF Preview would render here
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {selectedPaper.fileName}
                          </p>
                        </div>
                      </div>
                    )}

                  {selectedPaper.processingStatus === "PROCESSING" && (
                    <div className="flex flex-col items-center justify-center py-16">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4" />
                      <p className="text-muted-foreground">
                        Processing document...
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        This may take a few minutes
                      </p>
                    </div>
                  )}

                  {selectedPaper.processingStatus === "FAILED" && (
                    <div className="flex flex-col items-center justify-center py-16">
                      <XCircle className="h-12 w-12 text-red-500 mb-4" />
                      <p className="font-medium">Extraction Failed</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Please try re-uploading the document
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg"
                      >
                        Retry Extraction
                      </motion.button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                  <FileSearch className="h-16 w-16 mb-4 opacity-50" />
                  <p className="text-lg font-medium">Select a paper</p>
                  <p className="text-sm mt-1">
                    Choose a paper from the list to view or extract text
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

export default PdfExtractionPage;
