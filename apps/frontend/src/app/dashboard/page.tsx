"use client";

import { RoleBadge } from "@/components/auth/RoleBadge";
import { showSuccessToast } from "@/components/providers/ToastProvider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useProtectedRoute } from "@/hooks/useAuthGuard";
import { USER_ROLES } from "@/lib/auth/roles";
import {
  BookOpen,
  Clock,
  FileText,
  Plus,
  Search,
  Settings,
  Shield,
  Star,
  Users,
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
    value: "0",
    change: "+0 this week",
    icon: FileText,
    color: "text-blue-600",
  },
  {
    title: "Collections",
    value: "0",
    change: "+0 this week",
    icon: BookOpen,
    color: "text-green-600",
  },
  {
    title: "Collaborations",
    value: "0",
    change: "+0 this week",
    icon: Users,
    color: "text-purple-600",
  },
  {
    title: "Reading Time",
    value: "0h",
    change: "+0h this week",
    icon: Clock,
    color: "text-orange-600",
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Role Badge */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Welcome back, {user?.name?.split(" ")[0] || "Researcher"}!
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Here's what's happening with your research today.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <RoleBadge role={userRole} size="lg" />
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {recentStats.map((stat, index) => (
            <Card key={index} className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {stat.change}
                    </p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="mb-8 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">Quick Actions</CardTitle>
            <CardDescription className="dark:text-gray-400">
              Get started with common tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {availableActions.map((action, index) => (
                <Button
                  key={index}
                  asChild
                  variant="outline"
                  className="h-auto p-6 flex-col items-start space-y-3 hover:shadow-lg transition-all duration-300 dark:border-gray-600 dark:hover:bg-gray-700"
                  onClick={() => handleActionClick(action.title)}
                >
                  <Link href={action.href}>
                    <div
                      className={`p-3 rounded-lg ${action.color} text-white`}
                    >
                      <action.icon className="h-6 w-6" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {action.description}
                      </p>
                    </div>
                  </Link>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity & Collections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Papers */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-white">
                <FileText className="h-5 w-5" />
                Recent Papers
              </CardTitle>
              <CardDescription className="dark:text-gray-400">
                Your recently uploaded or viewed papers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  No papers uploaded yet
                </p>
                <Button asChild>
                  <Link href="/papers/upload">Upload Your First Paper</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Collections */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-white">
                <BookOpen className="h-5 w-5" />
                Collections
              </CardTitle>
              <CardDescription className="dark:text-gray-400">
                Your organized paper collections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  No collections created yet
                </p>
                <Button asChild variant="outline">
                  <Link href="/collections/create">
                    Create Your First Collection
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Getting Started Guide */}
        <Card className="mt-8 border-primary/20 bg-gradient-to-r from-primary/5 to-blue-50 dark:from-primary/10 dark:to-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary dark:text-primary">
              <Star className="h-5 w-5" />
              Getting Started with ScholarFlow
            </CardTitle>
            <CardDescription className="dark:text-gray-400">
              New to ScholarFlow? Here's how to get the most out of your
              research workflow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-primary/10 dark:bg-primary/20 p-4 rounded-lg mb-3 inline-block">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2 dark:text-white">
                  1. Upload Papers
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Start by uploading your research papers to build your digital
                  library
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 dark:bg-primary/20 p-4 rounded-lg mb-3 inline-block">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2 dark:text-white">
                  2. Organize
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Create collections to organize papers by topic, project, or
                  research area
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 dark:bg-primary/20 p-4 rounded-lg mb-3 inline-block">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2 dark:text-white">
                  3. Collaborate
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Share collections and collaborate with colleagues on research
                  projects
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
