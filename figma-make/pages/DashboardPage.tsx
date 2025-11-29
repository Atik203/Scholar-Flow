"use client";
import {
  AlertCircle,
  ArrowUpRight,
  BookOpen,
  Brain,
  Clock,
  FileText,
  Lightbulb,
  Plus,
  Search,
  TrendingUp,
  Upload,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

// Role types
type UserRole = "researcher" | "pro_researcher" | "team_lead" | "admin";

interface DashboardPageProps {
  role: UserRole;
  onNavigate?: (path: string) => void;
  onShowToast?: (message: string, type: "error" | "success" | "info") => void;
}

// Role display names
const roleDisplayNames: Record<UserRole, string> = {
  researcher: "Researcher",
  pro_researcher: "Pro Researcher",
  team_lead: "Team Lead",
  admin: "Administrator",
};

// Mock user data based on role
const getUserData = (role: UserRole) => ({
  name:
    role === "admin"
      ? "Admin User"
      : role === "team_lead"
        ? "Team Lead"
        : role === "pro_researcher"
          ? "Pro Researcher"
          : "John Researcher",
  email: `${role}@example.com`,
  role,
  image: undefined,
});

// Stats based on role
const getStatsForRole = (role: UserRole) => {
  const baseStats = [
    {
      title: "Total Papers",
      value: "24",
      change: "+12%",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "Collections",
      value: "8",
      change: "+3",
      icon: BookOpen,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
      title: "AI Summaries",
      value: "156",
      change: "+28%",
      icon: Brain,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      title: "Research Hours",
      value: "42h",
      change: "+8h",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
    },
  ];

  if (role === "admin") {
    return [
      {
        title: "Total Users",
        value: "1,234",
        change: "+15%",
        icon: Users,
        color: "text-blue-600",
        bgColor: "bg-blue-100 dark:bg-blue-900/30",
      },
      {
        title: "Active Sessions",
        value: "89",
        change: "+12",
        icon: Zap,
        color: "text-green-600",
        bgColor: "bg-green-100 dark:bg-green-900/30",
      },
      {
        title: "Total Papers",
        value: "5,678",
        change: "+234",
        icon: FileText,
        color: "text-purple-600",
        bgColor: "bg-purple-100 dark:bg-purple-900/30",
      },
      {
        title: "System Health",
        value: "99.9%",
        change: "Stable",
        icon: TrendingUp,
        color: "text-orange-600",
        bgColor: "bg-orange-100 dark:bg-orange-900/30",
      },
    ];
  }

  if (role === "team_lead") {
    return [
      {
        title: "Team Members",
        value: "12",
        change: "+2",
        icon: Users,
        color: "text-blue-600",
        bgColor: "bg-blue-100 dark:bg-blue-900/30",
      },
      {
        title: "Team Papers",
        value: "156",
        change: "+23",
        icon: FileText,
        color: "text-green-600",
        bgColor: "bg-green-100 dark:bg-green-900/30",
      },
      {
        title: "Active Projects",
        value: "5",
        change: "+1",
        icon: Lightbulb,
        color: "text-purple-600",
        bgColor: "bg-purple-100 dark:bg-purple-900/30",
      },
      {
        title: "Pending Reviews",
        value: "8",
        change: "-2",
        icon: AlertCircle,
        color: "text-orange-600",
        bgColor: "bg-orange-100 dark:bg-orange-900/30",
      },
    ];
  }

  return baseStats;
};

// Quick actions based on role
const getQuickActionsForRole = (role: UserRole) => {
  const baseActions = [
    {
      title: "Upload Paper",
      description: "Add a new research paper",
      icon: Plus,
      href: "/papers/upload",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      title: "View Papers",
      description: "Browse your papers",
      icon: FileText,
      href: "/papers",
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      title: "Search",
      description: "Find research papers",
      icon: Search,
      href: "/papers/search",
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      title: "Collections",
      description: "Manage collections",
      icon: BookOpen,
      href: "/collections",
      color: "bg-orange-500 hover:bg-orange-600",
    },
  ];

  if (role === "admin") {
    return [
      {
        title: "Admin Overview",
        description: "System dashboard",
        icon: Users,
        href: "/admin-overview",
        color: "bg-red-500 hover:bg-red-600",
      },
      {
        title: "User Management",
        description: "Manage platform users",
        icon: Users,
        href: "/admin/users",
        color: "bg-blue-500 hover:bg-blue-600",
      },
      {
        title: "System Settings",
        description: "Configure platform",
        icon: Zap,
        href: "/admin/settings",
        color: "bg-green-500 hover:bg-green-600",
      },
      {
        title: "View Reports",
        description: "System reports",
        icon: FileText,
        href: "/admin/reports",
        color: "bg-purple-500 hover:bg-purple-600",
      },
    ];
  }

  if (role === "team_lead") {
    return [
      {
        title: "Team Overview",
        description: "View team activity",
        icon: Users,
        href: "/team",
        color: "bg-cyan-500 hover:bg-cyan-600",
      },
      {
        title: "Invitations",
        description: "Manage invites",
        icon: Users,
        href: "/team/invitations",
        color: "bg-blue-500 hover:bg-blue-600",
      },
      {
        title: "Workspace Analytics",
        description: "Team insights",
        icon: TrendingUp,
        href: "/analytics/workspace",
        color: "bg-purple-500 hover:bg-purple-600",
      },
      ...baseActions.slice(0, 1),
    ];
  }

  if (role === "pro_researcher") {
    return [
      ...baseActions.slice(0, 2),
      {
        title: "Citation Graph",
        description: "Visualize citations",
        icon: TrendingUp,
        href: "/research/citation-graph",
        color: "bg-indigo-500 hover:bg-indigo-600",
      },
      {
        title: "Analytics",
        description: "Research insights",
        icon: Lightbulb,
        href: "/analytics/personal",
        color: "bg-pink-500 hover:bg-pink-600",
      },
    ];
  }

  return baseActions;
};

// Recent papers mock data
const recentPapers = [
  {
    id: "1",
    title: "Machine Learning in Healthcare: A Comprehensive Review",
    authors: "Smith, J., Johnson, A.",
    date: "2 days ago",
    status: "processed",
  },
  {
    id: "2",
    title: "Natural Language Processing: Recent Advances",
    authors: "Brown, M., Davis, K.",
    date: "5 days ago",
    status: "processing",
  },
  {
    id: "3",
    title: "Deep Learning for Computer Vision Applications",
    authors: "Wilson, R., Taylor, S.",
    date: "1 week ago",
    status: "processed",
  },
];

// Recent activity mock data
const recentActivity = [
  {
    title: "Uploaded new research paper",
    time: "2 hours ago",
    type: "upload",
    icon: Upload,
    color: "text-blue-600",
  },
  {
    title: "Created new collection",
    time: "1 day ago",
    type: "collection",
    icon: BookOpen,
    color: "text-green-600",
  },
  {
    title: "Shared collection with colleague",
    time: "2 days ago",
    type: "collaboration",
    icon: Users,
    color: "text-purple-600",
  },
  {
    title: "AI analysis completed",
    time: "3 days ago",
    type: "ai",
    icon: Brain,
    color: "text-pink-600",
  },
];

export function DashboardPage({
  role,
  onNavigate,
  onShowToast,
}: DashboardPageProps) {
  const user = getUserData(role);
  const stats = getStatsForRole(role);
  const quickActions = getQuickActionsForRole(role);

  const handleSignOut = () => {
    onShowToast?.("Signed out successfully", "success");
    onNavigate?.("/");
  };

  return (
    <DashboardLayout
      user={user}
      currentPath={`/dashboard/${role.replace("_", "-")}`}
      onNavigate={onNavigate}
      onSignOut={handleSignOut}
    >
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Welcome back, {user.name.split(" ")[0]}! 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's what's happening with your research today.
            </p>
          </div>
          <Badge
            variant="outline"
            className="px-3 py-1.5 text-sm font-medium w-fit"
          >
            {roleDisplayNames[role]}
          </Badge>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat, index) => (
          <Card key={stat.title} className="p-6">
            <div className="flex items-center justify-between">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
            </div>
          </Card>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Card
              key={action.title}
              className="p-4 cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              onClick={() => onNavigate?.(action.href)}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-2 rounded-lg ${action.color} text-white transition-transform group-hover:scale-110`}
                >
                  <action.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm">{action.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {action.description}
                  </p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Recent Papers & Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Papers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Recent Papers</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate?.("/papers")}
              >
                View all
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <div className="space-y-4">
              {recentPapers.map((paper) => (
                <div
                  key={paper.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => onNavigate?.(`/paper/${paper.id}`)}
                >
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">
                      {paper.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {paper.authors}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {paper.date}
                      </span>
                      <Badge
                        variant={
                          paper.status === "processed" ? "default" : "secondary"
                        }
                        className="text-[10px] px-1.5 py-0"
                      >
                        {paper.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <activity.icon className={`h-4 w-4 ${activity.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Role-specific sections */}
      {role === "admin" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="p-6 border-red-200 dark:border-red-900">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <h2 className="text-lg font-semibold">Admin Alerts</h2>
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto"
                onClick={() => onNavigate?.("/admin-overview")}
              >
                Admin Overview
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <div className="space-y-3">
              <div
                className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors"
                onClick={() => onNavigate?.("/admin/users")}
              >
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  3 users pending approval
                </p>
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                  Review and approve new user registrations
                </p>
              </div>
              <div
                className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                onClick={() => onNavigate?.("/admin/settings")}
              >
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  System update available
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  Version 2.1.0 is ready to deploy
                </p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate?.("/admin/reports")}
              >
                Reports
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate?.("/admin/audit")}
              >
                Audit Log
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate?.("/admin/plans")}
              >
                Plans
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate?.("/admin/payments")}
              >
                Payments
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {role === "team_lead" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="p-6 border-cyan-200 dark:border-cyan-900">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-cyan-100 dark:bg-cyan-900/30">
                <Users className="h-5 w-5 text-cyan-600" />
              </div>
              <h2 className="text-lg font-semibold">Team Overview</h2>
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto"
                onClick={() => onNavigate?.("/team")}
              >
                Manage Team
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div
                className="text-center p-4 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted transition-colors"
                onClick={() => onNavigate?.("/team")}
              >
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">Team Members</p>
              </div>
              <div
                className="text-center p-4 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted transition-colors"
                onClick={() => onNavigate?.("/team/activity")}
              >
                <p className="text-2xl font-bold">8</p>
                <p className="text-sm text-muted-foreground">Active Today</p>
              </div>
              <div
                className="text-center p-4 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted transition-colors"
                onClick={() => onNavigate?.("/analytics/workspace")}
              >
                <p className="text-2xl font-bold">23</p>
                <p className="text-sm text-muted-foreground">
                  Papers This Week
                </p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate?.("/team/invitations")}
              >
                Invitations
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate?.("/team/activity")}
              >
                Activity
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate?.("/team/settings")}
              >
                Settings
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {role === "pro_researcher" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="p-6 border-purple-200 dark:border-purple-900">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <Brain className="h-5 w-5 text-purple-600" />
              </div>
              <h2 className="text-lg font-semibold">Pro Research Tools</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-4">
              <div
                className="text-center p-4 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted transition-colors"
                onClick={() => onNavigate?.("/research/citation-graph")}
              >
                <TrendingUp className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                <p className="text-sm font-medium">Citation Graph</p>
              </div>
              <div
                className="text-center p-4 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted transition-colors"
                onClick={() => onNavigate?.("/research/map")}
              >
                <Lightbulb className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                <p className="text-sm font-medium">Research Map</p>
              </div>
              <div
                className="text-center p-4 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted transition-colors"
                onClick={() => onNavigate?.("/analytics/personal")}
              >
                <TrendingUp className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                <p className="text-sm font-medium">Analytics</p>
              </div>
              <div
                className="text-center p-4 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted transition-colors"
                onClick={() => onNavigate?.("/analytics/usage")}
              >
                <Clock className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                <p className="text-sm font-medium">Usage Reports</p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </DashboardLayout>
  );
}
