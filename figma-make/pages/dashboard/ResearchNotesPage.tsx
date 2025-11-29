"use client";

import {
  BookOpen,
  CheckCircle,
  Clock,
  Edit3,
  FileText,
  FolderOpen,
  Globe,
  Lightbulb,
  Link2,
  Lock,
  Plus,
  Search,
  Sparkles,
  Star,
  Trash2,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Button } from "../../components/ui/button";

// ============================================================================
// Types
// ============================================================================
interface ResearchNotesPageProps {
  role?: "researcher" | "pro_researcher" | "team_lead" | "admin";
  onNavigate?: (path: string) => void;
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
  linkedPapers: Array<{ id: string; title: string }>;
  linkedCollections: Array<{ id: string; name: string }>;
  wordCount: number;
  isStarred: boolean;
  author: {
    name: string;
    avatar?: string;
  };
  aiGenerated?: boolean;
}

interface NoteFolder {
  id: string;
  name: string;
  icon: string;
  notesCount: number;
  color: string;
}

// ============================================================================
// Sample Data
// ============================================================================
const sampleNotes: ResearchNote[] = [
  {
    id: "1",
    title: "Key Insights from Transformer Architecture Paper",
    content:
      "The attention mechanism allows the model to focus on relevant parts of the input...",
    excerpt:
      "Comprehensive notes on the foundational transformer paper, highlighting key architectural decisions and their implications for modern NLP systems.",
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
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    },
  },
  {
    id: "2",
    title: "Experiment Design: Fine-tuning LLMs",
    content:
      "Hypothesis: Parameter-efficient fine-tuning methods can achieve comparable...",
    excerpt:
      "Detailed methodology for upcoming experiments comparing LoRA, prefix tuning, and full fine-tuning approaches.",
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
    author: {
      name: "Dr. Sarah Chen",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    },
  },
  {
    id: "3",
    title: "Preliminary Results: Model Comparison Study",
    content:
      "Initial findings show that the proposed approach outperforms baselines...",
    excerpt:
      "Early results from comparing transformer variants on downstream tasks. Key observations and next steps outlined.",
    type: "findings",
    visibility: "workspace",
    tags: ["results", "analysis", "comparison"],
    createdAt: "2025-01-08T16:00:00Z",
    updatedAt: "2025-01-09T11:20:00Z",
    linkedPapers: [],
    linkedCollections: [{ id: "c2", name: "PhD Thesis" }],
    wordCount: 892,
    isStarred: true,
    author: {
      name: "Dr. Sarah Chen",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    },
  },
  {
    id: "4",
    title: "Idea: Cross-lingual Knowledge Transfer",
    content:
      "What if we could leverage multilingual representations to improve...",
    excerpt:
      "Brainstorming session notes on potential research directions for cross-lingual NLP applications.",
    type: "idea",
    visibility: "private",
    tags: ["idea", "multilingual", "research-direction"],
    createdAt: "2025-01-07T09:00:00Z",
    updatedAt: "2025-01-07T09:45:00Z",
    linkedPapers: [],
    linkedCollections: [],
    wordCount: 456,
    isStarred: false,
    author: {
      name: "Dr. Sarah Chen",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    },
    aiGenerated: true,
  },
  {
    id: "5",
    title: "Meeting Notes: Lab Discussion Jan 5",
    content: "Discussed ongoing projects and upcoming deadlines...",
    excerpt:
      "Summary of weekly lab meeting covering project updates, paper submissions, and conference planning.",
    type: "quick",
    visibility: "workspace",
    tags: ["meeting", "lab", "planning"],
    createdAt: "2025-01-05T14:00:00Z",
    updatedAt: "2025-01-05T15:30:00Z",
    linkedPapers: [],
    linkedCollections: [],
    wordCount: 723,
    isStarred: false,
    author: {
      name: "Emily Watson",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    },
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
    name: "Experiment Logs",
    icon: "🧪",
    notesCount: 8,
    color: "bg-green-500",
  },
  {
    id: "f3",
    name: "Ideas & Brainstorms",
    icon: "💡",
    notesCount: 15,
    color: "bg-yellow-500",
  },
  {
    id: "f4",
    name: "Meeting Notes",
    icon: "📝",
    notesCount: 6,
    color: "bg-purple-500",
  },
  {
    id: "f5",
    name: "Thesis Draft",
    icon: "📖",
    notesCount: 4,
    color: "bg-red-500",
  },
];

