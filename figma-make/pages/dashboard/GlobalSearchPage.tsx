"use client";

/**
 * GlobalSearchPage - Enhanced Global Search with Deep Research
 *
 * Features:
 * - Deep Research mode with AI conversation threads
 * - Semantic search across all content types
 * - Advanced filters with date/type/author
 * - Search result grouping by type
 * - AI-powered search suggestions
 * - Recent searches & saved searches
 * - Framer Motion animations
 */

import {
  ArrowRight,
  Bookmark,
  BookOpen,
  Bot,
  Brain,
  Calendar,
  Check,
  ChevronDown,
  FileText,
  Filter,
  FolderOpen,
  History,
  Lightbulb,
  Loader2,
  MessageSquare,
  Plus,
  Save,
  Search,
  Send,
  Sliders,
  Sparkles,
  Star,
  Tag,
  TrendingUp,
  User,
  Users,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useRef, useState } from "react";
import { useRole, type UserRole } from "../../components/context";
import { DashboardLayout } from "../../components/layout/DashboardLayout";

// ============================================================================
// Types
// ============================================================================
interface GlobalSearchPageProps {
  onNavigate?: (path: string) => void;
  role?: UserRole;
  initialQuery?: string;
}

type SearchResultType =
  | "paper"
  | "annotation"
  | "collection"
  | "note"
  | "discussion"
  | "ai-thread";

interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  description: string;
  matches: string[];
  metadata: {
    authors?: string[];
    collection?: string;
    date?: string;
    tags?: string[];
    relevanceScore?: number;
  };
}

interface DeepResearchMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: { title: string; id: string }[];
  timestamp: string;
}

interface RecentSearch {
  id: string;
  query: string;
  timestamp: string;
  resultsCount: number;
}

