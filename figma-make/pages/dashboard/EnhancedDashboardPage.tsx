"use client";

import {
  BookOpen,
  ChevronRight,
  FileText,
  FolderOpen,
  History,
  MessageSquare,
  Plus,
  RefreshCw,
  Settings,
  Sparkles,
  Star,
  Target,
  TrendingDown,
  TrendingUp,
  Upload,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Button } from "../../components/ui/button";

// ============================================================================
// Types
// ============================================================================
interface EnhancedDashboardPageProps {
  role?: "researcher" | "pro_researcher" | "team_lead" | "admin";
  onNavigate?: (path: string) => void;
}

interface DashboardWidget {
  id: string;
  type:
    | "stats"
    | "chart"
    | "activity"
    | "papers"
    | "goals"
    | "ai-summary"
    | "calendar"
    | "team";
  title: string;
  size: "small" | "medium" | "large";
  position: { row: number; col: number };
  isVisible: boolean;
}

interface RecentPaper {
  id: string;
  title: string;
  authors: string[];
  uploadedAt: string;
  readProgress: number;
  annotations: number;
  isStarred: boolean;
}

interface ActivityItem {
  id: string;
  type: "upload" | "annotation" | "ai" | "share" | "collection";
  title: string;
  description: string;
  timestamp: string;
  icon: React.ElementType;
}

interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  deadline: string;
  status: "on-track" | "behind" | "completed";
}

// ============================================================================
// Sample Data
// ============================================================================
const sampleRecentPapers: RecentPaper[] = [
  {
    id: "p1",
    title: "Attention Is All You Need",
    authors: ["Vaswani, A.", "Shazeer, N.", "Parmar, N."],
    uploadedAt: "2025-01-10T10:00:00Z",
    readProgress: 85,
    annotations: 12,
    isStarred: true,
  },
  {
    id: "p2",
    title: "BERT: Pre-training of Deep Bidirectional Transformers",
    authors: ["Devlin, J.", "Chang, M."],
    uploadedAt: "2025-01-09T14:30:00Z",
    readProgress: 45,
    annotations: 5,
    isStarred: false,
  },
  {
    id: "p3",
    title: "Language Models are Few-Shot Learners",
    authors: ["Brown, T.", "Mann, B."],
    uploadedAt: "2025-01-08T09:15:00Z",
    readProgress: 100,
    annotations: 23,
    isStarred: true,
  },
  {
    id: "p4",
    title: "LoRA: Low-Rank Adaptation of Large Language Models",
    authors: ["Hu, E.", "Shen, Y."],
    uploadedAt: "2025-01-07T16:45:00Z",
    readProgress: 30,
    annotations: 3,
    isStarred: false,
  },
];

const sampleActivities: ActivityItem[] = [
  {
    id: "a1",
    type: "annotation",
    title: "Added annotation",
    description:
      "Highlighted key finding on page 5 of 'Attention Is All You Need'",
    timestamp: "2025-01-10T14:30:00Z",
    icon: MessageSquare,
  },
  {
    id: "a2",
    type: "ai",
    title: "AI Summary generated",
    description: "Created summary for 'BERT: Pre-training' collection",
    timestamp: "2025-01-10T13:15:00Z",
    icon: Sparkles,
  },
  {
    id: "a3",
    type: "upload",
    title: "Paper uploaded",
    description: "Added 'Language Models are Few-Shot Learners' to library",
    timestamp: "2025-01-10T11:00:00Z",
    icon: Upload,
  },
  {
    id: "a4",
    type: "share",
    title: "Shared collection",
    description: "Shared 'NLP Foundations' with Prof. Rodriguez",
    timestamp: "2025-01-10T10:45:00Z",
    icon: Users,
  },
  {
    id: "a5",
    type: "collection",
    title: "Collection created",
    description: "Created new collection 'Transformer Architectures'",
    timestamp: "2025-01-09T16:30:00Z",
    icon: FolderOpen,
  },
];

const sampleGoals: Goal[] = [
  {
    id: "g1",
    title: "Read research papers",
    target: 20,
    current: 14,
    unit: "papers",
    deadline: "2025-01-31",
    status: "on-track",
  },
  {
    id: "g2",
    title: "Literature review annotations",
    target: 100,
    current: 78,
    unit: "annotations",
    deadline: "2025-01-25",
    status: "on-track",
  },
  {
    id: "g3",
    title: "AI-assisted summaries",
    target: 10,
    current: 4,
    unit: "summaries",
    deadline: "2025-01-20",
    status: "behind",
  },
];

