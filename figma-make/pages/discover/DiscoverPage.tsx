"use client";

/**
 * DiscoverPage - AI-powered paper recommendations and research discovery
 *
 * Features:
 * - AI-powered paper recommendations
 * - Trending topics in research
 * - Similar papers to your library
 * - Research area exploration
 * - Personalized research feed
 * - Discovery filters
 * - Save/bookmark recommendations
 * - Framer Motion animations
 */

import {
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  BookOpen,
  Eye,
  Flame,
  Heart,
  RefreshCw,
  Search,
  Settings2,
  Sliders,
  Sparkles,
  Star,
  ThumbsDown,
  ThumbsUp,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { useRole, type UserRole } from "../../components/context";
import { DashboardLayout } from "../../components/layout/DashboardLayout";

interface DiscoverPageProps {
  onNavigate: (path: string) => void;
  role?: UserRole;
}

// Paper recommendation type
interface RecommendedPaper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  venue: string;
  year: number;
  citationCount: number;
  relevanceScore: number;
  topics: string[];
  reason: string;
  isBookmarked: boolean;
  isNew: boolean;
  thumbnailUrl?: string;
}

// Trending topic type
interface TrendingTopic {
  id: string;
  name: string;
  paperCount: number;
  growthRate: number;
  relatedTopics: string[];
  description: string;
}

// Research area type
interface ResearchArea {
  id: string;
  name: string;
  icon: string;
  color: string;
  paperCount: number;
  isFollowing: boolean;
}

// Mock recommended papers
const mockRecommendations: RecommendedPaper[] = [
  {
    id: "rec1",
    title:
      "Attention Is All You Need: Revisiting Transformer Architectures for Modern NLP",
    authors: ["A. Vaswani", "N. Shazeer", "N. Parmar", "J. Uszkoreit"],
    abstract:
      "We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely. Experiments on two machine translation tasks show these models to be superior in quality while being more parallelizable...",
    venue: "NeurIPS 2023",
    year: 2023,
    citationCount: 12453,
    relevanceScore: 98,
    topics: ["Transformers", "NLP", "Deep Learning"],
    reason: "Highly cited in your research area",
    isBookmarked: false,
    isNew: true,
  },
  {
    id: "rec2",
    title:
      "Large Language Models as Zero-Shot Reasoners: A Comprehensive Study",
    authors: ["T. Kojima", "S. Gu", "M. Reid", "Y. Matsuo"],
    abstract:
      "We demonstrate that large language models can be prompted to perform complex reasoning tasks with minimal task-specific training. Our method achieves state-of-the-art results on multiple reasoning benchmarks...",
    venue: "ACL 2023",
    year: 2023,
    citationCount: 856,
    relevanceScore: 95,
    topics: ["LLMs", "Reasoning", "Few-shot Learning"],
    reason: "Similar to papers in your library",
    isBookmarked: true,
    isNew: false,
  },
  {
    id: "rec3",
    title: "Multimodal Learning with Vision Transformers: A Survey",
    authors: ["J. Chen", "H. Guo", "K. Yi", "B. Li"],
    abstract:
      "This paper presents a comprehensive survey of multimodal learning approaches using vision transformers. We categorize existing methods, analyze their strengths and limitations, and discuss future research directions...",
    venue: "CVPR 2023",
    year: 2023,
    citationCount: 423,
    relevanceScore: 92,
    topics: ["Vision Transformers", "Multimodal", "Computer Vision"],
    reason: "Trending in your field",
    isBookmarked: false,
    isNew: true,
  },
  {
    id: "rec4",
    title: "Efficient Fine-Tuning of Large Language Models with LoRA and QLoRA",
    authors: ["E. Hu", "Y. Shen", "P. Wallis", "Z. Allen-Zhu"],
    abstract:
      "We propose Low-Rank Adaptation (LoRA), a method for efficient fine-tuning of large language models. LoRA freezes the pre-trained model weights and injects trainable rank decomposition matrices...",
    venue: "ICLR 2023",
    year: 2023,
    citationCount: 2341,
    relevanceScore: 89,
    topics: ["LLMs", "Fine-tuning", "Efficiency"],
    reason: "Cited by authors you follow",
    isBookmarked: false,
    isNew: false,
  },
  {
    id: "rec5",
    title: "Constitutional AI: Harmlessness from AI Feedback",
    authors: ["Y. Bai", "S. Kadavath", "S. Kundu", "A. Askell"],
    abstract:
      "We explore a method for training AI systems to be harmless and helpful, using AI feedback to scale up human oversight. Our approach uses a constitutional set of principles to guide model behavior...",
    venue: "arXiv 2023",
    year: 2023,
    citationCount: 567,
    relevanceScore: 87,
    topics: ["AI Safety", "RLHF", "Alignment"],
    reason: "Popular in NLP community",
    isBookmarked: false,
    isNew: true,
  },
];

