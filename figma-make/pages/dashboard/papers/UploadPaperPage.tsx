"use client";

/**
 * UploadPaperPage - Enhanced Modern Upload Experience
 *
 * Features:
 * - Animated file processing states with visual feedback
 * - DOI/arXiv/URL auto-import feature
 * - Real-time AI metadata extraction preview
 * - Bulk upload with progress queue
 * - Drag-drop with file type validation
 * - Collection assignment during upload
 * - Framer Motion animations
 */

import {
  ArrowLeft,
  BookOpen,
  Brain,
  Building2,
  Check,
  CheckCircle,
  Clock,
  FileText,
  Globe,
  Link2,
  Loader2,
  Plus,
  Search,
  Sparkles,
  Upload,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useState } from "react";
import { useRole, type UserRole } from "../../../components/context";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";

// ============================================================================
// Types
// ============================================================================
interface UploadPaperPageProps {
  onNavigate?: (path: string) => void;
  role?: UserRole;
}

type UploadMethod = "file" | "doi" | "arxiv" | "url";
type ProcessingStage =
  | "idle"
  | "uploading"
  | "extracting"
  | "analyzing"
  | "complete"
  | "error";

interface FileUpload {
  id: string;
  file: File;
  progress: number;
  stage: ProcessingStage;
  extractedMetadata?: ExtractedMetadata;
  error?: string;
}

interface ExtractedMetadata {
  title: string;
  authors: string[];
  year: number;
  abstract: string;
  keywords: string[];
  journal?: string;
  doi?: string;
  confidence: number;
}

// ============================================================================
// Default User & Sample Data
// ============================================================================
const defaultUser = {
  name: "Demo Researcher",
  email: "demo@scholarflow.com",
  image: undefined,
  role: "researcher" as const,
};

const dummyWorkspaces = [
  { id: "ws-1", name: "Personal Workspace" },
  { id: "ws-2", name: "Research Lab Alpha" },
  { id: "ws-3", name: "Team Collaboration" },
];

const dummyCollections = [
  {
    id: "col-1",
    name: "Machine Learning Papers",
    workspaceId: "ws-1",
    paperCount: 12,
  },
  {
    id: "col-2",
    name: "Deep Learning Research",
    workspaceId: "ws-1",
    paperCount: 8,
  },
  { id: "col-3", name: "NLP Studies", workspaceId: "ws-2", paperCount: 15 },
  { id: "col-4", name: "Computer Vision", workspaceId: "ws-3", paperCount: 6 },
];

const sampleExtractedMetadata: ExtractedMetadata = {
  title: "Attention Is All You Need",
  authors: ["Ashish Vaswani", "Noam Shazeer", "Niki Parmar", "Jakob Uszkoreit"],
  year: 2017,
  abstract:
    "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism.",
  keywords: ["Transformers", "Attention Mechanism", "Neural Networks", "NLP"],
  journal: "NeurIPS 2017",
  doi: "10.48550/arXiv.1706.03762",
  confidence: 94,
};

