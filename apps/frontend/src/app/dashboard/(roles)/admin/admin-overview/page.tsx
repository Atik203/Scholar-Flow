"use client";

import { RoleBadge } from "@/components/auth/RoleBadge";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { showSuccessToast } from "@/components/providers/ToastProvider";
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
  useGetSystemHealthQuery,
  useGetSystemStatsQuery,
} from "@/redux/api/adminApi";
import {
  Activity,
  Database,
  Download,
  FileText,
  Plus,
  Settings,
  Shield,
  Users,
} from "lucide-react";
import { Suspense, lazy } from "react";

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
    title: "Analytics Dashboard",
    description: "View detailed platform analytics and reports",
    icon: Activity,
    href: "/dashboard/admin/analytics",
    color: "bg-purple-500 hover:bg-purple-600",
  },
];

export default function AdminOverviewPage() {
  // Fetch data with polling (30 seconds interval)
  const { data: systemStats, isLoading: statsLoading } = useGetSystemStatsQuery(
    undefined,
    {
      pollingInterval: 30000, // 30 seconds
    }
  );

  const { data: recentUsersData, isLoading: usersLoading } =
    useGetRecentUsersQuery({
      page: 1,
      limit: 10,
    });

  const { data: systemHealth, isLoading: healthLoading } =
    useGetSystemHealthQuery(undefined, {
      pollingInterval: 60000, // 1 minute
    });

  const { data: paperStats } = useGetPaperStatsQuery();

  const handleExportUsers = () => {
    showSuccessToast("Export Data", "User data export started");
  };

  const handleAddUser = () => {
    showSuccessToast("Add User", "Opening user creation form");
  };

  return (
    <DashboardLayout>
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
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button size="sm" onClick={handleAddUser}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
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
      </div>
    </DashboardLayout>
  );
}
