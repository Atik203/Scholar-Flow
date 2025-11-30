"use client";

import {
  ArrowUp,
  Bot,
  Brain,
  Check,
  ChevronDown,
  Clock,
  Copy,
  Crown,
  FileText,
  Globe,
  History,
  Image,
  Lightbulb,
  Loader2,
  Paperclip,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  Upload,
  User,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { useRole, type UserRole } from "../../components/context";
import { DashboardLayout } from "../../components/layout/DashboardLayout";

// ============================================================================
// Default User for Demo
// ============================================================================
const defaultUser = {
  name: "John Researcher",
  email: "john@example.com",
  image: undefined,
  role: "researcher" as const,
};

interface AIInsightsPageProps {
  onNavigate?: (path: string) => void;
  role?: UserRole;
}

// ============================================================================
// Utility Functions
// ============================================================================
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ============================================================================
// Types
// ============================================================================
interface Paper {
  id: string;
  title: string;
  abstract: string;
  authors: string[];
  year: number;
  processingStatus: string;
  selected?: boolean;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  attachments?: { type: "image" | "file"; name: string }[];
  sources?: { title: string; url?: string }[];
  isDeepResearch?: boolean;
  isSearching?: boolean;
}

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  papers: string[];
}

// ============================================================================
// AI Models Configuration
// ============================================================================
const AI_MODELS = [
  {
    value: "gemini-3-flash",
    label: "Gemini 3 Flash",
    description: "Fast & efficient",
    tier: "free",
    icon: "⚡",
  },
  {
    value: "gpt-5.1-mini",
    label: "GPT 5.1 Mini",
    description: "Balanced performance",
    tier: "free",
    icon: "🎯",
  },
  {
    value: "gpt-5.1",
    label: "GPT 5.1",
    description: "Most capable",
    tier: "premium",
    icon: "🚀",
  },
  {
    value: "opus-4.5",
    label: "Opus 4.5",
    description: "Best for research",
    tier: "premium",
    icon: "🧠",
  },
  {
    value: "gemini-3-ultra",
    label: "Gemini 3 Ultra",
    description: "Multimodal expert",
    tier: "premium",
    icon: "✨",
  },
];

// ============================================================================
// Dummy Data
// ============================================================================
const dummyPapers: Paper[] = [
  {
    id: "paper-1",
    title: "Attention Is All You Need",
    abstract:
      "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks...",
    authors: ["Ashish Vaswani", "Noam Shazeer", "Niki Parmar"],
    year: 2017,
    processingStatus: "PROCESSED",
    selected: true,
  },
  {
    id: "paper-2",
    title: "BERT: Pre-training of Deep Bidirectional Transformers",
    abstract: "We introduce a new language representation model called BERT...",
    authors: ["Jacob Devlin", "Ming-Wei Chang"],
    year: 2018,
    processingStatus: "PROCESSED",
    selected: true,
  },
  {
    id: "paper-3",
    title: "GPT-3: Language Models are Few-Shot Learners",
    abstract:
      "Recent work has demonstrated substantial gains on many NLP tasks...",
    authors: ["Tom B. Brown", "Benjamin Mann"],
    year: 2020,
    processingStatus: "PROCESSED",
    selected: false,
  },
  {
    id: "paper-4",
    title: "Deep Residual Learning for Image Recognition",
    abstract: "Deeper neural networks are more difficult to train...",
    authors: ["Kaiming He", "Xiangyu Zhang"],
    year: 2015,
    processingStatus: "PROCESSING",
    selected: false,
  },
  {
    id: "paper-5",
    title: "ImageNet Classification with Deep Convolutional Neural Networks",
    abstract: "We trained a large, deep convolutional neural network...",
    authors: ["Alex Krizhevsky", "Ilya Sutskever"],
    year: 2012,
    processingStatus: "PROCESSED",
    selected: false,
  },
  {
    id: "paper-6",
    title: "Generative Adversarial Networks",
    abstract: "We propose a new framework for estimating generative models...",
    authors: ["Ian Goodfellow", "Jean Pouget-Abadie"],
    year: 2014,
    processingStatus: "PROCESSED",
    selected: false,
  },
];

