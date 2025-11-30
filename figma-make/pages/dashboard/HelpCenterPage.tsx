"use client";

/**
 * HelpCenterPage - User Support and Documentation
 *
 * Enhanced with:
 * - AI chatbot integration with floating widget
 * - Interactive tutorials with step-by-step guides
 * - Video walkthroughs with playback controls
 * - Community forum links
 */

import {
  BookOpen,
  Bot,
  ChevronDown,
  ChevronRight,
  Clock,
  CreditCard,
  ExternalLink,
  FileText,
  FolderOpen,
  HelpCircle,
  Mail,
  MessageCircle,
  MessageSquare,
  Play,
  PlayCircle,
  Search,
  Send,
  Shield,
  Sparkles,
  Star,
  ThumbsDown,
  ThumbsUp,
  Users,
  Video,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useRef, useState } from "react";

import { useRole, type UserRole } from "../../components/context";
import { DashboardLayout } from "../../components/layout/DashboardLayout";

interface HelpCenterPageProps {
  onNavigate: (path: string) => void;
  role?: UserRole;
}

interface HelpCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  articles: HelpArticle[];
}

interface HelpArticle {
  id: string;
  title: string;
  summary: string;
  views: number;
  helpful: number;
  lastUpdated: string;
  readTime: number;
  tags: string[];
}

interface FeaturedGuide {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  type: "video" | "article" | "interactive";
  duration: string;
}

