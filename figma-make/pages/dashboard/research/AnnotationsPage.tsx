"use client";

import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  FileText,
  Highlighter,
  MessageSquare,
  MousePointer2,
  Pencil,
  RotateCcw,
  Square,
  StickyNote,
  Type,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { motion } from "motion/react";
import React, { useState } from "react";
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

interface AnnotationsPageProps {
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
const dummyPapers = [
  {
    id: "paper-1",
    title: "Deep Learning in Natural Language Processing",
    processingStatus: "PROCESSED",
    fileName: "deep_learning_nlp.pdf",
    pageCount: 24,
    annotations: [
      {
        id: "a1",
        type: "highlight",
        color: "yellow",
        page: 3,
        text: "Key finding about transformer architecture",
      },
      {
        id: "a2",
        type: "comment",
        page: 5,
        text: "Important methodology section",
      },
      {
        id: "a3",
        type: "highlight",
        color: "green",
        page: 10,
        text: "Results validation approach",
      },
    ],
    notes: [
      {
        id: "n1",
        title: "Key Insights",
        content: "The paper presents a novel approach...",
      },
      { id: "n2", title: "Questions", content: "How does this compare to..." },
    ],
    comments: [
      {
        id: "c1",
        author: "John Doe",
        text: "Great analysis of the methodology!",
        createdAt: "2024-03-18",
      },
    ],
  },
  {
    id: "paper-2",
    title: "Machine Learning for Healthcare",
    processingStatus: "PROCESSED",
    fileName: "ml_healthcare.pdf",
    pageCount: 18,
    annotations: [],
    notes: [],
    comments: [],
  },
  {
    id: "paper-3",
    title: "Computer Vision Advances",
    processingStatus: "PROCESSING",
    fileName: "cv_advances.pdf",
    pageCount: 15,
    annotations: [],
    notes: [],
    comments: [],
  },
];

// ============================================================================
// Status Badge Component
// ============================================================================
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const config: Record<string, { label: string; className: string }> = {
    PROCESSED: {
      label: "Ready",
      className:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    },
    PROCESSING: {
      label: "Processing",
      className:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    },
    UPLOADED: {
      label: "Uploaded",
      className:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    },
    FAILED: {
      label: "Failed",
      className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    },
  };

  const statusConfig = config[status] || config.UPLOADED;

  return (
    <span
      className={cn(
        "px-2 py-1 rounded-full text-xs font-medium",
        statusConfig.className
      )}
    >
      {statusConfig.label}
    </span>
  );
};

