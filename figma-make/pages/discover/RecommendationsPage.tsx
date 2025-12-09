"use client";

/**
 * RecommendationsPage - AI-powered paper recommendations
 *
 * Features:
 * - Personalized paper recommendations
 * - Recommendation categories (similar to library, trending, new in field)
 * - Feedback mechanism for improving recommendations
 * - Explanation of why papers were recommended
 * - Framer Motion animations
 */

import {
  Bookmark,
  Brain,
  Check,
  Clock,
  Eye,
  FileText,
  Heart,
  Lightbulb,
  RefreshCw,
  Sliders,
  Sparkles,
  Star,
  Target,
  ThumbsDown,
  ThumbsUp,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { useRole, type UserRole } from "../../components/context";
import { DashboardLayout } from "../../components/layout/DashboardLayout";

interface RecommendationsPageProps {
  onNavigate: (path: string) => void;
  role?: UserRole;
}

// Default user for DashboardLayout
const defaultUser = {
  name: "Dr. Sarah Chen",
  email: "sarah.chen@university.edu",
  image: undefined,
  role: "researcher" as const,
};

// Recommendation type
interface RecommendedPaper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  venue: string;
  year: number;
  citations: number;
  matchScore: number;
  reason: string;
  reasonIcon: "similar" | "trending" | "author" | "topic" | "cited" | "new";
  tags: string[];
  isBookmarked: boolean;
  isSaved: boolean;
  feedback?: "like" | "dislike";
}

// Research interest
interface ResearchInterest {
  id: string;
  name: string;
  papers: number;
  lastUpdated: string;
  isActive: boolean;
}

// Recommendation category
interface RecommendationCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  count: number;
  color: string;
}

// Mock recommendations
const mockRecommendations: RecommendedPaper[] = [
  {
    id: "r1",
    title:
      "Attention Is All You Need: A Comprehensive Survey of Transformer Applications",
    authors: ["A. Vaswani", "N. Shazeer", "N. Parmar", "J. Uszkoreit"],
    abstract:
      "We present a comprehensive survey of transformer architectures and their applications across various domains including NLP, computer vision, and multi-modal learning...",
    venue: "NeurIPS 2024",
    year: 2024,
    citations: 45678,
    matchScore: 98,
    reason:
      "Based on your reading history in transformers and attention mechanisms",
    reasonIcon: "similar",
    tags: ["Transformers", "Deep Learning", "NLP"],
    isBookmarked: true,
    isSaved: false,
  },
  {
    id: "r2",
    title:
      "Scaling Language Models: Methods, Analysis & Insights from Training Gopher",
    authors: ["J. Rae", "S. Borgeaud", "T. Cai", "K. Millican"],
    abstract:
      "We present an analysis of Transformer language model performance across a wide range of model scales, from tens of millions of parameters up to 280 billion parameters...",
    venue: "ICML 2024",
    year: 2024,
    citations: 2341,
    matchScore: 95,
    reason: "Trending in your research area",
    reasonIcon: "trending",
    tags: ["LLMs", "Scaling Laws", "GPT"],
    isBookmarked: false,
    isSaved: false,
  },
  {
    id: "r3",
    title: "Constitutional AI: Harmlessness from AI Feedback",
    authors: ["Y. Bai", "S. Kadavath", "S. Kundu", "A. Askell"],
    abstract:
      "As AI systems become more capable, we need methods to make them more aligned with human values. This paper presents Constitutional AI (CAI)...",
    venue: "ICLR 2024",
    year: 2024,
    citations: 892,
    matchScore: 92,
    reason: "By authors you frequently cite",
    reasonIcon: "author",
    tags: ["AI Safety", "RLHF", "Alignment"],
    isBookmarked: false,
    isSaved: true,
  },
  {
    id: "r4",
    title:
      "LLaVA-Next: Improved Visual Instruction Tuning with Dynamic High Resolution",
    authors: ["H. Liu", "C. Li", "Y. Li", "Y. J. Lee"],
    abstract:
      "We present LLaVA-Next, which advances the frontier of visual instruction tuning with new capabilities in high-resolution image understanding...",
    venue: "CVPR 2024",
    year: 2024,
    citations: 567,
    matchScore: 89,
    reason: "Related to your saved collection 'Multimodal AI'",
    reasonIcon: "topic",
    tags: ["Multimodal", "Vision-Language", "VLM"],
    isBookmarked: false,
    isSaved: false,
  },
  {
    id: "r5",
    title:
      "Direct Preference Optimization: Your Language Model is Secretly a Reward Model",
    authors: ["R. Rafailov", "A. Sharma", "E. Mitchell", "C. Ermon"],
    abstract:
      "While large language models (LLMs) have demonstrated impressive capabilities, fine-tuning them to align with human preferences remains challenging...",
    venue: "NeurIPS 2024",
    year: 2024,
    citations: 1234,
    matchScore: 87,
    reason: "Cited by papers in your library",
    reasonIcon: "cited",
    tags: ["DPO", "RLHF", "Fine-tuning"],
    isBookmarked: false,
    isSaved: false,
  },
  {
    id: "r6",
    title:
      "Mixture of Experts Meets Instruction Tuning: A Winning Combination for LLMs",
    authors: ["S. Shen", "L. Hou", "Y. Zhou", "N. Du"],
    abstract:
      "We study the relationship between sparsely activated Mixture-of-Experts (MoE) models and instruction tuning, finding that they are complementary...",
    venue: "arXiv 2024",
    year: 2024,
    citations: 234,
    matchScore: 85,
    reason: "New paper in your field",
    reasonIcon: "new",
    tags: ["MoE", "Instruction Tuning", "Sparse Models"],
    isBookmarked: false,
    isSaved: false,
  },
];

