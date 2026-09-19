"use client";

import { RoleBadge } from "@/components/auth/RoleBadge";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/providers/ToastProvider";
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
import {
  useGetPaperStatsQuery,
  useGetRecentUsersQuery,
  useGetRoleDistributionQuery,
  useGetSystemHealthQuery,
  useGetSystemStatsQuery,
  useGetUserGrowthDataQuery,
} from "@/redux/api/adminApi";
import {
  useExportUsersMutation,
  useGetAlertCountsQuery,
  useListAlertsQuery,
  useResolveAlertMutation,
} from "@/redux/api/adminExtendedApi";
import {
  Activity,
  AlertTriangle,
  Bell,
  Database,
  Download,
  FileText,
  Plus,
  Settings,
  Shield,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Suspense, lazy, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Lazy load heavy components for code splitting and better performance
const AdminStatsCard = lazy(() =>
  import("./components").then((mod) => ({ default: mod.AdminStatsCard }))
);
const RecentUsersTable = lazy(() =>
  import("./components").then((mod) => ({ default: mod.RecentUsersTable }))
);
const SystemHealthIndicator = lazy(() =>
  import("./components").then((mod) => ({
    default: mod.SystemHealthIndicator,
  }))
);

const adminActions = [
  {
    title: "User Management",
    description: "Manage user accounts, roles, and permissions",
    icon: Users,
    href: "/dashboard/admin/users",
    color: "bg-blue-500 hover:bg-blue-600",
  },
  {
    title: "System Settings",
    description: "Configure platform settings and policies",
    icon: Settings,
    href: "/dashboard/admin/settings",
    color: "bg-gray-500 hover:bg-gray-600",
  },
  {
    title: "Security Center",
    description: "Monitor security events and manage access",
    icon: Shield,
    href: "/dashboard/admin/system",
    color: "bg-red-500 hover:bg-red-600",
  },
  {
    title: "Revenue & Subscriptions",
    description: "Revenue analytics, MRR, and subscription management",
    icon: Activity,
    href: "/dashboard/admin/subscriptions",
    color: "bg-purple-500 hover:bg-purple-600",
  },
];

export default function AdminOverviewPage() {
  const [usersPage, setUsersPage] = useState(1);

  // Fetch data with polling (10 seconds interval per AGENTS.md)
  const { data: systemStats, isLoading: statsLoading } = useGetSystemStatsQuery(
    undefined,
    {
      pollingInterval: 10000, // 10 seconds
    }
  );

  const { data: recentUsersData, isLoading: usersLoading } =
    useGetRecentUsersQuery({
      page: usersPage,
      limit: 10,
    });

  const { data: systemHealth, isLoading: healthLoading } =
    useGetSystemHealthQuery(undefined, {
      pollingInterval: 10000, // 10 seconds
    });

  const { data: paperStats } = useGetPaperStatsQuery();

  // Phase 7 - System Alerts widget
  const { data: alertCounts } = useGetAlertCountsQuery();
  const { data: recentAlerts } = useListAlertsQuery({ resolved: false, limit: 5 });
  const [resolveAlert] = useResolveAlertMutation();

  // Growth + role distribution widgets
  const { data: growthData, isLoading: growthLoading } =
    useGetUserGrowthDataQuery();
  const { data: roleDistribution, isLoading: rolesLoading } =
    useGetRoleDistributionQuery();

  // Real user export (filter-aware CSV)
  const [exportUsers, { isLoading: isExporting }] = useExportUsersMutation();

  const handleExportUsers = async () => {
    try {
      const blob = await exportUsers().unwrap();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `scholar-flow-users-${new Date()
        .toISOString()
        .slice(0, 10)}.csv`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      showSuccessToast("Export complete", "User CSV downloaded");
    } catch {
      showErrorToast("Export failed", "Could not export users. Try again.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Shield className="h-8 w-8 text-red-500" />
            Admin Dashboard
          </h1>
            <p className="text-muted-foreground mt-2">
              System administration and user management overview.
            </p>
          </div>
          <RoleBadge role={USER_ROLES.ADMIN} size="lg" />
        </div>

        {/* System Stats Grid */}
        <Suspense
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-24 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <AdminStatsCard
              title="Total Users"
              value={systemStats?.totalUsers ?? 0}
              change={`+${systemStats?.userGrowth?.percentageChange ?? 0}% this month`}
              icon={Users}
              iconColor="text-blue-600"
              isLoading={statsLoading}
            />
            <AdminStatsCard
              title="Research Papers"
              value={systemStats?.totalPapers ?? 0}
              change={`+${systemStats?.paperGrowth?.percentageChange ?? 0}% this month`}
              icon={FileText}
              iconColor="text-green-600"
              isLoading={statsLoading}
            />
            <AdminStatsCard
              title="Active Sessions"
              value={systemStats?.activeSessions ?? 0}
              change={`+${systemStats?.sessionGrowth?.percentageChange ?? 0}% this week`}
              icon={Activity}
              iconColor="text-purple-600"
              isLoading={statsLoading}
            />
            <AdminStatsCard
              title="Storage Used"
              value={systemStats?.storageUsed ?? "0 Bytes"}
              change={`+${systemStats?.storageGrowth?.percentageChange ?? 0}% this month`}
              icon={Database}
              iconColor="text-orange-600"
              isLoading={statsLoading}
            />
          </div>
        </Suspense>

        {/* Admin Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Admin Actions</CardTitle>
            <CardDescription>
              Quick access to high-impact administration tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {adminActions.map((action) => (
                <Button
                  key={action.title}
                  asChild
                  variant="outline"
                  className="h-auto p-6 flex-col items-start space-y-3 hover:shadow-lg transition-all duration-300"
                >
                  <a href={action.href}>
                    <div
                      className={`p-3 rounded-lg ${action.color} text-white`}
                    >
                      <action.icon className="h-6 w-6" />
                    </div>
                    <div className="text-left space-y-1">
                      <h3 className="font-semibold text-foreground">
                        {action.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {action.description}
                      </p>
                    </div>
                  </a>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Users */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle>Recent Users</CardTitle>
                  <CardDescription>
                    Latest user registrations and activity
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportUsers}
                    disabled={isExporting}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {isExporting ? "Exporting..." : "Export"}
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/dashboard/admin/users">
                      <Plus className="h-4 w-4 mr-2" />
                      Manage Users
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Suspense
                  fallback={
                    <div className="space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                      ))}
                    </div>
                  }
                >
                  <RecentUsersTable
                    users={recentUsersData?.data ?? []}
                    isLoading={usersLoading}
                    currentPage={usersPage}
                    totalPages={recentUsersData?.meta?.totalPage ?? 1}
                    onPageChange={setUsersPage}
                  />
                </Suspense>
              </CardContent>
            </Card>
          </div>

          {/* System Health */}
          <div>
            <Suspense
              fallback={
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              }
            >
              <SystemHealthIndicator
                health={systemHealth}
                isLoading={healthLoading}
              />
            </Suspense>
          </div>
        </div>

        {/* Growth + Role Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                User Growth (30 days)
              </CardTitle>
              <CardDescription>New registrations per day</CardDescription>
            </CardHeader>
            <CardContent>
              {growthLoading ? (
                <Skeleton className="h-56 w-full" />
              ) : !growthData || growthData.length === 0 ? (
                <p className="text-sm text-muted-foreground py-10 text-center">
                  No growth data available.
                </p>
              ) : (
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={growthData.map((g) => ({
                        ...g,
                        label: g.date.slice(5),
                      }))}
                      margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="hsl(var(--muted-foreground) / 0.15)"
                      />
                      <XAxis
                        dataKey="label"
                        tick={{ fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                        interval="preserveStartEnd"
                      />
                      <YAxis
                        tick={{ fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                        width={32}
                        allowDecimals={false}
                      />
                      <Tooltip
                        contentStyle={{
                          fontSize: 12,
                          borderRadius: 8,
                          border: "1px solid hsl(var(--border))",
                          background: "hsl(var(--background))",
                        }}
                      />
                      <Bar
                        dataKey="newUsers"
                        name="New users"
                        fill="hsl(var(--primary))"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Role Distribution
              </CardTitle>
              <CardDescription>Active accounts by role</CardDescription>
            </CardHeader>
            <CardContent>
              {rolesLoading ? (
                <Skeleton className="h-56 w-full" />
              ) : !roleDistribution || roleDistribution.length === 0 ? (
                <p className="text-sm text-muted-foreground py-10 text-center">
                  No role data available.
                </p>
              ) : (
                <div className="space-y-4 pt-2">
                  {roleDistribution.map((r) => (
                    <div key={r.role} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium capitalize">
                          {r.role.replace(/_/g, " ").toLowerCase()}
                        </span>
                        <span className="text-muted-foreground">
                          {r.count} ({r.percentage}%)
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${Math.min(100, r.percentage)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Paper Processing Stats (if available) */}
        {paperStats && (
          <Card>
            <CardHeader>
              <CardTitle>Paper Processing Statistics</CardTitle>
              <CardDescription>
                Overview of paper processing status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Processing</p>
                  <p className="text-2xl font-bold">
                    {paperStats.processingPapers}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-green-600">
                    {paperStats.completedPapers}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Failed</p>
                  <p className="text-2xl font-bold text-red-600">
                    {paperStats.failedPapers}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Avg. Time</p>
                  <p className="text-2xl font-bold">
                    {Math.round(paperStats.averageProcessingTime)}s
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Phase 7 - System Alerts widget */}
        <Card>
          <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                System Alerts
              </CardTitle>
              <CardDescription>
                Auto-generated alerts from system monitoring
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {alertCounts && alertCounts.data.critical > 0 && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600">
                  <AlertTriangle className="h-3 w-3" />
                  {alertCounts.data.critical} critical
                </span>
              )}
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/admin/alerts">View all</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {!recentAlerts || recentAlerts.data.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No unresolved alerts.
              </p>
            ) : (
              <div className="space-y-2">
                {recentAlerts.data.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center gap-3 p-3 rounded-lg border"
                  >
                    <AlertTriangle
                      className={`h-4 w-4 flex-shrink-0 ${
                        a.severity === "CRITICAL"
                          ? "text-red-500"
                          : a.severity === "WARNING"
                            ? "text-amber-500"
                            : "text-blue-500"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{a.title}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {a.message}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => resolveAlert(a.id)}
                    >
                      Resolve
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
    </div>
  );
}