// ============================================================================
// Utility Functions
// ============================================================================
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// ============================================================================
// Processing Stage Indicator
// ============================================================================
const ProcessingStageIndicator: React.FC<{
  stage: ProcessingStage;
  progress: number;
}> = ({ stage, progress }) => {
  const stages = [
    { key: "uploading", label: "Uploading", icon: Upload },
    { key: "extracting", label: "Extracting Text", icon: FileText },
    { key: "analyzing", label: "AI Analysis", icon: Brain },
    { key: "complete", label: "Complete", icon: CheckCircle },
  ];

  const currentIndex = stages.findIndex((s) => s.key === stage);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        {stages.map((s, index) => {
          const Icon = s.icon;
          const isActive = s.key === stage;
          const isComplete = index < currentIndex || stage === "complete";

          return (
            <React.Fragment key={s.key}>
              <div className="flex flex-col items-center gap-1">
                <motion.div
                  animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ repeat: isActive ? Infinity : 0, duration: 1 }}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                    isComplete
                      ? "bg-green-500 text-white"
                      : isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                  )}
                >
                  {isComplete && !isActive ? (
                    <Check className="h-5 w-5" />
                  ) : isActive ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </motion.div>
                <span
                  className={cn(
                    "text-xs font-medium",
                    isActive || isComplete
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {s.label}
                </span>
              </div>
              {index < stages.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-2",
                    index < currentIndex ? "bg-green-500" : "bg-muted"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
      {stage !== "complete" && stage !== "idle" && stage !== "error" && (
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-purple-600"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}
    </div>
  );
};

// ============================================================================
// Upload Paper Page Component
// ============================================================================
export function UploadPaperPage({
  onNavigate,
  role: propRole,
}: UploadPaperPageProps) {
  const { role: contextRole } = useRole();
  const effectiveRole = propRole ?? contextRole;
  const user = { ...defaultUser, role: effectiveRole };

  // State
  const [uploadMethod, setUploadMethod] = useState<UploadMethod>("file");
  const [dragActive, setDragActive] = useState(false);
  const [uploads, setUploads] = useState<FileUpload[]>([]);
  const [doiInput, setDoiInput] = useState("");
  const [arxivInput, setArxivInput] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState("");
  const [selectedCollectionIds, setSelectedCollectionIds] = useState<string[]>(
    []
  );
  const [showMetadataPreview, setShowMetadataPreview] = useState(false);
  const [extractedMetadata, setExtractedMetadata] =
    useState<ExtractedMetadata | null>(null);
  const [manualTitle, setManualTitle] = useState("");
  const [manualAuthors, setManualAuthors] = useState<string[]>([]);
  const [newAuthor, setNewAuthor] = useState("");
  const [manualYear, setManualYear] = useState<number | "">("");

  // File handling
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files).filter(
      (f) => f.type === "application/pdf" || f.name.endsWith(".pdf")
    );

    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    const newUploads: FileUpload[] = files.map((file) => ({
      id: generateId(),
      file,
      progress: 0,
      stage: "uploading" as ProcessingStage,
    }));

    setUploads((prev) => [...prev, ...newUploads]);

    // Simulate processing for each file
    newUploads.forEach((upload) => {
      simulateProcessing(upload.id);
    });
  };

  const simulateProcessing = async (uploadId: string) => {
    const stages: ProcessingStage[] = [
      "uploading",
      "extracting",
      "analyzing",
      "complete",
    ];

    for (let i = 0; i < stages.length; i++) {
      const stage = stages[i];
      setUploads((prev) =>
        prev.map((u) => (u.id === uploadId ? { ...u, stage } : u))
      );

      // Simulate progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise((r) => setTimeout(r, 100));
        setUploads((prev) =>
          prev.map((u) => (u.id === uploadId ? { ...u, progress } : u))
        );
      }

      if (stage === "analyzing") {
        // Add extracted metadata
        setUploads((prev) =>
          prev.map((u) =>
            u.id === uploadId
              ? {
                  ...u,
                  extractedMetadata: sampleExtractedMetadata,
                }
              : u
          )
        );
      }
    }
  };

  const removeUpload = (id: string) => {
    setUploads((prev) => prev.filter((u) => u.id !== id));
  };

  // Import handlers
  const handleDoiImport = async () => {
    if (!doiInput.trim()) return;
    setIsImporting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setExtractedMetadata(sampleExtractedMetadata);
    setShowMetadataPreview(true);
    setIsImporting(false);
  };

  const handleArxivImport = async () => {
    if (!arxivInput.trim()) return;
    setIsImporting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setExtractedMetadata(sampleExtractedMetadata);
    setShowMetadataPreview(true);
    setIsImporting(false);
  };

  const handleUrlImport = async () => {
    if (!urlInput.trim()) return;
    setIsImporting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setExtractedMetadata(sampleExtractedMetadata);
    setShowMetadataPreview(true);
    setIsImporting(false);
  };

  // Author handling
  const addAuthor = () => {
    if (newAuthor.trim() && !manualAuthors.includes(newAuthor.trim())) {
      setManualAuthors([...manualAuthors, newAuthor.trim()]);
      setNewAuthor("");
    }
  };

  const removeAuthor = (index: number) => {
    setManualAuthors(manualAuthors.filter((_, i) => i !== index));
  };

  // Collection handling
  const toggleCollection = (collectionId: string) => {
    setSelectedCollectionIds((prev) =>
      prev.includes(collectionId)
        ? prev.filter((id) => id !== collectionId)
        : [...prev, collectionId]
    );
  };

  const filteredCollections = dummyCollections.filter(
    (c) => !selectedWorkspaceId || c.workspaceId === selectedWorkspaceId
  );

  const isPremiumUser =
    effectiveRole === "pro_researcher" ||
    effectiveRole === "team_lead" ||
    effectiveRole === "admin";

  return (
    <DashboardLayout
      user={user}
      onNavigate={onNavigate}
      currentPath="/papers/upload"
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate?.("/papers")}
              className="inline-flex items-center px-3 py-2 text-sm border rounded-lg hover:bg-muted transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </motion.button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <Upload className="h-8 w-8 text-primary" />
                Upload Papers
              </h1>
              <p className="text-muted-foreground">
                Add research papers with AI-powered metadata extraction
              </p>
            </div>
          </div>
        </div>

        {/* Upload Method Tabs */}
        <div className="bg-card border rounded-2xl p-1">
          <div className="flex gap-1">
            {[
              { key: "file", label: "Upload File", icon: Upload },
              { key: "doi", label: "Import DOI", icon: Link2 },
              { key: "arxiv", label: "arXiv ID", icon: BookOpen },
              { key: "url", label: "From URL", icon: Globe },
            ].map((method) => (
              <motion.button
                key={method.key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setUploadMethod(method.key as UploadMethod)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                  uploadMethod === method.key
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "hover:bg-muted"
                )}
              >
                <method.icon className="h-4 w-4" />
                {method.label}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Upload Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* File Upload */}
            {uploadMethod === "file" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border rounded-2xl p-6"
              >
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Upload className="h-5 w-5 text-primary" />
                  Drop Your Papers
                </h2>

                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={cn(
                    "relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer",
                    dragActive
                      ? "border-primary bg-primary/5 scale-[1.02]"
                      : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
                  )}
                >
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept=".pdf"
                    multiple
                    onChange={handleFileSelect}
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <motion.div
                      animate={dragActive ? { scale: 1.1 } : { scale: 1 }}
                      className="flex flex-col items-center gap-4"
                    >
                      <div
                        className={cn(
                          "p-4 rounded-full transition-colors",
                          dragActive ? "bg-primary/20" : "bg-muted"
                        )}
                      >
                        <Upload
                          className={cn(
                            "h-10 w-10",
                            dragActive
                              ? "text-primary"
                              : "text-muted-foreground"
                          )}
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-lg">
                          {dragActive
                            ? "Drop your files here"
                            : "Drag and drop PDF files"}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          or click to browse • Multiple files supported
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          PDF only
                        </span>
                        <span className="flex items-center gap-1">
                          <Sparkles className="h-3 w-3" />
                          AI metadata extraction
                        </span>
                      </div>
                    </motion.div>
                  </label>
                </div>

                {/* Upload Queue */}
                <AnimatePresence>
                  {uploads.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-6 space-y-4"
                    >
                      <h3 className="text-sm font-medium flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Upload Queue ({uploads.length})
                      </h3>
                      {uploads.map((upload) => (
                        <motion.div
                          key={upload.id}
                          layout
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="bg-muted/50 rounded-xl p-4"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div
                                className={cn(
                                  "p-2 rounded-lg",
                                  upload.stage === "complete"
                                    ? "bg-green-100 dark:bg-green-900/30"
                                    : upload.stage === "error"
                                      ? "bg-red-100 dark:bg-red-900/30"
                                      : "bg-primary/10"
                                )}
                              >
                                <FileText
                                  className={cn(
                                    "h-5 w-5",
                                    upload.stage === "complete"
                                      ? "text-green-600"
                                      : upload.stage === "error"
                                        ? "text-red-600"
                                        : "text-primary"
                                  )}
                                />
                              </div>
                              <div>
                                <p className="font-medium text-sm">
                                  {upload.file.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {(upload.file.size / 1024 / 1024).toFixed(2)}{" "}
                                  MB
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => removeUpload(upload.id)}
                              className="p-1 hover:bg-muted rounded"
                            >
                              <X className="h-4 w-4 text-muted-foreground" />
                            </button>
                          </div>

                          <ProcessingStageIndicator
                            stage={upload.stage}
                            progress={upload.progress}
                          />

                          {/* Extracted Metadata Preview */}
                          {upload.extractedMetadata &&
                            upload.stage === "complete" && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg"
                              >
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h4 className="font-medium text-sm text-green-800 dark:text-green-300">
                                      {upload.extractedMetadata.title}
                                    </h4>
                                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                                      {upload.extractedMetadata.authors
                                        .slice(0, 3)
                                        .join(", ")}
                                      {upload.extractedMetadata.authors.length >
                                        3 &&
                                        ` +${upload.extractedMetadata.authors.length - 3} more`}
                                    </p>
                                  </div>
                                  <span className="px-2 py-0.5 bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 rounded text-xs font-medium">
                                    {upload.extractedMetadata.confidence}% match
                                  </span>
                                </div>
                              </motion.div>
                            )}
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* DOI Import */}
            {uploadMethod === "doi" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border rounded-2xl p-6"
              >
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Link2 className="h-5 w-5 text-primary" />
                  Import from DOI
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">DOI</label>
                    <div className="flex gap-2 mt-1.5">
                      <input
                        type="text"
                        value={doiInput}
                        onChange={(e) => setDoiInput(e.target.value)}
                        placeholder="10.1000/xyz123 or https://doi.org/..."
                        className="flex-1 px-4 py-3 border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleDoiImport}
                        disabled={isImporting || !doiInput.trim()}
                        className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium flex items-center gap-2 disabled:opacity-50"
                      >
                        {isImporting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Search className="h-4 w-4" />
                        )}
                        Fetch
                      </motion.button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Enter a DOI to automatically fetch paper metadata
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* arXiv Import */}
            {uploadMethod === "arxiv" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border rounded-2xl p-6"
              >
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Import from arXiv
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">arXiv ID</label>
                    <div className="flex gap-2 mt-1.5">
                      <input
                        type="text"
                        value={arxivInput}
                        onChange={(e) => setArxivInput(e.target.value)}
                        placeholder="2301.00234 or https://arxiv.org/abs/..."
                        className="flex-1 px-4 py-3 border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleArxivImport}
                        disabled={isImporting || !arxivInput.trim()}
                        className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium flex items-center gap-2 disabled:opacity-50"
                      >
                        {isImporting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Search className="h-4 w-4" />
                        )}
                        Fetch
                      </motion.button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Enter an arXiv ID to download and import the paper
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* URL Import */}
            {uploadMethod === "url" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border rounded-2xl p-6"
              >
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Import from URL
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Paper URL</label>
                    <div className="flex gap-2 mt-1.5">
                      <input
                        type="url"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="https://example.com/paper.pdf"
                        className="flex-1 px-4 py-3 border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleUrlImport}
                        disabled={isImporting || !urlInput.trim()}
                        className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium flex items-center gap-2 disabled:opacity-50"
                      >
                        {isImporting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Search className="h-4 w-4" />
                        )}
                        Fetch
                      </motion.button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Direct link to a PDF file
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Metadata Preview */}
            <AnimatePresence>
              {showMetadataPreview && extractedMetadata && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-card border rounded-2xl p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      AI Extracted Metadata
                    </h2>
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm font-medium">
                      {extractedMetadata.confidence}% confidence
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Title</label>
                      <input
                        type="text"
                        defaultValue={extractedMetadata.title}
                        className="mt-1.5 w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Authors</label>
                      <div className="flex flex-wrap gap-2 mt-1.5">
                        {extractedMetadata.authors.map((author, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-muted rounded-full text-sm flex items-center gap-1"
                          >
                            {author}
                            <button className="hover:text-destructive">
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Year</label>
                        <input
                          type="number"
                          defaultValue={extractedMetadata.year}
                          className="mt-1.5 w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">
                          Journal/Venue
                        </label>
                        <input
                          type="text"
                          defaultValue={extractedMetadata.journal}
                          className="mt-1.5 w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Abstract</label>
                      <textarea
                        defaultValue={extractedMetadata.abstract}
                        rows={3}
                        className="mt-1.5 w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Keywords</label>
                      <div className="flex flex-wrap gap-2 mt-1.5">
                        {extractedMetadata.keywords.map((keyword, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-medium flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Confirm & Save
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowMetadataPreview(false)}
                      className="px-6 py-3 border rounded-xl font-medium hover:bg-muted"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Workspace Selection */}
            <div className="bg-card border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Workspace
                </h3>
              </div>
              <select
                value={selectedWorkspaceId}
                onChange={(e) => setSelectedWorkspaceId(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select workspace</option>
                {dummyWorkspaces.map((ws) => (
                  <option key={ws.id} value={ws.id}>
                    {ws.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Collections */}
            <div className="bg-card border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Add to Collections
                </h3>
                <button className="text-sm text-primary hover:underline flex items-center gap-1">
                  <Plus className="h-3 w-3" />
                  New
                </button>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {filteredCollections.map((col) => (
                  <label
                    key={col.id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                      selectedCollectionIds.includes(col.id)
                        ? "bg-primary/10 border border-primary/30"
                        : "hover:bg-muted"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={selectedCollectionIds.includes(col.id)}
                      onChange={() => toggleCollection(col.id)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{col.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {col.paperCount} papers
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* AI Features Info */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-purple-900 dark:text-purple-100">
                    AI Processing
                  </h3>
                  <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                    Our AI automatically extracts metadata, generates summaries,
                    and identifies key concepts.
                  </p>
                  {!isPremiumUser && (
                    <button className="mt-3 text-sm font-medium text-purple-700 dark:text-purple-300 flex items-center gap-1 hover:underline">
                      <Zap className="h-3 w-3" />
                      Upgrade for advanced AI features
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default UploadPaperPage;