const helpCategories: HelpCategory[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "Learn the basics of ScholarFlow",
    icon: <Zap className="h-5 w-5" />,
    color: "from-blue-500 to-blue-600",
    articles: [
      {
        id: "1",
        title: "Welcome to ScholarFlow",
        summary: "An introduction to the platform and its core features",
        views: 15234,
        helpful: 94,
        lastUpdated: "2 days ago",
        readTime: 5,
        tags: ["basics", "introduction"],
      },
      {
        id: "2",
        title: "Setting up your profile",
        summary: "Complete your researcher profile for better collaboration",
        views: 8976,
        helpful: 92,
        lastUpdated: "1 week ago",
        readTime: 3,
        tags: ["profile", "setup"],
      },
      {
        id: "3",
        title: "Navigating the dashboard",
        summary: "Understanding the main interface and navigation",
        views: 12453,
        helpful: 89,
        lastUpdated: "3 days ago",
        readTime: 4,
        tags: ["navigation", "dashboard"],
      },
    ],
  },
  {
    id: "papers",
    title: "Papers & Documents",
    description: "Upload, organize, and manage research papers",
    icon: <FileText className="h-5 w-5" />,
    color: "from-emerald-500 to-emerald-600",
    articles: [
      {
        id: "4",
        title: "Uploading papers",
        summary: "How to upload PDFs and other document formats",
        views: 23456,
        helpful: 96,
        lastUpdated: "1 day ago",
        readTime: 4,
        tags: ["upload", "pdf"],
      },
      {
        id: "5",
        title: "Automatic metadata extraction",
        summary: "Understanding how we extract paper information",
        views: 7823,
        helpful: 88,
        lastUpdated: "5 days ago",
        readTime: 6,
        tags: ["metadata", "ai"],
      },
      {
        id: "6",
        title: "Managing paper annotations",
        summary: "Add highlights, notes, and comments to your papers",
        views: 9234,
        helpful: 91,
        lastUpdated: "2 days ago",
        readTime: 5,
        tags: ["annotations", "notes"],
      },
    ],
  },
  {
    id: "collections",
    title: "Collections & Organization",
    description: "Create and manage paper collections",
    icon: <FolderOpen className="h-5 w-5" />,
    color: "from-amber-500 to-amber-600",
    articles: [
      {
        id: "7",
        title: "Creating collections",
        summary: "Organize papers into themed collections",
        views: 11234,
        helpful: 93,
        lastUpdated: "4 days ago",
        readTime: 4,
        tags: ["collections", "organization"],
      },
      {
        id: "8",
        title: "Sharing collections",
        summary: "Share your collections with collaborators",
        views: 6543,
        helpful: 87,
        lastUpdated: "1 week ago",
        readTime: 3,
        tags: ["sharing", "collaboration"],
      },
    ],
  },
  {
    id: "ai-features",
    title: "AI & Insights",
    description: "Leverage AI-powered research tools",
    icon: <Sparkles className="h-5 w-5" />,
    color: "from-purple-500 to-purple-600",
    articles: [
      {
        id: "9",
        title: "AI-powered summaries",
        summary: "Get instant summaries of research papers",
        views: 18234,
        helpful: 95,
        lastUpdated: "1 day ago",
        readTime: 5,
        tags: ["ai", "summaries"],
      },
      {
        id: "10",
        title: "Smart recommendations",
        summary: "Discover related papers through AI",
        views: 14567,
        helpful: 91,
        lastUpdated: "3 days ago",
        readTime: 4,
        tags: ["recommendations", "discovery"],
      },
      {
        id: "11",
        title: "Citation analysis",
        summary: "Understand citation networks and impact",
        views: 8765,
        helpful: 89,
        lastUpdated: "1 week ago",
        readTime: 6,
        tags: ["citations", "analysis"],
      },
    ],
  },
  {
    id: "collaboration",
    title: "Collaboration",
    description: "Work together with your research team",
    icon: <Users className="h-5 w-5" />,
    color: "from-pink-500 to-pink-600",
    articles: [
      {
        id: "12",
        title: "Inviting team members",
        summary: "Add collaborators to your workspaces",
        views: 7654,
        helpful: 90,
        lastUpdated: "2 days ago",
        readTime: 3,
        tags: ["team", "invitations"],
      },
      {
        id: "13",
        title: "Real-time collaboration",
        summary: "Work on papers simultaneously with team",
        views: 5432,
        helpful: 88,
        lastUpdated: "5 days ago",
        readTime: 5,
        tags: ["realtime", "collaboration"],
      },
    ],
  },
  {
    id: "billing",
    title: "Billing & Subscriptions",
    description: "Manage your plan and payments",
    icon: <CreditCard className="h-5 w-5" />,
    color: "from-cyan-500 to-cyan-600",
    articles: [
      {
        id: "14",
        title: "Understanding pricing plans",
        summary: "Compare features across different plans",
        views: 12345,
        helpful: 87,
        lastUpdated: "1 week ago",
        readTime: 5,
        tags: ["pricing", "plans"],
      },
      {
        id: "15",
        title: "Upgrading your plan",
        summary: "How to upgrade to Pro or Team plans",
        views: 4567,
        helpful: 92,
        lastUpdated: "3 days ago",
        readTime: 3,
        tags: ["upgrade", "subscription"],
      },
    ],
  },
  {
    id: "security",
    title: "Security & Privacy",
    description: "Keep your research data safe",
    icon: <Shield className="h-5 w-5" />,
    color: "from-red-500 to-red-600",
    articles: [
      {
        id: "16",
        title: "Two-factor authentication",
        summary: "Add an extra layer of security",
        views: 6789,
        helpful: 94,
        lastUpdated: "4 days ago",
        readTime: 4,
        tags: ["2fa", "security"],
      },
      {
        id: "17",
        title: "Data privacy settings",
        summary: "Control who sees your research",
        views: 5432,
        helpful: 90,
        lastUpdated: "2 days ago",
        readTime: 5,
        tags: ["privacy", "settings"],
      },
    ],
  },
];

const featuredGuides: FeaturedGuide[] = [
  {
    id: "1",
    title: "Quick Start Guide",
    description: "Get up and running in 5 minutes",
    icon: <Zap className="h-6 w-6" />,
    color: "from-blue-500 to-indigo-600",
    type: "video",
    duration: "5 min",
  },
  {
    id: "2",
    title: "Mastering AI Features",
    description: "Unlock the power of AI research tools",
    icon: <Sparkles className="h-6 w-6" />,
    color: "from-purple-500 to-pink-600",
    type: "interactive",
    duration: "10 min",
  },
  {
    id: "3",
    title: "Collaboration Best Practices",
    description: "Tips for effective team research",
    icon: <Users className="h-6 w-6" />,
    color: "from-emerald-500 to-teal-600",
    type: "article",
    duration: "8 min",
  },
];

const popularSearches = [
  "upload papers",
  "share collection",
  "AI summary",
  "team invite",
  "export citations",
  "change password",
];

