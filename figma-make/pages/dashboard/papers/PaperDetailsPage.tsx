"use client";

import {
  ArrowLeft,
  ArrowUp,
  Bot,
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  Crown,
  Edit,
  Eye,
  FileText,
  Highlighter,
  MessageCircle,
  MessageSquare,
  MousePointer2,
  Pencil,
  Plus,
  RotateCcw,
  Save,
  Sparkles,
  Square,
  StickyNote,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  Type,
  User,
  X,
  Zap,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useRole, type UserRole } from "../../../components/context";
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

// AI Chat dummy data
const dummyChatMessages = [
  {
    id: "msg-1",
    role: "user" as const,
    content: "What is the main contribution of this paper?",
    timestamp: "2024-01-20T10:30:00Z",
  },
  {
    id: "msg-2",
    role: "assistant" as const,
    content:
      "The main contribution of this paper is the introduction of the Transformer architecture, which relies entirely on self-attention mechanisms for sequence transduction tasks. Key innovations include:\n\n1. **Self-Attention Mechanism**: The model uses self-attention to draw global dependencies between input and output, without using recurrence or convolution.\n\n2. **Multi-Head Attention**: This allows the model to jointly attend to information from different representation subspaces at different positions.\n\n3. **Positional Encoding**: Since the model contains no recurrence, positional encodings are added to give the model information about the relative positions of tokens.\n\n4. **Parallel Processing**: Unlike RNNs, Transformers can process all positions simultaneously, enabling much faster training.",
    timestamp: "2024-01-20T10:30:15Z",
  },
  {
    id: "msg-3",
    role: "user" as const,
    content: "How does the attention mechanism work in simple terms?",
    timestamp: "2024-01-20T10:32:00Z",
  },
  {
    id: "msg-4",
    role: "assistant" as const,
    content:
      'In simple terms, the attention mechanism works like a smart spotlight:\n\n**Query, Key, Value (Q, K, V)**:\n- Imagine you\'re in a library looking for relevant information\n- The Query is your question\n- Keys are like book titles/indices\n- Values are the actual book contents\n\n**How it works**:\n1. Compare your question (Query) with all book titles (Keys)\n2. Calculate "relevance scores" for each book\n3. Use these scores to weight the actual contents (Values)\n4. Combine weighted contents to get your answer\n\nThe Transformer does this for every word in a sentence, allowing each word to "look at" all other words and decide which ones are most relevant for understanding the current context.',
    timestamp: "2024-01-20T10:32:20Z",
  },
];

