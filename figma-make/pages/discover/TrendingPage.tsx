"use client";

/**
 * TrendingPage - Trending research topics and papers
 *
 * Features:
 * - Trending topics with growth rates
 * - Hot papers in each topic
 * - Time-based filtering (today, week, month)
 * - Topic follow/unfollow
 * - Interactive charts
 * - Framer Motion animations
 */

import {
  ArrowUp,
  Bell,
  BellOff,
  Bookmark,
  BookOpen,
  ChevronRight,
  Eye,
  Flame,
  Hash,
  LineChart,
  Network,
  RefreshCw,
  Search,
  Share2,
  Star,
  TrendingUp,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { useRole, type UserRole } from "../../components/context";
import { DashboardLayout } from "../../components/layout/DashboardLayout";

interface TrendingPageProps {
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

// Trending topic type
interface TrendingTopic {
  id: string;
  name: string;
  paperCount: number;
  growthRate: number;
  weeklyPapers: number;
  relatedTopics: string[];
  description: string;
  color: string;
  isFollowing: boolean;
  notificationsEnabled: boolean;
  trendData: number[]; // Weekly paper counts for chart
}

// Trending paper type
interface TrendingPaper {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  year: number;
  views: number;
  citations: number;
  topic: string;
  isBookmarked: boolean;
  trendScore: number;
}

// Mock trending topics
const mockTrendingTopics: TrendingTopic[] = [
  {
    id: "t1",
    name: "Large Language Models",
    paperCount: 15234,
    growthRate: 156,
    weeklyPapers: 423,
    relatedTopics: ["NLP", "Transformers", "AI", "GPT"],
    description:
      "Research on scaling and improving language models for various tasks",
    color: "purple",
    isFollowing: true,
    notificationsEnabled: true,
    trendData: [45, 52, 68, 75, 89, 95, 112, 125, 145, 167, 189, 210],
  },
  {
    id: "t2",
    name: "Multimodal Learning",
    paperCount: 8456,
    growthRate: 89,
    weeklyPapers: 187,
    relatedTopics: ["Vision", "Language", "Audio", "CLIP"],
    description: "Combining multiple data modalities for richer understanding",
    color: "blue",
    isFollowing: false,
    notificationsEnabled: false,
    trendData: [23, 28, 35, 42, 48, 55, 62, 71, 85, 95, 108, 120],
  },
  {
    id: "t3",
    name: "AI Safety & Alignment",
    paperCount: 3421,
    growthRate: 234,
    weeklyPapers: 156,
    relatedTopics: ["Ethics", "RLHF", "Interpretability"],
    description: "Ensuring AI systems are safe and aligned with human values",
    color: "red",
    isFollowing: true,
    notificationsEnabled: true,
    trendData: [12, 18, 25, 35, 48, 62, 78, 95, 115, 138, 162, 190],
  },
  {
    id: "t4",
    name: "Efficient ML",
    paperCount: 6789,
    growthRate: 67,
    weeklyPapers: 98,
    relatedTopics: ["Quantization", "Pruning", "Distillation", "LoRA"],
    description: "Making machine learning more efficient and accessible",
    color: "green",
    isFollowing: false,
    notificationsEnabled: false,
    trendData: [32, 35, 38, 42, 45, 48, 52, 58, 65, 72, 80, 88],
  },
  {
    id: "t5",
    name: "Generative AI",
    paperCount: 12345,
    growthRate: 312,
    weeklyPapers: 567,
    relatedTopics: ["Diffusion", "GANs", "VAEs", "Stable Diffusion"],
    description: "Creating new content using AI models",
    color: "amber",
    isFollowing: true,
    notificationsEnabled: false,
    trendData: [55, 72, 95, 125, 158, 195, 245, 305, 378, 462, 558, 670],
  },
  {
    id: "t6",
    name: "Reinforcement Learning",
    paperCount: 5678,
    growthRate: 45,
    weeklyPapers: 67,
    relatedTopics: ["RL", "Policy Gradient", "Q-Learning", "PPO"],
    description: "Training agents through interaction with environments",
    color: "cyan",
    isFollowing: false,
    notificationsEnabled: false,
    trendData: [42, 45, 48, 52, 55, 58, 62, 65, 68, 72, 76, 80],
  },
];

// Mock trending papers
const mockTrendingPapers: TrendingPaper[] = [
  {
    id: "p1",
    title: "GPT-4 Technical Report: Capabilities and Limitations",
    authors: ["OpenAI Research Team"],
    venue: "arXiv 2024",
    year: 2024,
    views: 125000,
    citations: 2341,
    topic: "Large Language Models",
    isBookmarked: true,
    trendScore: 98,
  },
  {
    id: "p2",
    title: "Scaling Laws for Neural Language Models: A New Perspective",
    authors: ["J. Hoffmann", "S. Borgeaud", "A. Mensch"],
    venue: "NeurIPS 2024",
    year: 2024,
    views: 89000,
    citations: 1567,
    topic: "Large Language Models",
    isBookmarked: false,
    trendScore: 95,
  },
  {
    id: "p3",
    title: "Stable Diffusion 3: Next Generation Image Synthesis",
    authors: ["Stability AI Team"],
    venue: "CVPR 2024",
    year: 2024,
    views: 156000,
    citations: 892,
    topic: "Generative AI",
    isBookmarked: false,
    trendScore: 94,
  },
  {
    id: "p4",
    title: "Constitutional AI: Training Harmless Assistants",
    authors: ["Y. Bai", "S. Kadavath", "A. Askell"],
    venue: "ICLR 2024",
    year: 2024,
    views: 67000,
    citations: 723,
    topic: "AI Safety & Alignment",
    isBookmarked: true,
    trendScore: 92,
  },
  {
    id: "p5",
    title: "QLoRA: Efficient Fine-tuning of Quantized LLMs",
    authors: ["T. Dettmers", "A. Pagnoni", "L. Zettlemoyer"],
    venue: "NeurIPS 2024",
    year: 2024,
    views: 78000,
    citations: 1123,
    topic: "Efficient ML",
    isBookmarked: false,
    trendScore: 91,
  },
  {
    id: "p6",
    title: "LLaVA: Visual Instruction Tuning for Multimodal Models",
    authors: ["H. Liu", "C. Li", "Q. Wu", "Y. J. Lee"],
    venue: "NeurIPS 2024",
    year: 2024,
    views: 92000,
    citations: 1456,
    topic: "Multimodal Learning",
    isBookmarked: false,
    trendScore: 90,
  },
];

const timeFilters = [
  { id: "today", label: "Today" },
  { id: "week", label: "This Week" },
  { id: "month", label: "This Month" },
  { id: "year", label: "This Year" },
];

const getTopicColorClasses = (color: string) => {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    purple: {
      bg: "bg-purple-100 dark:bg-purple-900/30",
      text: "text-purple-600 dark:text-purple-400",
      border: "border-purple-200 dark:border-purple-800",
    },
    blue: {
      bg: "bg-blue-100 dark:bg-blue-900/30",
      text: "text-blue-600 dark:text-blue-400",
      border: "border-blue-200 dark:border-blue-800",
    },
    red: {
      bg: "bg-red-100 dark:bg-red-900/30",
      text: "text-red-600 dark:text-red-400",
      border: "border-red-200 dark:border-red-800",
    },
    green: {
      bg: "bg-green-100 dark:bg-green-900/30",
      text: "text-green-600 dark:text-green-400",
      border: "border-green-200 dark:border-green-800",
    },
    amber: {
      bg: "bg-amber-100 dark:bg-amber-900/30",
      text: "text-amber-600 dark:text-amber-400",
      border: "border-amber-200 dark:border-amber-800",
    },
    cyan: {
      bg: "bg-cyan-100 dark:bg-cyan-900/30",
      text: "text-cyan-600 dark:text-cyan-400",
      border: "border-cyan-200 dark:border-cyan-800",
    },
  };
  return colors[color] || colors.purple;
};

// Interactive Trend Chart Component
function TrendChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const colorClasses: Record<string, string> = {
    purple: "bg-purple-500",
    blue: "bg-blue-500",
    red: "bg-red-500",
    green: "bg-green-500",
    amber: "bg-amber-500",
    cyan: "bg-cyan-500",
    orange: "bg-orange-500",
  };

  return (
    <div className="flex items-end gap-1 h-16">
      {data.map((value, index) => (
        <motion.div
          key={index}
          initial={{ height: 0 }}
          animate={{ height: `${(value / max) * 100}%` }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
          className={`flex-1 rounded-t ${colorClasses[color] || "bg-orange-500"} opacity-80 hover:opacity-100 transition-opacity cursor-pointer relative group`}
        >
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {value} papers
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Topic Network Visualization (simplified)
function TopicNetwork({
  topics,
  selectedTopic,
  onSelect,
}: {
  topics: TrendingTopic[];
  selectedTopic: string | null;
  onSelect: (name: string | null) => void;
}) {
  const getSize = (paperCount: number) => {
    if (paperCount > 10000) return "w-20 h-20";
    if (paperCount > 5000) return "w-16 h-16";
    return "w-12 h-12";
  };

  const colorMap: Record<string, string> = {
    purple: "from-purple-400 to-purple-600",
    blue: "from-blue-400 to-blue-600",
    red: "from-red-400 to-red-600",
    green: "from-green-400 to-green-600",
    amber: "from-amber-400 to-amber-600",
    cyan: "from-cyan-400 to-cyan-600",
  };

  return (
    <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 rounded-xl p-6 min-h-[200px]">
      <div className="flex flex-wrap justify-center gap-4">
        {topics.slice(0, 6).map((topic, index) => (
          <motion.button
            key={topic.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.1, zIndex: 10 }}
            onClick={() =>
              onSelect(selectedTopic === topic.name ? null : topic.name)
            }
            className={`${getSize(topic.paperCount)} rounded-full bg-gradient-to-br ${colorMap[topic.color] || "from-gray-400 to-gray-600"} flex items-center justify-center text-white text-xs font-medium shadow-lg ${selectedTopic === topic.name ? "ring-4 ring-orange-400 ring-offset-2" : ""}`}
          >
            <span className="text-center px-1 leading-tight line-clamp-2">
              {topic.name.split(" ")[0]}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Connection lines (decorative) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
        style={{ zIndex: 0 }}
      >
        <line
          x1="20%"
          y1="30%"
          x2="50%"
          y2="50%"
          stroke="currentColor"
          strokeWidth="1"
          className="text-gray-400"
        />
        <line
          x1="80%"
          y1="30%"
          x2="50%"
          y2="50%"
          stroke="currentColor"
          strokeWidth="1"
          className="text-gray-400"
        />
        <line
          x1="30%"
          y1="70%"
          x2="50%"
          y2="50%"
          stroke="currentColor"
          strokeWidth="1"
          className="text-gray-400"
        />
        <line
          x1="70%"
          y1="70%"
          x2="50%"
          y2="50%"
          stroke="currentColor"
          strokeWidth="1"
          className="text-gray-400"
        />
      </svg>
    </div>
  );
}

// Notification Toggle for Topic
function TopicNotificationToggle({
  isEnabled,
  onToggle,
}: {
  isEnabled: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className={`p-1.5 rounded-lg transition-colors ${
        isEnabled
          ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
          : "bg-gray-100 dark:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
      }`}
      title={isEnabled ? "Notifications enabled" : "Enable notifications"}
    >
      {isEnabled ? (
        <Bell className="h-4 w-4" />
      ) : (
        <BellOff className="h-4 w-4" />
      )}
    </motion.button>
  );
}

export function TrendingPage({
  onNavigate,
  role: propRole,
}: TrendingPageProps) {
  const { role: contextRole } = useRole();
  const effectiveRole = propRole ?? contextRole;
  const user = { ...defaultUser, role: effectiveRole };

  const [selectedTimeFilter, setSelectedTimeFilter] = useState("week");
  const [topics, setTopics] = useState(mockTrendingTopics);
  const [papers, setPapers] = useState(mockTrendingPapers);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "network">("list");

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const toggleFollowTopic = (topicId: string) => {
    setTopics(
      topics.map((t) =>
        t.id === topicId ? { ...t, isFollowing: !t.isFollowing } : t
      )
    );
  };

  const toggleNotifications = (topicId: string) => {
    setTopics(
      topics.map((t) =>
        t.id === topicId
          ? { ...t, notificationsEnabled: !t.notificationsEnabled }
          : t
      )
    );
  };

  const toggleBookmarkPaper = (paperId: string) => {
    setPapers(
      papers.map((p) =>
        p.id === paperId ? { ...p, isBookmarked: !p.isBookmarked } : p
      )
    );
  };

  const filteredPapers = selectedTopic
    ? papers.filter((p) => p.topic === selectedTopic)
    : papers;

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
                  <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl text-white">
                    <Flame className="h-6 w-6" />
                  </div>
                  Trending Research
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Discover the hottest topics and papers in your field
                </p>
              </div>
              <div className="flex items-center gap-3">
                {/* View Mode Toggle */}
                <div className="flex bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("list")}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                      viewMode === "list"
                        ? "bg-orange-500 text-white"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <LineChart className="h-4 w-4" />
                    List
                  </button>
                  <button
                    onClick={() => setViewMode("network")}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                      viewMode === "network"
                        ? "bg-orange-500 text-white"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <Network className="h-4 w-4" />
                    Network
                  </button>
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
            </div>

            {/* Time Filter & Search */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex gap-2 bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
                {timeFilters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedTimeFilter(filter.id)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      selectedTimeFilter === filter.id
                        ? "bg-orange-500 text-white"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search trending topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          </motion.div>

          {/* Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            {[
              {
                label: "Trending Topics",
                value: topics.length,
                icon: Hash,
                color: "orange",
              },
              {
                label: "Hot Papers",
                value: papers.length,
                icon: Flame,
                color: "red",
              },
              {
                label: "Following",
                value: topics.filter((t) => t.isFollowing).length,
                icon: Star,
                color: "amber",
              },
              {
                label: "Total Views",
                value: formatNumber(
                  papers.reduce((acc, p) => acc + p.views, 0)
                ),
                icon: Eye,
                color: "blue",
              },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/30`}
                  >
                    <stat.icon
                      className={`h-5 w-5 text-${stat.color}-600 dark:text-${stat.color}-400`}
                    />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Topic Network View */}
          {viewMode === "network" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Network className="h-5 w-5 text-orange-500" />
                    Topic Network
                  </h2>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Click a topic to filter papers
                  </span>
                </div>
                <TopicNetwork
                  topics={topics}
                  selectedTopic={selectedTopic}
                  onSelect={setSelectedTopic}
                />
              </div>
            </motion.div>
          )}

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Trending Topics */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-orange-500" />
                    Trending Topics
                  </h2>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {topics.map((topic, index) => {
                    const colors = getTopicColorClasses(topic.color);
                    return (
                      <motion.button
                        key={topic.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        onClick={() =>
                          setSelectedTopic(
                            selectedTopic === topic.name ? null : topic.name
                          )
                        }
                        className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                          selectedTopic === topic.name
                            ? "bg-orange-50 dark:bg-orange-900/20"
                            : ""
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-lg font-bold text-gray-400">
                                #{index + 1}
                              </span>
                              <h3 className="font-medium text-gray-900 dark:text-white">
                                {topic.name}
                              </h3>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 mb-2">
                              {topic.description}
                            </p>
                            <div className="flex items-center gap-3 text-sm">
                              <span className="text-gray-500 dark:text-gray-400">
                                {formatNumber(topic.paperCount)} papers
                              </span>
                              <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                                <ArrowUp className="h-3 w-3" />
                                {topic.growthRate}%
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {topic.isFollowing && (
                              <TopicNotificationToggle
                                isEnabled={topic.notificationsEnabled}
                                onToggle={() => toggleNotifications(topic.id)}
                              />
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFollowTopic(topic.id);
                              }}
                              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                topic.isFollowing
                                  ? "bg-orange-500 text-white"
                                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                              }`}
                            >
                              {topic.isFollowing ? "Following" : "Follow"}
                            </button>
                          </div>
                        </div>
                        {/* Trend Chart */}
                        <div className="mt-2">
                          <TrendChart
                            data={topic.trendData}
                            color={topic.color}
                          />
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Trending Papers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Zap className="h-5 w-5 text-amber-500" />
                    {selectedTopic
                      ? `Hot Papers in ${selectedTopic}`
                      : "Hot Papers"}
                  </h2>
                  {selectedTopic && (
                    <button
                      onClick={() => setSelectedTopic(null)}
                      className="text-sm text-orange-600 hover:text-orange-700 dark:text-orange-400"
                    >
                      Show All
                    </button>
                  )}
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  <AnimatePresence mode="popLayout">
                    {filteredPapers.map((paper, index) => (
                      <motion.div
                        key={paper.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: 0.05 * index }}
                        className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold">
                            #{index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <button
                              onClick={() => onNavigate(`/papers/${paper.id}`)}
                              className="text-left"
                            >
                              <h3 className="font-medium text-gray-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 line-clamp-2">
                                {paper.title}
                              </h3>
                            </button>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {paper.authors.join(", ")}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-sm">
                              <span className="text-gray-500 dark:text-gray-400">
                                {paper.venue}
                              </span>
                              <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                <Eye className="h-3.5 w-3.5" />
                                {formatNumber(paper.views)}
                              </span>
                              <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                <BookOpen className="h-3.5 w-3.5" />
                                {formatNumber(paper.citations)}
                              </span>
                              <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded text-xs">
                                {paper.topic}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-right mr-2">
                              <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                                {paper.trendScore}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                Score
                              </div>
                            </div>
                            <button
                              onClick={() => toggleBookmarkPaper(paper.id)}
                              className={`p-2 rounded-lg transition-colors ${
                                paper.isBookmarked
                                  ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                                  : "bg-gray-100 dark:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                              }`}
                            >
                              <Bookmark
                                className={`h-4 w-4 ${paper.isBookmarked ? "fill-current" : ""}`}
                              />
                            </button>
                            <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                              <Share2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                {/* View More */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => onNavigate("/papers/search")}
                    className="w-full flex items-center justify-center gap-2 py-2 text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium"
                  >
                    View All Trending Papers
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
