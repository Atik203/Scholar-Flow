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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useProtectedRoute } from "@/hooks/useAuthGuard";
import { USER_ROLES, resolveRoleScopedHref } from "@/lib/auth/roles";
import { useGetMyCollectionsQuery } from "@/redux/api/collectionApi";
import { useListPapersQuery } from "@/redux/api/paperApi";
import { useListWorkspacesQuery } from "@/redux/api/workspaceApi";
import {
  AlertCircle,
  ArrowUpRight,
  BookOpen,
  Brain,
  Building2,
  Clock,
  FileText,
  Lightbulb,
  Plus,
  Search,
  Settings,
  Shield,
  TextCursor,
  TrendingUp,
  Upload,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

// Base quick actions available to all roles (now defined as a function to use workspace context)
const getBaseQuickActions = (workspaceId?: string) => [
  {
    title: "Upload Paper",
    description: "Add a new research paper to your collection",
    icon: Plus,
    href: workspaceId
      ? `/papers/upload?workspaceId=${workspaceId}`
      : "/papers/upload",
    color: "bg-blue-500 hover:bg-blue-600",
    minRole: USER_ROLES.RESEARCHER,
  },
  {
    title: "View Papers",
    description: "View and manage your research papers",
    icon: FileText,
    href: "/papers",
    color: "bg-green-500 hover:bg-green-600",
    minRole: USER_ROLES.RESEARCHER,
  },
  {
    title: "Search Papers",
    description: "Find and explore research papers",
    icon: Search,
    href: "/papers/search",
    color: "bg-purple-500 hover:bg-purple-600",
    minRole: USER_ROLES.RESEARCHER,
  },
  {
    title: "View Collections",
    description: "View and manage your paper collections",
    icon: BookOpen,
    href: workspaceId
      ? `/collections?workspaceId=${workspaceId}`
      : "/collections",
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
      href: "",
      color: "bg-indigo-500 hover:bg-indigo-600",
    },
  ],
  [USER_ROLES.TEAM_LEAD]: [
    {
      title: "Team Management",
      description: "Manage team members and permissions",
      icon: Users,
      href: "",
      color: "bg-cyan-500 hover:bg-cyan-600",
    },
  ],
  [USER_ROLES.ADMIN]: [
    {
      title: "Admin Panel",
      description: "System administration and user management",
      icon: Shield,
      href: "",
      color: "bg-red-500 hover:bg-red-600",
    },
  ],
};

// Recent activity data (static for now, can be made dynamic later)
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

