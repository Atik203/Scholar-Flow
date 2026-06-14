"use client";

import { RoleBadge } from "@/components/auth/RoleBadge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { USER_ROLES } from "@/lib/auth/roles";
import { useGetMyCollectionsQuery } from "@/redux/api/collectionApi";
import { useListPapersQuery } from "@/redux/api/paperApi";
import { useListWorkspacesQuery } from "@/redux/api/workspaceApi";
import { useAuth } from "@/redux/auth/useAuth";
import {
  Activity,
  ArrowUpRight,
  BookOpen,
  Brain,
  Clock,
  FileText,
  Layers,
  Plus,
  Settings,
  Sparkles,
  TrendingUp,
  Upload,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";

interface ActivityItem {
  id: string;
  entity: string;
  action: string;
  details: Record<string, unknown> | null;
  createdAt: string;
}

function StatsCardSkeleton() {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center justify-between mb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4 rounded" />
      </div>
      <Skeleton className="h-8 w-16 mb-2" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
}

function QuickActionCard({
  title,
  description,
  icon: Icon,
  href,
  color,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-lg border p-4 hover:shadow-md hover:border-primary/40 transition-all duration-200"
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex-shrink-0 h-10 w-10 rounded-lg ${color} flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm group-hover:text-primary transition-colors flex items-center gap-1">
            {title}
            <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}

function ActivityFeedItem({ item }: { item: ActivityItem }) {
  const date = new Date(item.createdAt);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  let timeAgo: string;
  if (diffMins < 1) timeAgo = "Just now";
  else if (diffMins < 60) timeAgo = `${diffMins}m ago`;
  else if (diffHours < 24) timeAgo = `${diffHours}h ago`;
  else if (diffDays < 7) timeAgo = `${diffDays}d ago`;
  else timeAgo = date.toLocaleDateString();

  const actionIcon = (() => {
    const e = item.entity.toLowerCase();
    if (e.includes("paper")) return FileText;
    if (e.includes("collection")) return BookOpen;
    if (e.includes("workspace")) return Layers;
    if (e.includes("discussion")) return Activity;
    return Zap;
  })();

  const actionColor = (() => {
    const a = item.action.toLowerCase();
    if (a.includes("create") || a.includes("upload")) return "text-blue-600 bg-blue-50 dark:bg-blue-950/40";
    if (a.includes("share") || a.includes("invite")) return "text-purple-600 bg-purple-50 dark:bg-purple-950/40";
    if (a.includes("delete")) return "text-red-600 bg-red-50 dark:bg-red-950/40";
    return "text-green-600 bg-green-50 dark:bg-green-950/40";
  })();

  const Icon = actionIcon;
  return (
    <div className="flex items-start gap-3 py-3 border-b last:border-b-0">
      <div
        className={`flex-shrink-0 h-8 w-8 rounded-full ${actionColor} flex items-center justify-center`}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium capitalize">
          {item.action} {item.entity}
        </p>
        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
          <Clock className="h-3 w-3" /> {timeAgo}
        </p>
      </div>
    </div>
  );
}

export default function DashboardHomePage() {
  const { user } = useAuth();
  const userRole = user?.role || USER_ROLES.RESEARCHER;
  const firstName = user?.name?.split(" ")[0] || "Researcher";

  const { data: papersData, isLoading: papersLoading } = useListPapersQuery({
    limit: 5,
    page: 1,
  });
  const { data: collectionsData, isLoading: collectionsLoading } =
    useGetMyCollectionsQuery({ limit: 5, page: 1 });
  const { data: workspacesData, isLoading: workspacesLoading } =
    useListWorkspacesQuery({ limit: 1, page: 1 });

  const totalPapers = papersData?.meta?.total ?? 0;
  const totalCollections = collectionsData?.meta?.total ?? 0;
  const totalWorkspaces = workspacesData?.meta?.total ?? 0;
  const recentPapers = papersData?.items ?? [];
  const recentCollections = (collectionsData?.result ?? []) as Array<{
    id: string;
    name: string;
    description?: string;
    _count?: { papers: number; members: number };
    createdAt: string;
    updatedAt: string;
  }>;

  // Activity feed - this would come from /api/user/activity
  // For now, derive synthetic activity from recent papers/collections
  const recentActivity: ActivityItem[] = [
    ...recentPapers.slice(0, 3).map((p) => ({
      id: `paper-${p.id}`,
      entity: "paper",
      action: "uploaded",
      details: { title: p.title },
      createdAt: p.createdAt,
    })),
    ...recentCollections.slice(0, 2).map((c: { id: string; name: string; createdAt: string }) => ({
      id: `collection-${c.id}`,
      entity: "collection",
      action: "created",
      details: { name: c.name },
      createdAt: c.createdAt,
    })),
  ]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome back, {firstName}!
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Here's what's happening in your research today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <RoleBadge role={userRole} size="sm" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {papersLoading ? (
          <StatsCardSkeleton />
        ) : (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Papers</span>
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-2xl font-bold">{totalPapers}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Total uploaded
              </p>
            </CardContent>
          </Card>
        )}
        {collectionsLoading ? (
          <StatsCardSkeleton />
        ) : (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  Collections
                </span>
                <BookOpen className="h-4 w-4 text-orange-600" />
              </div>
              <div className="text-2xl font-bold">{totalCollections}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Active collections
              </p>
            </CardContent>
          </Card>
        )}
        {workspacesLoading ? (
          <StatsCardSkeleton />
        ) : (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  Workspaces
                </span>
                <Layers className="h-4 w-4 text-purple-600" />
              </div>
              <div className="text-2xl font-bold">{totalWorkspaces}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Active workspaces
              </p>
            </CardContent>
          </Card>
        )}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Plan</span>
              <Sparkles className="h-4 w-4 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold">Free</div>
            <p className="text-xs text-muted-foreground mt-1">
              <Link href="/pricing" className="text-primary hover:underline">
                Upgrade
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Quick Actions</h2>
          <Link
            href="/dashboard/papers"
            className="text-sm text-primary hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <QuickActionCard
            title="Upload Paper"
            description="Add a new research paper to your library"
            icon={Upload}
            href="/dashboard/papers/upload"
            color="bg-blue-500"
          />
          <QuickActionCard
            title="New Collection"
            description="Organize papers into a curated collection"
            icon={Plus}
            href="/dashboard/collections/create"
            color="bg-green-500"
          />
          <QuickActionCard
            title="New Workspace"
            description="Create a workspace for collaboration"
            icon={Layers}
            href="/dashboard/workspaces/create"
            color="bg-purple-500"
          />
          <QuickActionCard
            title="AI Insights"
            description="Get AI-powered summaries of your papers"
            icon={Brain}
            href="/dashboard/ai-insights"
            color="bg-orange-500"
          />
        </div>
      </div>

      {/* Two-column layout: Activity + Recent Papers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Recent Activity
            </CardTitle>
            <CardDescription>Your latest research actions</CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">
                No recent activity yet. Upload your first paper to get started.
              </p>
            ) : (
              <div className="divide-y">
                {recentActivity.map((item) => (
                  <ActivityFeedItem key={item.id} item={item} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Papers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Recent Papers
            </CardTitle>
            <CardDescription>Your most recent uploads</CardDescription>
          </CardHeader>
          <CardContent>
            {recentPapers.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">
                No papers yet.{" "}
                <Link
                  href="/dashboard/papers/upload"
                  className="text-primary hover:underline"
                >
                  Upload one
                </Link>{" "}
                to get started.
              </p>
            ) : (
              <div className="space-y-3">
                {recentPapers.slice(0, 5).map((paper) => (
                  <Link
                    key={paper.id}
                    href={`/dashboard/papers/${paper.id}`}
                    className="block p-3 rounded-md hover:bg-accent transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
                          {paper.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {paper.metadata?.authors?.slice(0, 2).join(", ") ||
                            "Unknown authors"}
                          {paper.metadata?.year && ` · ${paper.metadata.year}`}
                        </p>
                      </div>
                      <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Collections + Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Top Collections
            </CardTitle>
            <CardDescription>
              Your most recently updated collections
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentCollections.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">
                No collections yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {recentCollections.slice(0, 4).map((collection: { id: string; name: string; description?: string; _count?: { papers: number } }) => (
                  <Link
                    key={collection.id}
                    href={`/dashboard/collections/${collection.id}`}
                    className="block p-3 rounded-md border hover:border-primary/40 hover:shadow-sm transition-all"
                  >
                    <h4 className="font-medium text-sm line-clamp-1">
                      {collection.name}
                    </h4>
                    {collection.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {collection.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {collection._count?.papers ?? 0} papers
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Pro Tip
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-muted-foreground">
              Press{" "}
              <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded">⌘ K</kbd>{" "}
              anywhere to quickly search your research library.
            </p>
            <Link
              href="/dashboard/ai-insights"
              className="block text-primary hover:underline text-sm"
            >
              Try AI Insights →
            </Link>
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground text-xs mt-2"
            >
              <Settings className="h-3 w-3" /> Customize dashboard
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
