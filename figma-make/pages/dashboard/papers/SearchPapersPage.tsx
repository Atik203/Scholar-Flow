"use client";

/**
 * SearchPapersPage - Enhanced AI-Powered Semantic Search
 *
 * Features:
 * - AI semantic search with relevance scoring
 * - Advanced filter panels (date, author, citation count)
 * - Inline preview for search results
 * - "Why this matches" AI explanations
 * - Deep Research mode integration
 * - Search history with suggestions
 * - Framer Motion animations
 */

import {
  ArrowLeft,
  BookOpen,
  Brain,
  Calendar,
  CheckCircle,
  ChevronDown,
  Clock,
  Download,
  Eye,
  FileText,
  Filter,
  History,
  Lightbulb,
  Loader2,
  Search,
  Sparkles,
  TrendingUp,
  User,
  X,
  XCircle,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import React, { useMemo, useState } from "react";
import { useRole, type UserRole } from "../../../components/context";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";

// ============================================================================
// Types
// ============================================================================
interface SearchPapersPageProps {
  onNavigate?: (path: string) => void;
  role?: UserRole;
}

interface SearchResult {
  id: string;
  title: string;
  authors: string[];
  year: number;
  abstract: string;
  processingStatus: "PROCESSED" | "PROCESSING" | "UPLOADED" | "FAILED";
  extractedText: string;
  pageCount: number;
  citationCount: number;
  workspaceId: string;
  createdAt: string;
  relevanceScore: number;
  matchHighlights: string[];
  aiExplanation: string;
  tags: string[];
}

interface SearchFilter {
  dateRange: "all" | "today" | "week" | "month" | "year" | "custom";
  status: "all" | "PROCESSED" | "PROCESSING" | "UPLOADED" | "FAILED";
  citationRange: [number, number];
  authors: string[];
  tags: string[];
}

interface SearchSuggestion {
  id: string;
  query: string;
  type: "recent" | "trending" | "ai-suggested";
  timestamp?: string;
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

const sampleSearchResults: SearchResult[] = [
  {
    id: "paper-1",
    title: "Attention Is All You Need",
    authors: ["Vaswani, A.", "Shazeer, N.", "Parmar, N."],
    year: 2017,
    abstract:
      "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder...",
    processingStatus: "PROCESSED",
    extractedText:
      "This paper explores deep learning techniques for NLP tasks including sentiment analysis, machine translation, and text summarization...",
    pageCount: 24,
    citationCount: 89542,
    workspaceId: "ws-1",
    createdAt: "2024-01-15",
    relevanceScore: 98,
    matchHighlights: [
      "transformer architecture",
      "attention mechanism",
      "self-attention",
    ],
    aiExplanation:
      "This paper is highly relevant because it introduces the foundational transformer architecture that matches your search for attention mechanisms.",
    tags: ["transformers", "NLP", "deep-learning"],
  },
  {
    id: "paper-2",
    title: "BERT: Pre-training of Deep Bidirectional Transformers",
    authors: ["Devlin, J.", "Chang, M.", "Lee, K."],
    year: 2018,
    abstract: "We introduce a new language representation model called BERT...",
    processingStatus: "PROCESSED",
    extractedText:
      "BERT is designed to pre-train deep bidirectional representations...",
    pageCount: 16,
    citationCount: 67234,
    workspaceId: "ws-1",
    createdAt: "2024-02-20",
    relevanceScore: 95,
    matchHighlights: ["BERT", "bidirectional", "pre-training", "transformers"],
    aiExplanation:
      "BERT extends transformer architecture with bidirectional training, directly relevant to your NLP research interests.",
    tags: ["BERT", "NLP", "pre-training"],
  },
  {
    id: "paper-3",
    title: "GPT-3: Language Models are Few-Shot Learners",
    authors: ["Brown, T.", "Mann, B.", "Ryder, N."],
    year: 2020,
    abstract:
      "Recent work has demonstrated substantial gains on many NLP tasks...",
    processingStatus: "PROCESSED",
    extractedText:
      "We train GPT-3, an autoregressive language model with 175 billion parameters...",
    pageCount: 75,
    citationCount: 45123,
    workspaceId: "ws-2",
    createdAt: "2024-03-10",
    relevanceScore: 92,
    matchHighlights: ["few-shot learning", "large language models", "GPT-3"],
    aiExplanation:
      "GPT-3 demonstrates emergent capabilities of large transformers, connecting to your research on model scaling.",
    tags: ["GPT", "LLM", "few-shot"],
  },
  {
    id: "paper-4",
    title: "Deep Residual Learning for Image Recognition",
    authors: ["He, K.", "Zhang, X.", "Ren, S."],
    year: 2015,
    abstract: "Deeper neural networks are more difficult to train...",
    processingStatus: "PROCESSING",
    extractedText: "",
    pageCount: 12,
    citationCount: 123456,
    workspaceId: "ws-2",
    createdAt: "2024-03-15",
    relevanceScore: 78,
    matchHighlights: ["residual connections", "deep networks"],
    aiExplanation:
      "ResNet introduces skip connections that later influenced transformer design.",
    tags: ["computer-vision", "ResNet", "deep-learning"],
  },
  {
    id: "paper-5",
    title: "LoRA: Low-Rank Adaptation of Large Language Models",
    authors: ["Hu, E.", "Shen, Y.", "Wallis, P."],
    year: 2021,
    abstract: "We propose Low-Rank Adaptation (LoRA)...",
    processingStatus: "PROCESSED",
    extractedText:
      "LoRA reduces the number of trainable parameters by 10,000 times...",
    pageCount: 13,
    citationCount: 12345,
    workspaceId: "ws-3",
    createdAt: "2024-03-18",
    relevanceScore: 88,
    matchHighlights: ["LoRA", "parameter-efficient", "fine-tuning"],
    aiExplanation:
      "LoRA is essential for efficient fine-tuning, matching your interest in practical LLM deployment.",
    tags: ["LoRA", "fine-tuning", "efficiency"],
  },
];

const searchSuggestions: SearchSuggestion[] = [
  {
    id: "s1",
    query: "transformer attention mechanism",
    type: "recent",
    timestamp: "2 hours ago",
  },
  {
    id: "s2",
    query: "BERT pre-training",
    type: "recent",
    timestamp: "Yesterday",
  },
  { id: "s3", query: "multimodal learning vision-language", type: "trending" },
  { id: "s4", query: "efficient fine-tuning methods", type: "ai-suggested" },
  { id: "s5", query: "chain-of-thought reasoning", type: "trending" },
];

// ============================================================================
// Utility Functions
// ============================================================================
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

// ============================================================================
// Status Badge Component
// ============================================================================
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const config = {
    PROCESSED: {
      icon: CheckCircle,
      label: "Processed",
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
  const statusConfig = config[status as keyof typeof config] || config.UPLOADED;
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
// Relevance Score Badge
// ============================================================================
const RelevanceScoreBadge: React.FC<{ score: number }> = ({ score }) => {
  const getColor = () => {
    if (score >= 90) return "from-green-500 to-emerald-500";
    if (score >= 75) return "from-blue-500 to-cyan-500";
    if (score >= 50) return "from-yellow-500 to-orange-500";
    return "from-gray-400 to-gray-500";
  };

  return (
    <div className="flex items-center gap-1.5">
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white bg-gradient-to-br",
          getColor()
        )}
      >
        {score}
      </div>
      <span className="text-xs text-muted-foreground">match</span>
    </div>
  );
};

// ============================================================================
// Search Papers Page Component
// ============================================================================
export function SearchPapersPage({
  onNavigate,
  role: propRole,
}: SearchPapersPageProps) {
  const { role: contextRole } = useRole();
  const effectiveRole = propRole ?? contextRole;
  const user = { ...defaultUser, role: effectiveRole };

  const [searchQuery, setSearchQuery] = useState("transformer attention");
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [useSemanticSearch, setUseSemanticSearch] = useState(true);
  const [deepResearchMode, setDeepResearchMode] = useState(false);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState("");
  const [selectedPaper, setSelectedPaper] = useState<SearchResult | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [filters, setFilters] = useState<SearchFilter>({
    dateRange: "all",
    status: "all",
    citationRange: [0, 200000],
    authors: [],
    tags: [],
  });

  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    // Split query into words for flexible matching
    const queryWords = searchQuery
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 1);

    return sampleSearchResults
      .filter((paper) => {
        if (selectedWorkspaceId && paper.workspaceId !== selectedWorkspaceId)
          return false;
        if (
          filters.status !== "all" &&
          paper.processingStatus !== filters.status
        )
          return false;

        // Check if ANY query word matches any field
        const searchableText = [
          paper.title,
          ...paper.authors,
          paper.extractedText,
          ...paper.tags,
          paper.abstract,
          ...paper.matchHighlights,
        ]
          .join(" ")
          .toLowerCase();

        // Return true if at least one query word is found
        return queryWords.some((word) => searchableText.includes(word));
      })
      .sort((a, b) => b.relevanceScore - a.relevanceScore);
  }, [searchQuery, selectedWorkspaceId, filters]);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setShowSuggestions(false);
    setTimeout(() => setIsSearching(false), 1000);
  };

  const stats = {
    total: filteredResults.length,
    avgRelevance:
      filteredResults.length > 0
        ? Math.round(
            filteredResults.reduce((acc, p) => acc + p.relevanceScore, 0) /
              filteredResults.length
          )
        : 0,
  };

  const isPremiumUser =
    effectiveRole === "pro_researcher" ||
    effectiveRole === "team_lead" ||
    effectiveRole === "admin";

  return (
    <DashboardLayout
      user={user}
      onNavigate={onNavigate}
      currentPath="/papers/search"
    >
      <div className="max-w-7xl mx-auto space-y-6">
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
                <Sparkles className="h-8 w-8 text-primary" />
                AI-Powered Search
              </h1>
              <p className="text-muted-foreground">
                Semantic search with intelligent relevance scoring
              </p>
            </div>
          </div>
        </div>

        {/* Main Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <div className="bg-card border-2 border-primary/20 rounded-2xl p-6 shadow-lg">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {useSemanticSearch ? (
                  <Brain className="h-5 w-5 text-primary" />
                ) : (
                  <Search className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder={
                  useSemanticSearch
                    ? "Ask a question or describe what you're looking for..."
                    : "Search papers by title, author, or content..."
                }
                className="w-full pl-12 pr-36 py-4 text-lg bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="px-4 py-2 bg-gradient-to-r from-primary to-purple-600 text-white rounded-lg font-medium flex items-center gap-2"
                >
                  {isSearching ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                  Search
                </motion.button>
              </div>
            </div>

            {/* Search Options */}
            <div className="flex flex-wrap items-center gap-4 mt-4">
              <label
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setUseSemanticSearch(!useSemanticSearch)}
              >
                <div
                  className={cn(
                    "w-10 h-6 rounded-full flex items-center transition-colors",
                    useSemanticSearch
                      ? "bg-primary justify-end"
                      : "bg-muted justify-start"
                  )}
                >
                  <motion.div
                    layout
                    className="w-5 h-5 bg-white rounded-full shadow mx-0.5"
                  />
                </div>
                <span className="text-sm font-medium flex items-center gap-1">
                  <Brain className="h-4 w-4" />
                  AI Semantic Search
                </span>
              </label>

              <label
                className="flex items-center gap-2 cursor-pointer"
                onClick={() =>
                  isPremiumUser && setDeepResearchMode(!deepResearchMode)
                }
              >
                <div
                  className={cn(
                    "w-10 h-6 rounded-full flex items-center transition-colors",
                    deepResearchMode
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 justify-end"
                      : "bg-muted justify-start"
                  )}
                >
                  <motion.div
                    layout
                    className="w-5 h-5 bg-white rounded-full shadow mx-0.5"
                  />
                </div>
                <span className="text-sm font-medium flex items-center gap-1">
                  <Zap className="h-4 w-4" />
                  Deep Research
                  {!isPremiumUser && (
                    <span className="px-1.5 py-0.5 text-xs rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium">
                      PRO
                    </span>
                  )}
                </span>
              </label>

              <select
                value={selectedWorkspaceId}
                onChange={(e) => setSelectedWorkspaceId(e.target.value)}
                className="px-3 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Workspaces</option>
                {dummyWorkspaces.map((ws) => (
                  <option key={ws.id} value={ws.id}>
                    {ws.name}
                  </option>
                ))}
              </select>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 border rounded-lg text-sm transition-colors",
                  showFilters
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
              >
                <Filter className="h-4 w-4" />
                Advanced Filters
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    showFilters && "rotate-180"
                  )}
                />
              </motion.button>
            </div>

            {/* Advanced Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 mt-4 border-t">
                    <div>
                      <label className="text-sm font-medium flex items-center gap-1 mb-2">
                        <Calendar className="h-4 w-4" />
                        Date Range
                      </label>
                      <select
                        value={filters.dateRange}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            dateRange: e.target
                              .value as SearchFilter["dateRange"],
                          })
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
                      <label className="text-sm font-medium flex items-center gap-1 mb-2">
                        <CheckCircle className="h-4 w-4" />
                        Status
                      </label>
                      <select
                        value={filters.status}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            status: e.target.value as SearchFilter["status"],
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg bg-background text-sm"
                      >
                        <option value="all">All Statuses</option>
                        <option value="PROCESSED">Processed</option>
                        <option value="PROCESSING">Processing</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium flex items-center gap-1 mb-2">
                        <TrendingUp className="h-4 w-4" />
                        Min Citations
                      </label>
                      <input
                        type="number"
                        value={filters.citationRange[0]}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            citationRange: [
                              parseInt(e.target.value) || 0,
                              filters.citationRange[1],
                            ],
                          })
                        }
                        placeholder="0"
                        className="w-full px-3 py-2 border rounded-lg bg-background text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium flex items-center gap-1 mb-2">
                        <User className="h-4 w-4" />
                        Author
                      </label>
                      <input
                        type="text"
                        placeholder="Filter by author..."
                        className="w-full px-3 py-2 border rounded-lg bg-background text-sm"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Search Suggestions */}
            <AnimatePresence>
              {showSuggestions && !searchQuery && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 pt-4 border-t"
                >
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-1 mb-2">
                        <History className="h-4 w-4" />
                        Recent Searches
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {searchSuggestions
                          .filter((s) => s.type === "recent")
                          .map((suggestion) => (
                            <motion.button
                              key={suggestion.id}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => {
                                setSearchQuery(suggestion.query);
                                setShowSuggestions(false);
                                handleSearch();
                              }}
                              className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full text-sm hover:bg-muted/80"
                            >
                              <Clock className="h-3 w-3" />
                              {suggestion.query}
                              <span className="text-xs text-muted-foreground">
                                {suggestion.timestamp}
                              </span>
                            </motion.button>
                          ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-1 mb-2">
                        <Sparkles className="h-4 w-4" />
                        Suggested for You
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {searchSuggestions
                          .filter((s) => s.type !== "recent")
                          .map((suggestion) => (
                            <motion.button
                              key={suggestion.id}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => {
                                setSearchQuery(suggestion.query);
                                setShowSuggestions(false);
                              }}
                              className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm",
                                suggestion.type === "ai-suggested"
                                  ? "bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300"
                                  : "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300"
                              )}
                            >
                              {suggestion.type === "ai-suggested" ? (
                                <Lightbulb className="h-3 w-3" />
                              ) : (
                                <TrendingUp className="h-3 w-3" />
                              )}
                              {suggestion.query}
                            </motion.button>
                          ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Results Section */}
        {searchQuery && (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h2 className="text-lg font-semibold">
                    {filteredResults.length} Results
                  </h2>
                  {stats.avgRelevance > 0 && (
                    <span className="text-sm text-muted-foreground">
                      Avg. relevance:{" "}
                      <span className="font-medium text-primary">
                        {stats.avgRelevance}%
                      </span>
                    </span>
                  )}
                </div>
                <select className="px-3 py-1.5 border rounded-lg text-sm bg-background">
                  <option>Sort by Relevance</option>
                  <option>Sort by Date</option>
                  <option>Sort by Citations</option>
                </select>
              </div>

              {isSearching ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-purple-600 animate-spin opacity-20" />
                    <Brain className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-primary" />
                  </div>
                  <p className="mt-4 text-muted-foreground">
                    Analyzing your query with AI...
                  </p>
                </div>
              ) : filteredResults.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Search className="h-16 w-16 text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-medium">No results found</h3>
                  <p className="text-muted-foreground mt-1">
                    Try adjusting your search terms or filters
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredResults.map((paper, index) => (
                    <motion.div
                      key={paper.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -2 }}
                      onClick={() => {
                        setSelectedPaper(paper);
                        setShowPreview(true);
                      }}
                      className={cn(
                        "bg-card border rounded-xl p-4 cursor-pointer transition-all hover:shadow-md hover:border-primary/30",
                        selectedPaper?.id === paper.id && "ring-2 ring-primary"
                      )}
                    >
                      <div className="flex items-start gap-4">
                        <RelevanceScoreBadge score={paper.relevanceScore} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold text-base line-clamp-2 hover:text-primary transition-colors">
                              {paper.title}
                            </h3>
                            <StatusBadge status={paper.processingStatus} />
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {paper.authors.join(", ")} • {paper.year}
                          </p>
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {paper.abstract}
                          </p>
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {paper.matchHighlights
                              .slice(0, 3)
                              .map((highlight, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded text-xs"
                                >
                                  {highlight}
                                </span>
                              ))}
                          </div>
                          {useSemanticSearch && (
                            <div className="mt-3 p-2 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                              <p className="text-xs text-purple-700 dark:text-purple-300 flex items-start gap-1">
                                <Sparkles className="h-3 w-3 mt-0.5 flex-shrink-0" />
                                <span className="font-medium">
                                  Why this matches:
                                </span>{" "}
                                {paper.aiExplanation}
                              </p>
                            </div>
                          )}
                          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              {paper.pageCount} pages
                            </span>
                            <span className="flex items-center gap-1">
                              <TrendingUp className="h-3 w-3" />
                              {paper.citationCount.toLocaleString()} citations
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {paper.createdAt}
                            </span>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPaper(paper);
                            setShowPreview(true);
                          }}
                          className="p-2 hover:bg-muted rounded-lg"
                        >
                          <Eye className="h-5 w-5 text-muted-foreground" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Preview Panel */}
            <div className="hidden lg:block">
              <div className="sticky top-24">
                <AnimatePresence mode="wait">
                  {selectedPaper && showPreview ? (
                    <motion.div
                      key={selectedPaper.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="bg-card border rounded-xl overflow-hidden"
                    >
                      <div className="p-4 border-b bg-muted/30">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-muted-foreground">
                            Quick Preview
                          </span>
                          <button
                            onClick={() => setShowPreview(false)}
                            className="p-1 hover:bg-muted rounded"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <h3 className="font-semibold line-clamp-2">
                          {selectedPaper.title}
                        </h3>
                      </div>
                      <div className="aspect-[3/4] bg-muted/50 flex items-center justify-center border-b">
                        <div className="text-center p-6">
                          <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                          <p className="text-sm text-muted-foreground">
                            PDF Preview
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {selectedPaper.pageCount} pages
                          </p>
                        </div>
                      </div>
                      <div className="p-4 space-y-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() =>
                            onNavigate?.(`/papers/${selectedPaper.id}`)
                          }
                          className="w-full py-2 bg-primary text-primary-foreground rounded-lg font-medium flex items-center justify-center gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          Open Full View
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full py-2 border rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-muted"
                        >
                          <Download className="h-4 w-4" />
                          Download PDF
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full py-2 border rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-muted"
                        >
                          <BookOpen className="h-4 w-4" />
                          Add to Collection
                        </motion.button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-card border rounded-xl p-8 text-center"
                    >
                      <Eye className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                      <h3 className="font-medium text-muted-foreground">
                        Quick Preview
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Click on a paper to preview it here
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 mb-6">
              <Brain className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">
              AI-Powered Research Search
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Search through your papers using natural language. Our AI
              understands context and meaning, not just keywords.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              <span className="px-3 py-1 bg-muted rounded-full text-sm">
                Try: &quot;papers about attention mechanisms&quot;
              </span>
              <span className="px-3 py-1 bg-muted rounded-full text-sm">
                Try: &quot;recent NLP breakthroughs&quot;
              </span>
              <span className="px-3 py-1 bg-muted rounded-full text-sm">
                Try: &quot;efficient training methods&quot;
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default SearchPapersPage;