const weeklyStats = [
  { day: "Mon", papers: 3, annotations: 12 },
  { day: "Tue", papers: 2, annotations: 8 },
  { day: "Wed", papers: 4, annotations: 15 },
  { day: "Thu", papers: 1, annotations: 5 },
  { day: "Fri", papers: 5, annotations: 20 },
  { day: "Sat", papers: 2, annotations: 6 },
  { day: "Sun", papers: 1, annotations: 4 },
];

// ============================================================================
// Helper Functions
// ============================================================================
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getGoalStatusColor(status: Goal["status"]): string {
  const colors = {
    "on-track": "text-green-500 bg-green-500/10",
    behind: "text-yellow-500 bg-yellow-500/10",
    completed: "text-blue-500 bg-blue-500/10",
  };
  return colors[status];
}

// ============================================================================
// Enhanced Dashboard Page Component
// ============================================================================
export function EnhancedDashboardPage({
  role = "researcher",
  onNavigate,
}: EnhancedDashboardPageProps) {
  const [showCustomize, setShowCustomize] = useState(false);
  const [dateRange, setDateRange] = useState("week");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const user = {
    name: "Dr. Sarah Chen",
    email: "sarah.chen@university.edu",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    role: role,
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const totalPapersThisWeek = weeklyStats.reduce(
    (acc, day) => acc + day.papers,
    0
  );
  const totalAnnotationsThisWeek = weeklyStats.reduce(
    (acc, day) => acc + day.annotations,
    0
  );
  const maxPapers = Math.max(...weeklyStats.map((d) => d.papers));

  return (
    <DashboardLayout user={user} onNavigate={onNavigate}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, Sarah! 👋</h1>
            <p className="text-muted-foreground mt-1">
              Here's an overview of your research progress this week
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCustomize(true)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Customize
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Papers Read",
              value: 47,
              change: "+12%",
              trend: "up",
              icon: BookOpen,
              color: "text-blue-500 bg-blue-500/10",
            },
            {
              label: "Annotations",
              value: 234,
              change: "+8%",
              trend: "up",
              icon: MessageSquare,
              color: "text-green-500 bg-green-500/10",
            },
            {
              label: "AI Queries",
              value: 56,
              change: "+25%",
              trend: "up",
              icon: Sparkles,
              color: "text-purple-500 bg-purple-500/10",
            },
            {
              label: "Collections",
              value: 12,
              change: "-2%",
              trend: "down",
              icon: FolderOpen,
              color: "text-orange-500 bg-orange-500/10",
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-xl border bg-card p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div
                  className={`flex items-center gap-1 text-xs ${
                    stat.trend === "up" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {stat.change}
                </div>
              </div>
              <p className="text-2xl font-bold mt-3">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weekly Activity Chart */}
          <div className="lg:col-span-2 rounded-xl border bg-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold">Weekly Activity</h3>
                <p className="text-sm text-muted-foreground">
                  {totalPapersThisWeek} papers • {totalAnnotationsThisWeek}{" "}
                  annotations
                </p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-primary" />
                  <span className="text-muted-foreground">Papers</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-chart-1" />
                  <span className="text-muted-foreground">Annotations</span>
                </div>
              </div>
            </div>
            <div className="h-48 flex items-end justify-between gap-2">
              {weeklyStats.map((day, index) => (
                <div
                  key={day.day}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <div className="w-full flex flex-col gap-1">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(day.papers / maxPapers) * 100}%` }}
                      transition={{ delay: index * 0.1 }}
                      className="w-full bg-primary rounded-t min-h-[4px]"
                      style={{ height: `${(day.papers / maxPapers) * 120}px` }}
                    />
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(day.annotations / 25) * 100}%` }}
                      transition={{ delay: index * 0.1 + 0.05 }}
                      className="w-full bg-chart-1 rounded-t min-h-[4px]"
                      style={{ height: `${(day.annotations / 25) * 60}px` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {day.day}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Goals Progress */}
          <div className="rounded-xl border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Research Goals</h3>
              <Button variant="ghost" size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              {sampleGoals.map((goal) => (
                <div key={goal.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{goal.title}</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${getGoalStatusColor(
                        goal.status
                      )}`}
                    >
                      {goal.status === "on-track"
                        ? "On Track"
                        : goal.status === "behind"
                          ? "Behind"
                          : "Completed"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(goal.current / goal.target) * 100}%`,
                        }}
                        className={`h-full rounded-full ${
                          goal.status === "behind"
                            ? "bg-yellow-500"
                            : "bg-primary"
                        }`}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {goal.current}/{goal.target} {goal.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Papers */}
          <div className="lg:col-span-2 rounded-xl border bg-card overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold">Recent Papers</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate?.("/papers")}
              >
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <div className="divide-y">
              {sampleRecentPapers.map((paper, index) => (
                <motion.div
                  key={paper.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-medium text-sm line-clamp-1">
                            {paper.title}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {paper.authors.join(", ")}
                          </p>
                        </div>
                        <Star
                          className={`h-4 w-4 flex-shrink-0 ${
                            paper.isStarred
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground"
                          }`}
                        />
                      </div>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-2 flex-1">
                          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${paper.readProgress}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {paper.readProgress}%
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MessageSquare className="h-3 w-3" />
                          {paper.annotations}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatRelativeTime(paper.uploadedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="rounded-xl border bg-card overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold">Recent Activity</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate?.("/activity")}
              >
                <History className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4 space-y-4 max-h-[400px] overflow-auto">
              {sampleActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <activity.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatRelativeTime(activity.timestamp)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Summary Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-gradient-to-r from-primary/5 via-chart-1/5 to-chart-2/5 border border-primary/20 p-6"
        >
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-chart-1 flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">AI Research Summary</h3>
              <p className="text-sm text-muted-foreground mb-4">
                This week you've focused heavily on transformer architectures
                and attention mechanisms. Your reading patterns suggest an
                interest in efficient fine-tuning methods. Consider exploring
                recent papers on parameter-efficient training to complement your
                current research.
              </p>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Get Recommendations
                </Button>
                <Button size="sm" variant="ghost">
                  View Analysis
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              icon: Upload,
              label: "Upload Paper",
              action: "/upload",
              color: "text-blue-500",
            },
            {
              icon: Sparkles,
              label: "Ask AI",
              action: "/ai",
              color: "text-purple-500",
            },
            {
              icon: FolderOpen,
              label: "New Collection",
              action: "/collections",
              color: "text-orange-500",
            },
            {
              icon: Users,
              label: "Invite Team",
              action: "/team",
              color: "text-green-500",
            },
          ].map((action, index) => (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              onClick={() => onNavigate?.(action.action)}
              className="p-4 rounded-xl border bg-card hover:bg-muted/50 hover:shadow-md transition-all flex flex-col items-center gap-2 group"
            >
              <div
                className={`p-3 rounded-lg bg-muted group-hover:scale-110 transition-transform ${action.color}`}
              >
                <action.icon className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium">{action.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Customize Modal */}
      <AnimatePresence>
        {showCustomize && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCustomize(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card rounded-xl border shadow-lg w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Customize Dashboard</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCustomize(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-4 space-y-4">
                <p className="text-sm text-muted-foreground">
                  Choose which widgets to display on your dashboard.
                </p>
                <div className="space-y-2">
                  {[
                    { id: "stats", label: "Stats Cards", checked: true },
                    {
                      id: "activity",
                      label: "Weekly Activity Chart",
                      checked: true,
                    },
                    { id: "goals", label: "Research Goals", checked: true },
                    { id: "papers", label: "Recent Papers", checked: true },
                    { id: "feed", label: "Activity Feed", checked: true },
                    { id: "ai", label: "AI Summary", checked: true },
                    { id: "actions", label: "Quick Actions", checked: true },
                  ].map((widget) => (
                    <label
                      key={widget.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted cursor-pointer"
                    >
                      <span className="text-sm font-medium">
                        {widget.label}
                      </span>
                      <input
                        type="checkbox"
                        defaultChecked={widget.checked}
                        className="rounded"
                      />
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 p-4 border-t">
                <Button variant="ghost" onClick={() => setShowCustomize(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowCustomize(false)}>
                  Save Changes
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