// Mock trending topics
const mockTrendingTopics: TrendingTopic[] = [
  {
    id: "t1",
    name: "Large Language Models",
    paperCount: 15234,
    growthRate: 156,
    relatedTopics: ["NLP", "Transformers", "AI"],
    description: "Research on scaling and improving language models",
  },
  {
    id: "t2",
    name: "Multimodal Learning",
    paperCount: 8456,
    growthRate: 89,
    relatedTopics: ["Vision", "Language", "Audio"],
    description: "Combining multiple data modalities for richer understanding",
  },
  {
    id: "t3",
    name: "AI Safety & Alignment",
    paperCount: 3421,
    growthRate: 234,
    relatedTopics: ["Ethics", "RLHF", "Interpretability"],
    description: "Ensuring AI systems are safe and aligned with human values",
  },
  {
    id: "t4",
    name: "Efficient ML",
    paperCount: 6789,
    growthRate: 67,
    relatedTopics: ["Quantization", "Pruning", "Distillation"],
    description: "Making machine learning more efficient and accessible",
  },
  {
    id: "t5",
    name: "Generative AI",
    paperCount: 12345,
    growthRate: 312,
    relatedTopics: ["Diffusion", "GANs", "VAEs"],
    description: "Creating new content with AI models",
  },
];

// Mock research areas
const mockResearchAreas: ResearchArea[] = [
  {
    id: "a1",
    name: "Natural Language Processing",
    icon: "💬",
    color: "blue",
    paperCount: 45678,
    isFollowing: true,
  },
  {
    id: "a2",
    name: "Computer Vision",
    icon: "👁️",
    color: "purple",
    paperCount: 38901,
    isFollowing: true,
  },
  {
    id: "a3",
    name: "Machine Learning",
    icon: "🧠",
    color: "green",
    paperCount: 67890,
    isFollowing: false,
  },
  {
    id: "a4",
    name: "Robotics",
    icon: "🤖",
    color: "amber",
    paperCount: 23456,
    isFollowing: false,
  },
  {
    id: "a5",
    name: "Reinforcement Learning",
    icon: "🎮",
    color: "red",
    paperCount: 19876,
    isFollowing: false,
  },
  {
    id: "a6",
    name: "Graph Neural Networks",
    icon: "🕸️",
    color: "cyan",
    paperCount: 12345,
    isFollowing: true,
  },
];

