"use client";

import {
  AlertCircle,
  BookOpen,
  Calendar,
  CheckCircle,
  ChevronDown,
  Clock,
  Download,
  ExternalLink,
  FileText,
  FolderOpen,
  History,
  RotateCcw,
  Search,
  Star,
  Tag,
  Trash2,
  TrendingUp,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useRole, type UserRole } from "../../components/context";
import { DashboardLayout } from "../../components/layout/DashboardLayout";

// Search history types
type SearchCategory = "papers" | "collections" | "users" | "all";

interface SearchHistoryItem {
  id: string;
  query: string;
  category: SearchCategory;
  timestamp: string;
  resultsCount: number;
  filters?: {
    dateRange?: string;
    authors?: string[];
    tags?: string[];
    type?: string;
  };
  starred: boolean;
  lastResultClicked?: {
    id: string;
    title: string;
    type: "paper" | "collection" | "user";
  };
}

// Mock search history data
const mockSearchHistory: SearchHistoryItem[] = [
  {
    id: "1",
    query: "transformer architecture attention mechanism",
    category: "papers",
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    resultsCount: 156,
    filters: {
      dateRange: "2023-2024",
      authors: ["Vaswani", "Brown"],
      tags: ["NLP", "Deep Learning"],
    },
    starred: true,
    lastResultClicked: {
      id: "paper_1",
      title: "Attention Is All You Need",
      type: "paper",
    },
  },
  {
    id: "2",
    query: "neural network optimization techniques",
    category: "papers",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    resultsCount: 89,
    filters: {
      tags: ["Optimization", "Training"],
    },
    starred: false,
  },
  {
    id: "3",
    query: "machine learning research",
    category: "collections",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    resultsCount: 23,
    starred: false,
    lastResultClicked: {
      id: "col_1",
      title: "ML Fundamentals Collection",
      type: "collection",
    },
  },
  {
    id: "4",
    query: "Dr. Sarah Chen publications",
    category: "users",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    resultsCount: 12,
    starred: true,
    lastResultClicked: {
      id: "user_1",
      title: "Dr. Sarah Chen",
      type: "user",
    },
  },
  {
    id: "5",
    query: "large language models GPT BERT",
    category: "papers",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    resultsCount: 234,
    filters: {
      dateRange: "2022-2024",
      tags: ["LLM", "NLP"],
    },
    starred: true,
  },
  {
    id: "6",
    query: "computer vision image classification",
    category: "papers",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    resultsCount: 178,
    starred: false,
  },
  {
    id: "7",
    query: "reinforcement learning robotics",
    category: "papers",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    resultsCount: 67,
    filters: {
      tags: ["RL", "Robotics"],
    },
    starred: false,
  },
  {
    id: "8",
    query: "natural language processing survey",
    category: "papers",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    resultsCount: 45,
    starred: false,
  },
];

// Trending searches
const trendingSearches = [
  { query: "GPT-4 capabilities", count: 1245 },
  { query: "multimodal learning", count: 892 },
  { query: "diffusion models", count: 756 },
  { query: "federated learning", count: 634 },
  { query: "graph neural networks", count: 589 },
];

interface SearchHistoryPageProps {
  onNavigate?: (path: string) => void;
  role?: UserRole;
}