// ============================================================================
// Annotations Page Component
// ============================================================================
export function AnnotationsPage({
  onNavigate,
  role: propRole,
}: AnnotationsPageProps) {
  const { role: contextRole } = useRole();
  const effectiveRole = propRole ?? contextRole;
  const user = { ...defaultUser, role: effectiveRole };

  const [selectedPaperId, setSelectedPaperId] = useState<string | null>(
    "paper-1"
  );
  const [activeTab, setActiveTab] = useState<
    "preview" | "annotations" | "comments" | "notes"
  >("preview");
  const [activeTool, setActiveTool] = useState<
    "select" | "highlight" | "underline" | "draw" | "area"
  >("select");
  const [zoomLevel, setZoomLevel] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);

  const selectedPaper = dummyPapers.find((p) => p.id === selectedPaperId);
  const totalPages = selectedPaper?.pageCount || 1;

  return (
    <DashboardLayout
      user={user}
      onNavigate={onNavigate}
      currentPath="/research/annotations"
    >
      <div className="max-w-7xl mx-auto space-y-8">
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
              <h1 className="text-xl font-semibold">PDF Annotations</h1>
              <p className="text-sm text-muted-foreground">
                Annotate, highlight, and collaborate on your research papers
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Paper Selection Sidebar */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border bg-card">
              <div className="p-4 border-b">
                <h3 className="font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Your Papers
                </h3>
              </div>
              <div className="max-h-[500px] overflow-y-auto">
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
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-medium text-sm line-clamp-2">
                        {paper.title}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={paper.processingStatus} />
                      {paper.annotations.length > 0 && (
                        <span className="text-xs text-muted-foreground">
                          {paper.annotations.length} annotations
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-4">
            {selectedPaper ? (
              <>
                {/* Tab Navigation */}
                <div className="flex gap-2 border-b">
                  {[
                    { id: "preview", label: "Preview", icon: Eye },
                    {
                      id: "annotations",
                      label: "Annotations",
                      icon: Highlighter,
                    },
                    { id: "comments", label: "Comments", icon: MessageSquare },
                    { id: "notes", label: "Notes", icon: StickyNote },
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

                {/* Tab Content */}
                <div className="rounded-xl border bg-card overflow-hidden">
                  {activeTab === "preview" && (
                    <div className="flex flex-col h-[650px]">
                      {/* Annotation Toolbar */}
                      <div className="flex items-center justify-between p-3 border-b bg-muted/30">
                        <div className="flex items-center gap-2">
                          {/* Tool Selection */}
                          <div className="flex items-center border rounded-lg overflow-hidden bg-background">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              onClick={() => setActiveTool("select")}
                              className={cn(
                                "p-2 border-r transition-colors",
                                activeTool === "select"
                                  ? "bg-primary/10"
                                  : "hover:bg-muted"
                              )}
                              title="Select"
                            >
                              <MousePointer2
                                className={cn(
                                  "h-4 w-4",
                                  activeTool === "select" ? "text-primary" : ""
                                )}
                              />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              onClick={() => setActiveTool("highlight")}
                              className={cn(
                                "p-2 border-r transition-colors",
                                activeTool === "highlight"
                                  ? "bg-yellow-100 dark:bg-yellow-900/30"
                                  : "hover:bg-muted"
                              )}
                              title="Highlight"
                            >
                              <Highlighter className="h-4 w-4 text-yellow-500" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              onClick={() => setActiveTool("underline")}
                              className={cn(
                                "p-2 border-r transition-colors",
                                activeTool === "underline"
                                  ? "bg-blue-100 dark:bg-blue-900/30"
                                  : "hover:bg-muted"
                              )}
                              title="Underline"
                            >
                              <Type className="h-4 w-4 text-blue-500" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              onClick={() => setActiveTool("draw")}
                              className={cn(
                                "p-2 border-r transition-colors",
                                activeTool === "draw"
                                  ? "bg-green-100 dark:bg-green-900/30"
                                  : "hover:bg-muted"
                              )}
                              title="Draw"
                            >
                              <Pencil className="h-4 w-4 text-green-500" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              onClick={() => setActiveTool("area")}
                              className={cn(
                                "p-2 transition-colors",
                                activeTool === "area"
                                  ? "bg-purple-100 dark:bg-purple-900/30"
                                  : "hover:bg-muted"
                              )}
                              title="Area Selection"
                            >
                              <Square className="h-4 w-4 text-purple-500" />
                            </motion.button>
                          </div>

                          {/* Zoom Controls */}
                          <div className="flex items-center border rounded-lg overflow-hidden bg-background ml-2">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              onClick={() =>
                                setZoomLevel(Math.max(50, zoomLevel - 10))
                              }
                              className="p-2 hover:bg-muted border-r"
                              title="Zoom Out"
                            >
                              <ZoomOut className="h-4 w-4" />
                            </motion.button>
                            <span className="px-3 py-2 text-sm font-medium min-w-[60px] text-center">
                              {zoomLevel}%
                            </span>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              onClick={() =>
                                setZoomLevel(Math.min(200, zoomLevel + 10))
                              }
                              className="p-2 hover:bg-muted border-l"
                              title="Zoom In"
                            >
                              <ZoomIn className="h-4 w-4" />
                            </motion.button>
                          </div>

                          {/* Rotate */}
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            className="p-2 border rounded-lg hover:bg-muted bg-background"
                            title="Rotate"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </motion.button>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Page Navigation */}
                          <div className="flex items-center gap-1 text-sm">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() =>
                                setCurrentPage(Math.max(1, currentPage - 1))
                              }
                              className="p-1.5 hover:bg-muted rounded-lg"
                              disabled={currentPage <= 1}
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </motion.button>
                            <span className="px-2 py-1 bg-muted rounded text-xs font-medium min-w-[70px] text-center">
                              {currentPage} / {totalPages}
                            </span>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() =>
                                setCurrentPage(
                                  Math.min(totalPages, currentPage + 1)
                                )
                              }
                              className="p-1.5 hover:bg-muted rounded-lg"
                              disabled={currentPage >= totalPages}
                            >
                              <ChevronRight className="h-4 w-4" />
                            </motion.button>
                          </div>

                          {/* Download */}
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="p-2 border rounded-lg hover:bg-muted bg-background"
                            title="Download PDF"
                          >
                            <Download className="h-4 w-4" />
                          </motion.button>
                        </div>
                      </div>

                      {/* PDF Viewer Area */}
                      <div className="flex-1 flex overflow-hidden">
                        {/* Main PDF View */}
                        <div className="flex-1 overflow-auto bg-muted/20 p-6">
                          <div className="flex justify-center">
                            <div
                              className="relative bg-white shadow-2xl rounded-sm"
                              style={{
                                width: `${550 * (zoomLevel / 100)}px`,
                                minHeight: `${700 * (zoomLevel / 100)}px`,
                                transform: `scale(1)`,
                                transformOrigin: "top center",
                              }}
                            >
                              {/* Simulated PDF Page */}
                              <div className="p-8 text-gray-800 space-y-4">
                                <h1 className="text-xl font-bold text-center mb-6">
                                  {selectedPaper?.title}
                                </h1>
                                <p className="text-center text-gray-600 text-sm mb-4">
                                  Research Paper • Page {currentPage} of{" "}
                                  {totalPages}
                                </p>

                                {/* Demo Highlight Annotation */}
                                <div className="relative mt-8">
                                  <h2 className="text-lg font-semibold border-b pb-2 mb-3">
                                    Abstract
                                  </h2>
                                  <span className="bg-yellow-200 px-1">
                                    Deep learning has revolutionized
                                  </span>
                                  <span>
                                    {" "}
                                    the field of natural language processing,
                                    enabling significant advances in tasks such
                                    as machine translation, sentiment analysis,
                                    and question answering.
                                  </span>
                                  {selectedPaper?.annotations.some(
                                    (a) => a.type === "highlight"
                                  ) && (
                                    <div className="absolute -right-2 -top-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center cursor-pointer shadow-sm">
                                      <span className="text-[10px] font-bold text-yellow-800">
                                        1
                                      </span>
                                    </div>
                                  )}
                                </div>

                                <h2 className="text-lg font-semibold border-b pb-2 mb-3 mt-6">
                                  1. Introduction
                                </h2>
                                <p className="text-sm leading-relaxed text-gray-700">
                                  This paper explores the application of
                                  transformer-based architectures in natural
                                  language understanding tasks. We present a
                                  comprehensive analysis of various approaches
                                  and their effectiveness in real-world
                                  scenarios.
                                </p>

                                {/* Demo Underline Annotation */}
                                <div className="relative mt-4">
                                  <span className="border-b-2 border-blue-500">
                                    Self-attention mechanisms
                                  </span>
                                  <span>
                                    {" "}
                                    have become the cornerstone of modern NLP
                                    systems, allowing models to capture
                                    long-range dependencies more effectively
                                    than previous approaches.
                                  </span>
                                  {selectedPaper?.annotations.some(
                                    (a) => a.type === "comment"
                                  ) && (
                                    <div className="absolute -right-2 -top-1 w-5 h-5 bg-blue-400 rounded-full flex items-center justify-center cursor-pointer shadow-sm">
                                      <span className="text-[10px] font-bold text-blue-800">
                                        2
                                      </span>
                                    </div>
                                  )}
                                </div>

                                <p className="text-sm leading-relaxed text-gray-700 mt-4">
                                  The contributions of this paper include: (1) A
                                  novel architecture that improves upon existing
                                  transformer models, (2) Comprehensive
                                  experiments demonstrating state-of-the-art
                                  performance, and (3) Analysis of model
                                  behavior across different domains.
                                </p>

                                <p className="text-gray-400 text-xs mt-12 text-center">
                                  Page {currentPage} of {totalPages}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Annotations Sidebar */}
                        <div className="w-72 border-l bg-card overflow-y-auto hidden lg:block">
                          <div className="p-4 border-b">
                            <h4 className="font-semibold flex items-center gap-2">
                              <Highlighter className="h-4 w-4" />
                              Annotations
                              <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                {selectedPaper?.annotations.length || 0}
                              </span>
                            </h4>
                          </div>
                          {selectedPaper?.annotations &&
                          selectedPaper.annotations.length > 0 ? (
                            <div className="divide-y">
                              {selectedPaper.annotations.map(
                                (annotation, index) => (
                                  <div
                                    key={annotation.id}
                                    className="p-3 hover:bg-muted/50 cursor-pointer"
                                  >
                                    <div className="flex items-start gap-2">
                                      <div
                                        className={cn(
                                          "w-3 h-3 rounded-full mt-1 shrink-0",
                                          annotation.type === "highlight"
                                            ? annotation.color === "yellow"
                                              ? "bg-yellow-400"
                                              : "bg-green-400"
                                            : "bg-blue-400"
                                        )}
                                      />
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate capitalize">
                                          {annotation.type}
                                        </p>
                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                          "{annotation.text}"
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                          <span className="text-xs text-muted-foreground">
                                            Page {annotation.page}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          ) : (
                            <div className="p-4 text-center text-muted-foreground">
                              <Highlighter className="h-8 w-8 mx-auto mb-2 opacity-50" />
                              <p className="text-sm">No annotations yet</p>
                              <p className="text-xs mt-1">
                                Select a tool and start annotating
                              </p>
                            </div>
                          )}
                          {/* Add Note Input */}
                          <div className="p-3 border-t">
                            <textarea
                              placeholder="Add a note to selected text..."
                              rows={2}
                              className="w-full px-3 py-2 border rounded-lg bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="w-full mt-2 py-2 bg-primary text-primary-foreground rounded-lg text-sm"
                            >
                              Add Note
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "annotations" && (
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">Annotations</h3>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
                        >
                          <Highlighter className="inline-block mr-2 h-4 w-4" />
                          Add Annotation
                        </motion.button>
                      </div>
                      {selectedPaper.annotations.length > 0 ? (
                        <div className="space-y-3">
                          {selectedPaper.annotations.map((annotation) => (
                            <div
                              key={annotation.id}
                              className="p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                {annotation.type === "highlight" ? (
                                  <span
                                    className={cn(
                                      "px-2 py-0.5 rounded text-xs font-medium",
                                      annotation.color === "yellow"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : "bg-green-100 text-green-700"
                                    )}
                                  >
                                    Highlight
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs font-medium">
                                    Comment
                                  </span>
                                )}
                                <span className="text-xs text-muted-foreground">
                                  Page {annotation.page}
                                </span>
                              </div>
                              <p className="text-sm">{annotation.text}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 text-muted-foreground">
                          <Highlighter className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No annotations yet</p>
                          <p className="text-sm mt-1">
                            Start highlighting and annotating your paper
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "comments" && (
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">Comments</h3>
                      </div>
                      {selectedPaper.comments.length > 0 ? (
                        <div className="space-y-4">
                          {selectedPaper.comments.map((comment) => (
                            <div
                              key={comment.id}
                              className="p-4 rounded-lg bg-muted/50"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                  <span className="text-sm font-medium text-primary">
                                    {comment.author[0]}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-medium text-sm">
                                    {comment.author}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {comment.createdAt}
                                  </p>
                                </div>
                              </div>
                              <p className="text-sm">{comment.text}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 text-muted-foreground">
                          <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No comments yet</p>
                          <p className="text-sm mt-1">
                            Start a discussion about this paper
                          </p>
                        </div>
                      )}
                      {/* Comment Input */}
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex gap-3">
                          <input
                            type="text"
                            placeholder="Add a comment..."
                            className="flex-1 px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
                          >
                            Post
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "notes" && (
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">Personal Notes</h3>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
                        >
                          <StickyNote className="inline-block mr-2 h-4 w-4" />
                          Add Note
                        </motion.button>
                      </div>
                      {selectedPaper.notes.length > 0 ? (
                        <div className="grid gap-4 sm:grid-cols-2">
                          {selectedPaper.notes.map((note) => (
                            <div
                              key={note.id}
                              className="p-4 rounded-lg border hover:border-primary transition-colors cursor-pointer"
                            >
                              <h4 className="font-medium mb-2">{note.title}</h4>
                              <p className="text-sm text-muted-foreground line-clamp-3">
                                {note.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 text-muted-foreground">
                          <StickyNote className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No notes yet</p>
                          <p className="text-sm mt-1">
                            Create personal notes about this paper
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-muted-foreground rounded-xl border bg-card">
                <FileText className="h-16 w-16 mb-4 opacity-50" />
                <p className="text-lg font-medium">Select a paper</p>
                <p className="text-sm mt-1">
                  Choose a paper from the list to view annotations
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AnnotationsPage;
