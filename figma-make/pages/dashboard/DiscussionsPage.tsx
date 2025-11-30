"use client";

import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Filter,
  Hash,
  Heart,
  MessageSquare,
  MoreHorizontal,
  Pin,
  Plus,
  Reply,
  Search,
  Send,
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
interface DiscussionsPageProps {
  onNavigate?: (path: string) => void;
  role?: "researcher" | "pro_researcher" | "team_lead" | "admin";
}

interface DiscussionThread {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    image?: string;
  };
  workspace: {
    id: string;
    name: string;
  };
  tags: string[];
  isPinned: boolean;
  isResolved: boolean;
  repliesCount: number;
  createdAt: string;
  updatedAt: string;
  lastReply?: {
    author: string;
    content: string;
    createdAt: string;
  };
}

interface Reply {
  id: string;
  discussionId: string;
  author: {
    id: string;
    name: string;
    image?: string;
  };
  content: string;
  createdAt: string;
  likes: number;
}

// ============================================================================
// Sample Replies Data
// ============================================================================
const sampleReplies: Reply[] = [
  {
    id: "r1",
    discussionId: "1",
    author: { id: "2", name: "Prof. John Smith" },
    content:
      "I recommend using the PRISMA framework for systematic reviews. It provides clear guidelines for inclusion/exclusion criteria and helps ensure reproducibility.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    likes: 5,
  },
  {
    id: "r2",
    discussionId: "1",
    author: { id: "3", name: "Dr. Emily Watson" },
    content:
      "Building on John's point, I'd also suggest using Covidence or Rayyan for screening - they make the process much more efficient.",
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    likes: 3,
  },
  {
    id: "r3",
    discussionId: "1",
    author: { id: "4", name: "Michael Lee" },
    content:
      "Don't forget about inter-rater reliability! Having two reviewers independently screen articles is crucial for reducing bias.",
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    likes: 2,
  },
  {
    id: "r4",
    discussionId: "2",
    author: { id: "5", name: "Dr. Alex Kim" },
    content:
      "Linear attention variants like Performer and Linformer show promising results for long sequences. The trade-off is usually between speed and accuracy.",
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    likes: 4,
  },
  {
    id: "r5",
    discussionId: "2",
    author: { id: "6", name: "Sarah Williams" },
    content:
      "Check out the Flash Attention paper - it achieves significant speedups while maintaining exact attention computation.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    likes: 7,
  },
];