// Video tutorials data
const videoTutorials = [
  {
    id: "v1",
    title: "Getting Started with ScholarFlow",
    description: "A complete walkthrough of the platform",
    duration: "5:30",
    views: 12500,
    thumbnail:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&fit=crop",
    category: "Getting Started",
  },
  {
    id: "v2",
    title: "Uploading and Organizing Papers",
    description: "Learn how to manage your research library",
    duration: "4:15",
    views: 8900,
    thumbnail:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=225&fit=crop",
    category: "Papers",
  },
  {
    id: "v3",
    title: "Using AI-Powered Features",
    description: "Master the AI tools for research insights",
    duration: "6:45",
    views: 15200,
    thumbnail:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=225&fit=crop",
    category: "AI Features",
  },
  {
    id: "v4",
    title: "Team Collaboration Best Practices",
    description: "Work effectively with your research team",
    duration: "7:20",
    views: 6800,
    thumbnail:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=225&fit=crop",
    category: "Collaboration",
  },
];

// Interactive tutorials data
const interactiveTutorials = [
  {
    id: "t1",
    title: "Upload Your First Paper",
    steps: 5,
    completedSteps: 0,
    estimatedTime: "3 min",
    icon: FileText,
  },
  {
    id: "t2",
    title: "Create a Collection",
    steps: 4,
    completedSteps: 0,
    estimatedTime: "2 min",
    icon: FolderOpen,
  },
  {
    id: "t3",
    title: "Generate AI Summary",
    steps: 3,
    completedSteps: 0,
    estimatedTime: "2 min",
    icon: Sparkles,
  },
  {
    id: "t4",
    title: "Invite Team Members",
    steps: 4,
    completedSteps: 0,
    estimatedTime: "3 min",
    icon: Users,
  },
];

// Community forum links
const communityLinks = [
  {
    id: "c1",
    title: "Discussion Forums",
    description: "Join conversations with other researchers",
    icon: MessageCircle,
    link: "/community/forums",
    members: "12.5K",
  },
  {
    id: "c2",
    title: "Feature Requests",
    description: "Suggest and vote on new features",
    icon: Sparkles,
    link: "/community/feature-requests",
    members: "8.2K",
  },
  {
    id: "c3",
    title: "Research Tips",
    description: "Share and discover research methodologies",
    icon: BookOpen,
    link: "/community/research-tips",
    members: "15.8K",
  },
];

// Community forums data
const communityForums = [
  {
    id: "general",
    title: "General Discussion",
    description:
      "Connect with researchers worldwide and discuss academic topics",
    color: "from-violet-500 to-purple-500",
    link: "/community/general",
    members: 12500,
    activeNow: 234,
    topics: 1847,
  },
  {
    id: "research",
    title: "Research Methods",
    description: "Share methodologies and best practices for academic research",
    color: "from-blue-500 to-cyan-500",
    link: "/community/research",
    members: 8200,
    activeNow: 156,
    topics: 923,
  },
  {
    id: "technical",
    title: "Technical Support",
    description: "Get help with platform features and troubleshooting",
    color: "from-amber-500 to-orange-500",
    link: "/community/technical",
    members: 5600,
    activeNow: 89,
    topics: 654,
  },
  {
    id: "showcase",
    title: "Research Showcase",
    description: "Share your published work and get feedback from peers",
    color: "from-emerald-500 to-teal-500",
    link: "/community/showcase",
    members: 9800,
    activeNow: 178,
    topics: 1256,
  },
];

// AI Chatbot suggested questions
const suggestedQuestions = [
  "How do I upload a paper?",
  "What AI features are available?",
  "How can I share my collection?",
  "How do I invite team members?",
];

