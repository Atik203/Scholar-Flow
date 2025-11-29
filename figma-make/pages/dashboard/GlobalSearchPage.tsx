"use client";

import {
  ArrowRight,
  BookOpen,
  Calendar,
  Download,
  FileText,
  Filter,
  FolderOpen,
  History,
  Loader2,
  MessageSquare,
  Search,
  Sparkles,
  User,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Button } from "../../components/ui/button";

// ============================================================================
// Types
// ============================================================================
interface GlobalSearchPageProps {
  role?: "researcher" | "pro_researcher" | "team_lead" | "admin";
  onNavigate?: (path: string) => void;
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
  icon: React.ElementType;
}

interface SearchFilter {
  types: SearchResultType[];
  dateRange: "all" | "today" | "week" | "month" | "year";
  sortBy: "relevance" | "date" | "title";
}

interface RecentSearch {
  id: string;
  query: string;
  timestamp: string;
  resultsCount: number;
}

// ============================================================================
// Sample Data
// ============================================================================
const sampleResults: SearchResult[] = [
  {
    id: "r1",
    type: "paper",
    title: "Attention Is All You Need",
    description:
      "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks...",
    matches: [
      "attention mechanism",
      "transformer architecture",
      "self-attention",
    ],
    metadata: {
      authors: ["Vaswani, A.", "Shazeer, N.", "Parmar, N."],
      date: "2017-06-12",
      tags: ["transformers", "NLP", "deep-learning"],
      relevanceScore: 98,
    },
    icon: FileText,
  },
  {
    id: "r2",
    type: "annotation",
    title: "Key insight on multi-head attention",
    description:
      "The attention mechanism allows the model to jointly attend to information from different representation subspaces...",
    matches: ["multi-head attention", "subspaces"],
    metadata: {
      collection: "NLP Foundations",
      date: "2025-01-10",
      relevanceScore: 95,
    },
    icon: MessageSquare,
  },
  {
    id: "r3",
    type: "paper",
    title: "BERT: Pre-training of Deep Bidirectional Transformers",
    description:
      "We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations...",
    matches: ["BERT", "bidirectional", "pre-training"],
    metadata: {
      authors: ["Devlin, J.", "Chang, M."],
      date: "2018-10-11",
      tags: ["BERT", "NLP", "pre-training"],
      relevanceScore: 92,
    },
    icon: FileText,
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
      tags: ["transformers", "research"],
      relevanceScore: 88,
    },
    icon: FolderOpen,
  },
  {
    id: "r5",
    type: "note",
    title: "Notes on Scaled Dot-Product Attention",
    description:
      "Key observations about the scaling factor in attention: The dot products grow large in magnitude for large dk...",
    matches: ["scaled dot-product", "attention", "scaling factor"],
    metadata: {
      date: "2025-01-09",
      tags: ["notes", "attention"],
      relevanceScore: 85,
    },
    icon: BookOpen,
  },
  {
    id: "r6",
    type: "ai-thread",
    title: "Conversation: Understanding Attention Mechanisms",
    description:
      "AI-assisted exploration of attention mechanisms in transformer models, covering self-attention, cross-attention...",
    matches: ["attention mechanisms", "self-attention", "cross-attention"],
    metadata: {
      date: "2025-01-10",
      relevanceScore: 82,
    },
    icon: Sparkles,
  },
  {
    id: "r7",
    type: "discussion",
    title: "Discussion: Best practices for transformer fine-tuning",
    description:
      "Team discussion about optimal strategies for fine-tuning large transformer models on downstream tasks...",
    matches: ["fine-tuning", "transformer", "best practices"],
    metadata: {
      date: "2025-01-07",
      relevanceScore: 78,
    },
    icon: Users,
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
  {
    id: "rs4",
    query: "parameter-efficient training",
    timestamp: "2025-01-09T10:00:00Z",
    resultsCount: 8,
  },
];