// ============================================================================
// Sample Data
// ============================================================================
const sampleDiscussions: DiscussionThread[] = [
  {
    id: "1",
    title: "Best practices for literature review methodology",
    content:
      "I'm working on a systematic literature review and wondering what approaches others have found most effective. Specifically interested in search string construction and inclusion/exclusion criteria.",
    author: { id: "1", name: "Dr. Sarah Chen" },
    workspace: { id: "ws-1", name: "AI Research Lab" },
    tags: ["methodology", "literature-review", "best-practices"],
    isPinned: true,
    isResolved: false,
    repliesCount: 12,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    lastReply: {
      author: "Prof. John Smith",
      content:
        "I recommend using the PRISMA framework for systematic reviews...",
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
  },
  {
    id: "2",
    title: "Question about transformer architecture variations",
    content:
      "Has anyone compared the performance of different attention mechanisms in transformer models for NLP tasks? Looking for empirical comparisons.",
    author: { id: "2", name: "Prof. John Smith" },
    workspace: { id: "ws-1", name: "AI Research Lab" },
    tags: ["transformers", "attention", "nlp"],
    isPinned: false,
    isResolved: true,
    repliesCount: 8,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    lastReply: {
      author: "Dr. Emily Davis",
      content:
        "The Flash Attention paper has great benchmarks. Also check out the Longformer comparison...",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    },
  },
  {
    id: "3",
    title: "Collaboration opportunity: Climate data analysis",
    content:
      "Looking for collaborators interested in applying ML techniques to climate prediction models. We have access to extensive satellite imagery data.",
    author: { id: "3", name: "Dr. Emily Davis" },
    workspace: { id: "ws-2", name: "Climate Science Team" },
    tags: ["collaboration", "climate", "machine-learning"],
    isPinned: true,
    isResolved: false,
    repliesCount: 15,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    lastReply: {
      author: "Alex Johnson",
      content:
        "Very interested! I have experience with CNN-based satellite image classification...",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    },
  },
  {
    id: "4",
    title: "Paper feedback request: Novel optimization algorithm",
    content:
      "Draft paper ready for peer feedback. Proposing a new gradient descent variant with adaptive learning rates. Would appreciate critical review from optimization experts.",
    author: { id: "4", name: "Dr. Michael Brown" },
    workspace: { id: "ws-3", name: "Quantum Lab" },
    tags: ["feedback", "optimization", "algorithms"],
    isPinned: false,
    isResolved: false,
    repliesCount: 6,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    lastReply: {
      author: "Dr. Sarah Chen",
      content:
        "I've read through the methodology section. A few suggestions on the convergence proof...",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
  },
  {
    id: "5",
    title: "Resource sharing: Quantum computing tutorials",
    content:
      "Compiled a list of beginner-friendly quantum computing resources and tutorials. Includes Qiskit basics, quantum gates, and simple algorithms.",
    author: { id: "5", name: "Alex Johnson" },
    workspace: { id: "ws-3", name: "Quantum Lab" },
    tags: ["resources", "quantum", "tutorials"],
    isPinned: false,
    isResolved: true,
    repliesCount: 20,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 168).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    lastReply: {
      author: "Dr. Michael Brown",
      content:
        "Great compilation! Added a few more advanced resources to the list.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    },
  },
];

// ============================================================================
// Helper Functions
// ============================================================================
const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

// ============================================================================
// Discussions Page Component
// ============================================================================
export function DiscussionsPage({ onNavigate, role }: DiscussionsPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [pinnedFilter, setPinnedFilter] = useState<string>("");
  const [tagFilter, setTagFilter] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [expandedDiscussion, setExpandedDiscussion] = useState<string | null>(
    null
  );
  const [replyContent, setReplyContent] = useState("");

  // Create user with the correct role
  const user = {
    ...defaultUser,
    role: role || defaultUser.role,
  };

  // Filter discussions
  const filteredDiscussions = sampleDiscussions.filter((discussion) => {
    const matchesSearch =
      !searchQuery ||
      discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discussion.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discussion.author.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      !statusFilter ||
      (statusFilter === "resolved" && discussion.isResolved) ||
      (statusFilter === "unresolved" && !discussion.isResolved);

    const matchesPinned =
      !pinnedFilter ||
      (pinnedFilter === "pinned" && discussion.isPinned) ||
      (pinnedFilter === "unpinned" && !discussion.isPinned);

    const matchesTags =
      !tagFilter ||
      discussion.tags.some((tag) =>
        tag.toLowerCase().includes(tagFilter.toLowerCase())
      );

    return matchesSearch && matchesStatus && matchesPinned && matchesTags;
  });

  // Sort: pinned first, then by updated date
  const sortedDiscussions = [...filteredDiscussions].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return (
    <DashboardLayout
      user={user}
      onNavigate={onNavigate}
      currentPath="/discussions"
    >
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Research Discussions
            </h1>
            <p className="text-muted-foreground mt-1">
              Collaborate and discuss research topics with your team
            </p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Start Discussion
          </Button>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border bg-card p-4"
        >
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold">Filters</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">All Status</option>
              <option value="unresolved">Unresolved</option>
              <option value="resolved">Resolved</option>
            </select>

            {/* Pinned Filter */}
            <select
              value={pinnedFilter}
              onChange={(e) => setPinnedFilter(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">All Discussions</option>
              <option value="pinned">Pinned Only</option>
              <option value="unpinned">Not Pinned</option>
            </select>

            {/* Tags Filter */}
            <input
              type="text"
              placeholder="Filter by tags..."
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </motion.div>

        {/* Discussions List */}
        <div className="space-y-4">
          {sortedDiscussions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl border bg-card p-12 text-center"
            >
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No discussions found</h3>
              <p className="text-muted-foreground mb-4">
                Start a new discussion to collaborate with your team
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Start Discussion
              </Button>
            </motion.div>
          ) : (
            sortedDiscussions.map((discussion, index) => (
              <motion.div
                key={discussion.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-xl border bg-card p-5 hover:shadow-md transition-shadow cursor-pointer"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-start gap-3">
                    {/* Author Avatar */}
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-primary">
                        {discussion.author.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {discussion.isPinned && (
                          <Pin className="h-4 w-4 text-primary" />
                        )}
                        {discussion.isResolved && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                        <h3 className="font-semibold text-foreground">
                          {discussion.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <span>{discussion.author.name}</span>
                        <span>•</span>
                        <span>{discussion.workspace.name}</span>
                        <span>•</span>
                        <span>{formatTimeAgo(discussion.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>

                {/* Content Preview */}
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {discussion.content}
                </p>

                {/* Tags */}
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  {discussion.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs"
                    >
                      <Hash className="h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedDiscussion(
                          expandedDiscussion === discussion.id
                            ? null
                            : discussion.id
                        );
                      }}
                      className="flex items-center gap-1 hover:text-primary transition-colors"
                    >
                      <MessageSquare className="h-4 w-4" />
                      {discussion.repliesCount} replies
                      {expandedDiscussion === discussion.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                    <span>Updated {formatTimeAgo(discussion.updatedAt)}</span>
                  </div>

                  {discussion.lastReply &&
                    expandedDiscussion !== discussion.id && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">
                          Last reply:
                        </span>
                        <span className="font-medium">
                          {discussion.lastReply.author}
                        </span>
                      </div>
                    )}
                </div>

                {/* Expandable Replies Section */}
                {expandedDiscussion === discussion.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t space-y-4"
                  >
                    {/* Replies List */}
                    <div className="space-y-3">
                      {sampleReplies
                        .filter((reply) => reply.discussionId === discussion.id)
                        .map((reply) => (
                          <div
                            key={reply.id}
                            className="flex gap-3 p-3 rounded-lg bg-muted/50"
                          >
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-medium text-primary">
                                {reply.author.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .slice(0, 2)}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium">
                                  {reply.author.name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {formatTimeAgo(reply.createdAt)}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {reply.content}
                              </p>
                              <div className="flex items-center gap-3 mt-2">
                                <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                                  <Heart className="h-3 w-3" />
                                  {reply.likes}
                                </button>
                                <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                                  <Reply className="h-3 w-3" />
                                  Reply
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>

                    {/* Reply Input */}
                    <div className="flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium text-primary">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </span>
                      </div>
                      <div className="flex-1 flex gap-2">
                        <input
                          type="text"
                          placeholder="Write a reply..."
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          className="flex-1 h-9 px-3 rounded-lg border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (replyContent.trim()) {
                              console.log("Sending reply:", replyContent);
                              setReplyContent("");
                            }
                          }}
                          disabled={!replyContent.trim()}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))
          )}
        </div>

        {/* Discussion Guidelines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border bg-card p-6"
        >
          <h3 className="font-semibold mb-4">Discussion Guidelines</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2 text-sm">Best Practices</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Be respectful and constructive in your comments</li>
                <li>• Use clear, descriptive titles for discussions</li>
                <li>• Tag discussions with relevant keywords</li>
                <li>
                  • Mark discussions as resolved when questions are answered
                </li>
                <li>• Pin important discussions for easy access</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-sm">Discussion Types</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>
                  • <strong>Questions:</strong> Ask for clarification or help
                </li>
                <li>
                  • <strong>Ideas:</strong> Share research ideas and insights
                </li>
                <li>
                  • <strong>Reviews:</strong> Discuss paper findings and
                  methodology
                </li>
                <li>
                  • <strong>Collaboration:</strong> Coordinate research
                  activities
                </li>
                <li>
                  • <strong>Feedback:</strong> Provide constructive feedback
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
