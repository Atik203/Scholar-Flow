"use client";

import {
  ArrowRight,
  BookOpen,
  Brain,
  Calendar,
  Eye,
  FileText,
  Layers,
  MoreHorizontal,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Button } from "../../components/ui/button";

// ============================================================================
// Default User for Demo
// ============================================================================
const defaultUser = {
  name: "John Researcher",
  email: "john@example.com",
  image: undefined,
  role: "researcher" as const,
};

// ============================================================================
// Types
// ============================================================================
interface KnowledgePagesPageProps {
  onNavigate?: (path: string) => void;
}

interface KnowledgePage {
  id: string;
  title: string;
  summary: string;
  status: "Updated" | "New" | "Synced" | "Beta" | "Draft";
  updatedAt: string;
  highlights: string[];
  icon: React.ElementType;
  actions: { label: string; path: string }[];
}

// ============================================================================
// Sample Data
// ============================================================================
const knowledgePages: KnowledgePage[] = [
  {
    id: "workspace-overview",
    title: "Workspace Overview",
    summary:
      "Track papers, collections, and collaborators for your active workspace.",
    status: "Updated",
    updatedAt: "2 hours ago",
    icon: Layers,
    highlights: [
      "Workspace-wide metrics refreshed every hour",
      "Quick links to papers, collections, and collaborators",
      "Role-aware recommendations based on workspace membership",
    ],
    actions: [
      { label: "Open workspace", path: "/workspaces" },
      { label: "View analytics", path: "/analytics" },
    ],
  },
  {
    id: "reading-queue",
    title: "Reading Queue",
    summary:
      "Prioritize upcoming papers with AI-generated summaries and due dates.",
    status: "New",
    updatedAt: "Today",
    icon: BookOpen,
    highlights: [
      "Auto-generated reading order",
      "Smart reminders via email and in-app notifications",
      "Link highlights directly to notes and collections",
    ],
    actions: [
      { label: "Manage queue", path: "/papers" },
      { label: "Create reminder", path: "/collections" },
    ],
  },
  {
    id: "annotations",
    title: "Annotations",
    summary:
      "Review highlights and notes across PDFs and collaborative documents.",
    status: "Synced",
    updatedAt: "Yesterday",
    icon: FileText,
    highlights: [
      "Filter annotations by collaborator or tag",
      "Export annotations into research summaries",
      "Sync insights into collections and shared workspaces",
    ],
    actions: [
      { label: "Open annotations", path: "/research/annotations" },
      { label: "Share notes", path: "/workspaces" },
    ],
  },
  {
    id: "insights",
    title: "AI Insights",
    summary:
      "Surface trend analysis and recommended citations tailored to the workspace.",
    status: "Beta",
    updatedAt: "This week",
    icon: Brain,
    highlights: [
      "Vector-based similarity to discover adjacent literature",
      "Workspace-scoped recommendations for collaborators",
      "Continuous updates tied to new uploads and feedback",
    ],
    actions: [
      { label: "Open AI Insights", path: "/ai-insights" },
      { label: "Provide feedback", path: "/workspaces" },
    ],
  },
  {
    id: "research-trends",
    title: "Research Trends",
    summary:
      "Discover emerging topics and citation patterns in your research domain.",
    status: "Beta",
    updatedAt: "3 days ago",
    icon: TrendingUp,
    highlights: [
      "Track citation velocity and impact metrics",
      "Identify emerging research fronts",
      "Compare trends across multiple domains",
    ],
    actions: [
      { label: "Explore trends", path: "/analytics" },
      { label: "Set alerts", path: "/settings" },
    ],
  },
  {
    id: "smart-summaries",
    title: "Smart Summaries",
    summary:
      "AI-generated summaries and key findings from your paper collections.",
    status: "New",
    updatedAt: "Today",
    icon: Sparkles,
    highlights: [
      "Automatic abstract summarization",
      "Key findings extraction",
      "Cross-paper synthesis reports",
    ],
    actions: [
      { label: "Generate summary", path: "/ai-insights" },
      { label: "View templates", path: "/research" },
    ],
  },
];

// ============================================================================
// Helper Functions
// ============================================================================
const getStatusColor = (status: string) => {
  switch (status) {
    case "New":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    case "Updated":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    case "Synced":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
    case "Beta":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
    case "Draft":
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
  }
};

// ============================================================================
// Knowledge Pages Page Component
// ============================================================================
export function KnowledgePagesPage({ onNavigate }: KnowledgePagesPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPage, setSelectedPage] = useState<string | null>(null);

  // Filter pages
  const filteredPages = knowledgePages.filter((page) => {
    const matchesSearch =
      !searchQuery ||
      page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <DashboardLayout
      user={defaultUser}
      onNavigate={onNavigate}
      currentPath="/pages"
    >
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Researcher Pages
            </h1>
            <p className="text-muted-foreground mt-2">
              Curated workspaces and tools mapped specifically for researcher
              productivity.
            </p>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative max-w-md"
        >
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search pages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </motion.div>

        {/* Pages Grid */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredPages.map((page, index) => {
            const Icon = page.icon;
            const isExpanded = selectedPage === page.id;

            return (
              <motion.div
                key={page.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`rounded-xl border bg-card overflow-hidden transition-shadow ${
                  isExpanded
                    ? "shadow-lg ring-2 ring-primary/20"
                    : "hover:shadow-md"
                }`}
              >
                {/* Card Header */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {page.title}
                        </h3>
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${getStatusColor(page.status)}`}
                        >
                          {page.status}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setSelectedPage(isExpanded ? null : page.id)
                      }
                      className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                    >
                      <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">
                    {page.summary}
                  </p>

                  {/* Highlights (shown when expanded) */}
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-4"
                    >
                      <h4 className="text-sm font-medium mb-2">Highlights</h4>
                      <ul className="space-y-1">
                        {page.highlights.map((highlight, i) => (
                          <li
                            key={i}
                            className="text-xs text-muted-foreground flex items-start gap-2"
                          >
                            <Sparkles className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Last updated {page.updatedAt}
                    </p>
                    <Button
                      size="sm"
                      onClick={() => onNavigate?.(page.actions[0].path)}
                    >
                      Open
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredPages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl border bg-card p-12 text-center"
          >
            <Eye className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No pages found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search query
            </p>
          </motion.div>
        )}

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div className="rounded-xl border bg-card p-4 text-center">
            <p className="text-2xl font-bold text-primary">
              {knowledgePages.length}
            </p>
            <p className="text-sm text-muted-foreground">Total Pages</p>
          </div>
          <div className="rounded-xl border bg-card p-4 text-center">
            <p className="text-2xl font-bold text-green-500">
              {knowledgePages.filter((p) => p.status === "New").length}
            </p>
            <p className="text-sm text-muted-foreground">New This Week</p>
          </div>
          <div className="rounded-xl border bg-card p-4 text-center">
            <p className="text-2xl font-bold text-blue-500">
              {knowledgePages.filter((p) => p.status === "Updated").length}
            </p>
            <p className="text-sm text-muted-foreground">Recently Updated</p>
          </div>
          <div className="rounded-xl border bg-card p-4 text-center">
            <p className="text-2xl font-bold text-orange-500">
              {knowledgePages.filter((p) => p.status === "Beta").length}
            </p>
            <p className="text-sm text-muted-foreground">Beta Features</p>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