const AI_MODELS = [
  {
    value: "gemini-3-flash",
    label: "Gemini 3 Flash",
    description: "Fast & free",
    tier: "free",
    icon: "⚡",
  },
  {
    value: "gpt-5.1-mini",
    label: "GPT 5.1 Mini",
    description: "Balanced",
    tier: "free",
    icon: "🎯",
  },
  {
    value: "gpt-5.1",
    label: "GPT 5.1",
    description: "Most capable",
    tier: "premium",
    icon: "🚀",
  },
  {
    value: "opus-4.5",
    label: "Opus 4.5",
    description: "Best for research",
    tier: "premium",
    icon: "🧠",
  },
  {
    value: "gemini-3-ultra",
    label: "Gemini 3 Ultra",
    description: "Multimodal",
    tier: "premium",
    icon: "✨",
  },
];

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
  role: propRole,
}: PaperDetailsPageProps) {
  const { role: contextRole } = useRole();
  const effectiveRole = propRole ?? contextRole;
  const user = { ...defaultUser, role: effectiveRole };

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
  const [showAIChat, setShowAIChat] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [selectedModel, setSelectedModel] = useState("gemini-3-flash");
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [chatMessages, setChatMessages] = useState<
    Array<{
      id: string;
      role: "user" | "assistant";
      content: string;
      timestamp: string | Date;
    }>
  >(dummyChatMessages);

  // Derived state
  const currentModel = AI_MODELS.find((m) => m.value === selectedModel);
  const isPremiumUser =
    effectiveRole === "pro_researcher" || effectiveRole === "admin";

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

  const formatTime = (dateInput: string | Date) => {
    const date =
      typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
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
      user={user}
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
                  className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
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
                      View Full Screen
                    </motion.button>

                    {/* Inline PDF Preview */}
                    <div className="border rounded-xl overflow-hidden bg-muted/20">
                      <div className="flex items-center justify-between p-3 border-b bg-card">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <FileText className="h-4 w-4 text-red-500" />
                          {dummyPaper.file.originalFilename}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center border rounded-lg overflow-hidden bg-background">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              className="p-1.5 hover:bg-muted border-r"
                            >
                              <ZoomOut className="h-4 w-4" />
                            </motion.button>
                            <span className="px-3 py-1.5 text-xs font-medium">
                              100%
                            </span>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              className="p-1.5 hover:bg-muted border-l"
                            >
                              <ZoomIn className="h-4 w-4" />
                            </motion.button>
                          </div>
                          <div className="flex items-center gap-1 text-xs bg-muted px-2 py-1.5 rounded-lg">
                            <ChevronLeft className="h-4 w-4" />
                            <span className="font-medium">1 / 12</span>
                            <ChevronRight className="h-4 w-4" />
                          </div>
                        </div>
                      </div>

                      {/* PDF Content Area */}
                      <div className="h-[500px] overflow-auto bg-muted/30 p-6">
                        <div className="flex justify-center">
                          <div
                            className="relative bg-white shadow-2xl rounded-sm"
                            style={{ width: "550px", minHeight: "700px" }}
                          >
                            {/* Simulated PDF Page */}
                            <div className="p-8 text-gray-800 space-y-4">
                              <h1 className="text-xl font-bold text-center mb-6">
                                {dummyPaper.title}
                              </h1>
                              <p className="text-center text-gray-600 text-sm mb-4">
                                {dummyPaper.metadata.authors.join(", ")}
                              </p>
                              <div className="text-center text-gray-500 text-xs mb-8">
                                Published: {dummyPaper.metadata.year}
                              </div>

                              <h2 className="text-lg font-semibold border-b pb-2 mb-3">
                                Abstract
                              </h2>
                              <p className="text-sm leading-relaxed text-gray-700">
                                {dummyPaper.abstract}
                              </p>

                              <h2 className="text-lg font-semibold border-b pb-2 mb-3 mt-6">
                                1. Introduction
                              </h2>
                              <p className="text-sm leading-relaxed text-gray-700">
                                The Transformer model introduces a novel
                                architecture based entirely on attention
                                mechanisms. This paper proposes a new simple
                                network architecture, the Transformer, based
                                solely on attention mechanisms, dispensing with
                                recurrence and convolutions entirely.
                              </p>
                              <p className="text-sm leading-relaxed text-gray-700 mt-3">
                                Self-attention, sometimes called
                                intra-attention, is an attention mechanism
                                relating different positions of a single
                                sequence in order to compute a representation of
                                the sequence. The model achieves
                                state-of-the-art performance on machine
                                translation tasks while being more
                                parallelizable and requiring significantly less
                                time to train.
                              </p>

                              <p className="text-gray-400 text-xs mt-8 text-center">
                                Page 1 of 12
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === "annotations" && (
                  <div className="flex flex-col h-[600px] border rounded-lg overflow-hidden bg-background">
                    {/* Annotation Toolbar */}
                    <div className="flex items-center justify-between p-3 border-b bg-muted/30">
                      <div className="flex items-center gap-2">
                        {/* Tool Selection */}
                        <div className="flex items-center border rounded-lg overflow-hidden bg-background">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            className="p-2 hover:bg-muted border-r bg-primary/10"
                            title="Select"
                          >
                            <MousePointer2 className="h-4 w-4 text-primary" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            className="p-2 hover:bg-muted border-r"
                            title="Highlight"
                          >
                            <Highlighter className="h-4 w-4 text-yellow-500" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            className="p-2 hover:bg-muted border-r"
                            title="Underline"
                          >
                            <Type className="h-4 w-4 text-blue-500" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            className="p-2 hover:bg-muted border-r"
                            title="Draw"
                          >
                            <Pencil className="h-4 w-4 text-green-500" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            className="p-2 hover:bg-muted"
                            title="Area Selection"
                          >
                            <Square className="h-4 w-4 text-purple-500" />
                          </motion.button>
                        </div>

                        {/* Zoom Controls */}
                        <div className="flex items-center border rounded-lg overflow-hidden bg-background ml-2">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            className="p-2 hover:bg-muted border-r"
                            title="Zoom Out"
                          >
                            <ZoomOut className="h-4 w-4" />
                          </motion.button>
                          <span className="px-3 py-2 text-sm font-medium">
                            120%
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
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
                            className="p-1.5 hover:bg-muted rounded-lg"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </motion.button>
                          <span className="px-2 py-1 bg-muted rounded text-xs font-medium">
                            1 / 12
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-1.5 hover:bg-muted rounded-lg"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </motion.button>
                        </div>

                        {/* Toggle Annotations List */}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm"
                        >
                          Show List
                        </motion.button>
                      </div>
                    </div>

                    {/* PDF Viewer Area */}
                    <div className="flex-1 flex">
                      {/* Main PDF View */}
                      <div className="flex-1 overflow-auto bg-muted/20 p-6">
                        <div className="flex justify-center">
                          <div
                            className="relative bg-white shadow-2xl"
                            style={{ width: "595px", height: "842px" }}
                          >
                            {/* Simulated PDF Page */}
                            <div className="p-8 text-sm text-gray-700 space-y-4">
                              <h1 className="text-xl font-bold text-center mb-6">
                                {dummyPaper.title}
                              </h1>
                              <p className="text-center text-gray-500 text-xs mb-4">
                                {dummyPaper.metadata.authors.join(", ")}
                              </p>

                              {/* Demo Highlight Annotation */}
                              <div className="relative">
                                <span className="bg-yellow-200 px-1">
                                  The Transformer model
                                </span>
                                <span>
                                  {" "}
                                  introduces a novel architecture based entirely
                                  on attention mechanisms.
                                </span>
                                <div className="absolute -right-2 -top-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center cursor-pointer shadow-sm">
                                  <span className="text-[10px] font-bold text-yellow-800">
                                    1
                                  </span>
                                </div>
                              </div>

                              <p>
                                This paper proposes a new simple network
                                architecture, the Transformer, based solely on
                                attention mechanisms, dispensing with recurrence
                                and convolutions entirely.
                              </p>

                              {/* Demo Underline Annotation */}
                              <div className="relative">
                                <span className="border-b-2 border-blue-500">
                                  Self-attention
                                </span>
                                <span>
                                  , sometimes called intra-attention, is an
                                  attention mechanism relating different
                                  positions of a single sequence.
                                </span>
                                <div className="absolute -right-2 -top-1 w-4 h-4 bg-blue-400 rounded-full flex items-center justify-center cursor-pointer shadow-sm">
                                  <span className="text-[10px] font-bold text-blue-800">
                                    2
                                  </span>
                                </div>
                              </div>

                              <p>
                                The model achieves state-of-the-art performance
                                on machine translation tasks while being more
                                parallelizable and requiring significantly less
                                time to train.
                              </p>

                              <p className="text-gray-500 text-xs mt-8">
                                Page 1 of 12
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Annotations Sidebar */}
                      <div className="w-72 border-l bg-card overflow-y-auto">
                        <div className="p-4 border-b">
                          <h4 className="font-semibold flex items-center gap-2">
                            <Highlighter className="h-4 w-4" />
                            Annotations
                            <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                              2
                            </span>
                          </h4>
                        </div>
                        <div className="divide-y">
                          {/* Annotation Item 1 */}
                          <div className="p-3 hover:bg-muted/50 cursor-pointer">
                            <div className="flex items-start gap-2">
                              <div className="w-3 h-3 bg-yellow-400 rounded-full mt-1 shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                  Highlight
                                </p>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                  "The Transformer model"
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs text-muted-foreground">
                                    Page 1
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    • 2 min ago
                                  </span>
                                </div>
                              </div>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                className="p-1 hover:bg-destructive/10 text-destructive rounded"
                              >
                                <Trash2 className="h-3 w-3" />
                              </motion.button>
                            </div>
                          </div>
                          {/* Annotation Item 2 */}
                          <div className="p-3 hover:bg-muted/50 cursor-pointer">
                            <div className="flex items-start gap-2">
                              <div className="w-3 h-3 bg-blue-400 rounded-full mt-1 shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                  Underline
                                </p>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                  "Self-attention"
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs text-muted-foreground">
                                    Page 1
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    • 5 min ago
                                  </span>
                                </div>
                              </div>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                className="p-1 hover:bg-destructive/10 text-destructive rounded"
                              >
                                <Trash2 className="h-3 w-3" />
                              </motion.button>
                            </div>
                          </div>
                        </div>
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
                        onClick={() => setShowAIChat(!showAIChat)}
                        className="w-full py-2 bg-primary/10 text-primary rounded-lg text-sm inline-flex items-center justify-center gap-2"
                      >
                        <MessageCircle className="h-4 w-4" />
                        {showAIChat ? "Hide Chat" : "Chat with AI"}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* AI Chat Panel */}
            <AnimatePresence>
              {showAIChat && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-xl border bg-card shadow-sm overflow-hidden"
                >
                  <div className="p-4 border-b bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold flex items-center gap-2">
                        <div className="p-1.5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                        AI Research Assistant
                      </h3>
                      <div className="flex items-center gap-2">
                        {/* Model Selector */}
                        <div className="relative">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            onClick={() =>
                              setShowModelSelector(!showModelSelector)
                            }
                            className="inline-flex items-center gap-1.5 px-2 py-1 bg-background border rounded-lg text-xs font-medium"
                          >
                            <span>{currentModel?.icon}</span>
                            <span className="hidden sm:inline">
                              {currentModel?.label}
                            </span>
                            {currentModel?.tier === "premium" && (
                              <Crown className="h-3 w-3 text-yellow-500" />
                            )}
                            <ChevronDown className="h-3 w-3 text-muted-foreground" />
                          </motion.button>

                          <AnimatePresence>
                            {showModelSelector && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute right-0 mt-2 w-56 bg-card border rounded-xl shadow-xl z-50 overflow-hidden"
                              >
                                <div className="p-2">
                                  {AI_MODELS.map((model) => {
                                    const isLocked =
                                      model.tier === "premium" &&
                                      !isPremiumUser;
                                    return (
                                      <motion.button
                                        key={model.value}
                                        whileHover={{
                                          scale: isLocked ? 1 : 1.01,
                                        }}
                                        onClick={() => {
                                          if (!isLocked) {
                                            setSelectedModel(model.value);
                                            setShowModelSelector(false);
                                          }
                                        }}
                                        className={cn(
                                          "w-full p-2.5 rounded-lg text-left transition-colors",
                                          selectedModel === model.value
                                            ? "bg-primary/10"
                                            : isLocked
                                              ? "opacity-50 cursor-not-allowed"
                                              : "hover:bg-muted"
                                        )}
                                      >
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-2">
                                            <span>{model.icon}</span>
                                            <div>
                                              <div className="font-medium text-xs flex items-center gap-1.5">
                                                {model.label}
                                                {model.tier === "premium" && (
                                                  <span className="px-1.5 py-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-[9px] rounded-full font-semibold">
                                                    PRO
                                                  </span>
                                                )}
                                              </div>
                                              <p className="text-[10px] text-muted-foreground">
                                                {model.description}
                                              </p>
                                            </div>
                                          </div>
                                          {selectedModel === model.value && (
                                            <Check className="h-3.5 w-3.5 text-primary" />
                                          )}
                                        </div>
                                      </motion.button>
                                    );
                                  })}
                                </div>
                                {!isPremiumUser && (
                                  <div className="p-2 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-t">
                                    <p className="text-[10px] text-muted-foreground">
                                      Upgrade to Pro for premium models
                                    </p>
                                  </div>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setChatMessages([])}
                          className="p-1.5 rounded-md hover:bg-muted text-muted-foreground"
                          title="New Chat"
                        >
                          <Plus className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {/* Chat Messages */}
                  <div className="h-80 overflow-y-auto p-4 space-y-4">
                    {chatMessages.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center">
                        <div className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl mb-4">
                          <Sparkles className="h-8 w-8 text-purple-500" />
                        </div>
                        <h4 className="font-medium mb-2">
                          Ask about this paper
                        </h4>
                        <p className="text-sm text-muted-foreground max-w-[200px]">
                          I can help you understand the content, methodology,
                          and key findings.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2 justify-center">
                          {[
                            "Summarize key findings",
                            "Explain methodology",
                            "List limitations",
                          ].map((suggestion) => (
                            <motion.button
                              key={suggestion}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => {
                                setChatInput(suggestion);
                              }}
                              className="text-xs px-3 py-1.5 bg-muted rounded-full hover:bg-muted/80"
                            >
                              {suggestion}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      chatMessages.map((message) => (
                        <div
                          key={message.id}
                          className={cn(
                            "flex gap-3",
                            message.role === "user" ? "flex-row-reverse" : ""
                          )}
                        >
                          <div
                            className={cn(
                              "flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center",
                              message.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-gradient-to-br from-purple-500 to-pink-500"
                            )}
                          >
                            {message.role === "user" ? (
                              <User className="h-4 w-4" />
                            ) : (
                              <Bot className="h-4 w-4 text-white" />
                            )}
                          </div>
                          <div
                            className={cn(
                              "flex-1 rounded-2xl p-3 max-w-[85%]",
                              message.role === "user"
                                ? "bg-primary text-primary-foreground ml-auto"
                                : "bg-muted"
                            )}
                          >
                            <p className="text-sm whitespace-pre-wrap leading-relaxed">
                              {message.content}
                            </p>
                            {message.role === "assistant" && (
                              <div className="flex items-center gap-1 mt-2 pt-2 border-t border-border/50">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  className="p-1 hover:bg-background rounded text-muted-foreground"
                                >
                                  <Copy className="h-3 w-3" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  className="p-1 hover:bg-background rounded text-muted-foreground"
                                >
                                  <ThumbsUp className="h-3 w-3" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  className="p-1 hover:bg-background rounded text-muted-foreground"
                                >
                                  <ThumbsDown className="h-3 w-3" />
                                </motion.button>
                                <span className="text-[10px] text-muted-foreground ml-auto">
                                  {formatTime(message.timestamp)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Chat Input */}
                  <div className="p-4 border-t bg-muted/20">
                    <div className="relative bg-background rounded-xl border focus-within:border-primary transition-colors">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && chatInput.trim()) {
                            const newMessage = {
                              id: `user-${Date.now()}`,
                              role: "user" as const,
                              content: chatInput,
                              timestamp: new Date(),
                            };
                            setChatMessages([...chatMessages, newMessage]);
                            setChatInput("");
                            // Simulate AI response after a short delay
                            setTimeout(() => {
                              const aiResponse = {
                                id: `ai-${Date.now()}`,
                                role: "assistant" as const,
                                content:
                                  "I'm analyzing your question about the paper. Based on the Transformer architecture described in this paper, the key innovation is the self-attention mechanism that allows the model to weigh the importance of different parts of the input sequence when producing each element of the output.",
                                timestamp: new Date(),
                              };
                              setChatMessages((prev) => [...prev, aiResponse]);
                            }, 1000);
                          }
                        }}
                        placeholder="Ask about this paper..."
                        className="w-full px-4 py-3 pr-12 bg-transparent text-sm rounded-xl focus:outline-none"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          if (chatInput.trim()) {
                            const newMessage = {
                              id: `user-${Date.now()}`,
                              role: "user" as const,
                              content: chatInput,
                              timestamp: new Date(),
                            };
                            setChatMessages([...chatMessages, newMessage]);
                            setChatInput("");
                            setTimeout(() => {
                              const aiResponse = {
                                id: `ai-${Date.now()}`,
                                role: "assistant" as const,
                                content:
                                  "I'm analyzing your question about the paper. Based on the Transformer architecture described in this paper, the key innovation is the self-attention mechanism that allows the model to weigh the importance of different parts of the input sequence when producing each element of the output.",
                                timestamp: new Date(),
                              };
                              setChatMessages((prev) => [...prev, aiResponse]);
                            }, 1000);
                          }
                        }}
                        disabled={!chatInput.trim()}
                        className={cn(
                          "absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors",
                          chatInput.trim()
                            ? "bg-primary text-white hover:bg-primary/90"
                            : "bg-muted text-muted-foreground cursor-not-allowed"
                        )}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </motion.button>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-2 text-center flex items-center justify-center gap-1">
                      <Zap className="h-3 w-3" />
                      Powered by {currentModel?.label}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

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
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
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