interface SavedSearch {
  id: string;
  query: string;
  name: string;
  filters: Record<string, string>;
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

const typeIcons: Record<SearchResultType, React.ElementType> = {
  paper: FileText,
  annotation: MessageSquare,
  collection: FolderOpen,
  note: BookOpen,
  discussion: Users,
  "ai-thread": Sparkles,
};

const typeColors: Record<SearchResultType, string> = {
  paper: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  annotation:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  collection:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  note: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  discussion:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  "ai-thread":
    "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
};

const sampleResults: SearchResult[] = [
  {
    id: "r1",
    type: "paper",
    title: "Attention Is All You Need",
    description:
      "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks...",
    matches: ["attention mechanism", "transformer architecture"],
    metadata: {
      authors: ["Vaswani, A.", "Shazeer, N."],
      date: "2017-06-12",
      tags: ["transformers", "NLP"],
      relevanceScore: 98,
    },
  },
  {
    id: "r2",
    type: "annotation",
    title: "Key insight on multi-head attention",
    description:
      "The attention mechanism allows the model to jointly attend to information from different representation subspaces...",
    matches: ["multi-head attention"],
    metadata: {
      collection: "NLP Foundations",
      date: "2025-01-10",
      relevanceScore: 95,
    },
  },
  {
    id: "r3",
    type: "paper",
    title: "BERT: Pre-training of Deep Bidirectional Transformers",
    description:
      "We introduce a new language representation model called BERT, which stands for Bidirectional Encoder...",
    matches: ["BERT", "pre-training"],
    metadata: {
      authors: ["Devlin, J.", "Chang, M."],
      date: "2018-10-11",
      tags: ["BERT", "NLP"],
      relevanceScore: 92,
    },
  },
  {
    id: "r4",
    type: "collection",
    title: "Transformer Architecture Papers",
    description:
      "A curated collection of foundational papers on transformer architectures and attention mechanisms.",
    matches: ["transformer", "architecture"],
    metadata: {
      date: "2025-01-08",
      tags: ["transformers"],
      relevanceScore: 88,
    },
  },
  {
    id: "r5",
    type: "note",
    title: "Notes on Scaled Dot-Product Attention",
    description:
      "Key observations about the scaling factor in attention: The dot products grow large in magnitude...",
    matches: ["scaled dot-product", "attention"],
    metadata: { date: "2025-01-09", tags: ["notes"], relevanceScore: 85 },
  },
  {
    id: "r6",
    type: "ai-thread",
    title: "Understanding Attention Mechanisms",
    description:
      "AI-assisted exploration of attention mechanisms in transformer models, covering self-attention...",
    matches: ["attention mechanisms", "self-attention"],
    metadata: { date: "2025-01-10", relevanceScore: 82 },
  },
  {
    id: "r7",
    type: "discussion",
    title: "Best practices for transformer fine-tuning",
    description:
      "Team discussion about optimal strategies for fine-tuning large transformer models...",
    matches: ["fine-tuning", "transformer"],
    metadata: { date: "2025-01-07", relevanceScore: 78 },
  },
];

const recentSearches: RecentSearch[] = [
  {
    id: "rs1",
    query: "attention mechanism transformers",
    timestamp: "2025-01-10T14:30:00Z",
    resultsCount: 24,
  },
  {
    id: "rs2",
    query: "BERT fine-tuning",
    timestamp: "2025-01-10T11:15:00Z",
    resultsCount: 18,
  },
  {
    id: "rs3",
    query: "cross-lingual NLP",
    timestamp: "2025-01-09T16:45:00Z",
    resultsCount: 12,
  },
];

const savedSearches: SavedSearch[] = [
  {
    id: "ss1",
    query: "transformer architecture",
    name: "Transformer Papers",
    filters: { type: "paper" },
  },
  {
    id: "ss2",
    query: "machine learning healthcare",
    name: "ML Healthcare",
    filters: { type: "all" },
  },
];

const searchSuggestions = [
  "What are the key differences between BERT and GPT?",
  "How does multi-head attention improve model performance?",
  "Best practices for fine-tuning large language models",
  "Recent advances in vision transformers",
];

// ============================================================================
// Utility Functions
// ============================================================================
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

// ============================================================================
// Advanced Filters Modal Component
// ============================================================================
interface AdvancedFiltersState {
  citationMin: number;
  citationMax: number;
  yearFrom: number;
  yearTo: number;
  authors: string[];
  tags: string[];
  relevanceThreshold: number;
  includeAIContent: boolean;
}

const AdvancedFiltersModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  filters: AdvancedFiltersState;
  onApply: (filters: AdvancedFiltersState) => void;
}> = ({ isOpen, onClose, filters, onApply }) => {
  const [localFilters, setLocalFilters] =
    useState<AdvancedFiltersState>(filters);
  const [authorInput, setAuthorInput] = useState("");
  const [tagInput, setTagInput] = useState("");

  const addAuthor = () => {
    if (
      authorInput.trim() &&
      !localFilters.authors.includes(authorInput.trim())
    ) {
      setLocalFilters((prev) => ({
        ...prev,
        authors: [...prev.authors, authorInput.trim()],
      }));
      setAuthorInput("");
    }
  };

  const removeAuthor = (author: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      authors: prev.authors.filter((a) => a !== author),
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !localFilters.tags.includes(tagInput.trim())) {
      setLocalFilters((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl bg-background border rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
                    <Sliders className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Advanced Filters</h3>
                    <p className="text-sm text-muted-foreground">
                      Fine-tune your search with precise controls
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-muted rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
              {/* Citation Range */}
              <div>
                <label className="text-sm font-medium mb-3 block">
                  Citation Count Range
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-muted-foreground">
                      Minimum
                    </span>
                    <input
                      type="number"
                      min={0}
                      value={localFilters.citationMin}
                      onChange={(e) =>
                        setLocalFilters((prev) => ({
                          ...prev,
                          citationMin: parseInt(e.target.value) || 0,
                        }))
                      }
                      className="w-full mt-1 px-3 py-2 border rounded-lg bg-background"
                    />
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">
                      Maximum
                    </span>
                    <input
                      type="number"
                      min={0}
                      value={localFilters.citationMax}
                      onChange={(e) =>
                        setLocalFilters((prev) => ({
                          ...prev,
                          citationMax: parseInt(e.target.value) || 10000,
                        }))
                      }
                      className="w-full mt-1 px-3 py-2 border rounded-lg bg-background"
                    />
                  </div>
                </div>
              </div>

              {/* Year Range */}
              <div>
                <label className="text-sm font-medium mb-3 block">
                  Publication Year
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-muted-foreground">From</span>
                    <input
                      type="number"
                      min={1900}
                      max={2025}
                      value={localFilters.yearFrom}
                      onChange={(e) =>
                        setLocalFilters((prev) => ({
                          ...prev,
                          yearFrom: parseInt(e.target.value) || 2000,
                        }))
                      }
                      className="w-full mt-1 px-3 py-2 border rounded-lg bg-background"
                    />
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">To</span>
                    <input
                      type="number"
                      min={1900}
                      max={2025}
                      value={localFilters.yearTo}
                      onChange={(e) =>
                        setLocalFilters((prev) => ({
                          ...prev,
                          yearTo: parseInt(e.target.value) || 2025,
                        }))
                      }
                      className="w-full mt-1 px-3 py-2 border rounded-lg bg-background"
                    />
                  </div>
                </div>
              </div>

              {/* Relevance Threshold Slider */}
              <div>
                <label className="text-sm font-medium mb-3 block">
                  Minimum Relevance Score: {localFilters.relevanceThreshold}%
                </label>
                <div className="relative">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all"
                      style={{ width: `${localFilters.relevanceThreshold}%` }}
                    />
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={localFilters.relevanceThreshold}
                    onChange={(e) =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        relevanceThreshold: parseInt(e.target.value),
                      }))
                    }
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* Authors */}
              <div>
                <label className="text-sm font-medium mb-3 block">
                  Filter by Authors
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add author name..."
                    value={authorInput}
                    onChange={(e) => setAuthorInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addAuthor()}
                    className="flex-1 px-3 py-2 border rounded-lg bg-background text-sm"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={addAuthor}
                    className="px-3 py-2 bg-primary text-primary-foreground rounded-lg"
                  >
                    <Plus className="h-4 w-4" />
                  </motion.button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {localFilters.authors.map((author) => (
                    <span
                      key={author}
                      className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-sm"
                    >
                      <User className="h-3 w-3" />
                      {author}
                      <button onClick={() => removeAuthor(author)}>
                        <X className="h-3 w-3 ml-1 hover:text-red-500" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="text-sm font-medium mb-3 block">
                  Filter by Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add tag..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addTag()}
                    className="flex-1 px-3 py-2 border rounded-lg bg-background text-sm"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={addTag}
                    className="px-3 py-2 bg-primary text-primary-foreground rounded-lg"
                  >
                    <Plus className="h-4 w-4" />
                  </motion.button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {localFilters.tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-lg text-sm"
                    >
                      <Tag className="h-3 w-3" />
                      {tag}
                      <button onClick={() => removeTag(tag)}>
                        <X className="h-3 w-3 ml-1 hover:text-red-500" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Include AI Content Toggle */}
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="font-medium">Include AI-Generated Content</p>
                    <p className="text-sm text-muted-foreground">
                      Show AI threads and AI-assisted annotations
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      includeAIContent: !prev.includeAIContent,
                    }))
                  }
                  className={cn(
                    "w-12 h-6 rounded-full transition-colors relative",
                    localFilters.includeAIContent
                      ? "bg-purple-500"
                      : "bg-muted-foreground/30"
                  )}
                >
                  <div
                    className={cn(
                      "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                      localFilters.includeAIContent ? "left-7" : "left-1"
                    )}
                  />
                </button>
              </div>
            </div>

            <div className="p-4 border-t flex justify-end gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="px-4 py-2 border rounded-xl hover:bg-muted"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onApply(localFilters);
                  onClose();
                }}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl flex items-center gap-2"
              >
                <Check className="h-4 w-4" />
                Apply Filters
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ============================================================================
// Save Search Modal Component
// ============================================================================
const SaveSearchModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  query: string;
  onSave: (name: string) => void;
}> = ({ isOpen, onClose, query, onSave }) => {
  const [name, setName] = useState("");

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-background border rounded-2xl shadow-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl">
                <Bookmark className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold">Save Search</h3>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              Save this search to quickly access it later
            </p>

            <div className="p-3 bg-muted/50 rounded-lg mb-4">
              <p className="text-sm font-medium text-muted-foreground">
                Query:
              </p>
              <p className="text-sm">{query}</p>
            </div>

            <input
              type="text"
              placeholder="Give your search a name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl bg-background mb-4"
            />

            <div className="flex justify-end gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="px-4 py-2 border rounded-xl hover:bg-muted"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (name.trim()) {
                    onSave(name.trim());
                    setName("");
                    onClose();
                  }
                }}
                disabled={!name.trim()}
                className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                Save
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ============================================================================
// AI Search Suggestions Component
// ============================================================================
const AISearchSuggestions: React.FC<{
  query: string;
  onSelect: (suggestion: string) => void;
}> = ({ query, onSelect }) => {
  const suggestions = [
    `papers citing "${query}"`,
    `methodology comparison for ${query}`,
    `recent advances in ${query}`,
    `${query} applications in healthcare`,
  ];

  if (!query.trim()) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute left-0 right-0 top-full mt-2 bg-background border rounded-xl shadow-lg p-3 z-40"
    >
      <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
        <Zap className="h-3 w-3 text-purple-500" />
        AI-powered suggestions
      </p>
      <div className="space-y-1">
        {suggestions.map((suggestion, i) => (
          <button
            key={i}
            onClick={() => onSelect(suggestion)}
            className="w-full p-2 text-left text-sm rounded-lg hover:bg-muted transition-colors flex items-center gap-2"
          >
            <Sparkles className="h-3 w-3 text-purple-500" />
            {suggestion}
          </button>
        ))}
      </div>
    </motion.div>
  );
};

