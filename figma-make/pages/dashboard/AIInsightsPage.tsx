"use client";

import {
  Bot,
  FileText,
  MessageCircle,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
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
}

// ============================================================================
// Utility Functions
// ============================================================================
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

// ============================================================================
// Dummy Data
// ============================================================================
const dummyPapers = [
  {
    id: "paper-1",
    title: "Attention Is All You Need",
    abstract:
      "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks...",
    authors: ["Ashish Vaswani", "Noam Shazeer", "Niki Parmar"],
    year: 2017,
    processingStatus: "PROCESSED",
  },
  {
    id: "paper-2",
    title: "BERT: Pre-training of Deep Bidirectional Transformers",
    abstract: "We introduce a new language representation model called BERT...",
    authors: ["Jacob Devlin", "Ming-Wei Chang"],
    year: 2018,
    processingStatus: "PROCESSED",
  },
  {
    id: "paper-3",
    title: "GPT-3: Language Models are Few-Shot Learners",
    abstract:
      "Recent work has demonstrated substantial gains on many NLP tasks...",
    authors: ["Tom B. Brown", "Benjamin Mann"],
    year: 2020,
    processingStatus: "PROCESSED",
  },
  {
    id: "paper-4",
    title: "Deep Residual Learning for Image Recognition",
    abstract: "Deeper neural networks are more difficult to train...",
    authors: ["Kaiming He", "Xiangyu Zhang"],
    year: 2015,
    processingStatus: "PROCESSING",
  },
  {
    id: "paper-5",
    title: "ImageNet Classification with Deep Convolutional Neural Networks",
    abstract: "We trained a large, deep convolutional neural network...",
    authors: ["Alex Krizhevsky", "Ilya Sutskever"],
    year: 2012,
    processingStatus: "PROCESSED",
  },
  {
    id: "paper-6",
    title: "Generative Adversarial Networks",
    abstract: "We propose a new framework for estimating generative models...",
    authors: ["Ian Goodfellow", "Jean Pouget-Abadie"],
    year: 2014,
    processingStatus: "PROCESSED",
  },
];

const features = [
  {
    icon: MessageCircle,
    title: "Interactive Chat",
    description:
      "Have conversations with AI about your papers. Ask questions, get explanations, and explore different perspectives.",
    color: "blue",
  },
  {
    icon: FileText,
    title: "Paper Analysis",
    description:
      "Get AI-powered analysis of your papers including key insights, methodology breakdown, and research implications.",
    color: "green",
  },
  {
    icon: Users,
    title: "Research Support",
    description:
      "Use AI as your research assistant to help with literature reviews, methodology questions, and research planning.",
    color: "purple",
  },
];

// ============================================================================
// AI Insights Page Component
// ============================================================================
export function AIInsightsPage({ onNavigate }: AIInsightsPageProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPapers = dummyPapers.filter(
    (paper) =>
      paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paper.authors.some((a) =>
        a.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const getStatusBadge = (status: string) => {
    const statusMap = {
      UPLOADED: {
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
        label: "Uploaded",
      },
      PROCESSING: {
        color:
          "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
        label: "Processing",
      },
      PROCESSED: {
        color:
          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        label: "Processed",
      },
      FAILED: {
        color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
        label: "Failed",
      },
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.UPLOADED;
  };

  const getFeatureColor = (color: string) => {
    const colorMap = {
      blue: {
        border: "border-blue-200 dark:border-blue-800",
        bg: "bg-blue-50/50 dark:bg-blue-950/30",
        icon: "text-blue-600 dark:text-blue-400",
      },
      green: {
        border: "border-green-200 dark:border-green-800",
        bg: "bg-green-50/50 dark:bg-green-950/30",
        icon: "text-green-600 dark:text-green-400",
      },
      purple: {
        border: "border-purple-200 dark:border-purple-800",
        bg: "bg-purple-50/50 dark:bg-purple-950/30",
        icon: "text-purple-600 dark:text-purple-400",
      },
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <DashboardLayout
      user={defaultUser}
      onNavigate={onNavigate}
      currentPath="/ai-insights"
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-background to-muted/30 p-6 rounded-xl border">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 dark:bg-blue-400/10 rounded-xl">
              <Bot className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">AI Insights</h1>
              <p className="text-muted-foreground">
                Chat with AI about your research papers to get insights and ask
                questions
              </p>
            </div>
          </div>
        </div>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const colors = getFeatureColor(feature.color);
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "rounded-xl border p-6",
                  colors.border,
                  colors.bg
                )}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Icon className={cn("h-5 w-5", colors.icon)} />
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Your Papers Section */}
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-semibold">Your Papers</h2>
              <p className="text-muted-foreground">
                Start AI conversations with any of your uploaded papers
              </p>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search papers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 pl-10 pr-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate?.("/papers/upload")}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg whitespace-nowrap"
              >
                Upload New Paper
              </motion.button>
            </div>
          </div>

          {/* Papers Grid */}
          {filteredPapers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPapers.map((paper, index) => {
                const statusBadge = getStatusBadge(paper.processingStatus);
                return (
                  <motion.div
                    key={paper.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    className="rounded-xl border bg-card p-5 hover:shadow-lg dark:hover:shadow-gray-900/20 transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h3 className="font-semibold text-base line-clamp-2 leading-tight flex-1">
                        {paper.title}
                      </h3>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded text-xs font-medium shrink-0",
                          statusBadge.color
                        )}
                      >
                        {statusBadge.label}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {paper.authors.join(", ")}
                    </p>
                    {paper.abstract && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {paper.abstract}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {paper.year}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onNavigate?.(`/papers/${paper.id}`)}
                        className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm inline-flex items-center gap-1"
                      >
                        <Bot className="h-3 w-3" />
                        Chat with AI
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 border rounded-xl bg-muted/10">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-medium mb-2">
                {searchTerm ? "No papers found" : "No papers uploaded"}
              </h3>
              <p className="text-muted-foreground mb-4 max-w-sm mx-auto">
                {searchTerm
                  ? "Try a different search term"
                  : "Upload your first paper to start using AI insights."}
              </p>
              {!searchTerm && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate?.("/papers/upload")}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg inline-flex items-center gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  Upload Paper
                </motion.button>
              )}
            </div>
          )}
        </div>

        {/* AI Capabilities Preview */}
        <div className="rounded-xl border bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">
                Powered by Advanced AI
              </h3>
              <p className="text-muted-foreground mb-4">
                Our AI can analyze your research papers, extract key insights,
                summarize complex content, answer questions about methodology,
                and help you discover connections between papers.
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Paper Summarization",
                  "Q&A",
                  "Key Insights",
                  "Citation Analysis",
                  "Topic Extraction",
                ].map((capability) => (
                  <span
                    key={capability}
                    className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-sm text-primary border"
                  >
                    {capability}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AIInsightsPage;
