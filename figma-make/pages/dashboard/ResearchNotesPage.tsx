"use client";

/**
 * ResearchNotesPage - Enhanced Research Notes with Rich Text Editing
 *
 * Features:
 * - Rich text editing with LaTeX/Markdown support
 * - Paper linking sidebar
 * - AI note summarization
 * - Real-time collaboration indicators
 * - Note folders and organization
 * - Framer Motion animations
 */

import {
  Bold,
  BookOpen,
  Brain,
  Check,
  Code,
  Edit3,
  ExternalLink,
  Eye,
  FileText,
  Globe,
  Hash,
  Heading1,
  Heading2,
  Image,
  Italic,
  Link2,
  List,
  ListOrdered,
  Lock,
  Plus,
  Quote,
  Search,
  Settings,
  Sparkles,
  Star,
  Table,
  Underline,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import React, { useMemo, useState } from "react";
import { useRole, type UserRole } from "../../components/context";
import { DashboardLayout } from "../../components/layout/DashboardLayout";

// ============================================================================
// Types
// ============================================================================
interface ResearchNotesPageProps {
  onNavigate?: (path: string) => void;
  role?: UserRole;
}

type NoteType = "quick" | "literature" | "methodology" | "findings" | "idea";
type NoteVisibility = "private" | "workspace" | "public";

interface ResearchNote {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  type: NoteType;
  visibility: NoteVisibility;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  linkedPapers: { id: string; title: string }[];
  linkedCollections: { id: string; name: string }[];
  wordCount: number;
  isStarred: boolean;
  author: { name: string; avatar?: string };
  aiGenerated?: boolean;
  collaborators?: { name: string; avatar?: string; online?: boolean }[];
}

interface NoteFolder {
  id: string;
  name: string;
  icon: string;
  notesCount: number;
  color: string;
}

interface LinkedPaper {
  id: string;
  title: string;
  authors: string[];
  year: number;
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

const noteTypeConfig: Record<
  NoteType,
  { label: string; color: string; icon: React.ElementType }
> = {
  quick: {
    label: "Quick Note",
    color: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
    icon: FileText,
  },
  literature: {
    label: "Literature Review",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    icon: BookOpen,
  },
  methodology: {
    label: "Methodology",
    color:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    icon: Settings,
  },
  findings: {
    label: "Findings",
    color:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    icon: Sparkles,
  },
  idea: {
    label: "Research Idea",
    color:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    icon: Brain,
  },
};

const visibilityConfig: Record<
  NoteVisibility,
  { label: string; icon: React.ElementType }
> = {
  private: { label: "Private", icon: Lock },
  workspace: { label: "Workspace", icon: Users },
  public: { label: "Public", icon: Globe },
};

const sampleNotes: ResearchNote[] = [
  {
    id: "1",
    title: "Key Insights from Transformer Architecture Paper",
    content:
      "# Transformer Architecture Analysis\n\n## Key Components\n\nThe attention mechanism allows the model to focus on relevant parts of the input...\n\n### Mathematical Formulation\n\n$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$$\n\n## Implications\n\n- Enables parallel processing\n- Captures long-range dependencies",
    excerpt:
      "Comprehensive notes on the foundational transformer paper, highlighting key architectural decisions...",
    type: "literature",
    visibility: "workspace",
    tags: ["transformers", "attention", "deep-learning", "NLP"],
    createdAt: "2025-01-10T14:30:00Z",
    updatedAt: "2025-01-10T16:45:00Z",
    linkedPapers: [
      { id: "p1", title: "Attention Is All You Need" },
      {
        id: "p2",
        title: "BERT: Pre-training of Deep Bidirectional Transformers",
      },
    ],
    linkedCollections: [{ id: "c1", name: "NLP Foundations" }],
    wordCount: 1847,
    isStarred: true,
    author: {
      name: "Dr. Sarah Chen",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    },
    collaborators: [
      {
        name: "Emily Watson",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
        online: true,
      },
    ],
  },
  {
    id: "2",
    title: "Experiment Design: Fine-tuning LLMs",
    content:
      "# Experiment Protocol\n\n## Hypothesis\nParameter-efficient fine-tuning methods can achieve comparable performance...",
    excerpt:
      "Detailed methodology for upcoming experiments comparing LoRA, prefix tuning, and full fine-tuning...",
    type: "methodology",
    visibility: "private",
    tags: ["experiments", "fine-tuning", "LLM", "methodology"],
    createdAt: "2025-01-09T10:15:00Z",
    updatedAt: "2025-01-10T09:30:00Z",
    linkedPapers: [
      { id: "p3", title: "LoRA: Low-Rank Adaptation of Large Language Models" },
    ],
    linkedCollections: [],
    wordCount: 2341,
    isStarred: false,
    author: { name: "Dr. Sarah Chen" },
  },
  {
    id: "3",
    title: "Preliminary Results: Model Comparison Study",
    content:
      "# Initial Findings\n\n## Performance Metrics\n\n| Model | Accuracy | F1 Score |\n|-------|----------|----------|\n| BERT | 92.3% | 0.91 |\n| GPT-3 | 94.1% | 0.93 |",
    excerpt:
      "Early results from comparing transformer variants on downstream tasks...",
    type: "findings",
    visibility: "workspace",
    tags: ["results", "analysis", "comparison"],
    createdAt: "2025-01-08T16:00:00Z",
    updatedAt: "2025-01-09T11:20:00Z",
    linkedPapers: [],
    linkedCollections: [{ id: "c2", name: "PhD Thesis" }],
    wordCount: 892,
    isStarred: true,
    author: { name: "Dr. Sarah Chen" },
  },
  {
    id: "4",
    title: "Idea: Cross-lingual Knowledge Transfer",
    content:
      "# Research Idea\n\n## Motivation\nWhat if we could leverage multilingual representations to improve low-resource languages?",
    excerpt:
      "Brainstorming session notes on potential research directions for cross-lingual NLP...",
    type: "idea",
    visibility: "private",
    tags: ["idea", "multilingual", "research-direction"],
    createdAt: "2025-01-07T09:00:00Z",
    updatedAt: "2025-01-07T09:45:00Z",
    linkedPapers: [],
    linkedCollections: [],
    wordCount: 456,
    isStarred: false,
    author: { name: "Dr. Sarah Chen" },
    aiGenerated: true,
  },
];

const sampleFolders: NoteFolder[] = [
  {
    id: "f1",
    name: "Literature Reviews",
    icon: "📚",
    notesCount: 12,
    color: "bg-blue-500",
  },
  {
    id: "f2",
    name: "Research Ideas",
    icon: "💡",
    notesCount: 8,
    color: "bg-purple-500",
  },
  {
    id: "f3",
    name: "Methodology",
    icon: "🔬",
    notesCount: 5,
    color: "bg-green-500",
  },
  {
    id: "f4",
    name: "Findings",
    icon: "📊",
    notesCount: 15,
    color: "bg-yellow-500",
  },
];

const availablePapers: LinkedPaper[] = [
  {
    id: "p1",
    title: "Attention Is All You Need",
    authors: ["Vaswani et al."],
    year: 2017,
  },
  {
    id: "p2",
    title: "BERT: Pre-training of Deep Bidirectional Transformers",
    authors: ["Devlin et al."],
    year: 2018,
  },
  {
    id: "p3",
    title: "LoRA: Low-Rank Adaptation",
    authors: ["Hu et al."],
    year: 2021,
  },
  {
    id: "p4",
    title: "GPT-3: Language Models are Few-Shot Learners",
    authors: ["Brown et al."],
    year: 2020,
  },
];

// ============================================================================
// Utility Functions
// ============================================================================
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

// ============================================================================
// Editor Toolbar Component
// ============================================================================
const EditorToolbar: React.FC<{ onFormat: (type: string) => void }> = ({
  onFormat,
}) => {
  const tools = [
    { icon: Bold, label: "Bold", action: "bold" },
    { icon: Italic, label: "Italic", action: "italic" },
    { icon: Underline, label: "Underline", action: "underline" },
    { type: "divider" },
    { icon: Heading1, label: "Heading 1", action: "h1" },
    { icon: Heading2, label: "Heading 2", action: "h2" },
    { type: "divider" },
    { icon: List, label: "Bullet List", action: "ul" },
    { icon: ListOrdered, label: "Numbered List", action: "ol" },
    { icon: Quote, label: "Quote", action: "quote" },
    { type: "divider" },
    { icon: Code, label: "Code", action: "code" },
    { icon: Link2, label: "Link", action: "link" },
    { icon: Image, label: "Image", action: "image" },
    { icon: Table, label: "Table", action: "table" },
    { type: "divider" },
    { icon: Hash, label: "LaTeX", action: "latex" },
  ];

  return (
    <div className="flex items-center gap-1 p-2 border-b bg-muted/30 overflow-x-auto">
      {tools.map((tool, i) =>
        tool.type === "divider" ? (
          <div key={i} className="w-px h-6 bg-border mx-1" />
        ) : (
          <motion.button
            key={tool.action}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onFormat(tool.action!)}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            title={tool.label}
          >
            <tool.icon className="h-4 w-4" />
          </motion.button>
        )
      )}
    </div>
  );
};

// ============================================================================
// Paper Linking Sidebar Component
// ============================================================================
const PaperLinkingSidebar: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  linkedPapers: { id: string; title: string }[];
  onLink: (paper: LinkedPaper) => void;
  onUnlink: (paperId: string) => void;
}> = ({ isOpen, onClose, linkedPapers, onLink, onUnlink }) => {
  const [search, setSearch] = useState("");

  const filteredPapers = availablePapers.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) &&
      !linkedPapers.some((lp) => lp.id === p.id)
  );

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      className="w-80 border-l bg-background h-full flex flex-col"
    >
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Linked Papers
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search papers..."
            className="w-full pl-9 pr-4 py-2 border rounded-lg bg-background text-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Currently Linked */}
        {linkedPapers.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-2">
              LINKED ({linkedPapers.length})
            </h4>
            <div className="space-y-2">
              {linkedPapers.map((paper) => (
                <div
                  key={paper.id}
                  className="flex items-center justify-between p-2 bg-primary/5 border border-primary/20 rounded-lg"
                >
                  <span className="text-sm line-clamp-1 flex-1">
                    {paper.title}
                  </span>
                  <button
                    onClick={() => onUnlink(paper.id)}
                    className="p-1 hover:bg-muted rounded"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available to Link */}
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-2">
            AVAILABLE
          </h4>
          <div className="space-y-2">
            {filteredPapers.map((paper) => (
              <motion.button
                key={paper.id}
                whileHover={{ x: 2 }}
                onClick={() => onLink(paper)}
                className="w-full p-2 text-left hover:bg-muted rounded-lg transition-colors"
              >
                <p className="text-sm font-medium line-clamp-1">
                  {paper.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {paper.authors.join(", ")} • {paper.year}
                </p>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ============================================================================
// Research Notes Page Component
// ============================================================================
export function ResearchNotesPage({
  onNavigate,
  role: propRole,
}: ResearchNotesPageProps) {
  const { role: contextRole } = useRole();
  const effectiveRole = propRole ?? contextRole;
  const user = { ...defaultUser, role: effectiveRole };

  const isPremiumUser =
    effectiveRole === "pro_researcher" ||
    effectiveRole === "team_lead" ||
    effectiveRole === "admin";

  // State
  const [notes, setNotes] = useState(sampleNotes);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>("1");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<NoteType | "all">("all");
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [showPaperSidebar, setShowPaperSidebar] = useState(false);
  const [viewMode, setViewMode] = useState<"edit" | "preview">("preview");
  const [showAISummary, setShowAISummary] = useState(false);

  const selectedNote = notes.find((n) => n.id === selectedNoteId);

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      if (
        searchQuery &&
        !note.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false;
      if (typeFilter !== "all" && note.type !== typeFilter) return false;
      return true;
    });
  }, [notes, searchQuery, typeFilter]);

  const startEditing = (note: ResearchNote) => {
    setEditTitle(note.title);
    setEditContent(note.content);
    setIsEditing(true);
  };

  const saveNote = () => {
    if (!selectedNoteId) return;
    setNotes((prev) =>
      prev.map((n) =>
        n.id === selectedNoteId
          ? {
              ...n,
              title: editTitle,
              content: editContent,
              updatedAt: new Date().toISOString(),
            }
          : n
      )
    );
    setIsEditing(false);
  };

  const toggleStar = (noteId: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, isStarred: !n.isStarred } : n))
    );
  };

  const handleFormat = (type: string) => {
    // Placeholder for formatting logic
    console.log("Format:", type);
  };

  return (
    <DashboardLayout
      user={user}
      onNavigate={onNavigate}
      currentPath="/research/notes"
    >
      <div className="h-[calc(100vh-120px)] flex">
        {/* Sidebar - Notes List */}
        <div className="w-80 border-r flex flex-col">
          {/* Header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold flex items-center gap-2">
                <Edit3 className="h-5 w-5 text-primary" />
                Research Notes
              </h1>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-primary text-primary-foreground rounded-lg"
              >
                <Plus className="h-4 w-4" />
              </motion.button>
            </div>

            {/* Search */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes..."
                className="w-full pl-9 pr-4 py-2 border rounded-xl bg-background text-sm"
              />
            </div>

            {/* Type Filter - Enhanced Dropdown + Chips */}
            <div className="space-y-2">
              {/* Primary filter dropdown for mobile/compact */}
              <div className="flex items-center gap-2">
                <select
                  value={typeFilter}
                  onChange={(e) =>
                    setTypeFilter(e.target.value as NoteType | "all")
                  }
                  className="flex-1 px-3 py-2 border rounded-xl bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary sm:hidden"
                >
                  <option value="all">📋 All Notes</option>
                  <option value="quick">📝 Quick Notes</option>
                  <option value="literature">📚 Literature</option>
                  <option value="methodology">🔬 Methodology</option>
                  <option value="findings">✨ Findings</option>
                  <option value="idea">💡 Ideas</option>
                </select>

                {/* Desktop chips - hidden on small screens */}
                <div className="hidden sm:flex items-center gap-1.5 flex-wrap">
                  <button
                    onClick={() => setTypeFilter("all")}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200",
                      typeFilter === "all"
                        ? "bg-primary text-primary-foreground shadow-md scale-105"
                        : "bg-muted hover:bg-muted/80 hover:scale-102"
                    )}
                  >
                    📋 All
                  </button>
                  {(Object.keys(noteTypeConfig) as NoteType[]).map((type) => {
                    const config = noteTypeConfig[type];
                    const TypeIcon = config.icon;
                    const emoji =
                      type === "quick"
                        ? "📝"
                        : type === "literature"
                          ? "📚"
                          : type === "methodology"
                            ? "🔬"
                            : type === "findings"
                              ? "✨"
                              : "💡";
                    return (
                      <button
                        key={type}
                        onClick={() => setTypeFilter(type)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1",
                          typeFilter === type
                            ? "bg-primary text-primary-foreground shadow-md scale-105"
                            : "bg-muted hover:bg-muted/80 hover:scale-102"
                        )}
                      >
                        <span>{emoji}</span>
                        <span className="hidden md:inline">
                          {config.label.split(" ")[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active filter indicator */}
              {typeFilter !== "all" && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 px-2 py-1 bg-primary/10 rounded-lg text-xs"
                >
                  <span className="text-primary font-medium">
                    Showing:{" "}
                    {noteTypeConfig[typeFilter as NoteType]?.label || "All"}
                  </span>
                  <button
                    onClick={() => setTypeFilter("all")}
                    className="p-0.5 hover:bg-primary/20 rounded"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </motion.div>
              )}
            </div>
          </div>

          {/* Folders */}
          <div className="p-3 border-b">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {sampleFolders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() =>
                    setSelectedFolder(
                      folder.id === selectedFolder ? null : folder.id
                    )
                  }
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors",
                    selectedFolder === folder.id
                      ? "bg-primary/10 border border-primary/30"
                      : "bg-muted/50 hover:bg-muted"
                  )}
                >
                  <span>{folder.icon}</span>
                  <span className="font-medium">{folder.notesCount}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Notes List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredNotes.map((note, index) => {
              const TypeIcon = noteTypeConfig[note.type].icon;
              const VisIcon = visibilityConfig[note.visibility].icon;
              return (
                <motion.button
                  key={note.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedNoteId(note.id)}
                  className={cn(
                    "w-full p-3 rounded-xl text-left transition-all",
                    selectedNoteId === note.id
                      ? "bg-primary/10 border border-primary/30"
                      : "hover:bg-muted"
                  )}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-medium text-sm line-clamp-1 flex-1">
                      {note.title}
                    </h3>
                    {note.isStarred && (
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                    {note.excerpt}
                  </p>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "px-1.5 py-0.5 rounded text-xs",
                        noteTypeConfig[note.type].color
                      )}
                    >
                      {noteTypeConfig[note.type].label.split(" ")[0]}
                    </span>
                    <VisIcon className="h-3 w-3 text-muted-foreground" />
                    {note.aiGenerated && (
                      <Sparkles className="h-3 w-3 text-purple-500" />
                    )}
                    {note.collaborators && note.collaborators.length > 0 && (
                      <div className="flex -space-x-1">
                        {note.collaborators.slice(0, 2).map((c, i) => (
                          <div
                            key={i}
                            className={cn(
                              "w-4 h-4 rounded-full border-2 border-background bg-muted",
                              c.online && "ring-2 ring-green-500"
                            )}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Main Content - Note Editor/Viewer */}
        <div className="flex-1 flex flex-col">
          {selectedNote ? (
            <>
              {/* Note Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "p-2 rounded-lg",
                      noteTypeConfig[selectedNote.type].color
                    )}
                  >
                    {React.createElement(
                      noteTypeConfig[selectedNote.type].icon,
                      { className: "h-5 w-5" }
                    )}
                  </div>
                  <div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="text-xl font-semibold bg-transparent border-b border-dashed focus:outline-none focus:border-primary"
                      />
                    ) : (
                      <h2 className="text-xl font-semibold">
                        {selectedNote.title}
                      </h2>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Updated{" "}
                      {new Date(selectedNote.updatedAt).toLocaleDateString()} •{" "}
                      {selectedNote.wordCount} words
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Collaborators */}
                  {selectedNote.collaborators &&
                    selectedNote.collaborators.length > 0 && (
                      <div className="flex items-center gap-1 mr-2">
                        {selectedNote.collaborators.map((c, i) => (
                          <div
                            key={i}
                            className={cn(
                              "w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-medium",
                              c.online && "ring-2 ring-green-500"
                            )}
                            title={`${c.name}${c.online ? " (online)" : ""}`}
                          >
                            {c.name.charAt(0)}
                          </div>
                        ))}
                      </div>
                    )}

                  <button
                    onClick={() => toggleStar(selectedNote.id)}
                    className="p-2 hover:bg-muted rounded-lg"
                  >
                    <Star
                      className={cn(
                        "h-5 w-5",
                        selectedNote.isStarred &&
                          "text-yellow-500 fill-yellow-500"
                      )}
                    />
                  </button>

                  <button
                    onClick={() => setShowPaperSidebar(!showPaperSidebar)}
                    className={cn(
                      "p-2 rounded-lg",
                      showPaperSidebar
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    )}
                  >
                    <Link2 className="h-5 w-5" />
                  </button>

                  {/* View/Edit Toggle */}
                  <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
                    <button
                      onClick={() => {
                        setViewMode("edit");
                        if (!isEditing) startEditing(selectedNote);
                      }}
                      className={cn(
                        "px-3 py-1.5 rounded text-sm font-medium",
                        viewMode === "edit" && "bg-background shadow"
                      )}
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        setViewMode("preview");
                        setIsEditing(false);
                      }}
                      className={cn(
                        "px-3 py-1.5 rounded text-sm font-medium",
                        viewMode === "preview" && "bg-background shadow"
                      )}
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>

                  {isEditing && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={saveNote}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium flex items-center gap-2"
                    >
                      <Check className="h-4 w-4" />
                      Save
                    </motion.button>
                  )}

                  {/* AI Summary */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAISummary(!showAISummary)}
                    className="px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium flex items-center gap-2 text-sm"
                  >
                    <Sparkles className="h-4 w-4" />
                    AI Summary
                    {!isPremiumUser && (
                      <span className="px-1.5 py-0.5 bg-white/20 rounded text-xs">
                        PRO
                      </span>
                    )}
                  </motion.button>
                </div>
              </div>

              {/* AI Summary Panel */}
              <AnimatePresence>
                {showAISummary && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-b"
                  >
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                          <Brain className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-1">
                            AI Summary
                          </h4>
                          <p className="text-sm text-purple-700 dark:text-purple-300">
                            This note discusses the transformer architecture,
                            focusing on the attention mechanism and its
                            mathematical formulation. Key insights include how
                            attention enables parallel processing and captures
                            long-range dependencies more effectively than RNNs.
                            The note references 2 papers from your NLP
                            Foundations collection.
                          </p>
                        </div>
                        <button
                          onClick={() => setShowAISummary(false)}
                          className="p-1 hover:bg-white/50 rounded"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Editor Toolbar */}
              {isEditing && <EditorToolbar onFormat={handleFormat} />}

              {/* Note Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6 max-w-4xl mx-auto">
                  {isEditing ? (
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full h-full min-h-[500px] bg-transparent resize-none focus:outline-none font-mono text-sm leading-relaxed"
                      placeholder="Start writing your research notes..."
                    />
                  ) : (
                    <div className="prose dark:prose-invert max-w-none">
                      {/* Simple markdown-like rendering */}
                      {selectedNote.content.split("\n").map((line, i) => {
                        if (line.startsWith("# "))
                          return (
                            <h1
                              key={i}
                              className="text-2xl font-bold mt-6 mb-4"
                            >
                              {line.slice(2)}
                            </h1>
                          );
                        if (line.startsWith("## "))
                          return (
                            <h2
                              key={i}
                              className="text-xl font-semibold mt-4 mb-3"
                            >
                              {line.slice(3)}
                            </h2>
                          );
                        if (line.startsWith("### "))
                          return (
                            <h3
                              key={i}
                              className="text-lg font-medium mt-3 mb-2"
                            >
                              {line.slice(4)}
                            </h3>
                          );
                        if (line.startsWith("- "))
                          return (
                            <li key={i} className="ml-4">
                              {line.slice(2)}
                            </li>
                          );
                        if (line.startsWith("$$") && line.endsWith("$$")) {
                          return (
                            <div
                              key={i}
                              className="p-4 bg-muted rounded-lg font-mono text-sm my-4"
                            >
                              {line}
                            </div>
                          );
                        }
                        if (line.startsWith("|"))
                          return (
                            <div key={i} className="font-mono text-sm">
                              {line}
                            </div>
                          );
                        if (line === "") return <br key={i} />;
                        return (
                          <p key={i} className="my-2">
                            {line}
                          </p>
                        );
                      })}
                    </div>
                  )}

                  {/* Linked Papers Section */}
                  {selectedNote.linkedPapers.length > 0 && !isEditing && (
                    <div className="mt-8 pt-6 border-t">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Linked Papers
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedNote.linkedPapers.map((paper) => (
                          <span
                            key={paper.id}
                            className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm flex items-center gap-2"
                          >
                            <FileText className="h-3 w-3" />
                            {paper.title}
                            <ExternalLink className="h-3 w-3 cursor-pointer hover:text-blue-900" />
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {selectedNote.tags.length > 0 && !isEditing && (
                    <div className="mt-4">
                      <div className="flex flex-wrap gap-2">
                        {selectedNote.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-muted rounded-full text-xs text-muted-foreground flex items-center gap-1"
                          >
                            <Hash className="h-3 w-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center p-8">
              <div>
                <Edit3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                <h3 className="text-xl font-semibold mb-2">No Note Selected</h3>
                <p className="text-muted-foreground mb-4">
                  Select a note from the sidebar or create a new one
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-xl font-medium flex items-center gap-2 mx-auto"
                >
                  <Plus className="h-4 w-4" />
                  Create Note
                </motion.button>
              </div>
            </div>
          )}
        </div>

        {/* Paper Linking Sidebar */}
        <AnimatePresence>
          {showPaperSidebar && selectedNote && (
            <PaperLinkingSidebar
              isOpen={showPaperSidebar}
              onClose={() => setShowPaperSidebar(false)}
              linkedPapers={selectedNote.linkedPapers}
              onLink={(paper) => {
                setNotes((prev) =>
                  prev.map((n) =>
                    n.id === selectedNoteId
                      ? {
                          ...n,
                          linkedPapers: [
                            ...n.linkedPapers,
                            { id: paper.id, title: paper.title },
                          ],
                        }
                      : n
                  )
                );
              }}
              onUnlink={(paperId) => {
                setNotes((prev) =>
                  prev.map((n) =>
                    n.id === selectedNoteId
                      ? {
                          ...n,
                          linkedPapers: n.linkedPapers.filter(
                            (p) => p.id !== paperId
                          ),
                        }
                      : n
                  )
                );
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}

export default ResearchNotesPage;
