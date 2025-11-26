"use client";
import {
  ArrowUpRight,
  Bell,
  Clock,
  FileText,
  Filter,
  FolderOpen,
  Grid3X3,
  List,
  LogOut,
  Moon,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Shield,
  Star,
  Sun,
  TrendingUp,
  Upload,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";

interface DashboardPageProps {
  onNavigate?: (path: string) => void;
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const [isDark, setIsDark] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const stats = [
    {
      title: "Total Papers",
      value: "247",
      change: "+12 this week",
      trend: "up",
      icon: FileText,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Collections",
      value: "18",
      change: "+2 new",
      trend: "up",
      icon: FolderOpen,
      color: "text-[var(--chart-1)]",
      bgColor: "bg-[var(--chart-1)]/10",
    },
    {
      title: "Collaborators",
      value: "12",
      change: "Active team",
      trend: "neutral",
      icon: Users,
      color: "text-[var(--chart-2)]",
      bgColor: "bg-[var(--chart-2)]/10",
    },
    {
      title: "Reading Time",
      value: "42h",
      change: "+8h this month",
      trend: "up",
      icon: Clock,
      color: "text-[var(--chart-3)]",
      bgColor: "bg-[var(--chart-3)]/10",
    },
  ];

  const recentPapers = [
    {
      id: "1",
      title: "Attention Is All You Need",
      authors: "Vaswani et al.",
      date: "2 hours ago",
      status: "Processing",
      collection: "Transformers",
    },
    {
      id: "2",
      title: "BERT: Pre-training of Deep Bidirectional Transformers",
      authors: "Devlin et al.",
      date: "Yesterday",
      status: "Ready",
      collection: "NLP",
    },
    {
      id: "3",
      title: "GPT-4 Technical Report",
      authors: "OpenAI",
      date: "3 days ago",
      status: "Ready",
      collection: "LLMs",
    },
    {
      id: "4",
      title: "ResNet: Deep Residual Learning",
      authors: "He et al.",
      date: "1 week ago",
      status: "Ready",
      collection: "Computer Vision",
    },
    {
      id: "5",
      title: "Language Models are Few-Shot Learners",
      authors: "Brown et al.",
      date: "2 weeks ago",
      status: "Ready",
      collection: "LLMs",
    },
  ];

  const collections = [
    { name: "Transformers", papers: 32, color: "bg-primary" },
    { name: "NLP", papers: 45, color: "bg-[var(--chart-1)]" },
    { name: "Computer Vision", papers: 28, color: "bg-[var(--chart-2)]" },
    {
      name: "Reinforcement Learning",
      papers: 19,
      color: "bg-[var(--chart-3)]",
    },
  ];

  const activities = [
    {
      action: "Added paper",
      title: "Attention Is All You Need",
      time: "2h ago",
    },
    { action: "Created collection", title: "Transformers", time: "5h ago" },
    { action: "Shared with", title: "john@example.com", time: "Yesterday" },
    {
      action: "Downloaded",
      title: "GPT-4 Technical Report",
      time: "2 days ago",
    },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between px-4 lg:px-8 h-16">
          {/* Logo */}
          <button
            onClick={() => onNavigate?.("/")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg bg-gradient-to-r from-primary to-[var(--chart-1)] bg-clip-text text-transparent">
              ScholarFlow
            </span>
          </button>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search papers, collections, or authors..."
                className="pl-10 h-10 bg-muted/50 border-border/50 focus:bg-background"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
            </Button>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate?.("/")}
            >
              <LogOut className="h-5 w-5" />
            </Button>

            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-[var(--chart-1)] flex items-center justify-center text-white text-sm font-medium">
              JD
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-background/50 h-[calc(100vh-64px)] sticky top-16">
          <div className="p-4 flex-1">
            <Button className="w-full bg-gradient-to-r from-primary to-[var(--chart-1)] text-white mb-6 gap-2 shadow-lg hover:shadow-xl transition-all">
              <Upload className="h-4 w-4" />
              Upload Paper
            </Button>

            <nav className="space-y-1">
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary font-medium">
                <FileText className="h-4 w-4" />
                My Papers
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                <FolderOpen className="h-4 w-4" />
                Collections
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                <Star className="h-4 w-4" />
                Favorites
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                <Users className="h-4 w-4" />
                Shared with Me
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                <Clock className="h-4 w-4" />
                Recent
              </button>
            </nav>

            <div className="mt-8">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Collections
                </h3>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              <div className="space-y-1">
                {collections.map((collection) => (
                  <button
                    key={collection.name}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <div
                      className={`h-2 w-2 rounded-full ${collection.color}`}
                    />
                    <span className="flex-1 text-left">{collection.name}</span>
                    <span className="text-xs">{collection.papers}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Storage indicator */}
          <div className="p-4 border-t border-border">
            <div className="text-xs text-muted-foreground mb-2">
              Storage used
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full w-[65%] bg-gradient-to-r from-primary to-[var(--chart-1)] rounded-full" />
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              6.5 GB of 10 GB
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Card className="border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            {stat.title}
                          </p>
                          <p className="text-2xl font-bold">{stat.value}</p>
                          <div className="flex items-center gap-1 mt-2">
                            {stat.trend === "up" && (
                              <TrendingUp className="h-3 w-3 text-green-500" />
                            )}
                            <span className="text-xs text-muted-foreground">
                              {stat.change}
                            </span>
                          </div>
                        </div>
                        <div
                          className={`h-10 w-10 rounded-xl ${stat.bgColor} flex items-center justify-center`}
                        >
                          <IconComponent className={`h-5 w-5 ${stat.color}`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Papers Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Papers */}
            <div className="lg:col-span-2">
              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Recent Papers</CardTitle>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Filter className="h-4 w-4" />
                      </Button>
                      <div className="flex items-center border rounded-lg">
                        <button
                          onClick={() => setViewMode("list")}
                          className={`p-1.5 ${viewMode === "list" ? "bg-muted" : ""}`}
                        >
                          <List className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setViewMode("grid")}
                          className={`p-1.5 ${viewMode === "grid" ? "bg-muted" : ""}`}
                        >
                          <Grid3X3 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentPapers.map((paper) => (
                      <motion.button
                        key={paper.id}
                        onClick={() => onNavigate?.("/paper")}
                        className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors group text-left"
                        whileHover={{ x: 4 }}
                      >
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium truncate group-hover:text-primary transition-colors">
                              {paper.title}
                            </h3>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{paper.authors}</span>
                            <span>•</span>
                            <span>{paper.date}</span>
                          </div>
                        </div>
                        <Badge
                          variant={
                            paper.status === "Ready" ? "default" : "secondary"
                          }
                          className={
                            paper.status === "Ready"
                              ? "bg-green-500/10 text-green-600"
                              : ""
                          }
                        >
                          {paper.status}
                        </Badge>
                        <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Activity Feed */}
            <div>
              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activities.map((activity, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        className="flex items-start gap-3"
                      >
                        <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="text-muted-foreground">
                              {activity.action}
                            </span>{" "}
                            <span className="font-medium">
                              {activity.title}
                            </span>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {activity.time}
                          </p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-border/50 mt-4">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      className="h-auto py-3 flex-col gap-1"
                    >
                      <Upload className="h-4 w-4" />
                      <span className="text-xs">Upload</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto py-3 flex-col gap-1"
                    >
                      <FolderOpen className="h-4 w-4" />
                      <span className="text-xs">Collection</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto py-3 flex-col gap-1"
                    >
                      <Users className="h-4 w-4" />
                      <span className="text-xs">Invite</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto py-3 flex-col gap-1"
                    >
                      <Search className="h-4 w-4" />
                      <span className="text-xs">Search</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