// ============================================================================
// Deep Research Panel Component
// ============================================================================
const DeepResearchPanel: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  query: string;
  isPremium: boolean;
}> = ({ isOpen, onClose, query, isPremium }) => {
  const [messages, setMessages] = useState<DeepResearchMessage[]>([
    {
      id: "1",
      role: "assistant",
      content: `I'll help you explore "${query}" in depth. I can analyze your papers, find connections, and answer questions based on your research library.\n\nWhat would you like to know?`,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage: DeepResearchMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: DeepResearchMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Based on my analysis of your research papers, the attention mechanism in transformers allows the model to weigh the importance of different parts of the input sequence. This is particularly powerful because it enables parallel processing and captures long-range dependencies more effectively than RNNs.\n\nKey findings from your papers suggest that multi-head attention further improves this by allowing the model to attend to information from different representation subspaces.",
        sources: [
          { title: "Attention Is All You Need", id: "r1" },
          { title: "BERT Paper", id: "r3" },
        ],
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      className="fixed right-0 top-0 h-full w-full md:w-[480px] bg-background border-l shadow-2xl z-50 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold">Deep Research Mode</h3>
            <p className="text-xs text-muted-foreground">
              AI-powered research assistant
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "flex gap-3",
              message.role === "user" && "flex-row-reverse"
            )}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                message.role === "assistant"
                  ? "bg-gradient-to-r from-purple-500 to-pink-500"
                  : "bg-primary"
              )}
            >
              {message.role === "assistant" ? (
                <Bot className="h-4 w-4 text-white" />
              ) : (
                <User className="h-4 w-4 text-white" />
              )}
            </div>
            <div
              className={cn(
                "flex-1 p-3 rounded-2xl max-w-[80%]",
                message.role === "assistant"
                  ? "bg-muted"
                  : "bg-primary text-primary-foreground"
              )}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              {message.sources && message.sources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border/50">
                  <p className="text-xs text-muted-foreground mb-2">Sources:</p>
                  <div className="flex flex-wrap gap-1">
                    {message.sources.map((source) => (
                      <span
                        key={source.id}
                        className="px-2 py-0.5 bg-background rounded text-xs hover:bg-muted cursor-pointer"
                      >
                        {source.title}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="p-3 bg-muted rounded-2xl">
              <div className="flex gap-1">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6 }}
                  className="w-2 h-2 bg-muted-foreground rounded-full"
                />
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                  className="w-2 h-2 bg-muted-foreground rounded-full"
                />
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                  className="w-2 h-2 bg-muted-foreground rounded-full"
                />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length === 1 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-muted-foreground mb-2">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {searchSuggestions.slice(0, 2).map((suggestion, i) => (
              <button
                key={i}
                onClick={() => setInput(suggestion)}
                className="px-3 py-1.5 bg-muted rounded-full text-xs hover:bg-muted/80 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask about your research..."
            className="flex-1 px-4 py-3 border rounded-xl bg-background"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={sendMessage}
            disabled={!input.trim() || isTyping}
            className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// ============================================================================
// Global Search Page Component
// ============================================================================
export function GlobalSearchPage({
  onNavigate,
  role: propRole,
  initialQuery = "",
}: GlobalSearchPageProps) {
  const { role: contextRole } = useRole();
  const effectiveRole = propRole ?? contextRole;
  const user = { ...defaultUser, role: effectiveRole };

  const isPremiumUser =
    effectiveRole === "pro_researcher" ||
    effectiveRole === "team_lead" ||
    effectiveRole === "admin";

  // State
  const [query, setQuery] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [typeFilter, setTypeFilter] = useState<SearchResultType | "all">("all");
  const [dateFilter, setDateFilter] = useState<
    "all" | "today" | "week" | "month" | "year"
  >("all");
  const [sortBy, setSortBy] = useState<"relevance" | "date" | "title">(
    "relevance"
  );
  const [showDeepResearch, setShowDeepResearch] = useState(false);
  const [semanticMode, setSemanticMode] = useState(true);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showSaveSearch, setShowSaveSearch] = useState(false);
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [mySavedSearches, setMySavedSearches] = useState(savedSearches);
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFiltersState>({
    citationMin: 0,
    citationMax: 10000,
    yearFrom: 2000,
    yearTo: 2025,
    authors: [],
    tags: [],
    relevanceThreshold: 50,
    includeAIContent: true,
  });

  const handleSearch = () => {
    if (!query.trim()) return;

    setIsSearching(true);
    setHasSearched(true);
    setShowAISuggestions(false);

    // Simulate search
    setTimeout(() => {
      const filtered = sampleResults.filter((r) => {
        if (typeFilter !== "all" && r.type !== typeFilter) return false;
        return true;
      });
      setResults(filtered);
      setIsSearching(false);
    }, 800);
  };

  const groupedResults = results.reduce(
    (acc, result) => {
      if (!acc[result.type]) acc[result.type] = [];
      acc[result.type].push(result);
      return acc;
    },
    {} as Record<SearchResultType, SearchResult[]>
  );

  return (
    <DashboardLayout user={user} onNavigate={onNavigate} currentPath="/search">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center pt-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold tracking-tight mb-2"
          >
            Search Your Research
          </motion.h1>
          <p className="text-muted-foreground">
            Find papers, annotations, notes, and more across your entire library
          </p>
        </div>

        {/* Search Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder={
                semanticMode
                  ? "Ask a question or describe what you're looking for..."
                  : "Search by keyword..."
              }
              className="w-full pl-12 pr-40 py-4 text-lg border-2 rounded-2xl bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {/* Semantic Toggle */}
              <button
                onClick={() => setSemanticMode(!semanticMode)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                  semanticMode
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                    : "bg-muted hover:bg-muted/80"
                )}
              >
                <Sparkles className="h-4 w-4" />
                AI
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSearch}
                disabled={isSearching}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-xl font-medium"
              >
                {isSearching ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Search"
                )}
              </motion.button>
            </div>
          </div>

          {/* Filters Row */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 border rounded-lg text-sm transition-colors",
                  showFilters &&
                    "bg-primary text-primary-foreground border-primary"
                )}
              >
                <Filter className="h-4 w-4" />
                Filters
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    showFilters && "rotate-180"
                  )}
                />
              </button>

              {typeFilter !== "all" && (
                <span className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-lg text-sm">
                  {typeFilter}
                  <button onClick={() => setTypeFilter("all")}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}

              {/* Advanced Filters Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAdvancedFilters(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-sm hover:bg-muted transition-colors"
              >
                <Sliders className="h-4 w-4" />
                Advanced
              </motion.button>

              {/* Save Search Button */}
              {query.trim() && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowSaveSearch(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-yellow-400 text-yellow-600 dark:text-yellow-400 rounded-lg text-sm hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors"
                >
                  <Bookmark className="h-4 w-4" />
                  Save
                </motion.button>
              )}
            </div>

            {/* Deep Research Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowDeepResearch(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium"
            >
              <Brain className="h-4 w-4" />
              Deep Research
              {!isPremiumUser && (
                <span className="px-1.5 py-0.5 bg-white/20 rounded text-xs">
                  PRO
                </span>
              )}
            </motion.button>
          </div>

          {/* AI Suggestions Dropdown */}
          {showAISuggestions && semanticMode && (
            <AISearchSuggestions
              query={query}
              onSelect={(suggestion) => {
                setQuery(suggestion);
                setShowAISuggestions(false);
                handleSearch();
              }}
            />
          )}

          {/* Expanded Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 p-4 bg-muted/50 rounded-xl">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      Type
                    </label>
                    <select
                      value={typeFilter}
                      onChange={(e) =>
                        setTypeFilter(e.target.value as typeof typeFilter)
                      }
                      className="w-full px-3 py-2 border rounded-lg bg-background text-sm"
                    >
                      <option value="all">All Types</option>
                      <option value="paper">Papers</option>
                      <option value="annotation">Annotations</option>
                      <option value="collection">Collections</option>
                      <option value="note">Notes</option>
                      <option value="discussion">Discussions</option>
                      <option value="ai-thread">AI Threads</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      Date
                    </label>
                    <select
                      value={dateFilter}
                      onChange={(e) =>
                        setDateFilter(e.target.value as typeof dateFilter)
                      }
                      className="w-full px-3 py-2 border rounded-lg bg-background text-sm"
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                      <option value="year">This Year</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      Sort By
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) =>
                        setSortBy(e.target.value as typeof sortBy)
                      }
                      className="w-full px-3 py-2 border rounded-lg bg-background text-sm"
                    >
                      <option value="relevance">Relevance</option>
                      <option value="date">Date</option>
                      <option value="title">Title</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Quick Access (before search) */}
        {!hasSearched && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Recent Searches */}
            <div className="bg-card border rounded-2xl p-6">
              <h3 className="font-semibold flex items-center gap-2 mb-4">
                <History className="h-5 w-5" />
                Recent Searches
              </h3>
              <div className="space-y-2">
                {recentSearches.map((search) => (
                  <motion.button
                    key={search.id}
                    whileHover={{ x: 4 }}
                    onClick={() => {
                      setQuery(search.query);
                      handleSearch();
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-muted transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Search className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{search.query}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {search.resultsCount} results
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Saved Searches */}
            <div className="bg-card border rounded-2xl p-6">
              <h3 className="font-semibold flex items-center gap-2 mb-4">
                <Star className="h-5 w-5" />
                Saved Searches
              </h3>
              <div className="space-y-2">
                {savedSearches.map((search) => (
                  <motion.button
                    key={search.id}
                    whileHover={{ x: 4 }}
                    onClick={() => {
                      setQuery(search.query);
                      handleSearch();
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-muted transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">{search.name}</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </motion.button>
                ))}
                <button className="w-full flex items-center gap-2 p-3 rounded-xl text-primary hover:bg-primary/5 transition-colors text-sm">
                  <Plus className="h-4 w-4" />
                  Save current search
                </button>
              </div>
            </div>

            {/* AI Suggestions */}
            <div className="md:col-span-2 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-2xl p-6">
              <h3 className="font-semibold flex items-center gap-2 mb-4 text-purple-900 dark:text-purple-100">
                <Lightbulb className="h-5 w-5" />
                Suggested Searches
              </h3>
              <div className="grid sm:grid-cols-2 gap-2">
                {searchSuggestions.map((suggestion, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => {
                      setQuery(suggestion);
                      handleSearch();
                    }}
                    className="p-3 bg-white/50 dark:bg-gray-900/50 rounded-xl text-sm text-left hover:bg-white dark:hover:bg-gray-900 transition-colors"
                  >
                    <Sparkles className="h-4 w-4 text-purple-500 inline mr-2" />
                    {suggestion}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Search Results */}
        {hasSearched && (
          <div className="space-y-6">
            {/* Results Summary */}
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">
                {isSearching
                  ? "Searching..."
                  : `${results.length} results for "${query}"`}
              </p>
            </div>

            {/* Grouped Results */}
            {Object.entries(groupedResults).map(([type, typeResults]) => {
              const Icon = typeIcons[type as SearchResultType];
              return (
                <div key={type} className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2 capitalize">
                    <Icon className="h-5 w-5" />
                    {type === "ai-thread" ? "AI Threads" : `${type}s`}
                    <span className="text-sm font-normal text-muted-foreground">
                      ({typeResults.length})
                    </span>
                  </h3>
                  <div className="space-y-2">
                    {typeResults.map((result, index) => (
                      <motion.div
                        key={result.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-card border rounded-xl p-4 hover:shadow-md transition-all cursor-pointer"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              "p-2 rounded-lg",
                              typeColors[result.type]
                            )}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-medium line-clamp-1">
                                {result.title}
                              </h4>
                              {result.metadata.relevanceScore && (
                                <span className="flex items-center gap-1 text-xs text-green-600 font-medium whitespace-nowrap">
                                  <TrendingUp className="h-3 w-3" />
                                  {result.metadata.relevanceScore}%
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                              {result.description}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              {result.matches.slice(0, 3).map((match, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded text-xs"
                                >
                                  {match}
                                </span>
                              ))}
                              {result.metadata.date && (
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {result.metadata.date}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}

            {results.length === 0 && !isSearching && (
              <div className="text-center py-16">
                <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                <h3 className="text-xl font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground">
                  Try different keywords or use Deep Research for AI-powered
                  search
                </p>
              </div>
            )}
          </div>
        )}

        {/* Deep Research Panel */}
        <AnimatePresence>
          {showDeepResearch && (
            <DeepResearchPanel
              isOpen={showDeepResearch}
              onClose={() => setShowDeepResearch(false)}
              query={query}
              isPremium={isPremiumUser}
            />
          )}
        </AnimatePresence>

        {/* Advanced Filters Modal */}
        <AdvancedFiltersModal
          isOpen={showAdvancedFilters}
          onClose={() => setShowAdvancedFilters(false)}
          filters={advancedFilters}
          onApply={(filters) => {
            setAdvancedFilters(filters);
            handleSearch();
          }}
        />

        {/* Save Search Modal */}
        <SaveSearchModal
          isOpen={showSaveSearch}
          onClose={() => setShowSaveSearch(false)}
          query={query}
          onSave={(name) => {
            setMySavedSearches((prev) => [
              ...prev,
              {
                id: `ss${Date.now()}`,
                query,
                name,
                filters: { type: typeFilter },
              },
            ]);
          }}
        />
      </div>
    </DashboardLayout>
  );
}

export default GlobalSearchPage;
