"use client";

import { motion } from "motion/react";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Book,
  BookOpen,
  CheckCircle,
  ChevronRight,
  Clock,
  Database,
  File,
  FileText,
  FolderOpen,
  HelpCircle,
  Link,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Upload,
  X,
} from "lucide-react";
import React, { useCallback, useState } from "react";

import { useRole, type UserRole } from "../../components/context";
import { DashboardLayout } from "../../components/layout/DashboardLayout";

interface ImportPapersPageProps {
  onNavigate: (path: string) => void;
  role?: UserRole;
}

type ImportSource =
  | "bibtex"
  | "zotero"
  | "mendeley"
  | "endnote"
  | "ris"
  | "url"
  | "doi";

interface ImportedPaper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  source: string;
  status: "pending" | "importing" | "success" | "error" | "duplicate";
  errorMessage?: string;
  doi?: string;
}

interface ImportHistory {
  id: string;
  source: ImportSource;
  papersCount: number;
  successCount: number;
  failedCount: number;
  timestamp: string;
  status: "completed" | "partial" | "failed";
}

const mockImportHistory: ImportHistory[] = [
  {
    id: "1",
    source: "zotero",
    papersCount: 45,
    successCount: 43,
    failedCount: 2,
    timestamp: "2 hours ago",
    status: "completed",
  },
  {
    id: "2",
    source: "bibtex",
    papersCount: 12,
    successCount: 12,
    failedCount: 0,
    timestamp: "Yesterday",
    status: "completed",
  },
  {
    id: "3",
    source: "doi",
    papersCount: 5,
    successCount: 3,
    failedCount: 2,
    timestamp: "3 days ago",
    status: "partial",
  },
];

const mockPreviewPapers: ImportedPaper[] = [
  {
    id: "p1",
    title:
      "Deep Learning for Natural Language Processing: A Comprehensive Survey",
    authors: ["John Smith", "Jane Doe", "Bob Wilson"],
    year: 2024,
    source: "arXiv:2401.12345",
    status: "pending",
    doi: "10.1000/example1",
  },
  {
    id: "p2",
    title: "Quantum Computing: Current State and Future Directions",
    authors: ["Alice Chen", "David Brown"],
    year: 2023,
    source: "Nature Physics",
    status: "pending",
    doi: "10.1000/example2",
  },
  {
    id: "p3",
    title: "Climate Change Modeling with Machine Learning",
    authors: ["Sarah Johnson"],
    year: 2024,
    source: "Science",
    status: "duplicate",
    doi: "10.1000/example3",
  },
  {
    id: "p4",
    title: "Blockchain in Healthcare: Opportunities and Challenges",
    authors: ["Michael Lee", "Emma Davis"],
    year: 2023,
    source: "IEEE Access",
    status: "pending",
  },
];

const importSources: {
  id: ImportSource;
  name: string;
  icon: React.ReactNode;
  description: string;
}[] = [
  {
    id: "bibtex",
    name: "BibTeX File",
    icon: <FileText className="h-6 w-6" />,
    description: "Import from .bib files exported from any reference manager",
  },
  {
    id: "zotero",
    name: "Zotero",
    icon: <Book className="h-6 w-6" />,
    description: "Connect to your Zotero library and sync references",
  },
  {
    id: "mendeley",
    name: "Mendeley",
    icon: <BookOpen className="h-6 w-6" />,
    description: "Import papers from your Mendeley account",
  },
  {
    id: "endnote",
    name: "EndNote",
    icon: <Database className="h-6 w-6" />,
    description: "Import from EndNote XML or RIS export files",
  },
  {
    id: "ris",
    name: "RIS File",
    icon: <File className="h-6 w-6" />,
    description: "Import from .ris format (Research Information Systems)",
  },
  {
    id: "doi",
    name: "DOI / URL",
    icon: <Link className="h-6 w-6" />,
    description: "Import papers by pasting DOIs or paper URLs",
  },
];