// Paper card component
function PaperRecommendationCard({
  paper,
  onBookmark,
  onView,
}: {
  paper: RecommendedPaper;
  onBookmark: () => void;
  onView: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow"
    >
      {/* Relevance Score Badge */}
      <div className="relative">
        {paper.isNew && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-3 left-3 z-10"
          >
            <span className="px-2 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              New
            </span>
          </motion.div>
        )}
        <div className="absolute top-3 right-3 z-10">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
            <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {paper.relevanceScore}%
            </span>
          </div>
        </div>
        <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
      </div>

      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2">
          {paper.title}
        </h3>

        {/* Authors */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          {paper.authors.slice(0, 3).join(", ")}
          {paper.authors.length > 3 && ` +${paper.authors.length - 3} more`}
        </p>

        {/* Venue & Year */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full">
            {paper.venue}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {paper.year}
          </span>
        </div>

        {/* Abstract */}
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-3">
          {paper.abstract}
        </p>

        {/* Topics */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {paper.topics.map((topic) => (
            <span
              key={topic}
              className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full"
            >
              #{topic}
            </span>
          ))}
        </div>

        {/* Recommendation Reason */}
        <div className="flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400 mb-4">
          <Sparkles className="h-3 w-3" />
          <span>{paper.reason}</span>
        </div>

        {/* Stats & Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              {paper.citationCount.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onBookmark}
              className={`p-2 rounded-lg transition-colors ${
                paper.isBookmarked
                  ? "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {paper.isBookmarked ? (
                <BookmarkCheck className="h-4 w-4" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onView}
              className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-600"
            >
              <Eye className="h-4 w-4" />
              View
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Trending topic card
function TrendingTopicCard({
  topic,
  onClick,
}: {
  topic: TrendingTopic;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-left hover:shadow-lg transition-shadow w-full"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {topic.name}
          </h3>
        </div>
        <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
          <TrendingUp className="h-4 w-4" />
          <span className="text-sm font-medium">+{topic.growthRate}%</span>
        </div>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
        {topic.description}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {topic.paperCount.toLocaleString()} papers
        </span>
        <div className="flex gap-1">
          {topic.relatedTopics.slice(0, 2).map((rt) => (
            <span
              key={rt}
              className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full"
            >
              {rt}
            </span>
          ))}
        </div>
      </div>
    </motion.button>
  );
}

// Research area pill
function ResearchAreaPill({
  area,
  onToggle,
}: {
  area: ResearchArea;
  onToggle: () => void;
}) {
  const getColorClasses = (color: string, isFollowing: boolean) => {
    if (!isFollowing) {
      return "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600";
    }
    switch (color) {
      case "blue":
        return "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-700";
      case "purple":
        return "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-700";
      case "green":
        return "bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 border-green-200 dark:border-green-700";
      case "amber":
        return "bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-700";
      case "red":
        return "bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 border-red-200 dark:border-red-700";
      case "cyan":
        return "bg-cyan-100 dark:bg-cyan-900/50 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-700";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600";
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onToggle}
      className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${getColorClasses(area.color, area.isFollowing)}`}
    >
      <span className="text-lg">{area.icon}</span>
      <span className="font-medium text-sm">{area.name}</span>
      {area.isFollowing && <Heart className="h-3 w-3 fill-current" />}
    </motion.button>
  );
}

// Personalization Controls Modal
interface PersonalizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: PersonalizationPreferences;
  onSave: (prefs: PersonalizationPreferences) => void;
}

interface PersonalizationPreferences {
  recency: number;
  citations: number;
  relevance: number;
  diversity: number;
  excludeRead: boolean;
  preferOpenAccess: boolean;
}

function PersonalizationModal({
  isOpen,
  onClose,
  preferences,
  onSave,
}: PersonalizationModalProps) {
  const [prefs, setPrefs] = useState<PersonalizationPreferences>(preferences);

  const handleSave = () => {
    onSave(prefs);
    onClose();
  };

  if (!isOpen) return null;

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
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
          <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                <Settings2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Personalization Settings
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Fine-tune your recommendations
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

          <div className="p-5 space-y-6">
            {/* Preference Sliders */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Recommendation Weights
              </h3>

              {/* Recency */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-600 dark:text-gray-400">
                    Recency Priority
                  </label>
                  <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                    {prefs.recency}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={prefs.recency}
                  onChange={(e) =>
                    setPrefs({ ...prefs, recency: parseInt(e.target.value) })
                  }
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Prefer newer papers over older ones
                </p>
              </div>

              {/* Citations */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-600 dark:text-gray-400">
                    Citation Impact
                  </label>
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {prefs.citations}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={prefs.citations}
                  onChange={(e) =>
                    setPrefs({ ...prefs, citations: parseInt(e.target.value) })
                  }
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Favor highly cited papers
                </p>
              </div>

              {/* Relevance */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-600 dark:text-gray-400">
                    Topic Relevance
                  </label>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    {prefs.relevance}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={prefs.relevance}
                  onChange={(e) =>
                    setPrefs({ ...prefs, relevance: parseInt(e.target.value) })
                  }
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Match your research interests closely
                </p>
              </div>

              {/* Diversity */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-600 dark:text-gray-400">
                    Topic Diversity
                  </label>
                  <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                    {prefs.diversity}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={prefs.diversity}
                  onChange={(e) =>
                    setPrefs({ ...prefs, diversity: parseInt(e.target.value) })
                  }
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Include papers from adjacent fields
                </p>
              </div>
            </div>

            {/* Toggle Options */}
            <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Additional Options
              </h3>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Exclude papers I've already read
                </span>
                <div
                  onClick={() =>
                    setPrefs({ ...prefs, excludeRead: !prefs.excludeRead })
                  }
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    prefs.excludeRead
                      ? "bg-purple-500"
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      prefs.excludeRead ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </div>
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Prefer open access papers
                </span>
                <div
                  onClick={() =>
                    setPrefs({
                      ...prefs,
                      preferOpenAccess: !prefs.preferOpenAccess,
                    })
                  }
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    prefs.preferOpenAccess
                      ? "bg-purple-500"
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      prefs.preferOpenAccess ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </div>
              </label>
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
              onClick={handleSave}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium"
            >
              Save Preferences
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

// Library-based Recommendation Card
function LibraryBasedCard({
  basePaper,
  recommendations,
  onView,
}: {
  basePaper: { title: string; savedDate: string };
  recommendations: { id: string; title: string; relevance: number }[];
  onView: (id: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200/50 dark:border-blue-700/50 p-4"
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 bg-white dark:bg-gray-800 rounded-lg">
          <BookmarkCheck className="h-4 w-4 text-blue-500" />
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Because you saved
          </p>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
            {basePaper.title}
          </h4>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {basePaper.savedDate}
          </p>
        </div>
      </div>
      <div className="space-y-2">
        {recommendations.map((rec) => (
          <motion.button
            key={rec.id}
            whileHover={{ x: 4 }}
            onClick={() => onView(rec.id)}
            className="w-full text-left p-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                {rec.title}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">
                  {rec.relevance}% match
                </span>
                <ArrowRight className="h-3 w-3 text-gray-400 group-hover:text-blue-500" />
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

// Feedback button component for paper recommendations
function FeedbackButtons({
  paperId,
  onFeedback,
}: {
  paperId: string;
  onFeedback: (paperId: string, type: "like" | "dislike") => void;
}) {
  const [feedback, setFeedback] = useState<"like" | "dislike" | null>(null);

  const handleFeedback = (type: "like" | "dislike") => {
    setFeedback(type);
    onFeedback(paperId, type);
  };

  return (
    <div className="flex items-center gap-1">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => handleFeedback("like")}
        className={`p-1.5 rounded-lg transition-colors ${
          feedback === "like"
            ? "bg-green-100 dark:bg-green-900/50 text-green-600"
            : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400"
        }`}
      >
        <ThumbsUp className="h-3.5 w-3.5" />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => handleFeedback("dislike")}
        className={`p-1.5 rounded-lg transition-colors ${
          feedback === "dislike"
            ? "bg-red-100 dark:bg-red-900/50 text-red-600"
            : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400"
        }`}
      >
        <ThumbsDown className="h-3.5 w-3.5" />
      </motion.button>
    </div>
  );
}

export function DiscoverPage({
  onNavigate,
  role: propRole,
}: DiscoverPageProps) {
  const { role: contextRole } = useRole();
  const effectiveRole = propRole ?? contextRole;
  const [recommendations, setRecommendations] =
    useState<RecommendedPaper[]>(mockRecommendations);
  const [topics] = useState<TrendingTopic[]>(mockTrendingTopics);
  const [areas, setAreas] = useState<ResearchArea[]>(mockResearchAreas);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"all" | "new" | "saved">(
    "all"
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showPersonalization, setShowPersonalization] = useState(false);
  const [preferences, setPreferences] = useState<PersonalizationPreferences>({
    recency: 70,
    citations: 50,
    relevance: 85,
    diversity: 40,
    excludeRead: true,
    preferOpenAccess: false,
  });

  // Mock library-based recommendations
  const libraryRecommendations = [
    {
      basePaper: {
        title: "Attention Is All You Need",
        savedDate: "2 days ago",
      },
      recommendations: [
        {
          id: "lr1",
          title: "Sparse Attention: A New Paradigm for Efficient Transformers",
          relevance: 94,
        },
        {
          id: "lr2",
          title: "FlashAttention: Fast and Memory-Efficient Exact Attention",
          relevance: 91,
        },
        {
          id: "lr3",
          title: "Multi-Query Attention for Efficient Inference",
          relevance: 88,
        },
      ],
    },
    {
      basePaper: {
        title: "BERT: Pre-training of Deep Bidirectional Transformers",
        savedDate: "1 week ago",
      },
      recommendations: [
        {
          id: "lr4",
          title: "RoBERTa: A Robustly Optimized BERT Pretraining Approach",
          relevance: 96,
        },
        {
          id: "lr5",
          title: "ALBERT: A Lite BERT for Self-supervised Learning",
          relevance: 92,
        },
      ],
    },
  ];

  const defaultUser = {
    name: "Dr. Sarah Chen",
    email: "sarah.chen@university.edu",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    role: "pro_researcher" as const,
  };
  const user = { ...defaultUser, role: effectiveRole };

  const handleBookmark = (paperId: string) => {
    setRecommendations((prev) =>
      prev.map((p) =>
        p.id === paperId ? { ...p, isBookmarked: !p.isBookmarked } : p
      )
    );
  };

  const handleToggleArea = (areaId: string) => {
    setAreas((prev) =>
      prev.map((a) =>
        a.id === areaId ? { ...a, isFollowing: !a.isFollowing } : a
      )
    );
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  const handleFeedback = (paperId: string, type: "like" | "dislike") => {
    console.log(`Feedback for ${paperId}: ${type}`);
    // In real app, would send to backend to improve recommendations
  };

  // Filter recommendations
  const filteredRecommendations = recommendations.filter((paper) => {
    if (selectedFilter === "new" && !paper.isNew) return false;
    if (selectedFilter === "saved" && !paper.isBookmarked) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        paper.title.toLowerCase().includes(query) ||
        paper.authors.some((a) => a.toLowerCase().includes(query)) ||
        paper.topics.some((t) => t.toLowerCase().includes(query))
      );
    }
    return true;
  });

  return (
    <DashboardLayout user={user} onNavigate={onNavigate}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="h-6 w-6 text-purple-500" />
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Discover
                  </h1>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  AI-powered paper recommendations tailored to your research
                </p>
              </div>
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowPersonalization(true)}
                  className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Sliders className="h-5 w-5" />
                  Personalize
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 disabled:opacity-50"
                >
                  <RefreshCw
                    className={`h-5 w-5 ${isRefreshing ? "animate-spin" : ""}`}
                  />
                  Refresh
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Research Areas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Your Research Interests
            </h2>
            <div className="flex flex-wrap gap-3">
              {areas.map((area) => (
                <ResearchAreaPill
                  key={area.id}
                  area={area}
                  onToggle={() => handleToggleArea(area.id)}
                />
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - Recommendations */}
            <div className="lg:col-span-2">
              {/* Search and Filter */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="flex flex-col md:flex-row gap-4 mb-6"
              >
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search recommendations..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  {(["all", "new", "saved"] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setSelectedFilter(filter)}
                      className={`px-4 py-2.5 rounded-lg font-medium text-sm capitalize transition-all ${
                        selectedFilter === filter
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                          : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      {filter === "all" && "All"}
                      {filter === "new" && (
                        <span className="flex items-center gap-1">
                          <Sparkles className="h-3 w-3" />
                          New
                        </span>
                      )}
                      {filter === "saved" && (
                        <span className="flex items-center gap-1">
                          <Bookmark className="h-3 w-3" />
                          Saved
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Recommendations Grid */}
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {filteredRecommendations.length > 0 ? (
                    filteredRecommendations.map((paper, index) => (
                      <motion.div
                        key={paper.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.05 }}
                      >
                        <PaperRecommendationCard
                          paper={paper}
                          onBookmark={() => handleBookmark(paper.id)}
                          onView={() => onNavigate(`/papers/${paper.id}`)}
                        />
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
                    >
                      <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No papers found
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Try adjusting your search or filters
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Load More */}
                {filteredRecommendations.length > 0 && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                  >
                    Load More Recommendations
                    <ArrowRight className="h-4 w-4" />
                  </motion.button>
                )}
              </div>
            </div>

            {/* Sidebar - Trending Topics */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="sticky top-24 space-y-6"
              >
                {/* Library-based Recommendations */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <BookmarkCheck className="h-5 w-5 text-blue-500" />
                    <h2 className="font-semibold text-gray-900 dark:text-white">
                      Based on Your Library
                    </h2>
                  </div>
                  <div className="space-y-4">
                    {libraryRecommendations.map((item, index) => (
                      <LibraryBasedCard
                        key={index}
                        basePaper={item.basePaper}
                        recommendations={item.recommendations}
                        onView={(id) => onNavigate(`/papers/${id}`)}
                      />
                    ))}
                  </div>
                </div>

                {/* Trending Topics */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Flame className="h-5 w-5 text-orange-500" />
                    <h2 className="font-semibold text-gray-900 dark:text-white">
                      Trending Topics
                    </h2>
                  </div>
                  <div className="space-y-3">
                    {topics.slice(0, 4).map((topic) => (
                      <TrendingTopicCard
                        key={topic.id}
                        topic={topic}
                        onClick={() => setSearchQuery(topic.name)}
                      />
                    ))}
                  </div>
                  <button className="w-full mt-4 py-2 text-blue-600 dark:text-blue-400 font-medium text-sm hover:underline flex items-center justify-center gap-1">
                    View All Topics
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

                {/* AI Insights Card */}
                <div className="bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 dark:from-purple-500/20 dark:via-pink-500/20 dark:to-orange-500/20 rounded-xl border border-purple-200/50 dark:border-purple-700/50 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-white dark:bg-gray-800 rounded-lg">
                      <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      AI Insights
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Based on your reading history, you might be interested in
                    exploring <strong>Multimodal Learning</strong> as your next
                    research direction.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium text-sm hover:from-purple-600 hover:to-pink-600"
                  >
                    Explore This Topic
                  </motion.button>
                </div>

                {/* Quick Stats */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Your Discovery Stats
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Papers Discovered
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        156
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Saved This Week
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        12
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Topics Following
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {areas.filter((a) => a.isFollowing).length}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Personalization Modal */}
          <AnimatePresence>
            {showPersonalization && (
              <PersonalizationModal
                isOpen={showPersonalization}
                onClose={() => setShowPersonalization(false)}
                preferences={preferences}
                onSave={(prefs) => setPreferences(prefs)}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default DiscoverPage;