const suggestedQueries = [
  "transformer architecture overview",
  "attention vs RNN comparison",
  "recent papers on LLMs",
  "fine-tuning techniques",
  "model scaling laws",
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

function getTypeColor(type: SearchResultType): string {
  const colors = {
    paper: "bg-blue-500/10 text-blue-600 border-blue-200",
    annotation: "bg-green-500/10 text-green-600 border-green-200",
    collection: "bg-orange-500/10 text-orange-600 border-orange-200",
    note: "bg-purple-500/10 text-purple-600 border-purple-200",
    discussion: "bg-pink-500/10 text-pink-600 border-pink-200",
    "ai-thread": "bg-indigo-500/10 text-indigo-600 border-indigo-200",
  };
  return colors[type];
}

function getTypeLabel(type: SearchResultType): string {
  const labels = {
    paper: "Paper",
    annotation: "Annotation",
    collection: "Collection",
    note: "Note",
    discussion: "Discussion",
    "ai-thread": "AI Thread",
  };
  return labels[type];
}

function highlightMatches(text: string, matches: string[]): React.ReactNode {
  let result = text;
  matches.forEach((match) => {
    const regex = new RegExp(`(${match})`, "gi");
    result = result.replace(regex, "**$1**");
  });
  return result.split("**").map((part, index) =>
    index % 2 === 1 ? (
      <mark
        key={index}
        className="bg-yellow-200 dark:bg-yellow-800 px-0.5 rounded"
      >
        {part}
      </mark>
    ) : (
      part
    )
  );
}

// ============================================================================
// Global Search Page Component
// ============================================================================
export function GlobalSearchPage({
  role = "researcher",
  onNavigate,
  initialQuery = "",
}: GlobalSearchPageProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [filters, setFilters] = useState<SearchFilter>({
    types: [],
    dateRange: "all",
    sortBy: "relevance",
  });
  const [showFilters, setShowFilters] = useState(false);

  const user = {
    name: "Dr. Sarah Chen",
    email: "sarah.chen@university.edu",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    role: role,
  };

  const handleSearch = (query?: string) => {
    const searchTerm = query || searchQuery;
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    setHasSearched(true);

    // Simulate search
    setTimeout(() => {
      const filtered = sampleResults.filter((result) => {
        const matchesQuery =
          result.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          result.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          result.matches.some((m) =>
            m.toLowerCase().includes(searchTerm.toLowerCase())
          );

        const matchesType =
          filters.types.length === 0 || filters.types.includes(result.type);

        return matchesQuery && matchesType;
      });

      // Sort results
      if (filters.sortBy === "relevance") {
        filtered.sort(
          (a, b) =>
            (b.metadata.relevanceScore || 0) - (a.metadata.relevanceScore || 0)
        );
      } else if (filters.sortBy === "date") {
        filtered.sort(
          (a, b) =>
            new Date(b.metadata.date || "").getTime() -
            new Date(a.metadata.date || "").getTime()
        );
      } else {
        filtered.sort((a, b) => a.title.localeCompare(b.title));
      }

      setResults(filtered);
      setIsSearching(false);
    }, 800);
  };

  const toggleTypeFilter = (type: SearchResultType) => {
    setFilters((prev) => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter((t) => t !== type)
        : [...prev.types, type],
    }));
  };

  const clearFilters = () => {
    setFilters({
      types: [],
      dateRange: "all",
      sortBy: "relevance",
    });
  };

  return (
    <DashboardLayout user={user} onNavigate={onNavigate}>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Search Header */}
        <div className="text-center space-y-4">
          {!hasSearched && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-3xl font-bold">Search Everything</h1>
              <p className="text-muted-foreground mt-2">
                Find papers, annotations, notes, collections, and more
              </p>
            </motion.div>
          )}

          {/* Search Input */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search papers, annotations, notes, discussions..."
              className="w-full pl-12 pr-24 py-4 text-lg border rounded-2xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm"
              autoFocus
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? "text-primary" : ""}
              >
                <Filter className="h-4 w-4" />
              </Button>
              <Button onClick={() => handleSearch()} disabled={isSearching}>
                {isSearching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Search"
                )}
              </Button>
            </div>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="max-w-2xl mx-auto"
              >
                <div className="rounded-xl border bg-card p-4 mt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium">Filters</h3>
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Clear All
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {/* Type Filters */}
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">
                        Content Type
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {(
                          [
                            "paper",
                            "annotation",
                            "collection",
                            "note",
                            "discussion",
                            "ai-thread",
                          ] as SearchResultType[]
                        ).map((type) => (
                          <button
                            key={type}
                            onClick={() => toggleTypeFilter(type)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                              filters.types.includes(type)
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-background hover:bg-muted"
                            }`}
                          >
                            {getTypeLabel(type)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Date Range & Sort */}
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground mb-2">
                          Date Range
                        </p>
                        <select
                          value={filters.dateRange}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              dateRange: e.target
                                .value as SearchFilter["dateRange"],
                            }))
                          }
                          className="w-full px-3 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                        >
                          <option value="all">All Time</option>
                          <option value="today">Today</option>
                          <option value="week">This Week</option>
                          <option value="month">This Month</option>
                          <option value="year">This Year</option>
                        </select>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground mb-2">
                          Sort By
                        </p>
                        <select
                          value={filters.sortBy}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              sortBy: e.target.value as SearchFilter["sortBy"],
                            }))
                          }
                          className="w-full px-3 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                        >
                          <option value="relevance">Relevance</option>
                          <option value="date">Date</option>
                          <option value="title">Title</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Initial State - Recent & Suggested */}
        {!hasSearched && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            {/* Recent Searches */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                Recent Searches
              </h3>
              <div className="space-y-2">
                {recentSearches.map((search) => (
                  <button
                    key={search.id}
                    onClick={() => {
                      setSearchQuery(search.query);
                      handleSearch(search.query);
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted text-left transition-colors"
                  >
                    <History className="h-4 w-4 text-muted-foreground" />
                    <span className="flex-1">{search.query}</span>
                    <span className="text-xs text-muted-foreground">
                      {search.resultsCount} results
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            </div>

            {/* Suggested Searches */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                Suggested Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {suggestedQueries.map((query) => (
                  <button
                    key={query}
                    onClick={() => {
                      setSearchQuery(query);
                      handleSearch(query);
                    }}
                    className="px-4 py-2 rounded-full border hover:border-primary hover:text-primary transition-colors text-sm"
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Suggestion */}
            <div className="rounded-xl bg-gradient-to-r from-primary/5 to-chart-1/5 border border-primary/20 p-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Try AI-Powered Search</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Ask natural questions like "What are the key differences
                    between BERT and GPT?"
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Search Results */}
        {hasSearched && (
          <div className="space-y-4">
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {isSearching ? (
                  "Searching..."
                ) : (
                  <>
                    Found <strong>{results.length}</strong> results for "
                    {searchQuery}"
                  </>
                )}
              </p>
              {results.length > 0 && (
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              )}
            </div>

            {/* Results List */}
            {isSearching ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-3">
                {results.map((result, index) => (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="rounded-xl border bg-card p-4 hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                        <result.icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium group-hover:text-primary transition-colors">
                                {result.title}
                              </h3>
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs border ${getTypeColor(
                                  result.type
                                )}`}
                              >
                                {getTypeLabel(result.type)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {highlightMatches(
                                result.description,
                                result.matches
                              )}
                            </p>
                          </div>
                          {result.metadata.relevanceScore && (
                            <div className="text-right flex-shrink-0">
                              <div className="text-xs text-muted-foreground">
                                Relevance
                              </div>
                              <div className="font-medium text-primary">
                                {result.metadata.relevanceScore}%
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Metadata */}
                        <div className="flex items-center flex-wrap gap-3 mt-3 text-xs text-muted-foreground">
                          {result.metadata.authors && (
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {result.metadata.authors.slice(0, 2).join(", ")}
                              {result.metadata.authors.length > 2 &&
                                ` +${result.metadata.authors.length - 2}`}
                            </span>
                          )}
                          {result.metadata.collection && (
                            <span className="flex items-center gap-1">
                              <FolderOpen className="h-3 w-3" />
                              {result.metadata.collection}
                            </span>
                          )}
                          {result.metadata.date && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(result.metadata.date)}
                            </span>
                          )}
                        </div>

                        {/* Tags */}
                        {result.metadata.tags &&
                          result.metadata.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {result.metadata.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-0.5 rounded bg-muted text-xs"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}

                        {/* Matches */}
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-muted-foreground">
                            Matched:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {result.matches.map((match) => (
                              <span
                                key={match}
                                className="px-2 py-0.5 rounded bg-yellow-100 dark:bg-yellow-900/30 text-xs"
                              >
                                {match}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No results found</h3>
                <p className="text-muted-foreground mb-4">
                  Try different keywords or adjust your filters
                </p>
                <div className="flex items-center justify-center gap-2">
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setHasSearched(false);
                    }}
                  >
                    New Search
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