export function ImportPapersPage({
  onNavigate,
  role: propRole,
}: ImportPapersPageProps) {
  const { role: contextRole } = useRole();
  const effectiveRole = propRole ?? contextRole;
  const [selectedSource, setSelectedSource] = useState<ImportSource | null>(
    null
  );
  const [isImporting, setIsImporting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewPapers, setPreviewPapers] = useState<ImportedPaper[]>([]);
  const [doiInput, setDoiInput] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const defaultUser = {
    name: "John Researcher",
    email: "john@research.edu",
    role: "pro_researcher" as const,
  };
  const user = { ...defaultUser, role: effectiveRole };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Handle file upload
      setShowPreview(true);
      setPreviewPapers(mockPreviewPapers);
    }
  }, []);

  const handleSourceSelect = (source: ImportSource) => {
    setSelectedSource(source);
    if (source !== "doi") {
      // Simulate showing preview for file-based sources
      setTimeout(() => {
        setShowPreview(true);
        setPreviewPapers(mockPreviewPapers);
      }, 500);
    }
  };

  const handleImportDOIs = () => {
    if (doiInput.trim()) {
      setShowPreview(true);
      setPreviewPapers(mockPreviewPapers);
    }
  };

  const handleStartImport = () => {
    setIsImporting(true);
    // Simulate import process
    setTimeout(() => {
      setIsImporting(false);
      setShowPreview(false);
      setSelectedSource(null);
    }, 3000);
  };

  const getStatusIcon = (status: ImportedPaper["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "duplicate":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "importing":
        return <Loader2 className="h-5 w-5 text-indigo-500 animate-spin" />;
      default:
        return <Clock className="h-5 w-5 text-slate-400" />;
    }
  };

  return (
    <DashboardLayout user={user} onNavigate={onNavigate}>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25">
              <Upload className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Import Papers
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Import references from your favorite tools and formats
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate("/papers")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800
                     text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <FolderOpen className="h-4 w-4" />
            View Library
          </button>
        </motion.div>

        {/* Import Sources Grid */}
        {!selectedSource && !showPreview && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Choose Import Source
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {importSources.map((source, index) => (
                  <motion.button
                    key={source.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    onClick={() => handleSourceSelect(source.id)}
                    className="flex items-start gap-4 p-5 rounded-2xl bg-white dark:bg-slate-800 
                             border border-slate-200 dark:border-slate-700
                             hover:border-emerald-300 dark:hover:border-emerald-700
                             hover:shadow-lg hover:shadow-emerald-500/10 transition-all text-left group"
                  >
                    <div
                      className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400
                                  group-hover:bg-emerald-500 group-hover:text-white transition-colors"
                    >
                      {source.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                        {source.name}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {source.description}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Quick File Drop Zone */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`p-8 rounded-2xl border-2 border-dashed transition-all
                ${
                  dragActive
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                    : "border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50"
                }`}
            >
              <div className="text-center">
                <div className="inline-flex p-4 rounded-2xl bg-slate-100 dark:bg-slate-700 mb-4">
                  <Upload
                    className={`h-8 w-8 ${dragActive ? "text-emerald-500" : "text-slate-400"}`}
                  />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Drop files here
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mb-4">
                  Drag and drop BibTeX, RIS, or EndNote files to import
                </p>
                <button
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300
                               hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                >
                  Browse Files
                </button>
              </div>
            </motion.div>

            {/* Import History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="mt-8"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Recent Imports
                </h2>
                <button className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">
                  View All
                </button>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                  {mockImportHistory.map((history, index) => (
                    <motion.div
                      key={history.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                      className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700">
                          {
                            importSources.find((s) => s.id === history.source)
                              ?.icon
                          }
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white capitalize">
                            {history.source} Import
                          </p>
                          <p className="text-sm text-slate-500">
                            {history.timestamp}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {history.successCount} / {history.papersCount}{" "}
                            papers
                          </p>
                          <p
                            className={`text-xs ${
                              history.status === "completed"
                                ? "text-emerald-500"
                                : history.status === "partial"
                                  ? "text-amber-500"
                                  : "text-red-500"
                            }`}
                          >
                            {history.status === "completed"
                              ? "Completed"
                              : history.status === "partial"
                                ? "Partial Success"
                                : "Failed"}
                          </p>
                        </div>
                        <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors">
                          <RefreshCw className="h-4 w-4 text-slate-400" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}

        {/* DOI Input Section */}
        {selectedSource === "doi" && !showPreview && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6"
          >
            <button
              onClick={() => setSelectedSource(null)}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 mb-4"
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
              Back to sources
            </button>

            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Import by DOI or URL
            </h2>

            <div className="space-y-4">
              <p className="text-slate-500 dark:text-slate-400">
                Enter DOIs or paper URLs, one per line. We'll automatically
                fetch the metadata.
              </p>

              <textarea
                value={doiInput}
                onChange={(e) => setDoiInput(e.target.value)}
                placeholder="10.1000/xyz123&#10;10.1000/abc456&#10;https://arxiv.org/abs/2301.12345"
                className="w-full h-40 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700
                         bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white
                         focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none font-mono text-sm"
              />

              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">
                  {doiInput.split("\n").filter((l) => l.trim()).length} items
                  detected
                </p>
                <button
                  onClick={handleImportDOIs}
                  disabled={!doiInput.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white
                           hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/25
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Search className="h-4 w-4" />
                  Fetch Papers
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Import Preview */}
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  setShowPreview(false);
                  setSelectedSource(null);
                }}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                <ChevronRight className="h-4 w-4 rotate-180" />
                Back
              </button>

              <div className="flex items-center gap-4">
                <div className="text-sm text-slate-500">
                  <span className="font-medium text-slate-900 dark:text-white">
                    {previewPapers.length}
                  </span>{" "}
                  papers found
                </div>
                <button
                  onClick={handleStartImport}
                  disabled={isImporting}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white
                           hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/25
                           disabled:opacity-50"
                >
                  {isImporting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Import All
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Preview Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  label: "Ready to Import",
                  value: previewPapers.filter((p) => p.status === "pending")
                    .length,
                  color: "text-emerald-500",
                },
                {
                  label: "Duplicates",
                  value: previewPapers.filter((p) => p.status === "duplicate")
                    .length,
                  color: "text-amber-500",
                },
                {
                  label: "Errors",
                  value: previewPapers.filter((p) => p.status === "error")
                    .length,
                  color: "text-red-500",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4"
                >
                  <p className={`text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Papers List */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Papers to Import
                </h3>
                <div className="flex items-center gap-2">
                  <button className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                    Select All
                  </button>
                  <span className="text-slate-300">|</span>
                  <button className="text-sm text-amber-500 hover:text-amber-600">
                    Skip Duplicates
                  </button>
                </div>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {previewPapers.map((paper, index) => (
                  <motion.div
                    key={paper.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 flex items-start gap-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      defaultChecked={paper.status !== "duplicate"}
                      disabled={paper.status === "error"}
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 
                               focus:ring-emerald-500 disabled:opacity-50"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="font-medium text-slate-900 dark:text-white">
                            {paper.title}
                          </h4>
                          <p className="text-sm text-slate-500 mt-1">
                            {paper.authors.join(", ")} • {paper.year}
                          </p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                            <span>{paper.source}</span>
                            {paper.doi && (
                              <span className="font-mono">
                                DOI: {paper.doi}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          {getStatusIcon(paper.status)}
                          {paper.status === "duplicate" && (
                            <span className="text-xs text-amber-500 font-medium">
                              Already exists
                            </span>
                          )}
                        </div>
                      </div>

                      {paper.errorMessage && (
                        <div className="mt-2 p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-sm text-red-600 dark:text-red-400">
                          {paper.errorMessage}
                        </div>
                      )}
                    </div>

                    <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors">
                      <X className="h-4 w-4 text-slate-400" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Import Options */}
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Import Options
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <label
                  className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-slate-800 
                                border border-slate-200 dark:border-slate-700 cursor-pointer
                                hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
                >
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600"
                  />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      Download PDFs
                    </p>
                    <p className="text-sm text-slate-500">
                      Automatically fetch available PDFs
                    </p>
                  </div>
                </label>

                <label
                  className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-slate-800 
                                border border-slate-200 dark:border-slate-700 cursor-pointer
                                hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
                >
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600"
                  />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      Extract Metadata
                    </p>
                    <p className="text-sm text-slate-500">
                      Enrich with abstract, keywords, citations
                    </p>
                  </div>
                </label>

                <label
                  className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-slate-800 
                                border border-slate-200 dark:border-slate-700 cursor-pointer
                                hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600"
                  />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      Add to Collection
                    </p>
                    <p className="text-sm text-slate-500">
                      Automatically organize imported papers
                    </p>
                  </div>
                </label>

                <label
                  className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-slate-800 
                                border border-slate-200 dark:border-slate-700 cursor-pointer
                                hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
                >
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600"
                  />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      Skip Duplicates
                    </p>
                    <p className="text-sm text-slate-500">
                      Don't import papers already in library
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </motion.div>
        )}

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900
                   border border-slate-200 dark:border-slate-700"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-900/50">
              <HelpCircle className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Need Help Importing?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Learn how to export references from your favorite tools or
                troubleshoot common issues.
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                  Export from Zotero <ArrowRight className="h-3 w-3" />
                </button>
                <button className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                  Export from Mendeley <ArrowRight className="h-3 w-3" />
                </button>
                <button className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                  View FAQ <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

export default ImportPapersPage;