export function HelpCenterPage({
  onNavigate,
  role: propRole,
}: HelpCenterPageProps) {
  const { role: contextRole } = useRole();
  const effectiveRole = propRole ?? contextRole;
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<HelpArticle | null>(
    null
  );

  // AI Chatbot state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([
    {
      role: "assistant",
      content: "Hi! I'm ScholarFlow's AI assistant. How can I help you today?",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Video player state
  const [selectedVideo, setSelectedVideo] = useState<
    (typeof videoTutorials)[0] | null
  >(null);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Tutorial state
  const [activeTutorial, setActiveTutorial] = useState<string | null>(null);
  const [tutorialStep, setTutorialStep] = useState(0);

  // Scroll chat to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Handle chat message submission
  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    setChatMessages((prev) => [
      ...prev,
      { role: "user", content: userMessage },
    ]);
    setChatInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, string> = {
        upload:
          "To upload a paper, click the 'Upload' button in the top navigation or drag and drop your PDF directly into any collection. We support PDF, DOC, and DOCX formats.",
        ai: "ScholarFlow offers several AI features: automatic summaries, citation extraction, related paper recommendations, and smart search. You can access these from any paper's detail page.",
        share:
          "To share a collection, open the collection and click the 'Share' button. You can invite specific team members or create a shareable link with customizable permissions.",
        team: "To invite team members, go to Settings > Team and click 'Invite Member'. Enter their email addresses, and they'll receive an invitation to join your workspace.",
        default:
          "I'd be happy to help with that! Could you provide more details about what you're trying to accomplish? You can also browse our help articles for step-by-step guides.",
      };

      const lowerMessage = userMessage.toLowerCase();
      let response = responses.default;

      if (lowerMessage.includes("upload") || lowerMessage.includes("paper")) {
        response = responses.upload;
      } else if (
        lowerMessage.includes("ai") ||
        lowerMessage.includes("summary") ||
        lowerMessage.includes("feature")
      ) {
        response = responses.ai;
      } else if (
        lowerMessage.includes("share") ||
        lowerMessage.includes("collection")
      ) {
        response = responses.share;
      } else if (
        lowerMessage.includes("team") ||
        lowerMessage.includes("invite") ||
        lowerMessage.includes("member")
      ) {
        response = responses.team;
      }

      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: response },
      ]);
      setIsTyping(false);
    }, 1500);
  };

  const defaultUser = {
    name: "Atik Rahaman",
    email: "atik@example.com",
    role: "researcher" as const,
  };
  const user = { ...defaultUser, role: effectiveRole };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((c) => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Filter categories based on search
  const filteredCategories = helpCategories
    .map((category) => ({
      ...category,
      articles: category.articles.filter(
        (article) =>
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      ),
    }))
    .filter(
      (category) =>
        category.articles.length > 0 ||
        category.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <DashboardLayout user={user} onNavigate={onNavigate}>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/25">
              <HelpCircle className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">
            How can we help you?
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Search our knowledge base or browse categories to find answers
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-10 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700
                       bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-lg
                       focus:ring-2 focus:ring-violet-500 focus:border-violet-500
                       placeholder:text-slate-400 shadow-lg shadow-slate-200/50 dark:shadow-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full
                         hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="h-5 w-5 text-slate-400" />
              </button>
            )}
          </div>

          {/* Popular Searches */}
          {!searchQuery && (
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              <span className="text-sm text-slate-500">Popular:</span>
              {popularSearches.map((search) => (
                <button
                  key={search}
                  onClick={() => setSearchQuery(search)}
                  className="px-3 py-1 rounded-full text-sm bg-slate-100 dark:bg-slate-700
                           text-slate-600 dark:text-slate-300 hover:bg-violet-100 dark:hover:bg-violet-900/30
                           hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                >
                  {search}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Featured Guides */}
        {!searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-500" />
              Featured Guides
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              {featuredGuides.map((guide, index) => (
                <motion.button
                  key={guide.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="text-left p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700
                           shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${guide.color} 
                               flex items-center justify-center text-white mb-4 shadow-lg`}
                  >
                    {guide.icon}
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                    {guide.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    {guide.description}
                  </p>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium
                                ${
                                  guide.type === "video"
                                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                    : guide.type === "interactive"
                                      ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                                      : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                }`}
                    >
                      {guide.type === "video" && (
                        <Video className="h-3 w-3 inline mr-1" />
                      )}
                      {guide.type}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {guide.duration}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Help Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-violet-500" />
            Browse by Category
          </h2>

          {searchQuery && filteredCategories.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <Search className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                No results found
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-4">
                We couldn't find any help articles matching "{searchQuery}"
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="text-violet-600 dark:text-violet-400 hover:underline"
              >
                Clear search
              </button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {(searchQuery ? filteredCategories : helpCategories).map(
                (category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700
                             shadow-sm overflow-hidden"
                  >
                    {/* Category Header */}
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="w-full flex items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-3 rounded-xl bg-gradient-to-br ${category.color} text-white shadow-lg`}
                        >
                          {category.icon}
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold text-slate-900 dark:text-white">
                            {category.title}
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {category.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-xs text-slate-600 dark:text-slate-400">
                          {category.articles.length} articles
                        </span>
                        <motion.div
                          animate={{
                            rotate: expandedCategories.includes(category.id)
                              ? 180
                              : 0,
                          }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="h-5 w-5 text-slate-400" />
                        </motion.div>
                      </div>
                    </button>

                    {/* Articles List */}
                    <AnimatePresence>
                      {expandedCategories.includes(category.id) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-slate-100 dark:border-slate-700">
                            {category.articles.map((article, idx) => (
                              <button
                                key={article.id}
                                onClick={() => setSelectedArticle(article)}
                                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50
                                         transition-colors text-left border-b border-slate-100 dark:border-slate-700 last:border-0"
                              >
                                <div className="flex-1 min-w-0 pr-4">
                                  <h4 className="font-medium text-slate-900 dark:text-white truncate">
                                    {article.title}
                                  </h4>
                                  <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                                    {article.summary}
                                  </p>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-slate-400">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {article.readTime} min
                                  </span>
                                  <ChevronRight className="h-4 w-4" />
                                </div>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              )}
            </div>
          )}
        </motion.div>

        {/* Video Tutorials Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12"
        >
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Video className="h-5 w-5 text-violet-500" />
            Video Tutorials
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {videoTutorials.map((video, index) => (
              <motion.button
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                onClick={() => setActiveVideo(video.id)}
                className="group relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 
                         dark:border-slate-700 shadow-sm overflow-hidden hover:shadow-lg transition-all text-left"
              >
                <div
                  className="aspect-video bg-gradient-to-br from-violet-500/20 to-purple-500/20 
                              flex items-center justify-center relative"
                >
                  <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/40 transition-colors" />
                  <div
                    className="w-14 h-14 rounded-full bg-white/90 dark:bg-slate-800/90 flex items-center justify-center
                                shadow-lg group-hover:scale-110 transition-transform"
                  >
                    <PlayCircle className="h-8 w-8 text-violet-600" />
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-black/70 text-white text-xs">
                    {video.duration}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-slate-900 dark:text-white mb-1">
                    {video.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                    {video.description}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="px-2 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30 text-xs text-violet-600 dark:text-violet-400">
                      {video.category}
                    </span>
                    <span className="text-xs text-slate-400">
                      {video.views} views
                    </span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Interactive Tutorials Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mt-12"
        >
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-violet-500" />
            Interactive Tutorials
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {interactiveTutorials.map((tutorial, index) => (
              <motion.button
                key={tutorial.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 + index * 0.05 }}
                onClick={() => {
                  setActiveTutorial(tutorial.id);
                  setTutorialStep(0);
                }}
                className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 
                         dark:border-slate-700 shadow-sm p-6 hover:shadow-lg hover:border-violet-300 
                         dark:hover:border-violet-700 transition-all text-left"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 text-white shadow-lg">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {tutorial.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {tutorial.steps.length} steps • {tutorial.estimatedTime}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  {tutorial.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-xs text-emerald-600 dark:text-emerald-400">
                    {tutorial.difficulty}
                  </span>
                  <span className="text-violet-600 dark:text-violet-400 text-sm font-medium group-hover:underline flex items-center gap-1">
                    Start Tutorial
                    <ChevronRight className="h-4 w-4" />
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Community Forums Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Users className="h-5 w-5 text-violet-500" />
            Community Forums
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {communityForums.map((forum, index) => (
              <motion.button
                key={forum.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                onClick={() => onNavigate(forum.link)}
                className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 
                         dark:border-slate-700 shadow-sm p-5 hover:shadow-lg hover:border-violet-300 
                         dark:hover:border-violet-700 transition-all text-left"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`p-2.5 rounded-xl bg-gradient-to-br ${forum.color} text-white`}
                  >
                    {forum.id === "general" && (
                      <MessageCircle className="h-5 w-5" />
                    )}
                    {forum.id === "research" && (
                      <BookOpen className="h-5 w-5" />
                    )}
                    {forum.id === "technical" && <Zap className="h-5 w-5" />}
                    {forum.id === "showcase" && <Star className="h-5 w-5" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {forum.title}
                    </h3>
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  {forum.description}
                </p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">
                    {forum.members.toLocaleString()} members
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    {forum.activeNow} online
                  </span>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {forum.topics} topics
                  </span>
                  <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-violet-500 transition-colors" />
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="mt-12 p-6 rounded-2xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 
                   border border-violet-200 dark:border-violet-800"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                Still need help?
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Our support team is available 24/7 to assist you
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate("/contact")}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 
                         border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300
                         hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <Mail className="h-4 w-4" />
                Email Support
              </button>
              <button
                onClick={() => onNavigate("/discussions")}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 text-white
                         hover:bg-violet-700 transition-colors shadow-lg shadow-violet-600/25"
              >
                <MessageSquare className="h-4 w-4" />
                Community Forum
              </button>
            </div>
          </div>
        </motion.div>

        {/* Article Modal */}
        <AnimatePresence>
          {selectedArticle && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedArticle(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                      {selectedArticle.title}
                    </h2>
                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {selectedArticle.readTime} min read
                      </span>
                      <span>Updated {selectedArticle.lastUpdated}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <X className="h-5 w-5 text-slate-400" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                  <p className="text-slate-600 dark:text-slate-300 mb-6">
                    {selectedArticle.summary}
                  </p>

                  {/* Placeholder content */}
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-slate-600 dark:text-slate-400">
                      This is a placeholder for the full article content. In a
                      real implementation, this would contain the complete help
                      documentation with step-by-step instructions, images, and
                      code examples where applicable.
                    </p>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                      Key Points
                    </h3>
                    <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                      <li>• Step-by-step instructions would appear here</li>
                      <li>• Screenshots and visual guides would be included</li>
                      <li>• Common troubleshooting tips would be listed</li>
                      <li>• Related articles would be linked at the bottom</li>
                    </ul>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                    {selectedArticle.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 
                                 text-sm text-slate-600 dark:text-slate-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-between p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Was this helpful?
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 
                                     text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      Yes ({selectedArticle.helpful}%)
                    </button>
                    <button
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 
                                     text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    >
                      <ThumbsDown className="h-4 w-4" />
                      No
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Video Tutorial Modal */}
        <AnimatePresence>
          {activeVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setActiveVideo(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-4xl bg-slate-900 rounded-2xl shadow-2xl overflow-hidden"
              >
                {/* Video Player */}
                <div className="aspect-video bg-black flex items-center justify-center relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                        <Play className="h-10 w-10 text-white ml-1" />
                      </div>
                      <p className="text-white/60 text-sm">
                        Video player placeholder
                      </p>
                    </div>
                  </div>
                  {/* Video Controls */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="flex items-center gap-4">
                      <button className="p-2 rounded-full hover:bg-white/20 transition-colors">
                        <Play className="h-5 w-5 text-white" />
                      </button>
                      <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                        <div className="w-1/3 h-full bg-violet-500" />
                      </div>
                      <span className="text-white/80 text-sm">
                        {
                          videoTutorials.find((v) => v.id === activeVideo)
                            ?.duration
                        }
                      </span>
                    </div>
                  </div>
                </div>
                {/* Video Info */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {videoTutorials.find((v) => v.id === activeVideo)?.title}
                  </h3>
                  <p className="text-slate-400">
                    {
                      videoTutorials.find((v) => v.id === activeVideo)
                        ?.description
                    }
                  </p>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700">
                    <span className="text-slate-500 text-sm">
                      {videoTutorials.find((v) => v.id === activeVideo)?.views}{" "}
                      views
                    </span>
                    <button
                      onClick={() => setActiveVideo(null)}
                      className="px-4 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Interactive Tutorial Modal */}
        <AnimatePresence>
          {activeTutorial && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden"
              >
                {(() => {
                  const tutorial = interactiveTutorials.find(
                    (t) => t.id === activeTutorial
                  );
                  const currentStepData = tutorial?.steps[tutorialStep];
                  return (
                    <>
                      {/* Tutorial Header */}
                      <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-violet-500 to-purple-500">
                        <div>
                          <h2 className="text-xl font-semibold text-white">
                            {tutorial?.title}
                          </h2>
                          <p className="text-violet-100 text-sm mt-1">
                            Step {tutorialStep + 1} of {tutorial?.steps.length}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setActiveTutorial(null);
                            setTutorialStep(0);
                          }}
                          className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                        >
                          <X className="h-5 w-5 text-white" />
                        </button>
                      </div>

                      {/* Progress Bar */}
                      <div className="h-1 bg-slate-200 dark:bg-slate-700">
                        <motion.div
                          className="h-full bg-violet-500"
                          initial={{ width: 0 }}
                          animate={{
                            width: `${((tutorialStep + 1) / (tutorial?.steps.length || 1)) * 100}%`,
                          }}
                        />
                      </div>

                      {/* Tutorial Content */}
                      <div className="p-8">
                        <motion.div
                          key={tutorialStep}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                            {currentStepData?.title}
                          </h3>
                          <p className="text-slate-600 dark:text-slate-400 mb-6">
                            {currentStepData?.content}
                          </p>

                          {/* Interactive Demo Area */}
                          <div className="p-6 rounded-xl bg-slate-100 dark:bg-slate-700/50 border-2 border-dashed border-slate-300 dark:border-slate-600 mb-6">
                            <div className="text-center">
                              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                                <Sparkles className="h-8 w-8 text-violet-600 dark:text-violet-400" />
                              </div>
                              <p className="text-slate-500 dark:text-slate-400 text-sm">
                                Interactive demo element for step{" "}
                                {tutorialStep + 1}
                              </p>
                              <p className="text-slate-400 dark:text-slate-500 text-xs mt-2">
                                Try the action described above
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      </div>

                      {/* Tutorial Footer */}
                      <div className="flex items-center justify-between p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                        <button
                          onClick={() =>
                            setTutorialStep(Math.max(0, tutorialStep - 1))
                          }
                          disabled={tutorialStep === 0}
                          className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400
                                   hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        <div className="flex gap-2">
                          {tutorial?.steps.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setTutorialStep(idx)}
                              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                                idx === tutorialStep
                                  ? "bg-violet-500"
                                  : idx < tutorialStep
                                    ? "bg-violet-300 dark:bg-violet-700"
                                    : "bg-slate-300 dark:bg-slate-600"
                              }`}
                            />
                          ))}
                        </div>
                        {tutorialStep < (tutorial?.steps.length || 1) - 1 ? (
                          <button
                            onClick={() => setTutorialStep(tutorialStep + 1)}
                            className="px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition-colors"
                          >
                            Next Step
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setActiveTutorial(null);
                              setTutorialStep(0);
                            }}
                            className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                          >
                            Complete
                          </button>
                        )}
                      </div>
                    </>
                  );
                })()}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* AI Chatbot Floating Widget */}
      <AnimatePresence>
        {isChatOpen ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-6 right-6 w-96 h-[500px] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl 
                     border border-slate-200 dark:border-slate-700 z-50 flex flex-col overflow-hidden"
          >
            {/* Chat Header */}
            <div className="p-4 bg-gradient-to-r from-violet-500 to-purple-500 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">ScholarFlow AI</h3>
                  <p className="text-violet-100 text-xs flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Online • Ready to help
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-2 rounded-lg hover:bg-white/20 transition-colors"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2.5 rounded-2xl ${
                      msg.role === "user"
                        ? "bg-violet-600 text-white rounded-br-md"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white rounded-bl-md"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && chatInput.trim()) {
                      setChatMessages([
                        ...chatMessages,
                        { role: "user", content: chatInput },
                        {
                          role: "assistant",
                          content:
                            "I'm here to help! Let me look into that for you...",
                        },
                      ]);
                      setChatInput("");
                    }
                  }}
                  placeholder="Ask me anything..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 border-0
                           text-slate-900 dark:text-white placeholder:text-slate-400 
                           focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
                <button
                  onClick={() => {
                    if (chatInput.trim()) {
                      setChatMessages([
                        ...chatMessages,
                        { role: "user", content: chatInput },
                        {
                          role: "assistant",
                          content:
                            "I'm here to help! Let me look into that for you...",
                        },
                      ]);
                      setChatInput("");
                    }
                  }}
                  className="p-2.5 rounded-xl bg-violet-600 text-white hover:bg-violet-700 transition-colors"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-2 text-center">
                Powered by AI • Responses are generated
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsChatOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 
                     text-white shadow-lg shadow-violet-500/30 z-50 flex items-center justify-center
                     hover:shadow-xl hover:shadow-violet-500/40 transition-shadow"
          >
            <Bot className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-800" />
          </motion.button>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}

export default HelpCenterPage;