// Mock research interests
const mockInterests: ResearchInterest[] = [
  {
    id: "i1",
    name: "Large Language Models",
    papers: 156,
    lastUpdated: "2 hours ago",
    isActive: true,
  },
  {
    id: "i2",
    name: "Transformer Architectures",
    papers: 89,
    lastUpdated: "1 day ago",
    isActive: true,
  },
  {
    id: "i3",
    name: "AI Alignment",
    papers: 45,
    lastUpdated: "3 days ago",
    isActive: true,
  },
  {
    id: "i4",
    name: "Multimodal Learning",
    papers: 67,
    lastUpdated: "1 week ago",
    isActive: false,
  },
];

// Recommendation categories
const recommendationCategories: RecommendationCategory[] = [
  {
    id: "all",
    name: "All Recommendations",
    description: "All personalized picks",
    icon: Sparkles,
    count: 24,
    color: "purple",
  },
  {
    id: "similar",
    name: "Similar to Library",
    description: "Based on your papers",
    icon: FileText,
    count: 8,
    color: "blue",
  },
  {
    id: "trending",
    name: "Trending in Field",
    description: "Hot papers now",
    icon: TrendingUp,
    count: 6,
    color: "orange",
  },
  {
    id: "authors",
    name: "From Followed Authors",
    description: "Authors you follow",
    icon: Users,
    count: 5,
    color: "green",
  },
  {
    id: "new",
    name: "New This Week",
    description: "Latest research",
    icon: Clock,
    count: 5,
    color: "cyan",
  },
];

const getReasonIcon = (reason: RecommendedPaper["reasonIcon"]) => {
  const icons = {
    similar: {
      icon: FileText,
      color: "text-blue-500",
      bg: "bg-blue-100 dark:bg-blue-900/30",
    },
    trending: {
      icon: TrendingUp,
      color: "text-orange-500",
      bg: "bg-orange-100 dark:bg-orange-900/30",
    },
    author: {
      icon: Users,
      color: "text-green-500",
      bg: "bg-green-100 dark:bg-green-900/30",
    },
    topic: {
      icon: Target,
      color: "text-purple-500",
      bg: "bg-purple-100 dark:bg-purple-900/30",
    },
    cited: {
      icon: Lightbulb,
      color: "text-amber-500",
      bg: "bg-amber-100 dark:bg-amber-900/30",
    },
    new: {
      icon: Zap,
      color: "text-cyan-500",
      bg: "bg-cyan-100 dark:bg-cyan-900/30",
    },
  };
  return icons[reason] || icons.similar;
};

