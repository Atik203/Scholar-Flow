"use client";

import {
  ArrowLeft,
  Eye,
  FileText,
  Highlighter,
  MessageSquare,
  StickyNote,
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

  const selectedPaper = dummyPapers.find((p) => p.id === selectedPaperId);

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
                <div className="rounded-xl border bg-card">
                  {activeTab === "preview" && (
                    <div className="p-8">
                      <div className="flex items-center justify-center py-24 bg-muted rounded-lg">
                        <div className="text-center">
                          <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                          <p className="text-muted-foreground">
                            PDF Preview would render here
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {selectedPaper.fileName} • {selectedPaper.pageCount}{" "}
                            pages
                          </p>
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