// ============================================================================
// Helper Functions
// ============================================================================
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateString);
}

function getNoteTypeIcon(type: NoteType): React.ReactNode {
  const icons = {
    quick: <FileText className="h-4 w-4" />,
    literature: <BookOpen className="h-4 w-4" />,
    methodology: <TrendingUp className="h-4 w-4" />,
    findings: <CheckCircle className="h-4 w-4" />,
    idea: <Lightbulb className="h-4 w-4" />,
  };
  return icons[type];
}

function getNoteTypeColor(type: NoteType): string {
  const colors = {
    quick: "bg-gray-500/10 text-gray-600 border-gray-200",
    literature: "bg-blue-500/10 text-blue-600 border-blue-200",
    methodology: "bg-green-500/10 text-green-600 border-green-200",
    findings: "bg-purple-500/10 text-purple-600 border-purple-200",
    idea: "bg-yellow-500/10 text-yellow-600 border-yellow-200",
  };
  return colors[type];
}

function getNoteTypeLabel(type: NoteType): string {
  const labels = {
    quick: "Quick Note",
    literature: "Literature",
    methodology: "Methodology",
    findings: "Findings",
    idea: "Idea",
  };
  return labels[type];
}

function getVisibilityIcon(visibility: NoteVisibility): React.ReactNode {
  const icons = {
    private: <Lock className="h-3 w-3" />,
    workspace: <Users className="h-3 w-3" />,
    public: <Globe className="h-3 w-3" />,
  };
  return icons[visibility];
}