const dummyChatSessions: ChatSession[] = [
  {
    id: "chat-1",
    title: "Transformer Architecture Analysis",
    lastMessage: "What are the key innovations in transformers?",
    timestamp: new Date(Date.now() - 3600000),
    papers: ["paper-1", "paper-2"],
  },
  {
    id: "chat-2",
    title: "Pre-training Methods Comparison",
    lastMessage: "Compare BERT and GPT pre-training approaches",
    timestamp: new Date(Date.now() - 86400000),
    papers: ["paper-2", "paper-3"],
  },
  {
    id: "chat-3",
    title: "CNN vs Transformer for Vision",
    lastMessage: "Analyzing ResNet architecture",
    timestamp: new Date(Date.now() - 172800000),
    papers: ["paper-4", "paper-5"],
  },
];

const suggestionChips = [
  "Compare the methodologies of selected papers",
  "Summarize key findings across all papers",
  "What are the limitations discussed?",
  "Explain the mathematical foundations",
  "Find connections between the papers",
  "Generate a literature review outline",
];

// ============================================================================
// AI Insights Page Component
// ============================================================================
export function AIInsightsPage({
  onNavigate,
  role: propRole,
}: AIInsightsPageProps) {
  const { role: contextRole } = useRole();
  const effectiveRole = propRole ?? contextRole;
  const user = { ...defaultUser, role: effectiveRole };

  // State
  const [papers, setPapers] = useState<Paper[]>(dummyPapers);
  const [chatSessions] = useState<ChatSession[]>(dummyChatSessions);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedModel, setSelectedModel] = useState("gemini-3-flash");
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [isDeepResearch, setIsDeepResearch] = useState(false);
  const [isWebSearch, setIsWebSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showPaperSelector, setShowPaperSelector] = useState(false);
  const [searchPapers, setSearchPapers] = useState("");
  const [attachments, setAttachments] = useState<
    { type: "image" | "file"; name: string }[]
  >([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Derived state
  const selectedPapers = papers.filter((p) => p.selected);
  const currentModel = AI_MODELS.find((m) => m.value === selectedModel);
  const isPremiumUser =
    effectiveRole === "pro_researcher" || effectiveRole === "admin";

  // Handlers
  const togglePaperSelection = (paperId: string) => {
    setPapers((prev) =>
      prev.map((p) => (p.id === paperId ? { ...p, selected: !p.selected } : p))
    );
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "file" | "image"
  ) => {
    const files = e.target.files;
    if (files) {
      const newAttachments = Array.from(files).map((file) => ({
        type,
        name: file.name,
      }));
      setAttachments((prev) => [...prev, ...newAttachments]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const sendMessage = () => {
    if (!inputValue.trim() && attachments.length === 0) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: inputValue,
      timestamp: new Date(),
      attachments: attachments.length > 0 ? [...attachments] : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setAttachments([]);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(
      () => {
        const aiMessage: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: "assistant",
          content: isDeepResearch
            ? `**Deep Research Analysis**\n\nBased on comprehensive analysis of ${selectedPapers.length} papers, here are my findings:\n\n**Key Insights:**\n1. The Transformer architecture introduced in "Attention Is All You Need" represents a paradigm shift from recurrent networks\n2. Self-attention mechanisms enable parallel processing and long-range dependencies\n3. BERT's bidirectional approach significantly improves contextual understanding\n\n**Cross-Paper Connections:**\n- Both papers build on the attention mechanism foundation\n- Pre-training strategies differ but share transfer learning principles\n- Scale and compute are emerging as critical factors\n\n**Research Implications:**\nThe trajectory from Transformers to BERT shows rapid evolution in NLP architectures. Future research may focus on efficiency and multimodal applications.`
            : `I've analyzed the selected papers on your query: "${inputValue}"\n\n**Summary:**\nThe transformer architecture fundamentally changed how we approach sequence modeling by relying entirely on attention mechanisms. Key innovations include:\n\n• **Multi-head attention** allowing the model to focus on different positions\n• **Positional encoding** to maintain sequence order information\n• **Layer normalization** and residual connections for training stability\n\nWould you like me to elaborate on any specific aspect?`,
          timestamp: new Date(),
          isDeepResearch,
          isSearching: isWebSearch,
          sources: isWebSearch
            ? [
                { title: "arXiv: Attention Is All You Need", url: "#" },
                { title: "Papers with Code: Transformers", url: "#" },
                { title: "Google AI Blog", url: "#" },
              ]
            : undefined,
        };
        setMessages((prev) => [...prev, aiMessage]);
        setIsLoading(false);
      },
      isDeepResearch ? 3000 : 1500
    );
  };

  const startNewChat = () => {
    setActiveSession(null);
    setMessages([]);
    setInputValue("");
    setAttachments([]);
  };

  const filteredPapers = papers.filter(
    (paper) =>
      paper.title.toLowerCase().includes(searchPapers.toLowerCase()) ||
      paper.authors.some((a) =>
        a.toLowerCase().includes(searchPapers.toLowerCase())
      )
  );

  return (
    <DashboardLayout
      user={user}
      onNavigate={onNavigate}
      currentPath="/ai-insights"
    >
      <div className="flex h-[calc(100vh-80px)] bg-background overflow-hidden">
        {/* Left Sidebar - Chat History & Papers */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-80 border-r bg-card flex flex-col shrink-0"
        >
          {/* New Chat Button */}
          <div className="p-4 border-b">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={startNewChat}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium inline-flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
            >
              <Plus className="h-5 w-5" />
              New Research Chat
            </motion.button>
          </div>

          {/* Toggle Buttons */}
          <div className="flex border-b">
            <button
              onClick={() => setShowHistory(false)}
              className={cn(
                "flex-1 py-3 text-sm font-medium transition-colors",
                !showHistory
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <FileText className="h-4 w-4 inline mr-2" />
              Papers ({selectedPapers.length})
            </button>
            <button
              onClick={() => setShowHistory(true)}
              className={cn(
                "flex-1 py-3 text-sm font-medium transition-colors",
                showHistory
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <History className="h-4 w-4 inline mr-2" />
              History
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto">
            {showHistory ? (
              <div className="p-3 space-y-2">
                {chatSessions.map((session) => (
                  <motion.div
                    key={session.id}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => setActiveSession(session.id)}
                    className={cn(
                      "p-3 rounded-lg cursor-pointer transition-colors",
                      activeSession === session.id
                        ? "bg-primary/10 border border-primary/20"
                        : "hover:bg-muted"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">
                          {session.title}
                        </h4>
                        <p className="text-xs text-muted-foreground truncate mt-1">
                          {session.lastMessage}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatTime(session.timestamp)}
                          <span className="text-primary">
                            • {session.papers.length} papers
                          </span>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        className="p-1 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="p-3 space-y-2">
                {/* Search Papers */}
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search papers..."
                    value={searchPapers}
                    onChange={(e) => setSearchPapers(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {filteredPapers.map((paper) => (
                  <motion.div
                    key={paper.id}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => togglePaperSelection(paper.id)}
                    className={cn(
                      "p-3 rounded-lg cursor-pointer transition-colors border",
                      paper.selected
                        ? "bg-primary/10 border-primary/30"
                        : "hover:bg-muted border-transparent"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5",
                          paper.selected
                            ? "bg-primary border-primary"
                            : "border-muted-foreground/30"
                        )}
                      >
                        {paper.selected && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-2">
                          {paper.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {paper.authors.slice(0, 2).join(", ")}
                          {paper.authors.length > 2 && " et al."} • {paper.year}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Upload Button */}
          <div className="p-4 border-t">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate?.("/papers/upload")}
              className="w-full py-2 border border-dashed rounded-lg text-sm text-muted-foreground hover:text-primary hover:border-primary transition-colors inline-flex items-center justify-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload New Paper
            </motion.button>
          </div>
        </motion.div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Chat Header */}
          <div className="border-b px-6 py-3 flex items-center justify-between bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold">ScholarFlow AI</h2>
                  <p className="text-xs text-muted-foreground">
                    {selectedPapers.length} papers selected for context
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Model Selector */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setShowModelSelector(!showModelSelector)}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-muted rounded-lg text-sm font-medium"
                >
                  <span>{currentModel?.icon}</span>
                  <span>{currentModel?.label}</span>
                  {currentModel?.tier === "premium" && (
                    <Crown className="h-3.5 w-3.5 text-yellow-500" />
                  )}
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </motion.button>

                <AnimatePresence>
                  {showModelSelector && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-64 bg-card border rounded-xl shadow-xl z-50 overflow-hidden"
                    >
                      <div className="p-2">
                        {AI_MODELS.map((model) => {
                          const isLocked =
                            model.tier === "premium" && !isPremiumUser;
                          return (
                            <motion.button
                              key={model.value}
                              whileHover={{ scale: isLocked ? 1 : 1.02 }}
                              onClick={() => {
                                if (!isLocked) {
                                  setSelectedModel(model.value);
                                  setShowModelSelector(false);
                                }
                              }}
                              className={cn(
                                "w-full p-3 rounded-lg text-left transition-colors",
                                selectedModel === model.value
                                  ? "bg-primary/10"
                                  : isLocked
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:bg-muted"
                              )}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">{model.icon}</span>
                                  <div>
                                    <div className="font-medium text-sm flex items-center gap-2">
                                      {model.label}
                                      {model.tier === "premium" && (
                                        <span className="px-1.5 py-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-[10px] rounded-full font-semibold">
                                          PRO
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                      {model.description}
                                    </p>
                                  </div>
                                </div>
                                {selectedModel === model.value && (
                                  <Check className="h-4 w-4 text-primary" />
                                )}
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                      {!isPremiumUser && (
                        <div className="p-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-t">
                          <p className="text-xs text-muted-foreground">
                            Upgrade to Pro to unlock premium models
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 hover:bg-muted rounded-lg"
              >
                <Settings className="h-5 w-5 text-muted-foreground" />
              </motion.button>
            </div>
          </div>

          {/* Messages Area */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto px-6 py-6"
          >
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto text-center">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl mb-6"
                >
                  <Sparkles className="h-16 w-16 text-primary" />
                </motion.div>
                <h2 className="text-2xl font-bold mb-3">
                  Research Smarter with AI
                </h2>
                <p className="text-muted-foreground mb-8 max-w-md">
                  Select papers from the sidebar and ask questions. I can help
                  you analyze, compare, and understand your research papers.
                </p>

                {/* Suggestion Chips */}
                <div className="flex flex-wrap gap-2 justify-center max-w-xl">
                  {suggestionChips.map((suggestion, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setInputValue(suggestion)}
                      className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-full text-sm transition-colors"
                    >
                      {suggestion}
                    </motion.button>
                  ))}
                </div>

                {/* Feature Cards */}
                <div className="grid grid-cols-3 gap-4 mt-10 w-full max-w-xl">
                  <div className="p-4 rounded-xl border bg-card text-left">
                    <Brain className="h-6 w-6 text-purple-500 mb-2" />
                    <h4 className="font-semibold text-sm mb-1">
                      Deep Research
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      In-depth analysis with citations
                    </p>
                  </div>
                  <div className="p-4 rounded-xl border bg-card text-left">
                    <Globe className="h-6 w-6 text-blue-500 mb-2" />
                    <h4 className="font-semibold text-sm mb-1">Web Search</h4>
                    <p className="text-xs text-muted-foreground">
                      Find related research online
                    </p>
                  </div>
                  <div className="p-4 rounded-xl border bg-card text-left">
                    <Lightbulb className="h-6 w-6 text-yellow-500 mb-2" />
                    <h4 className="font-semibold text-sm mb-1">
                      Smart Insights
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Key findings & connections
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto space-y-6">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex gap-4",
                      message.role === "user" ? "flex-row-reverse" : ""
                    )}
                  >
                    {/* Avatar */}
                    <div
                      className={cn(
                        "shrink-0 w-10 h-10 rounded-xl flex items-center justify-center",
                        message.role === "user"
                          ? "bg-primary"
                          : "bg-gradient-to-br from-blue-500 to-purple-600"
                      )}
                    >
                      {message.role === "user" ? (
                        <User className="h-5 w-5 text-white" />
                      ) : (
                        <Bot className="h-5 w-5 text-white" />
                      )}
                    </div>

                    {/* Message Content */}
                    <div
                      className={cn(
                        "flex-1 max-w-[80%]",
                        message.role === "user" ? "text-right" : ""
                      )}
                    >
                      {/* Attachments */}
                      {message.attachments &&
                        message.attachments.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-2 justify-end">
                            {message.attachments.map((att, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted rounded-lg text-xs"
                              >
                                {att.type === "image" ? (
                                  <Image className="h-3 w-3" />
                                ) : (
                                  <FileText className="h-3 w-3" />
                                )}
                                {att.name}
                              </span>
                            ))}
                          </div>
                        )}

                      {/* Deep Research Badge */}
                      {message.isDeepResearch &&
                        message.role === "assistant" && (
                          <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full text-xs font-medium mb-2">
                            <Brain className="h-3 w-3" />
                            Deep Research
                          </div>
                        )}

                      {/* Message Bubble */}
                      <div
                        className={cn(
                          "rounded-2xl p-4",
                          message.role === "user"
                            ? "bg-primary text-primary-foreground ml-auto"
                            : "bg-muted"
                        )}
                      >
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">
                          {message.content}
                        </p>
                      </div>

                      {/* Sources */}
                      {message.sources && message.sources.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {message.sources.map((source, i) => (
                            <a
                              key={i}
                              href={source.url}
                              className="inline-flex items-center gap-1.5 px-2 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg text-xs hover:bg-blue-500/20 transition-colors"
                            >
                              <Globe className="h-3 w-3" />
                              {source.title}
                            </a>
                          ))}
                        </div>
                      )}

                      {/* Actions for AI messages */}
                      {message.role === "assistant" && (
                        <div className="flex items-center gap-1 mt-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground"
                          >
                            <Copy className="h-4 w-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground"
                          >
                            <ThumbsUp className="h-4 w-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground"
                          >
                            <ThumbsDown className="h-4 w-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </motion.button>
                          <span className="text-xs text-muted-foreground ml-2">
                            {formatTime(message.timestamp)}
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}

                {/* Loading indicator */}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4"
                  >
                    <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                    <div className="bg-muted rounded-2xl p-4 inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">
                        {isDeepResearch
                          ? "Conducting deep research..."
                          : "Analyzing papers..."}
                      </span>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t bg-card/50 backdrop-blur-sm p-4">
            <div className="max-w-3xl mx-auto">
              {/* Attachments Preview */}
              {attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {attachments.map((att, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg text-sm"
                    >
                      {att.type === "image" ? (
                        <Image className="h-4 w-4 text-green-500" />
                      ) : (
                        <FileText className="h-4 w-4 text-blue-500" />
                      )}
                      <span className="max-w-[150px] truncate">{att.name}</span>
                      <button
                        onClick={() => removeAttachment(index)}
                        className="p-0.5 hover:bg-background rounded"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Selected Papers Pills */}
              {selectedPapers.length > 0 && (
                <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1">
                  <span className="text-xs text-muted-foreground shrink-0">
                    Context:
                  </span>
                  {selectedPapers.slice(0, 3).map((paper) => (
                    <span
                      key={paper.id}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs shrink-0"
                    >
                      <FileText className="h-3 w-3" />
                      {paper.title.slice(0, 25)}...
                    </span>
                  ))}
                  {selectedPapers.length > 3 && (
                    <span className="text-xs text-muted-foreground">
                      +{selectedPapers.length - 3} more
                    </span>
                  )}
                </div>
              )}

              {/* Mode Toggles */}
              <div className="flex items-center gap-2 mb-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsDeepResearch(!isDeepResearch)}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                    isDeepResearch
                      ? "bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30"
                      : "bg-muted hover:bg-muted/80 text-muted-foreground"
                  )}
                >
                  <Brain className="h-4 w-4" />
                  Deep Research
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsWebSearch(!isWebSearch)}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                    isWebSearch
                      ? "bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30"
                      : "bg-muted hover:bg-muted/80 text-muted-foreground"
                  )}
                >
                  <Globe className="h-4 w-4" />
                  Web Search
                </motion.button>
              </div>

              {/* Main Input */}
              <div className="relative bg-muted rounded-2xl border focus-within:border-primary transition-colors">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Ask anything about your research papers..."
                  rows={1}
                  className="w-full px-4 py-4 pr-32 bg-transparent text-sm resize-none focus:outline-none min-h-[56px] max-h-40"
                  style={{
                    height: "auto",
                    overflowY:
                      inputValue.split("\n").length > 4 ? "auto" : "hidden",
                  }}
                />
                <div className="absolute right-2 bottom-2 flex items-center gap-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={(e) => handleFileUpload(e, "file")}
                    className="hidden"
                  />
                  <input
                    ref={imageInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "image")}
                    className="hidden"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 hover:bg-background rounded-lg text-muted-foreground"
                    title="Attach file"
                  >
                    <Paperclip className="h-5 w-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => imageInputRef.current?.click()}
                    className="p-2 hover:bg-background rounded-lg text-muted-foreground"
                    title="Upload image"
                  >
                    <Image className="h-5 w-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={sendMessage}
                    disabled={!inputValue.trim() && attachments.length === 0}
                    className={cn(
                      "p-2 rounded-xl transition-colors",
                      inputValue.trim() || attachments.length > 0
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted-foreground/20 text-muted-foreground cursor-not-allowed"
                    )}
                  >
                    <ArrowUp className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-center gap-4 mt-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  Powered by {currentModel?.label}
                </span>
                <span>•</span>
                <span>Press Enter to send, Shift+Enter for new line</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AIInsightsPage;