export default function DashboardPage() {
  // Protected route guard
  const { isLoading, user, session } = useProtectedRoute();

  // Workspace state
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>("");

  // Fetch workspaces for selection
  const { data: workspacesData } = useListWorkspacesQuery({
    page: 1,
    limit: 50,
    scope: "all",
  });

  // Get workspace-aware data
  const { data: papersData, isLoading: papersLoading } = useListPapersQuery({
    page: 1,
    limit: 10, // Get more recent papers for dashboard
    workspaceId: selectedWorkspaceId || undefined,
  });

  const { data: collectionsData, isLoading: collectionsLoading } =
    useGetMyCollectionsQuery({
      page: 1,
      limit: 50,
      workspaceId: selectedWorkspaceId || undefined,
    });

  // Auto-select first workspace if only one available
  useEffect(() => {
    const workspaces = workspacesData?.data || [];
    if (workspaces.length === 1 && !selectedWorkspaceId) {
      setSelectedWorkspaceId(workspaces[0].id);
    }
  }, [workspacesData, selectedWorkspaceId]);

  // Helper: format relative time (e.g., "2h ago")
  const formatTimeAgo = (dateStr?: string) => {
    if (!dateStr) return "";
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const sec = Math.floor(diffMs / 1000);
    if (sec < 60) return `${sec}s ago`;
    const min = Math.floor(sec / 60);
    if (min < 60) return `${min}m ago`;
    const hrs = Math.floor(min / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString();
  };

  // Derived processing stats for overview widgets
  const processingStats = useMemo(() => {
    const items = papersData?.items || [];
    const total = papersData?.meta?.total || items.length || 0;
    const processed = items.filter(
      (p: any) => p.processingStatus === "PROCESSED"
    ).length;
    const processing = items.filter(
      (p: any) => p.processingStatus === "PROCESSING"
    ).length;
    const failed = items.filter(
      (p: any) => p.processingStatus === "FAILED"
    ).length;
    const extracted = items.filter(
      (p: any) => p.extractedText && p.extractedText.length > 100
    ).length;
    return { total, processed, processing, failed, extracted };
  }, [papersData]);

  // Dynamic recent activity derived from papers list
  const dynamicActivity = useMemo(() => {
    const items = papersData?.items || [];
    const acts: Array<{
      title: string;
      time: string;
      icon: any;
      color: string;
    }> = [];
    // Most recent uploads
    items.slice(0, 5).forEach((p: any) =>
      acts.push({
        title: `Paper added: ${p.title}`,
        time: formatTimeAgo(p.createdAt),
        icon: Upload,
        color: "text-blue-600",
      })
    );
    // Highlight processed papers (top 3)
    items
      .filter((p: any) => p.processingStatus === "PROCESSED")
      .slice(0, 3)
      .forEach((p: any) =>
        acts.push({
          title: `Text extracted: ${p.title}`,
          time: formatTimeAgo(p.updatedAt || p.createdAt),
          icon: TextCursor,
          color: "text-emerald-600",
        })
      );
    return acts.slice(0, 6);
  }, [papersData]);

  // Compute comprehensive workspace-aware stats
  const workspaceStats = useMemo(() => {
    const totalPapers = papersData?.meta?.total || 0;
    const recentPapers = papersData?.items || [];
    const totalCollections = collectionsData?.result?.length || 0;
    const availableWorkspaces = workspacesData?.data || [];

    // Calculate papers uploaded this week
    const thisWeekPapers = recentPapers.filter((paper) => {
      const paperDate = new Date(paper.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return paperDate > weekAgo;
    }).length;

    // Calculate processed papers and extraction stats
    const processedPapers = recentPapers.filter(
      (p) => p.processingStatus === "PROCESSED"
    ).length;
    const processingPapers = recentPapers.filter(
      (p) => p.processingStatus === "PROCESSING"
    ).length;
    const failedPapers = recentPapers.filter(
      (p) => p.processingStatus === "FAILED"
    ).length;
    // Approximate extracted as processed (frontend does not include extractedText in Paper type)
    const extractedPapers = processedPapers;

    // Calculate total storage
    const totalBytes = recentPapers.reduce(
      (acc, paper) => acc + (paper.file?.sizeBytes || 0),
      0
    );
    const totalMB = Math.round(totalBytes / (1024 * 1024));
    const totalGB = totalMB > 1024 ? (totalMB / 1024).toFixed(1) : null;

    // Get current workspace info
    const currentWorkspace = availableWorkspaces.find(
      (w) => w.id === selectedWorkspaceId
    );
    const totalWorkspaces = availableWorkspaces.length;

    return [
      {
        title: selectedWorkspaceId ? "Papers in Workspace" : "All Papers",
        value: totalPapers.toString(),
        change: `+${thisWeekPapers} this week`,
        trend: thisWeekPapers > 0 ? ("up" as const) : ("neutral" as const),
        icon: FileText,
        color: "text-blue-600",
        bgColor: "bg-blue-50 dark:bg-blue-950/20",
        iconColor: "text-blue-600 dark:text-blue-400",
        details: `${processingPapers} processing${failedPapers > 0 ? `, ${failedPapers} failed` : ""}`,
      },
      {
        title: "Text Extracted",
        value: extractedPapers.toString(),
        change: `${Math.round((extractedPapers / Math.max(totalPapers, 1)) * 100)}% of papers`,
        trend:
          extractedPapers > processedPapers * 0.8
            ? ("up" as const)
            : ("neutral" as const),
        icon: TextCursor,
        color: "text-emerald-600",
        bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
        iconColor: "text-emerald-600 dark:text-emerald-400",
        details: `${processedPapers} fully processed`,
      },
      {
        title: selectedWorkspaceId
          ? "Collections Here"
          : `Collections (${totalWorkspaces} workspaces)`,
        value: totalCollections.toString(),
        change: collectionsLoading
          ? "Loading..."
          : selectedWorkspaceId
            ? `in ${currentWorkspace?.name || "workspace"}`
            : "across all workspaces",
        trend: "neutral" as const,
        icon: BookOpen,
        color: "text-orange-600",
        bgColor: "bg-orange-50 dark:bg-orange-950/20",
        iconColor: "text-orange-600 dark:text-orange-400",
        details: selectedWorkspaceId
          ? `Role: ${currentWorkspace?.userRole || "Member"}`
          : `${totalWorkspaces} workspaces available`,
      },
      {
        title: "Storage Used",
        value: totalGB ? `${totalGB}GB` : totalMB > 0 ? `${totalMB}MB` : "0MB",
        change: selectedWorkspaceId
          ? "Workspace files"
          : "Total across all papers",
        trend: totalMB > 500 ? ("up" as const) : ("neutral" as const),
        icon: Clock,
        color: "text-purple-600",
        bgColor: "bg-purple-50 dark:bg-purple-950/20",
        iconColor: "text-purple-600 dark:text-purple-400",
        details: `${totalPapers} papers${totalMB > 100 ? ", optimize storage" : ""}`,
      },
    ];
  }, [
    papersData,
    collectionsData,
    collectionsLoading,
    selectedWorkspaceId,
    workspacesData,
  ]);

  // Current workspace memo for snapshot
  const currentWorkspace = useMemo(() => {
    return (workspacesData?.data || []).find(
      (w) => w.id === selectedWorkspaceId
    );
  }, [workspacesData, selectedWorkspaceId]);

  const userRole = user?.role || USER_ROLES.RESEARCHER;

  const scopedHref = useCallback(
    (href: string) => resolveRoleScopedHref(user?.role, href),
    [user?.role]
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Get actions available to the user based on their role
  const getAvailableActions = () => {
    const actions = [...getBaseQuickActions(selectedWorkspaceId)];
    const userRoleActions =
      roleSpecificActions[userRole as keyof typeof roleSpecificActions] || [];
    return [...actions, ...userRoleActions].map((action) => ({
      ...action,
      href: scopedHref(action.href),
    }));
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
      <div className="flex flex-col space-y-3 sm:space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between lg:space-y-0 gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">
              Welcome back, {user?.name?.split(" ")[0] || "Researcher"}!
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              {selectedWorkspaceId
                ? "Here's what's happening in your current workspace."
                : "Select a workspace to view your research dashboard."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <RoleBadge role={userRole} size="sm" />
          </div>
        </div>

        {/* Workspace Selection */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            <label htmlFor="workspace-select" className="text-sm font-medium">
              Current Workspace:
            </label>
          </div>
          <Select
            value={selectedWorkspaceId}
            onValueChange={setSelectedWorkspaceId}
          >
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Select a workspace to view dashboard" />
            </SelectTrigger>
            <SelectContent>
              {(workspacesData?.data || []).map((workspace: any) => (
                <SelectItem key={workspace.id} value={workspace.id}>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span>{workspace.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {workspace.userRole || "Member"}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {papersLoading || collectionsLoading
          ? // Loading skeletons
            Array.from({ length: 4 }).map((_, index) => (
              <Card key={index}>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1 space-y-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-6 w-12" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <Skeleton className="h-10 w-10 rounded-full" />
                  </div>
                </CardContent>
              </Card>
            ))
          : workspaceStats.map((stat, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                        {stat.title}
                      </p>
                      <p className="text-xl sm:text-2xl font-bold">
                        {stat.value}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {stat.change}
                      </p>
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
            {(dynamicActivity.length ? dynamicActivity : recentActivity).map(
              (activity, index) => (
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
              )
            )}
          </CardContent>
        </Card>
      </div>

      {/* Processing Overview, Research Tools, Workspace Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Processing Overview */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Zap className="h-4 w-4 sm:h-5 sm:w-5" /> Processing Overview
            </CardTitle>
            <CardDescription className="text-sm">
              Snapshot of document processing and extraction
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Total</span>
                  <FileText className="h-3.5 w-3.5 text-blue-600" />
                </div>
                <p className="text-lg font-semibold">{processingStats.total}</p>
              </div>
              <div className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Processed
                  </span>
                  <Brain className="h-3.5 w-3.5 text-emerald-600" />
                </div>
                <p className="text-lg font-semibold">
                  {processingStats.processed}
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Processing
                  </span>
                  <Zap className="h-3.5 w-3.5 text-amber-600" />
                </div>
                <p className="text-lg font-semibold">
                  {processingStats.processing}
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Failed</span>
                  <AlertCircle className="h-3.5 w-3.5 text-red-600" />
                </div>
                <p className="text-lg font-semibold">
                  {processingStats.failed}
                </p>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              {processingStats.processed > 0
                ? `${Math.round((processingStats.processed / Math.max(processingStats.total, 1)) * 100)}% processed`
                : "No processed papers yet"}
            </div>
          </CardContent>
        </Card>

        {/* Research Tools */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Search className="h-4 w-4 sm:h-5 sm:w-5" /> Research Tools
            </CardTitle>
            <CardDescription className="text-sm">
              Jump into key workflows
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                asChild
                variant="outline"
                className="justify-start h-auto p-3"
              >
                <Link
                  href={scopedHref("/research/pdf-extraction")}
                  className="flex items-center gap-3 w-full"
                >
                  <div className="p-2 rounded-lg bg-emerald-500 text-white">
                    <TextCursor className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">PDF Text Extraction</div>
                    <div className="text-xs text-muted-foreground">
                      Preview & extract text
                    </div>
                  </div>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="justify-start h-auto p-3"
              >
                <Link
                  href={scopedHref("/papers/search")}
                  className="flex items-center gap-3 w-full"
                >
                  <div className="p-2 rounded-lg bg-blue-500 text-white">
                    <Search className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Advanced Search</div>
                    <div className="text-xs text-muted-foreground">
                      Filter, query, discover
                    </div>
                  </div>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="justify-start h-auto p-3 sm:col-span-2"
              >
                <Link
                  href={scopedHref("/analytics")}
                  className="flex items-center gap-3 w-full"
                >
                  <div className="p-2 rounded-lg bg-purple-500 text-white">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Analytics</div>
                    <div className="text-xs text-muted-foreground">
                      Insights & trends
                    </div>
                  </div>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Workspace Snapshot */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Building2 className="h-4 w-4 sm:h-5 sm:w-5" /> Workspace Snapshot
            </CardTitle>
            <CardDescription className="text-sm">
              Key details of your current workspace
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {selectedWorkspaceId && currentWorkspace ? (
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Name</span>
                  <span className="font-medium">{currentWorkspace.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Your Role</span>
                  <Badge variant="outline">
                    {currentWorkspace.userRole || "Member"}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-lg border p-2 text-center">
                    <div className="text-[10px] text-muted-foreground">
                      Members
                    </div>
                    <div className="text-base font-semibold">
                      {currentWorkspace.memberCount ?? "-"}
                    </div>
                  </div>
                  <div className="rounded-lg border p-2 text-center">
                    <div className="text-[10px] text-muted-foreground">
                      Papers
                    </div>
                    <div className="text-base font-semibold">
                      {currentWorkspace.paperCount ?? "-"}
                    </div>
                  </div>
                  <div className="rounded-lg border p-2 text-center">
                    <div className="text-[10px] text-muted-foreground">
                      Collections
                    </div>
                    <div className="text-base font-semibold">
                      {currentWorkspace.collectionCount ?? "-"}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                Select a workspace above to see details.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Papers Section */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
            Recent Papers
            {selectedWorkspaceId && (
              <Badge variant="outline" className="text-xs">
                Workspace
              </Badge>
            )}
          </CardTitle>
          <CardDescription className="text-sm">
            {selectedWorkspaceId
              ? "Latest papers from your current workspace"
              : "Select a workspace to view recent papers"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {papersLoading ? (
            // Loading skeletons
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-start gap-3">
                <Skeleton className="h-10 w-10 rounded" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))
          ) : papersData?.items && papersData.items.length > 0 ? (
            <div className="space-y-3">
              {papersData.items.slice(0, 3).map((paper) => (
                <Link
                  key={paper.id}
                  href={`/dashboard/papers/${paper.id}`}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                >
                  <div className="rounded p-2 bg-blue-50 dark:bg-blue-950/20 flex-shrink-0">
                    <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm line-clamp-1 group-hover:text-primary">
                      {paper.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {paper.metadata?.authors &&
                      paper.metadata.authors.length > 0
                        ? `${paper.metadata.authors.slice(0, 2).join(", ")}${paper.metadata.authors.length > 2 ? "..." : ""}`
                        : "No authors"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(paper.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <Badge
                      variant={
                        paper.processingStatus === "PROCESSED"
                          ? "default"
                          : paper.processingStatus === "PROCESSING"
                            ? "secondary"
                            : "outline"
                      }
                      className="text-xs"
                    >
                      {paper.processingStatus}
                    </Badge>
                  </div>
                </Link>
              ))}
              <div className="pt-2">
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href={scopedHref("/papers")}>
                    View All Papers
                    <ArrowUpRight className="h-3 w-3 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          ) : selectedWorkspaceId ? (
            <div className="text-center py-6">
              <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                No papers in this workspace yet
              </p>
              <Button asChild variant="link" className="text-xs">
                <Link
                  href={`/dashboard/papers/upload?workspaceId=${selectedWorkspaceId}`}
                >
                  Upload your first paper
                </Link>
              </Button>
            </div>
          ) : (
            <div className="text-center py-6">
              <Building2 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Select a workspace to view papers
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Choose a workspace from the dropdown above
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      {selectedWorkspaceId && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5" />
              AI Recommendations
              <Badge variant="outline" className="text-xs">
                Beta
              </Badge>
            </CardTitle>
            <CardDescription className="text-sm">
              Personalized research suggestions based on your workspace activity
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
                  <Link href={scopedHref("/papers/search")}>
                    Explore Papers
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
                  2 researchers working on similar topics
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
                  <Link href={scopedHref("/papers/search")}>
                    Explore
                    <ArrowUpRight className="h-3 w-3 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
}
