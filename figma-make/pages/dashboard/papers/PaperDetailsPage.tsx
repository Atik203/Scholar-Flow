"use client";

import {
  ArrowLeft,
  Bot,
  Calendar,
  Edit,
  Eye,
  FileText,
  Highlighter,
  MessageSquare,
  Plus,
  Save,
  Sparkles,
  StickyNote,
  Trash2,
  User,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";

// ============================================================================
// Default User for Demo
// ============================================================================
const defaultUser = {
  name: "John Researcher",
  email: "john@example.com",
  image: undefined,
  role: "researcher" as const,
};

interface PaperDetailsPageProps {
  onNavigate?: (path: string) => void;
  paperId?: string;
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
const dummyPaper = {
  id: "paper-1",
  title:
    "Attention Is All You Need: A Study on Transformer Architecture in Deep Learning",
  abstract:
    "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.",
  processingStatus: "PROCESSED" as const,
  uploadedAt: "2024-01-15T10:30:00Z",
  metadata: {
    authors: [
      "Ashish Vaswani",
      "Noam Shazeer",
      "Niki Parmar",
      "Jakob Uszkoreit",
    ],
    year: 2017,
  },
  file: {
    originalFilename: "attention-is-all-you-need.pdf",
    sizeBytes: 2456789,
    mimeType: "application/pdf",
  },
};

const dummyComments = [
  {
    id: "c-1",
    author: "Dr. Sarah Chen",
    content:
      "This paper revolutionized NLP. The self-attention mechanism is brilliantly designed.",
    createdAt: "2024-01-20T14:30:00Z",
    avatar: undefined,
  },
  {
    id: "c-2",
    author: "Prof. Michael Lee",
    content:
      "Key insight: position encodings allow the model to understand sequence order without recurrence.",
    createdAt: "2024-01-21T09:15:00Z",
    avatar: undefined,
  },
];

const dummyNotes = [
  {
    id: "n-1",
    content:
      "Multi-head attention allows the model to jointly attend to information from different representation subspaces.",
    createdAt: "2024-01-18T16:00:00Z",
  },
  {
    id: "n-2",
    content:
      "The Transformer uses stacked self-attention and point-wise fully connected layers for both encoder and decoder.",
    createdAt: "2024-01-19T11:30:00Z",
  },
];

const dummyAISummary = {
  keyPoints: [
    "Introduced the Transformer architecture based purely on self-attention",
    "Eliminated recurrence and convolutions for sequence modeling",
    "Achieved state-of-the-art results on machine translation tasks",
    "Multi-head attention enables parallel processing of sequences",
  ],
  methodology:
    "The paper proposes replacing traditional RNN/CNN architectures with self-attention layers. The Transformer uses an encoder-decoder structure with multi-head attention in both components.",
  implications:
    "This architecture became the foundation for models like BERT, GPT, and other large language models, fundamentally changing NLP and beyond.",
};

// ============================================================================
// Tab Types
// ============================================================================
type TabType = "preview" | "annotations" | "comments" | "notes";

// ============================================================================
// Paper Details Page Component
// ============================================================================
export function PaperDetailsPage({
  onNavigate,
  paperId,
}: PaperDetailsPageProps) {
  const [activeTab, setActiveTab] = useState<TabType>("preview");
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(dummyPaper.title);
  const [editAbstract, setEditAbstract] = useState(dummyPaper.abstract);
  const [editAuthors, setEditAuthors] = useState<string[]>(
    dummyPaper.metadata.authors
  );
  const [editYear, setEditYear] = useState<number | "">(
    dummyPaper.metadata.year
  );
  const [newAuthor, setNewAuthor] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [newNote, setNewNote] = useState("");
  const [showAISummary, setShowAISummary] = useState(true);

  const tabs = [
    { id: "preview" as const, label: "Preview", icon: Eye },
    { id: "annotations" as const, label: "Annotations", icon: Highlighter },
    { id: "comments" as const, label: "Comments", icon: MessageSquare },
    { id: "notes" as const, label: "Notes", icon: StickyNote },
  ];

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return mb < 1 ? `${(bytes / 1024).toFixed(1)} KB` : `${mb.toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      UPLOADED: {
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
        label: "Uploaded",
      },
      PROCESSING: {
        color:
          "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
        label: "Processing",
      },
      PROCESSED: {
        color:
          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        label: "Processed",
      },
      FAILED: {
        color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
        label: "Failed",
      },
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.UPLOADED;
  };

  const addAuthor = () => {
    if (newAuthor.trim() && !editAuthors.includes(newAuthor.trim())) {
      setEditAuthors([...editAuthors, newAuthor.trim()]);
      setNewAuthor("");
    }
  };

  const removeAuthor = (index: number) => {
    setEditAuthors(editAuthors.filter((_, i) => i !== index));
  };

  const statusBadge = getStatusBadge(dummyPaper.processingStatus);

  return (
    <DashboardLayout
      user={defaultUser}
      onNavigate={onNavigate}
      currentPath="/papers/details"
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-background to-muted/30 p-6 rounded-lg border">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate?.("/papers")}
              className="inline-flex items-center px-3 py-2 text-sm border rounded-lg hover:bg-white/80 dark:hover:bg-muted transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Papers
            </motion.button>
            <div className="h-6 border-l border-border hidden sm:block" />
            <div>
              <h1 className="text-xl font-semibold">Paper Details</h1>
              <p className="text-sm text-muted-foreground">
                View and manage your research paper
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowDeleteDialog(true)}
                  className="inline-flex items-center px-4 py-2 bg-destructive text-destructive-foreground rounded-lg"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </motion.button>
              </>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsEditing(false)}
                  className="inline-flex items-center px-4 py-2 border rounded-lg hover:bg-muted"
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsEditing(false)}
                  className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </motion.button>
              </>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Paper Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Paper Information Card */}
            <div className="rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6 bg-gradient-to-r from-background to-muted/20">
                {isEditing ? (
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-medium">Title *</label>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="mt-2 w-full px-3 py-2 text-lg border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Abstract</label>
                      <textarea
                        value={editAbstract}
                        onChange={(e) => setEditAbstract(e.target.value)}
                        rows={4}
                        className="mt-2 w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <h2 className="text-2xl font-bold leading-tight">
                        {dummyPaper.title}
                      </h2>
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium shrink-0",
                          statusBadge.color
                        )}
                      >
                        {statusBadge.label}
                      </span>
                    </div>
                    {dummyPaper.abstract && (
                      <p className="text-base leading-relaxed text-muted-foreground bg-muted/30 p-4 rounded-lg border-l-4 border-primary/20">
                        {dummyPaper.abstract}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Tab Navigation */}
              <div className="border-t border-b">
                <nav className="flex px-6">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                          "flex items-center gap-2 py-4 px-4 border-b-2 font-medium text-sm transition-colors",
                          activeTab === tab.id
                            ? "border-primary text-primary"
                            : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6 space-y-6">
                {activeTab === "preview" && (
                  <>
                    {/* Authors Section */}
                    <div className="bg-muted/20 p-4 rounded-lg border">
                      <label className="text-sm font-semibold flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Authors
                      </label>
                      {isEditing ? (
                        <div className="mt-3 space-y-3">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newAuthor}
                              onChange={(e) => setNewAuthor(e.target.value)}
                              placeholder="Add author name..."
                              className="flex-1 px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                              onKeyDown={(e) =>
                                e.key === "Enter" && addAuthor()
                              }
                            />
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={addAuthor}
                              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg inline-flex items-center"
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add
                            </motion.button>
                          </div>
                          {editAuthors.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {editAuthors.map((author, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center gap-1 px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                                >
                                  <User className="h-3 w-3" />
                                  {author}
                                  <button
                                    onClick={() => removeAuthor(index)}
                                    className="ml-1 hover:text-destructive transition-colors"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {dummyPaper.metadata.authors.map((author, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-background border rounded-full text-sm"
                            >
                              <User className="h-3 w-3" />
                              {author}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Publication Year */}
                    <div className="bg-muted/20 p-4 rounded-lg border">
                      <label className="text-sm font-semibold flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Publication Year
                      </label>
                      {isEditing ? (
                        <input
                          type="number"
                          min="1900"
                          max={new Date().getFullYear() + 1}
                          value={editYear}
                          onChange={(e) =>
                            setEditYear(
                              e.target.value ? parseInt(e.target.value) : ""
                            )
                          }
                          className="mt-3 px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="e.g. 2024"
                        />
                      ) : (
                        <div className="mt-3">
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-background border rounded-full text-sm">
                            <Calendar className="h-3 w-3" />
                            {dummyPaper.metadata.year}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* View Document Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowPreview(true)}
                      className="w-full py-3 bg-primary text-primary-foreground rounded-lg inline-flex items-center justify-center gap-2"
                    >
                      <Eye className="h-5 w-5" />
                      View Full Document
                    </motion.button>
                  </>
                )}

                {activeTab === "annotations" && (
                  <div className="h-[500px] border rounded-lg flex items-center justify-center bg-muted/10">
                    <div className="text-center">
                      <Highlighter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        PDF Annotations
                      </h3>
                      <p className="text-muted-foreground mb-4 max-w-sm">
                        Highlight text, add notes, and annotate directly on the
                        PDF document.
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
                      >
                        Open Annotation Tool
                      </motion.button>
                    </div>
                  </div>
                )}

                {activeTab === "comments" && (
                  <div className="space-y-4">
                    {/* Add Comment */}
                    <div className="flex gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Add a comment..."
                          rows={3}
                          className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                        />
                        <div className="flex justify-end mt-2">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm"
                          >
                            Post Comment
                          </motion.button>
                        </div>
                      </div>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-4 pt-4 border-t">
                      {dummyComments.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                            <User className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">
                                {comment.author}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(comment.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {comment.content}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "notes" && (
                  <div className="space-y-4">
                    {/* Add Note */}
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-900/50">
                      <textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Add a personal note..."
                        rows={3}
                        className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      />
                      <div className="flex justify-end mt-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm inline-flex items-center gap-2"
                        >
                          <StickyNote className="h-4 w-4" />
                          Add Note
                        </motion.button>
                      </div>
                    </div>

                    {/* Notes List */}
                    <div className="space-y-3">
                      {dummyNotes.map((note) => (
                        <div
                          key={note.id}
                          className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-900/50"
                        >
                          <p className="text-sm mb-2">{note.content}</p>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(note.createdAt)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* AI Summary Panel */}
            <div className="rounded-xl border bg-card shadow-sm">
              <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold">AI Summary</h3>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAISummary(!showAISummary)}
                    className="text-sm text-primary hover:underline"
                  >
                    {showAISummary ? "Hide" : "Show"}
                  </motion.button>
                </div>
              </div>
              <AnimatePresence>
                {showAISummary && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold mb-2">
                          Key Points
                        </h4>
                        <ul className="space-y-2">
                          {dummyAISummary.keyPoints.map((point, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-2 text-sm text-muted-foreground"
                            >
                              <span className="text-primary mt-1">•</span>
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold mb-2">
                          Methodology
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {dummyAISummary.methodology}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold mb-2">
                          Implications
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {dummyAISummary.implications}
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-2 bg-primary/10 text-primary rounded-lg text-sm inline-flex items-center justify-center gap-2"
                      >
                        <Bot className="h-4 w-4" />
                        Chat with AI
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* File Information */}
            <div className="rounded-xl border bg-card shadow-sm">
              <div className="p-4 border-b bg-gradient-to-r from-background to-muted/20">
                <h3 className="font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  File Information
                </h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <FileText className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {dummyPaper.file.originalFilename}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(dummyPaper.file.sizeBytes)}
                    </p>
                  </div>
                </div>
                <div className="border-t pt-4 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <span className="font-medium">PDF Document</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Uploaded</span>
                    <span className="font-medium">
                      {formatDate(dummyPaper.uploadedAt)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded text-xs font-medium",
                        statusBadge.color
                      )}
                    >
                      {statusBadge.label}
                    </span>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-2 border rounded-lg text-sm hover:bg-muted transition-colors inline-flex items-center justify-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Download PDF
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        <AnimatePresence>
          {showDeleteDialog && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
              onClick={() => setShowDeleteDialog(false)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-background border rounded-xl p-6 w-full max-w-md"
              >
                <h3 className="text-lg font-semibold mb-2">Delete Paper</h3>
                <p className="text-muted-foreground mb-4">
                  Are you sure you want to delete "{dummyPaper.title}"? This
                  action cannot be undone.
                </p>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setShowDeleteDialog(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteDialog(false);
                      onNavigate?.("/papers");
                    }}
                    className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Document Preview Modal */}
        <AnimatePresence>
          {showPreview && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
              onClick={() => setShowPreview(false)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-background rounded-xl w-[90%] h-[90%] max-w-5xl overflow-hidden"
              >
                <div className="flex items-center justify-between p-4 border-b">
                  <h3 className="font-semibold">
                    {dummyPaper.file.originalFilename}
                  </h3>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="p-2 hover:bg-muted rounded-lg"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="h-[calc(100%-60px)] flex items-center justify-center bg-muted/50">
                  <div className="text-center">
                    <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      PDF Preview would appear here
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}

export default PaperDetailsPage;
