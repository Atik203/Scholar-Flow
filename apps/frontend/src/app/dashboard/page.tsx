"use client";

import { RoleBadge } from "@/components/auth/RoleBadge";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { showSuccessToast } from "@/components/providers/ToastProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useProtectedRoute } from "@/hooks/useAuthGuard";
import { USER_ROLES } from "@/lib/auth/roles";
import {
  ArrowUpRight,
  BookOpen,
  Brain,
  Clock,
  FileText,
  Lightbulb,
  Plus,
  Search,
  Settings,
  Shield,
  TrendingUp,
  Upload,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";

// Base quick actions available to all roles
const baseQuickActions = [
  {
    title: "Upload Paper",
    description: "Add a new research paper to your collection",
    icon: Plus,
    href: "/papers/upload",
    color: "bg-blue-500 hover:bg-blue-600",
    minRole: USER_ROLES.RESEARCHER,
  },
  {
    title: "Search Papers",
    description: "Find and explore research papers",
    icon: Search,
    href: "/papers/search",
    color: "bg-green-500 hover:bg-green-600",
    minRole: USER_ROLES.RESEARCHER,
  },
  {
    title: "Create Collection",
    description: "Organize papers into collections",
    icon: BookOpen,
    href: "/collections/create",
    color: "bg-purple-500 hover:bg-purple-600",
    minRole: USER_ROLES.RESEARCHER,
  },
  {
    title: "Collaborate",
    description: "Share and work with colleagues",
    icon: Users,
    href: "/collaborate",
    color: "bg-orange-500 hover:bg-orange-600",
    minRole: USER_ROLES.RESEARCHER,
  },
];

// Role-specific actions
const roleSpecificActions = {
  [USER_ROLES.PRO_RESEARCHER]: [
    {
      title: "Advanced Analytics",
      description: "Access detailed research analytics and insights",
      icon: Settings,
      href: "/analytics",
      color: "bg-indigo-500 hover:bg-indigo-600",
    },
  ],
  [USER_ROLES.TEAM_LEAD]: [
    {
      title: "Team Management",
      description: "Manage team members and permissions",
      icon: Users,
      href: "/team/manage",
      color: "bg-cyan-500 hover:bg-cyan-600",
    },
    {
      title: "Project Overview",
      description: "Monitor team projects and progress",
      icon: BookOpen,
      href: "/projects",
      color: "bg-teal-500 hover:bg-teal-600",
    },
  ],
  [USER_ROLES.ADMIN]: [
    {
      title: "Admin Panel",
      description: "System administration and user management",
      icon: Shield,
      href: "/admin",
      color: "bg-red-500 hover:bg-red-600",
    },
    {
      title: "System Settings",
      description: "Configure platform settings and policies",
      icon: Settings,
      href: "/admin/settings",
      color: "bg-gray-500 hover:bg-gray-600",
    },
  ],
};

const recentStats = [
  {
    title: "Papers Uploaded",
    value: "24",
    change: "+3 this week",
    trend: "up" as const,
    icon: FileText,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    title: "Collections",
    value: "8",
    change: "+2 this week",
    trend: "up" as const,
    icon: BookOpen,
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    iconColor: "text-green-600 dark:text-green-400",
  },
  {
    title: "Collaborations",
    value: "5",
    change: "+1 this week",
    trend: "up" as const,
    icon: Users,
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
  {
    title: "Reading Time",
    value: "42h",
    change: "+8h this week",
    trend: "up" as const,
    icon: Clock,
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-950/20",
    iconColor: "text-orange-600 dark:text-orange-400",
  },
];

// Recent activity data
const recentActivity = [
  {
    title: "Uploaded 'Neural Networks in Climate Science'",
    time: "2 hours ago",
    type: "upload",
    icon: Upload,
    color: "text-blue-600",
  },
  {
    title: "Created 'Machine Learning Papers' collection",
    time: "1 day ago",
    type: "collection",
    icon: BookOpen,
    color: "text-green-600",
  },
  {
    title: "Shared collection with Dr. Sarah Wilson",
    time: "2 days ago",
    type: "collaboration",
    icon: Users,
    color: "text-purple-600",
  },
  {
    title: "AI analysis completed for 3 papers",
    time: "3 days ago",
    type: "ai",
    icon: Brain,
    color: "text-pink-600",
  },
];

// Quick insights data
const quickInsights = [
  {
    title: "Research Productivity",
    description: "Your research activity has increased 40% this month",
    progress: 75,
    icon: TrendingUp,
    color: "text-green-600",
  },
  {
    title: "AI Recommendations",
    description: "3 new papers match your research interests",
    count: 3,
    icon: Lightbulb,
    color: "text-yellow-600",
  },
  {
    title: "Team Collaboration",
    description: "2 team members are actively contributing",
    count: 2,
    icon: Users,
    color: "text-blue-600",
  },
];

export default function DashboardPage() {
  // Protected route guard
  const { isLoading, user, session } = useProtectedRoute();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const userRole = user?.role || USER_ROLES.RESEARCHER;

  // Get actions available to the user based on their role
  const getAvailableActions = () => {
    const actions = [...baseQuickActions];
    const userRoleActions =
      roleSpecificActions[userRole as keyof typeof roleSpecificActions] || [];
    return [...actions, ...userRoleActions];
  };

  const availableActions = getAvailableActions();

  // Handle quick action click with toast feedback
  const handleActionClick = (actionTitle: string) => {
    showSuccessToast(
      `Opening ${actionTitle}`,
      "Redirecting you to the page..."
    );
  };

  return (
    <DashboardLayout>
      {/* Welcome Header */}
      <div className="flex flex-col space-y-3 sm:space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">
            Welcome back, {user?.name?.split(" ")[0] || "Researcher"}!
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Here's what's happening with your research today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <RoleBadge role={userRole} size="sm" />
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {recentStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                    {stat.title}
                  </p>
                  <p className="text-xl sm:text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                </div>
                <div
                  className={`rounded-full p-2 sm:p-3 ${stat.bgColor} flex-shrink-0`}
                >
                  <stat.icon
                    className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.iconColor}`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Quick Actions */}
        <div className="xl:col-span-2">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription className="text-sm">
                Get started with common research tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {availableActions.slice(0, 4).map((action, index) => (
                  <Button
                    key={index}
                    asChild
                    variant="outline"
                    className="h-auto p-3 sm:p-4 justify-start hover:shadow-md transition-all duration-300"
                    onClick={() => handleActionClick(action.title)}
                  >
                    <Link
                      href={action.href}
                      className="flex items-center gap-3 w-full"
                    >
                      <div
                        className={`p-2 rounded-lg ${action.color} text-white flex-shrink-0`}
                      >
                        <action.icon className="h-3 w-3 sm:h-4 sm:w-4" />
                      </div>
                      <div className="text-left min-w-0 flex-1">
                        <p className="font-medium text-sm sm:text-base truncate">
                          {action.title}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                          {action.description}
                        </p>
                      </div>
                    </Link>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Insights */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Brain className="h-4 w-4 sm:h-5 sm:w-5" />
              Insights
            </CardTitle>
            <CardDescription className="text-sm">
              Your research at a glance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            {quickInsights.map((insight, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="rounded-full p-2 bg-muted flex-shrink-0">
                  <insight.icon
                    className={`h-3 w-3 sm:h-4 sm:w-4 ${insight.color}`}
                  />
                </div>
                <div className="flex-1 space-y-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {insight.title}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {insight.description}
                  </p>
                  {"progress" in insight && (
                    <Progress
                      value={insight.progress}
                      className="h-1.5 sm:h-2"
                    />
                  )}
                  {"count" in insight && (
                    <Badge variant="secondary" className="text-xs">
                      {insight.count} items
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Research Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription className="text-sm">
              Your latest research actions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="rounded-full p-2 bg-muted flex-shrink-0">
                  <activity.icon
                    className={`h-3 w-3 sm:h-4 sm:w-4 ${activity.color}`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm line-clamp-2">
                    {activity.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Research Overview */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
              Research Overview
            </CardTitle>
            <CardDescription className="text-sm">
              Your research library status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1 min-w-0 flex-1">
                  <p className="text-sm font-medium">Papers Analyzed</p>
                  <p className="text-xs text-muted-foreground">
                    AI insights generated
                  </p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  18/24
                </Badge>
              </div>
              <Progress value={75} className="h-1.5 sm:h-2" />
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1 min-w-0 flex-1">
                  <p className="text-sm font-medium">Collection Progress</p>
                  <p className="text-xs text-muted-foreground">
                    Organized papers
                  </p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  21/24
                </Badge>
              </div>
              <Progress value={87} className="h-1.5 sm:h-2" />
            </div>

            <div className="flex gap-2 pt-2 sm:pt-4">
              <Button asChild size="sm" className="flex-1 text-xs sm:text-sm">
                <Link href="/papers/upload">
                  <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Upload
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="flex-1 text-xs sm:text-sm"
              >
                <Link href="/collections/create">
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Organize
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendations */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5" />
            AI Recommendations
          </CardTitle>
          <CardDescription className="text-sm">
            Personalized research suggestions powered by AI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="rounded-lg border p-3 sm:p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-3 w-3 sm:h-4 sm:w-4 text-pink-600" />
                <Badge variant="secondary" className="text-xs">
                  AI Insight
                </Badge>
              </div>
              <h4 className="font-medium mb-1 text-sm sm:text-base">
                Similar Research Found
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-2">
                3 papers on neural networks that align with your interests
              </p>
              <Button
                size="sm"
                variant="outline"
                asChild
                className="w-full text-xs sm:text-sm"
              >
                <Link href="/ai-insights">
                  View Details
                  <ArrowUpRight className="h-3 w-3 ml-1" />
                </Link>
              </Button>
            </div>

            <div className="rounded-lg border p-3 sm:p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                <Badge variant="secondary" className="text-xs">
                  Collaboration
                </Badge>
              </div>
              <h4 className="font-medium mb-1 text-sm sm:text-base">
                Potential Collaborators
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-2">
                2 researchers with similar interests want to connect
              </p>
              <Button
                size="sm"
                variant="outline"
                asChild
                className="w-full text-xs sm:text-sm"
              >
                <Link href="/collaborate">
                  Connect
                  <ArrowUpRight className="h-3 w-3 ml-1" />
                </Link>
              </Button>
            </div>

            <div className="rounded-lg border p-3 sm:p-4 hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                <Badge variant="secondary" className="text-xs">
                  Trending
                </Badge>
              </div>
              <h4 className="font-medium mb-1 text-sm sm:text-base">
                Trending Topics
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-2">
                "Sustainable AI" is gaining momentum in your field
              </p>
              <Button
                size="sm"
                variant="outline"
                asChild
                className="w-full text-xs sm:text-sm"
              >
                <Link href="/trends">
                  Explore
                  <ArrowUpRight className="h-3 w-3 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