// ============================================================================
// Research Notes Page Component
// ============================================================================
export function ResearchNotesPage({
  role = "researcher",
  onNavigate,
}: ResearchNotesPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<NoteType | "all">("all");
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [showNewNoteModal, setShowNewNoteModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState<ResearchNote | null>(null);
  const [starredNotes, setStarredNotes] = useState<Set<string>>(
    new Set(sampleNotes.filter((n) => n.isStarred).map((n) => n.id))
  );

  const user = {
    name: "Dr. Sarah Chen",
    email: "sarah.chen@university.edu",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    role: role,
  };

  // Filter notes
  const filteredNotes = sampleNotes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesType = selectedType === "all" || note.type === selectedType;
    return matchesSearch && matchesType;
  });

  const toggleStar = (noteId: string) => {
    setStarredNotes((prev) => {
      const next = new Set(prev);
      if (next.has(noteId)) {
        next.delete(noteId);
      } else {
        next.add(noteId);
      }
      return next;
    });
  };

  const totalWordCount = sampleNotes.reduce(
    (acc, note) => acc + note.wordCount,
    0
  );

  return (
    <DashboardLayout user={user} onNavigate={onNavigate}>
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <div className="w-64 border-r bg-muted/30 p-4 hidden lg:block">
          <div className="space-y-6">
            {/* New Note Button */}
            <Button
              className="w-full"
              onClick={() => setShowNewNoteModal(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Note
            </Button>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-card border p-3 text-center">
                <p className="text-2xl font-bold">{sampleNotes.length}</p>
                <p className="text-xs text-muted-foreground">Total Notes</p>
              </div>
              <div className="rounded-lg bg-card border p-3 text-center">
                <p className="text-2xl font-bold">
                  {(totalWordCount / 1000).toFixed(1)}k
                </p>
                <p className="text-xs text-muted-foreground">Words</p>
              </div>
            </div>

            {/* Folders */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Folders
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedFolder(null)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedFolder === null
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  <FolderOpen className="h-4 w-4" />
                  All Notes
                </button>
                {sampleFolders.map((folder) => (
                  <button
                    key={folder.id}
                    onClick={() => setSelectedFolder(folder.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedFolder === folder.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{folder.icon}</span>
                      <span className="truncate">{folder.name}</span>
                    </div>
                    <span className="text-xs opacity-70">
                      {folder.notesCount}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Note Types */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Note Types
              </h3>
              <div className="space-y-1">
                {(
                  [
                    "all",
                    "quick",
                    "literature",
                    "methodology",
                    "findings",
                    "idea",
                  ] as const
                ).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedType === type
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted"
                    }`}
                  >
                    {type === "all" ? (
                      <FileText className="h-4 w-4" />
                    ) : (
                      getNoteTypeIcon(type)
                    )}
                    <span>
                      {type === "all" ? "All Types" : getNoteTypeLabel(type)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tags Cloud */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Popular Tags
              </h3>
              <div className="flex flex-wrap gap-1">
                {[
                  "transformers",
                  "NLP",
                  "experiments",
                  "ideas",
                  "methodology",
                ].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="px-2 py-1 rounded bg-muted text-xs hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">Research Notes</h1>
                <p className="text-muted-foreground mt-1">
                  Organize your thoughts, findings, and ideas
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  List
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  Grid
                </Button>
                <Button
                  className="lg:hidden"
                  onClick={() => setShowNewNoteModal(true)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search notes, tags, or content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div className="flex gap-2 lg:hidden">
                <select
                  value={selectedType}
                  onChange={(e) =>
                    setSelectedType(e.target.value as NoteType | "all")
                  }
                  className="px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="all">All Types</option>
                  <option value="quick">Quick Notes</option>
                  <option value="literature">Literature</option>
                  <option value="methodology">Methodology</option>
                  <option value="findings">Findings</option>
                  <option value="idea">Ideas</option>
                </select>
              </div>
            </div>

            {/* AI Suggestion */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl bg-gradient-to-r from-primary/5 to-chart-1/5 border border-primary/20 p-4"
            >
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">AI Suggestion</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Based on your recent papers, consider adding notes about
                    "attention mechanisms" and "model scaling laws" to your
                    literature review folder.
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Generate Notes
                </Button>
              </div>
            </motion.div>

            {/* Notes Grid/List */}
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredNotes.map((note, index) => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="rounded-xl border bg-card p-4 hover:shadow-md transition-all cursor-pointer group"
                    onClick={() => setSelectedNote(note)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${getNoteTypeColor(
                          note.type
                        )}`}
                      >
                        {getNoteTypeIcon(note.type)}
                        <span>{getNoteTypeLabel(note.type)}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStar(note.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Star
                          className={`h-4 w-4 ${
                            starredNotes.has(note.id)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground"
                          }`}
                        />
                      </button>
                    </div>

                    <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                      {note.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                      {note.excerpt}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {note.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded bg-muted text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {note.tags.length > 3 && (
                        <span className="px-2 py-0.5 rounded bg-muted text-xs">
                          +{note.tags.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        {getVisibilityIcon(note.visibility)}
                        <span>{note.wordCount} words</span>
                      </div>
                      <span>{formatRelativeTime(note.updatedAt)}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredNotes.map((note, index) => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="rounded-xl border bg-card p-4 hover:shadow-md transition-all cursor-pointer group"
                    onClick={() => setSelectedNote(note)}
                  >
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      {note.author.avatar ? (
                        <img
                          src={note.author.avatar}
                          alt={note.author.name}
                          className="h-10 w-10 rounded-full object-cover hidden sm:block"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center hidden sm:flex">
                          <span className="text-sm font-medium text-primary">
                            {note.author.name.charAt(0)}
                          </span>
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold line-clamp-1">
                                {note.title}
                              </h3>
                              {note.aiGenerated && (
                                <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-primary/10 text-primary text-xs">
                                  <Sparkles className="h-3 w-3" />
                                  AI
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                              {note.excerpt}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleStar(note.id);
                            }}
                          >
                            <Star
                              className={`h-5 w-5 ${
                                starredNotes.has(note.id)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted-foreground hover:text-yellow-400"
                              }`}
                            />
                          </button>
                        </div>

                        {/* Meta */}
                        <div className="flex items-center flex-wrap gap-3 mt-3 text-xs text-muted-foreground">
                          <div
                            className={`flex items-center gap-1 px-2 py-0.5 rounded-full border ${getNoteTypeColor(
                              note.type
                            )}`}
                          >
                            {getNoteTypeIcon(note.type)}
                            <span>{getNoteTypeLabel(note.type)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {getVisibilityIcon(note.visibility)}
                            <span className="capitalize">
                              {note.visibility}
                            </span>
                          </div>
                          <span>{note.wordCount} words</span>
                          <span>
                            Updated {formatRelativeTime(note.updatedAt)}
                          </span>
                          {note.linkedPapers.length > 0 && (
                            <span className="flex items-center gap-1">
                              <Link2 className="h-3 w-3" />
                              {note.linkedPapers.length} papers
                            </span>
                          )}
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {note.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 rounded bg-muted text-xs"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {filteredNotes.length === 0 && (
              <div className="rounded-xl border bg-card p-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">No notes found</p>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or filters
                </p>
                <Button onClick={() => setShowNewNoteModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Note
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Note Detail Panel */}
        <AnimatePresence>
          {selectedNote && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="w-96 border-l bg-card overflow-auto hidden xl:block"
            >
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="font-semibold">Note Details</h3>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedNote(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="p-4 space-y-6">
                {/* Title */}
                <div>
                  <h2 className="text-xl font-bold">{selectedNote.title}</h2>
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Updated {formatRelativeTime(selectedNote.updatedAt)}
                  </div>
                </div>

                {/* Type & Visibility */}
                <div className="flex items-center gap-2">
                  <div
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${getNoteTypeColor(
                      selectedNote.type
                    )}`}
                  >
                    {getNoteTypeIcon(selectedNote.type)}
                    <span>{getNoteTypeLabel(selectedNote.type)}</span>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-muted">
                    {getVisibilityIcon(selectedNote.visibility)}
                    <span className="capitalize">
                      {selectedNote.visibility}
                    </span>
                  </div>
                </div>

                {/* Excerpt */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Excerpt</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedNote.excerpt}
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <p className="text-lg font-bold">
                      {selectedNote.wordCount}
                    </p>
                    <p className="text-xs text-muted-foreground">Words</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <p className="text-lg font-bold">
                      {selectedNote.linkedPapers.length}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Linked Papers
                    </p>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedNote.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 rounded bg-muted text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                    <button className="px-2 py-1 rounded border border-dashed text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                      <Plus className="h-3 w-3 inline mr-1" />
                      Add Tag
                    </button>
                  </div>
                </div>

                {/* Linked Papers */}
                {selectedNote.linkedPapers.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Linked Papers</h4>
                    <div className="space-y-2">
                      {selectedNote.linkedPapers.map((paper) => (
                        <div
                          key={paper.id}
                          className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 text-sm"
                        >
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate">{paper.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Linked Collections */}
                {selectedNote.linkedCollections.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      Linked Collections
                    </h4>
                    <div className="space-y-2">
                      {selectedNote.linkedCollections.map((collection) => (
                        <div
                          key={collection.id}
                          className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 text-sm"
                        >
                          <FolderOpen className="h-4 w-4 text-muted-foreground" />
                          <span>{collection.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Author */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Author</h4>
                  <div className="flex items-center gap-3">
                    {selectedNote.author.avatar ? (
                      <img
                        src={selectedNote.author.avatar}
                        alt={selectedNote.author.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {selectedNote.author.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <span className="text-sm">{selectedNote.author.name}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t space-y-2">
                  <Button className="w-full">
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Note
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Note
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* New Note Modal */}
      <AnimatePresence>
        {showNewNoteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowNewNoteModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card rounded-xl border shadow-lg w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Create New Note</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNewNoteModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    placeholder="Note title..."
                    className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <div className="grid grid-cols-5 gap-2">
                    {(
                      [
                        "quick",
                        "literature",
                        "methodology",
                        "findings",
                        "idea",
                      ] as NoteType[]
                    ).map((type) => (
                      <button
                        key={type}
                        className="flex flex-col items-center gap-1 p-3 rounded-lg border hover:border-primary hover:bg-primary/5 transition-colors"
                      >
                        {getNoteTypeIcon(type)}
                        <span className="text-xs">
                          {getNoteTypeLabel(type)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Content
                  </label>
                  <textarea
                    placeholder="Start writing..."
                    rows={6}
                    className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tags</label>
                  <input
                    type="text"
                    placeholder="Add tags separated by commas..."
                    className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 p-4 border-t">
                <Button
                  variant="ghost"
                  onClick={() => setShowNewNoteModal(false)}
                >
                  Cancel
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Note
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