export function SearchHistoryPage({
  onNavigate,
  role: propRole,
}: SearchHistoryPageProps) {
  const { role: contextRole } = useRole();
  const effectiveRole = propRole ?? contextRole;
  const [history, setHistory] =
    useState<SearchHistoryItem[]>(mockSearchHistory);
  const [selectedCategory, setSelectedCategory] = useState<
    SearchCategory | "all"
  >("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [showStarredOnly, setShowStarredOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const defaultUser = {
    name: "Dr. Sarah Chen",
    email: "sarah.chen@university.edu",
    role: "researcher" as const,
  };
  const user = { ...defaultUser, role: effectiveRole };

  const getCategoryIcon = (category: SearchCategory) => {
    switch (category) {
      case "papers":
        return FileText;
      case "collections":
        return FolderOpen;
      case "users":
        return Users;
      default:
        return Search;
    }
  };

  const getCategoryColor = (category: SearchCategory) => {
    switch (category) {
      case "papers":
        return "text-blue-400 bg-blue-500/20";
      case "collections":
        return "text-purple-400 bg-purple-500/20";
      case "users":
        return "text-green-400 bg-green-500/20";
      default:
        return "text-gray-600 dark:text-gray-400 bg-gray-500/20";
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return then.toLocaleDateString();
  };

  const toggleStar = (id: string) => {
    setHistory((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, starred: !item.starred } : item
      )
    );
  };

  const deleteItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
    setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
  };

  const deleteSelected = () => {
    setHistory((prev) =>
      prev.filter((item) => !selectedItems.includes(item.id))
    );
    setSelectedItems([]);
    setShowDeleteConfirm(false);
  };

  const clearAll = () => {
    setHistory([]);
    setSelectedItems([]);
    setShowDeleteConfirm(false);
  };

  const repeatSearch = (item: SearchHistoryItem) => {
    onNavigate?.(
      `/search?q=${encodeURIComponent(item.query)}&category=${item.category}`
    );
  };

  const filteredHistory = history.filter((item) => {
    if (selectedCategory !== "all" && item.category !== selectedCategory)
      return false;
    if (showStarredOnly && !item.starred) return false;
    if (
      searchQuery &&
      !item.query.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    if (timeFilter !== "all") {
      const now = new Date();
      const itemDate = new Date(item.timestamp);
      const diffDays = Math.floor(
        (now.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (timeFilter === "today" && diffDays > 0) return false;
      if (timeFilter === "week" && diffDays > 7) return false;
      if (timeFilter === "month" && diffDays > 30) return false;
    }
    return true;
  });

  const toggleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedItems.length === filteredHistory.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredHistory.map((item) => item.id));
    }
  };

  return (
    <DashboardLayout user={user} onNavigate={onNavigate}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl">
                    <History className="h-6 w-6" />
                  </div>
                  Search History
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  View and manage your recent searches
                </p>
              </div>
              <div className="flex items-center gap-3">
                {selectedItems.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2"
                  >
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedItems.length} selected
                    </span>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete Selected
                    </button>
                  </motion.div>
                )}
                <button
                  onClick={() => {
                    setShowDeleteConfirm(true);
                    setSelectedItems(history.map((item) => item.id));
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-900 dark:text-white rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear All
                </button>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1 space-y-6"
            >
              {/* Quick Stats */}
              <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl border border-gray-200 dark:border-white/10 p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Search Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">
                      Total Searches
                    </span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {history.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">Starred</span>
                    <span className="text-yellow-400 font-medium">
                      {history.filter((h) => h.starred).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">This Week</span>
                    <span className="text-purple-400 font-medium">
                      {
                        history.filter((h) => {
                          const diff =
                            Date.now() - new Date(h.timestamp).getTime();
                          return diff < 7 * 24 * 60 * 60 * 1000;
                        }).length
                      }
                    </span>
                  </div>
                </div>
              </div>

              {/* Category Filter */}
              <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl border border-gray-200 dark:border-white/10 p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Categories
                </h3>
                <div className="space-y-2">
                  {(
                    [
                      { id: "all", label: "All", count: history.length },
                      {
                        id: "papers",
                        label: "Papers",
                        count: history.filter((h) => h.category === "papers")
                          .length,
                      },
                      {
                        id: "collections",
                        label: "Collections",
                        count: history.filter(
                          (h) => h.category === "collections"
                        ).length,
                      },
                      {
                        id: "users",
                        label: "Users",
                        count: history.filter((h) => h.category === "users")
                          .length,
                      },
                    ] as const
                  ).map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                        selectedCategory === cat.id
                          ? "bg-purple-500/20 border border-purple-500/30"
                          : "hover:bg-white dark:bg-white/5"
                      }`}
                    >
                      <span
                        className={
                          selectedCategory === cat.id
                            ? "text-purple-400"
                            : "text-gray-600 dark:text-gray-400"
                        }
                      >
                        {cat.label}
                      </span>
                      <span
                        className={`text-sm ${
                          selectedCategory === cat.id
                            ? "text-purple-400"
                            : "text-gray-500"
                        }`}
                      >
                        {cat.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Trending Searches */}
              <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl border border-gray-200 dark:border-white/10 p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                  Trending
                </h3>
                <div className="space-y-2">
                  {trendingSearches.map((trend, index) => (
                    <button
                      key={trend.query}
                      onClick={() =>
                        onNavigate?.(
                          `/search?q=${encodeURIComponent(trend.query)}`
                        )
                      }
                      className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white dark:bg-white/5 transition-colors group"
                    >
                      <span className="w-6 h-6 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-xs text-gray-600 dark:text-gray-400">
                        {index + 1}
                      </span>
                      <span className="flex-1 text-left text-gray-700 dark:text-gray-300 text-sm truncate group-hover:text-gray-900 dark:text-white transition-colors">
                        {trend.query}
                      </span>
                      <span className="text-gray-500 text-xs">
                        {trend.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-3"
            >
              {/* Search and Filters */}
              <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl border border-gray-200 dark:border-white/10 p-4 mb-6">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search your history..."
                      className="w-full pl-10 pr-4 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    />
                  </div>
                  <div className="relative">
                    <select
                      value={timeFilter}
                      onChange={(e) => setTimeFilter(e.target.value)}
                      className="appearance-none px-4 py-2 pr-10 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 dark:text-gray-400 pointer-events-none" />
                  </div>
                  <button
                    onClick={() => setShowStarredOnly(!showStarredOnly)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      showStarredOnly
                        ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                        : "bg-white dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white"
                    }`}
                  >
                    <Star
                      className={`h-4 w-4 ${showStarredOnly ? "fill-current" : ""}`}
                    />
                    Starred
                  </button>
                </div>
              </div>

              {/* History List */}
              <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
                {/* Select All Header */}
                {filteredHistory.length > 0 && (
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-white/10 flex items-center gap-3">
                    <button
                      onClick={selectAll}
                      className={`w-5 h-5 rounded border transition-colors ${
                        selectedItems.length === filteredHistory.length
                          ? "bg-purple-500 border-purple-500"
                          : "border-gray-500 hover:border-gray-400"
                      }`}
                    >
                      {selectedItems.length === filteredHistory.length && (
                        <CheckCircle className="h-4 w-4 text-gray-900 dark:text-white" />
                      )}
                    </button>
                    <span className="text-gray-600 dark:text-gray-400 text-sm">
                      {selectedItems.length === filteredHistory.length
                        ? "Deselect all"
                        : "Select all"}
                    </span>
                  </div>
                )}

                {/* History Items */}
                <div className="divide-y divide-white/5">
                  <AnimatePresence>
                    {filteredHistory.length === 0 ? (
                      <div className="py-12 text-center">
                        <History className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">No search history found</p>
                        <p className="text-gray-500 text-sm mt-1">
                          {searchQuery
                            ? "Try adjusting your search"
                            : "Start searching to build your history"}
                        </p>
                      </div>
                    ) : (
                      filteredHistory.map((item, index) => {
                        const CategoryIcon = getCategoryIcon(item.category);
                        const colorClass = getCategoryColor(item.category);

                        return (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-4 hover:bg-white dark:bg-white/5 transition-colors group"
                          >
                            <div className="flex items-start gap-4">
                              <button
                                onClick={() => toggleSelectItem(item.id)}
                                className={`mt-1 w-5 h-5 rounded border flex-shrink-0 transition-colors ${
                                  selectedItems.includes(item.id)
                                    ? "bg-purple-500 border-purple-500"
                                    : "border-gray-500 hover:border-gray-400"
                                }`}
                              >
                                {selectedItems.includes(item.id) && (
                                  <CheckCircle className="h-4 w-4 text-gray-900 dark:text-white" />
                                )}
                              </button>

                              <div
                                className={`p-2 rounded-lg ${colorClass} flex-shrink-0`}
                              >
                                <CategoryIcon className="h-4 w-4" />
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-4">
                                  <div>
                                    <p className="text-gray-900 dark:text-white font-medium">
                                      {item.query}
                                    </p>
                                    <div className="flex items-center gap-3 mt-1">
                                      <span className="text-gray-500 text-xs flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {formatTimeAgo(item.timestamp)}
                                      </span>
                                      <span className="text-gray-500 text-xs">
                                        {item.resultsCount} results
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => toggleStar(item.id)}
                                      className={`p-1.5 rounded-lg transition-colors ${
                                        item.starred
                                          ? "text-yellow-400"
                                          : "text-gray-500 hover:text-yellow-400"
                                      }`}
                                    >
                                      <Star
                                        className={`h-4 w-4 ${
                                          item.starred ? "fill-current" : ""
                                        }`}
                                      />
                                    </button>
                                    <button
                                      onClick={() => repeatSearch(item)}
                                      className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 dark:text-white opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                      <RotateCcw className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => deleteItem(item.id)}
                                      className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>

                                {/* Filters used */}
                                {item.filters && (
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {item.filters.dateRange && (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white dark:bg-white/5 rounded text-xs text-gray-600 dark:text-gray-400">
                                        <Calendar className="h-3 w-3" />
                                        {item.filters.dateRange}
                                      </span>
                                    )}
                                    {item.filters.tags?.map((tag) => (
                                      <span
                                        key={tag}
                                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-500/10 rounded text-xs text-purple-400"
                                      >
                                        <Tag className="h-3 w-3" />
                                        {tag}
                                      </span>
                                    ))}
                                    {item.filters.authors
                                      ?.slice(0, 2)
                                      .map((author) => (
                                        <span
                                          key={author}
                                          className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-500/10 rounded text-xs text-blue-400"
                                        >
                                          <Users className="h-3 w-3" />
                                          {author}
                                        </span>
                                      ))}
                                  </div>
                                )}

                                {/* Last clicked result */}
                                {item.lastResultClicked && (
                                  <button
                                    onClick={() =>
                                      onNavigate?.(
                                        `/${
                                          item.lastResultClicked!.type ===
                                          "paper"
                                            ? "papers"
                                            : item.lastResultClicked!.type ===
                                                "collection"
                                              ? "collections"
                                              : "profile"
                                        }/${item.lastResultClicked!.id}`
                                      )
                                    }
                                    className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-white/5 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-white/10 transition-colors"
                                  >
                                    <BookOpen className="h-3.5 w-3.5" />
                                    <span className="truncate max-w-[200px]">
                                      {item.lastResultClicked.title}
                                    </span>
                                    <ExternalLink className="h-3 w-3" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })
                    )}
                  </AnimatePresence>
                </div>

                {/* Load More */}
                {filteredHistory.length > 0 && filteredHistory.length >= 8 && (
                  <div className="p-4 border-t border-gray-200 dark:border-white/10 text-center">
                    <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
                      Load More
                    </button>
                  </div>
                )}
              </div>

              {/* Export History */}
              <div className="mt-6 flex justify-center">
                <button className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white transition-colors">
                  <Download className="h-4 w-4" />
                  Export Search History
                </button>
              </div>
            </motion.div>
          </div>

          {/* Delete Confirmation Modal */}
          <AnimatePresence>
            {showDeleteConfirm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={() => setShowDeleteConfirm(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-gray-900 rounded-xl border border-gray-200 dark:border-white/10 p-6 max-w-md w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-red-500/20 rounded-full">
                      <AlertCircle className="h-6 w-6 text-red-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Delete Search History?
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {selectedItems.length === history.length
                      ? "This will permanently delete all your search history. This action cannot be undone."
                      : `This will permanently delete ${selectedItems.length} selected search${
                          selectedItems.length > 1 ? "es" : ""
                        }. This action cannot be undone.`}
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setSelectedItems([]);
                      }}
                      className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-900 dark:text-white rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={
                        selectedItems.length === history.length
                          ? clearAll
                          : deleteSelected
                      }
                      className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-gray-900 dark:text-white rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default SearchHistoryPage;
