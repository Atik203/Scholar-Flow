"use client";

/**
 * PdfExtractionPage - Enhanced PDF Text Extraction
 *
 * Features:
 * - Inline PDF preview with extraction highlights
 * - AI-powered text extraction with section detection
 * - Side-by-side PDF/Text view
 * - Smart chunk navigation
 * - Export to multiple formats
 * - Framer Motion animations
 */

import {
  ArrowLeft,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  Download,
  Eye,
  FileSearch,
  FileText,
  RefreshCw,
  Search,
  Sparkles,
  TextCursor,
  XCircle,
  Zap,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { motion } from "motion/react";
import React, { useMemo, useState } from "react";
import { useRole, type UserRole } from "../../../components/context";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";

// ============================================================================
// Types
// ============================================================================
interface PdfExtractionPageProps {
  onNavigate?: (path: string) => void;
  role?: UserRole;
}

interface ExtractedChunk {
  id: string;
  page: number;
  section:
    | "abstract"
    | "introduction"
    | "methodology"
    | "results"
    | "discussion"
    | "conclusion"
    | "references"
    | "other";
  text: string;
  confidence: number;
  highlighted?: boolean;
}

interface Paper {
  id: string;
  title: string;
  processingStatus: "PROCESSED" | "PROCESSING" | "UPLOADED" | "FAILED";
  fileName: string;
  pageCount: number;
  extractedChunks: ExtractedChunk[];
}

// ============================================================================
// Sample Data
// ============================================================================
const defaultUser = {
  name: "Demo Researcher",
  email: "demo@scholarflow.com",
  image: undefined,
  role: "researcher" as const,
};

const dummyPapers: Paper[] = [
  {
    id: "paper-1",
    title:
      "Deep Learning in Natural Language Processing: A Comprehensive Survey",
    processingStatus: "PROCESSED",
    fileName: "deep_learning_nlp.pdf",
    pageCount: 24,
    extractedChunks: [
      {
        id: "c1",
        page: 1,
        section: "abstract",
        text: "Abstract: This paper provides a comprehensive survey of deep learning techniques in natural language processing. We review the evolution from traditional methods to modern transformer-based architectures, analyzing their strengths and limitations across various NLP tasks including sentiment analysis, machine translation, and question answering.",
        confidence: 98,
      },
      {
        id: "c2",
        page: 2,
        section: "introduction",
        text: "1. Introduction\n\nNatural language processing has undergone a revolutionary transformation with the advent of deep learning. The field has shifted from rule-based and statistical methods to neural network-based approaches that can automatically learn hierarchical representations from raw text data.",
        confidence: 95,
      },
      {
        id: "c3",
        page: 5,
        section: "methodology",
        text: "3. Methodology\n\nWe employ a systematic literature review approach to analyze 150 papers published between 2017 and 2024. Our methodology follows the PRISMA guidelines for conducting systematic reviews, ensuring reproducibility and comprehensive coverage of the field.",
        confidence: 92,
      },
      {
        id: "c4",
        page: 10,
        section: "results",
        text: "4. Results and Analysis\n\nOur analysis reveals that transformer-based models consistently outperform traditional approaches across all evaluated NLP benchmarks. BERT and its variants achieve state-of-the-art results in 85% of the classification tasks examined.",
        confidence: 96,
      },
      {
        id: "c5",
        page: 15,
        section: "discussion",
        text: "5. Discussion\n\nThe implications of these findings extend beyond academic research. The demonstrated effectiveness of deep learning in NLP has profound impacts on industry applications, from automated customer service to content moderation systems.",
        confidence: 94,
      },
      {
        id: "c6",
        page: 20,
        section: "conclusion",
        text: "6. Conclusion\n\nThis survey demonstrates the transformative impact of deep learning on natural language processing. We identify key trends, challenges, and opportunities for future research, emphasizing the need for more interpretable and efficient models.",
        confidence: 97,
      },
      {
        id: "c7",
        page: 22,
        section: "references",
        text: "References\n\n[1] Vaswani et al., 'Attention Is All You Need', NeurIPS 2017\n[2] Devlin et al., 'BERT: Pre-training of Deep Bidirectional Transformers', NAACL 2019\n[3] Brown et al., 'Language Models are Few-Shot Learners', NeurIPS 2020",
        confidence: 99,
      },
    ],
  },
  {
    id: "paper-2",
    title: "Machine Learning for Healthcare: Opportunities and Challenges",
    processingStatus: "PROCESSED",
    fileName: "ml_healthcare.pdf",
    pageCount: 18,
    extractedChunks: [
      {
        id: "c8",
        page: 1,
        section: "abstract",
        text: "Abstract: Machine learning applications in healthcare promise to revolutionize patient care through improved diagnostics, personalized treatment plans, and efficient resource allocation.",
        confidence: 96,
      },
      {
        id: "c9",
        page: 3,
        section: "introduction",
        text: "1. Introduction\n\nThe healthcare industry generates vast amounts of data daily, from electronic health records to medical imaging. Machine learning offers unprecedented opportunities to extract actionable insights from this data.",
        confidence: 94,
      },
    ],
  },
  {
    id: "paper-3",
    title: "Computer Vision Advances in Autonomous Systems",
    processingStatus: "PROCESSING",
    fileName: "cv_autonomous.pdf",
    pageCount: 15,
    extractedChunks: [],
  },
  {
    id: "paper-4",
    title: "Quantum Computing: Theory and Applications",
    processingStatus: "FAILED",
    fileName: "quantum_computing.pdf",
    pageCount: 32,
    extractedChunks: [],
  },
];

const sectionColors: Record<ExtractedChunk["section"], string> = {
  abstract:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-300",
  introduction:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-300",
  methodology:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-300",
  results:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-300",
  discussion:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-300",
  conclusion:
    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-300",
  references:
    "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400 border-gray-300",
  other:
    "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400 border-slate-300",
};

// ============================================================================
// Utility Functions
// ============================================================================
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

// ============================================================================
// Status Badge Component
// ============================================================================
const StatusBadge: React.FC<{ status: Paper["processingStatus"] }> = ({
  status,
}) => {
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
  const statusConfig = config[status];
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
// PDF Preview Component
// ============================================================================
const PdfPreview: React.FC<{
  paper: Paper;
  currentPage: number;
  zoom: number;
  highlightedChunk?: string;
}> = ({ paper, currentPage, zoom, highlightedChunk }) => {
  return (
    <div className="relative bg-white dark:bg-slate-900 rounded-xl border overflow-hidden h-full flex items-center justify-center">
      {/* Simulated PDF Page */}
      <motion.div
        key={currentPage}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-white shadow-lg"
        style={{
          width: `${400 * (zoom / 100)}px`,
          height: `${550 * (zoom / 100)}px`,
          maxWidth: "100%",
        }}
      >
        {/* Page content simulation */}
        <div className="p-6 h-full overflow-hidden">
          <div className="space-y-3">
            {/* Simulate text lines */}
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-3 rounded",
                  i === 0
                    ? "w-3/4 bg-slate-800"
                    : "bg-slate-200 dark:bg-slate-700",
                  i % 5 === 4 ? "w-1/2" : "w-full"
                )}
              />
            ))}
          </div>

          {/* Highlight overlay for extracted content */}
          {highlightedChunk && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-yellow-400/20 border-2 border-yellow-500 rounded m-4"
            />
          )}
        </div>

        {/* Page number */}
        <div className="absolute bottom-2 right-2 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs">
          Page {currentPage} of {paper.pageCount}
        </div>
      </motion.div>
    </div>
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

  const isPremiumUser =
    effectiveRole === "pro_researcher" ||
    effectiveRole === "team_lead" ||
    effectiveRole === "admin";

  // State
  const [selectedPaperId, setSelectedPaperId] = useState<string>("paper-1");
  const [searchQuery, setSearchQuery] = useState("");
  const [sectionFilter, setSectionFilter] = useState<
    ExtractedChunk["section"] | "all"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [showPreview, setShowPreview] = useState(true);
  const [highlightedChunk, setHighlightedChunk] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"split" | "text" | "pdf">("split");

  const selectedPaper = dummyPapers.find((p) => p.id === selectedPaperId);

  // Filter chunks
  const filteredChunks = useMemo(() => {
    if (!selectedPaper) return [];
    return selectedPaper.extractedChunks.filter((chunk) => {
      if (sectionFilter !== "all" && chunk.section !== sectionFilter)
        return false;
      if (searchQuery) {
        return chunk.text.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return true;
    });
  }, [selectedPaper, sectionFilter, searchQuery]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const navigateToChunk = (chunk: ExtractedChunk) => {
    setCurrentPage(chunk.page);
    setHighlightedChunk(chunk.id);
    setTimeout(() => setHighlightedChunk(null), 3000);
  };

  return (
    <DashboardLayout
      user={user}
      onNavigate={onNavigate}
      currentPath="/research/pdf-extraction"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate?.("/papers")}
              className="inline-flex items-center px-3 py-2 text-sm border rounded-lg hover:bg-muted"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </motion.button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                <FileSearch className="h-8 w-8 text-primary" />
                PDF Text Extraction
              </h1>
              <p className="text-muted-foreground mt-1">
                Extract, search, and analyze text content from your research
                papers
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
              {(["split", "pdf", "text"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-sm font-medium transition-colors capitalize",
                    viewMode === mode
                      ? "bg-background shadow"
                      : "hover:bg-background/50"
                  )}
                >
                  {mode === "split"
                    ? "Split View"
                    : mode === "pdf"
                      ? "PDF Only"
                      : "Text Only"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Paper Selection */}
        <div className="bg-card border rounded-2xl p-4">
          <div className="flex items-center gap-4 overflow-x-auto pb-2">
            {dummyPapers.map((paper) => (
              <motion.button
                key={paper.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedPaperId(paper.id);
                  setCurrentPage(1);
                }}
                className={cn(
                  "flex-shrink-0 p-4 rounded-xl border text-left transition-all min-w-[250px]",
                  selectedPaperId === paper.id
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "hover:bg-muted"
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                  <StatusBadge status={paper.processingStatus} />
                </div>
                <h3 className="font-medium text-sm line-clamp-2">
                  {paper.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {paper.pageCount} pages • {paper.extractedChunks.length}{" "}
                  chunks
                </p>
              </motion.button>
            ))}
          </div>
        </div>

        {selectedPaper && selectedPaper.processingStatus === "PROCESSED" && (
          <div
            className={cn(
              "grid gap-6",
              viewMode === "split" ? "lg:grid-cols-2" : ""
            )}
          >
            {/* PDF Preview */}
            {(viewMode === "split" || viewMode === "pdf") && (
              <div className="bg-card border rounded-2xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    PDF Preview
                  </h3>
                  <div className="flex items-center gap-2">
                    {/* Zoom Controls */}
                    <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                      <button
                        onClick={() => setZoom(Math.max(50, zoom - 10))}
                        className="p-1 hover:bg-background rounded"
                      >
                        <ZoomOut className="h-4 w-4" />
                      </button>
                      <span className="text-xs w-12 text-center">{zoom}%</span>
                      <button
                        onClick={() => setZoom(Math.min(200, zoom + 10))}
                        className="p-1 hover:bg-background rounded"
                      >
                        <ZoomIn className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* PDF Viewer */}
                <div className="h-[500px] bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden">
                  <PdfPreview
                    paper={selectedPaper}
                    currentPage={currentPage}
                    zoom={zoom}
                    highlightedChunk={highlightedChunk || undefined}
                  />
                </div>

                {/* Page Navigation */}
                <div className="flex items-center justify-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="p-2 border rounded-lg hover:bg-muted disabled:opacity-50"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </motion.button>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={currentPage}
                      onChange={(e) =>
                        setCurrentPage(
                          Math.min(
                            selectedPaper.pageCount,
                            Math.max(1, parseInt(e.target.value) || 1)
                          )
                        )
                      }
                      className="w-16 text-center px-2 py-1 border rounded-lg bg-background"
                    />
                    <span className="text-muted-foreground">
                      of {selectedPaper.pageCount}
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={currentPage >= selectedPaper.pageCount}
                    onClick={() =>
                      setCurrentPage((p) =>
                        Math.min(selectedPaper.pageCount, p + 1)
                      )
                    }
                    className="p-2 border rounded-lg hover:bg-muted disabled:opacity-50"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>
            )}

            {/* Extracted Text */}
            {(viewMode === "split" || viewMode === "text") && (
              <div className="bg-card border rounded-2xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold flex items-center gap-2">
                    <TextCursor className="h-5 w-5" />
                    Extracted Content
                    <span className="text-sm font-normal text-muted-foreground">
                      ({filteredChunks.length} sections)
                    </span>
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-3 py-1.5 border rounded-lg hover:bg-muted text-sm"
                  >
                    <Download className="h-4 w-4" />
                    Export All
                  </motion.button>
                </div>

                {/* Search & Filter */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search extracted text..."
                      className="w-full pl-10 pr-4 py-2.5 border rounded-xl bg-background"
                    />
                  </div>
                  <select
                    value={sectionFilter}
                    onChange={(e) =>
                      setSectionFilter(e.target.value as typeof sectionFilter)
                    }
                    className="px-3 py-2 border rounded-xl bg-background text-sm"
                  >
                    <option value="all">All Sections</option>
                    <option value="abstract">Abstract</option>
                    <option value="introduction">Introduction</option>
                    <option value="methodology">Methodology</option>
                    <option value="results">Results</option>
                    <option value="discussion">Discussion</option>
                    <option value="conclusion">Conclusion</option>
                    <option value="references">References</option>
                  </select>
                </div>

                {/* Chunks List */}
                <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2">
                  {filteredChunks.map((chunk, index) => (
                    <motion.div
                      key={chunk.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={cn(
                        "p-4 rounded-xl border transition-all hover:shadow-md",
                        highlightedChunk === chunk.id &&
                          "ring-2 ring-yellow-500"
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-full text-xs font-medium capitalize border",
                              sectionColors[chunk.section]
                            )}
                          >
                            {chunk.section}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Page {chunk.page}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Sparkles className="h-3 w-3" />
                            {chunk.confidence}% confidence
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => navigateToChunk(chunk)}
                            className="p-1.5 hover:bg-muted rounded"
                            title="Jump to page"
                          >
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleCopy(chunk.id, chunk.text)}
                            className="p-1.5 hover:bg-muted rounded"
                          >
                            {copiedId === chunk.id ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4 text-muted-foreground" />
                            )}
                          </motion.button>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed whitespace-pre-line">
                        {chunk.text}
                      </p>
                    </motion.div>
                  ))}

                  {filteredChunks.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <FileSearch className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p>No matching content found</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Processing/Failed States */}
        {selectedPaper && selectedPaper.processingStatus === "PROCESSING" && (
          <div className="bg-card border rounded-2xl p-12 text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 mx-auto mb-4"
            >
              <RefreshCw className="w-full h-full text-primary" />
            </motion.div>
            <h3 className="text-xl font-semibold mb-2">Processing PDF...</h3>
            <p className="text-muted-foreground">
              AI is extracting and analyzing the document content
            </p>
          </div>
        )}

        {selectedPaper && selectedPaper.processingStatus === "FAILED" && (
          <div className="bg-card border border-red-200 dark:border-red-800 rounded-2xl p-12 text-center">
            <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h3 className="text-xl font-semibold mb-2">Processing Failed</h3>
            <p className="text-muted-foreground mb-4">
              Unable to extract text from this PDF
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-xl flex items-center gap-2 mx-auto"
            >
              <RefreshCw className="h-4 w-4" />
              Retry Processing
            </motion.button>
          </div>
        )}

        {/* AI Enhancement Promo */}
        {!isPremiumUser && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-xl">
                  <Sparkles className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-purple-900 dark:text-purple-100">
                    Upgrade to Pro for AI-Enhanced Extraction
                  </h3>
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    Get better section detection, formula extraction, and table
                    recognition
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium flex items-center gap-2"
              >
                <Zap className="h-4 w-4" />
                Upgrade Now
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default PdfExtractionPage;