// Preferences Tuning Interface
interface PreferenceTuning {
  novelty: number;
  citationWeight: number;
  recency: number;
  topicMatch: number;
  authorMatch: number;
  excludeRead: boolean;
  onlyOpenAccess: boolean;
}

// Preferences Tuning Modal
function PreferencesTuningModal({
  isOpen,
  onClose,
  preferences,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  preferences: PreferenceTuning;
  onSave: (prefs: PreferenceTuning) => void;
}) {
  const [localPrefs, setLocalPrefs] = useState<PreferenceTuning>(preferences);

  if (!isOpen) return null;

  const sliders = [
    {
      key: "novelty" as const,
      label: "Novelty vs. Reliability",
      leftLabel: "Established",
      rightLabel: "Cutting-edge",
      color: "purple",
    },
    {
      key: "citationWeight" as const,
      label: "Citation Impact",
      leftLabel: "Any",
      rightLabel: "Highly cited",
      color: "amber",
    },
    {
      key: "recency" as const,
      label: "Publication Recency",
      leftLabel: "Classic",
      rightLabel: "Recent",
      color: "blue",
    },
    {
      key: "topicMatch" as const,
      label: "Topic Similarity",
      leftLabel: "Broader",
      rightLabel: "Exact match",
      color: "green",
    },
    {
      key: "authorMatch" as const,
      label: "Author Familiarity",
      leftLabel: "New authors",
      rightLabel: "Known authors",
      color: "orange",
    },
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-50"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl">
                <Sliders className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Tune Recommendations
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Adjust how papers are selected for you
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <div className="p-5 space-y-6 max-h-[60vh] overflow-y-auto">
            {/* Sliders */}
            {sliders.map((slider) => (
              <div key={slider.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-900 dark:text-white">
                    {slider.label}
                  </label>
                  <span
                    className={`text-sm font-medium text-${slider.color}-600 dark:text-${slider.color}-400`}
                  >
                    {localPrefs[slider.key]}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={localPrefs[slider.key]}
                  onChange={(e) =>
                    setLocalPrefs({
                      ...localPrefs,
                      [slider.key]: parseInt(e.target.value),
                    })
                  }
                  className={`w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-${slider.color}-500`}
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>{slider.leftLabel}</span>
                  <span>{slider.rightLabel}</span>
                </div>
              </div>
            ))}

            {/* Toggle Options */}
            <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Additional Filters
              </h3>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Exclude papers I've already read
                </span>
                <div
                  onClick={() =>
                    setLocalPrefs({
                      ...localPrefs,
                      excludeRead: !localPrefs.excludeRead,
                    })
                  }
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    localPrefs.excludeRead
                      ? "bg-purple-500"
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      localPrefs.excludeRead ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </div>
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Only show open access papers
                </span>
                <div
                  onClick={() =>
                    setLocalPrefs({
                      ...localPrefs,
                      onlyOpenAccess: !localPrefs.onlyOpenAccess,
                    })
                  }
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    localPrefs.onlyOpenAccess
                      ? "bg-purple-500"
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      localPrefs.onlyOpenAccess
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </div>
              </label>
            </div>

            {/* Reset & Preset buttons */}
            <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() =>
                  setLocalPrefs({
                    novelty: 60,
                    citationWeight: 50,
                    recency: 70,
                    topicMatch: 80,
                    authorMatch: 40,
                    excludeRead: true,
                    onlyOpenAccess: false,
                  })
                }
                className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Reset to Default
              </button>
              <button
                onClick={() =>
                  setLocalPrefs({
                    novelty: 90,
                    citationWeight: 20,
                    recency: 95,
                    topicMatch: 50,
                    authorMatch: 20,
                    excludeRead: true,
                    onlyOpenAccess: false,
                  })
                }
                className="px-3 py-1.5 text-sm text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
              >
                🔥 Cutting Edge
              </button>
              <button
                onClick={() =>
                  setLocalPrefs({
                    novelty: 30,
                    citationWeight: 90,
                    recency: 40,
                    topicMatch: 90,
                    authorMatch: 70,
                    excludeRead: false,
                    onlyOpenAccess: false,
                  })
                }
                className="px-3 py-1.5 text-sm text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors"
              >
                📚 Classic Reads
              </button>
            </div>
          </div>

          <div className="p-5 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onSave(localPrefs);
                onClose();
              }}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg font-medium flex items-center gap-2"
            >
              <Check className="h-4 w-4" />
              Apply Preferences
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export function RecommendationsPage({
  onNavigate,
  role: propRole,
}: RecommendationsPageProps) {
  const { role: contextRole } = useRole();
  const effectiveRole = propRole ?? contextRole;
  const user = { ...defaultUser, role: effectiveRole };

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [recommendations, setRecommendations] = useState(mockRecommendations);
  const [interests, setInterests] = useState(mockInterests);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setDismissedIds(new Set());
    }, 1500);
  };

  const handleFeedback = (paperId: string, feedback: "like" | "dislike") => {
    setRecommendations((recs) =>
      recs.map((r) =>
        r.id === paperId
          ? { ...r, feedback: r.feedback === feedback ? undefined : feedback }
          : r
      )
    );
  };

  const handleDismiss = (paperId: string) => {
    setDismissedIds(new Set([...dismissedIds, paperId]));
  };

  const toggleBookmark = (paperId: string) => {
    setRecommendations((recs) =>
      recs.map((r) =>
        r.id === paperId ? { ...r, isBookmarked: !r.isBookmarked } : r
      )
    );
  };

  const toggleSave = (paperId: string) => {
    setRecommendations((recs) =>
      recs.map((r) => (r.id === paperId ? { ...r, isSaved: !r.isSaved } : r))
    );
  };

  const toggleInterest = (interestId: string) => {
    setInterests((ints) =>
      ints.map((i) =>
        i.id === interestId ? { ...i, isActive: !i.isActive } : i
      )
    );
  };

  const visibleRecommendations = recommendations.filter(
    (r) => !dismissedIds.has(r.id)
  );

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <DashboardLayout user={user} onNavigate={onNavigate}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl text-white">
                    <Brain className="h-6 w-6" />
                  </div>
                  AI Recommendations
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Personalized paper suggestions based on your research
                  interests
                </p>
              </div>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
            </div>

            {/* Category Pills */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {recommendationCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    selectedCategory === cat.id
                      ? "bg-purple-500 text-white"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700"
                  }`}
                >
                  <cat.icon className="h-4 w-4" />
                  <span>{cat.name}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      selectedCategory === cat.id
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Recommendations List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-3 space-y-4"
            >
              <AnimatePresence mode="popLayout">
                {visibleRecommendations.map((paper, index) => {
                  const reasonStyle = getReasonIcon(paper.reasonIcon);
                  const ReasonIcon = reasonStyle.icon;

                  return (
                    <motion.div
                      key={paper.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100, height: 0 }}
                      transition={{ delay: 0.05 * index }}
                      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
                    >
                      {/* Reason Banner */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className={`p-1.5 rounded-lg ${reasonStyle.bg}`}>
                          <ReasonIcon
                            className={`h-4 w-4 ${reasonStyle.color}`}
                          />
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {paper.reason}
                        </span>
                        <div className="ml-auto flex items-center gap-2">
                          <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                            {paper.matchScore}% match
                          </span>
                          <button
                            onClick={() => handleDismiss(paper.id)}
                            className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Paper Content */}
                      <div className="flex gap-4">
                        {/* Match Score Circle */}
                        <div className="hidden sm:flex flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 items-center justify-center text-white">
                          <div className="text-center">
                            <div className="text-lg font-bold">
                              {paper.matchScore}
                            </div>
                            <div className="text-xs opacity-80">%</div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <button
                            onClick={() => onNavigate(`/papers/${paper.id}`)}
                            className="text-left"
                          >
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 line-clamp-2">
                              {paper.title}
                            </h3>
                          </button>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {paper.authors.join(", ")}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2 line-clamp-2">
                            {paper.abstract}
                          </p>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mt-3">
                            {paper.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          {/* Meta Info */}
                          <div className="flex items-center gap-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
                            <span>{paper.venue}</span>
                            <span className="flex items-center gap-1">
                              <Star className="h-3.5 w-3.5" />
                              {formatNumber(paper.citations)} citations
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                        {/* Feedback */}
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">
                            Was this helpful?
                          </span>
                          <button
                            onClick={() => handleFeedback(paper.id, "like")}
                            className={`p-2 rounded-lg transition-colors ${
                              paper.feedback === "like"
                                ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-400 hover:text-green-600 dark:hover:text-green-400"
                            }`}
                          >
                            <ThumbsUp className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleFeedback(paper.id, "dislike")}
                            className={`p-2 rounded-lg transition-colors ${
                              paper.feedback === "dislike"
                                ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                            }`}
                          >
                            <ThumbsDown className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Save Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleBookmark(paper.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                              paper.isBookmarked
                                ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                            }`}
                          >
                            <Bookmark
                              className={`h-4 w-4 ${paper.isBookmarked ? "fill-current" : ""}`}
                            />
                            {paper.isBookmarked ? "Saved" : "Save"}
                          </button>
                          <button
                            onClick={() => toggleSave(paper.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                              paper.isSaved
                                ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                            }`}
                          >
                            <Heart
                              className={`h-4 w-4 ${paper.isSaved ? "fill-current" : ""}`}
                            />
                            {paper.isSaved ? "Liked" : "Like"}
                          </button>
                          <button
                            onClick={() => onNavigate(`/papers/${paper.id}`)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-purple-500 text-white hover:bg-purple-600 transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Load More */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center py-8"
              >
                <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-colors font-medium">
                  Load More Recommendations
                </button>
              </motion.div>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1 space-y-6"
            >
              {/* Research Interests */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Target className="h-5 w-5 text-purple-500" />
                    Your Interests
                  </h2>
                </div>
                <div className="p-4 space-y-3">
                  {interests.map((interest) => (
                    <div
                      key={interest.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                          {interest.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {interest.papers} papers • {interest.lastUpdated}
                        </p>
                      </div>
                      <button
                        onClick={() => toggleInterest(interest.id)}
                        className={`ml-2 w-10 h-6 rounded-full transition-colors ${
                          interest.isActive
                            ? "bg-purple-500"
                            : "bg-gray-200 dark:bg-gray-700"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${
                            interest.isActive
                              ? "translate-x-5"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => onNavigate("/settings/profile")}
                    className="w-full mt-2 py-2 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                  >
                    Manage Interests →
                  </button>
                </div>
              </div>

              {/* Recommendation Stats */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-500" />
                  Your Stats
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Papers viewed
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      247
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Saved papers
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      89
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Feedback given
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      156
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Match accuracy
                    </span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      87%
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-4 text-white">
                <h2 className="font-semibold mb-3">Improve Recommendations</h2>
                <p className="text-sm text-purple-100 mb-4">
                  Rate more papers and update your interests to get better
                  suggestions.
                </p>
                <button
                  onClick={() => onNavigate("/discover")}
                  className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
                >
                  Explore More Papers
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
