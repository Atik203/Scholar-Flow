"use client";

import { RoleBadge } from "@/components/auth/RoleBadge";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// Chart components - using recharts directly for better type safety
import { Progress } from "@/components/ui/progress";
import { useProtectedRoute } from "@/hooks/useAuthGuard";
import { USER_ROLES } from "@/lib/auth/roles";
import { useGetUserAnalyticsQuery } from "@/redux/api/userApi";
import {
  BarChart3,
  Database,
  FileText,
  FolderOpen,
  Loader2,
  Lock,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = {
  primary: "hsl(var(--primary))",
  secondary: "hsl(var(--secondary))",
  success: "hsl(142, 76%, 36%)",
  warning: "hsl(38, 92%, 50%)",
  danger: "hsl(0, 84%, 60%)",
  info: "hsl(221, 83%, 53%)",
};

const STATUS_COLORS: Record<string, string> = {
  PROCESSED: COLORS.success,
  PROCESSING: COLORS.info,
  UPLOADED: COLORS.warning,
  FAILED: COLORS.danger,
};

export default function AnalyticsPage() {
  const { isLoading: isAuthLoading, user: authUser } = useProtectedRoute();
  const { data: analyticsData, isLoading: isAnalyticsLoading } =
    useGetUserAnalyticsQuery();

  // Check if user has access to analytics (PRO, TEAM_LEAD, ADMIN)
  const hasAccess =
    authUser?.role === USER_ROLES.PRO_RESEARCHER ||
    authUser?.role === USER_ROLES.TEAM_LEAD ||
    authUser?.role === USER_ROLES.ADMIN;

  if (isAuthLoading || isAnalyticsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading analytics...</span>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="border-amber-200 dark:border-amber-800">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center mb-4">
                <Lock className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              </div>
              <CardTitle className="text-2xl">
                Analytics Dashboard - PRO Feature
              </CardTitle>
              <CardDescription className="text-base">
                Upgrade to PRO to access comprehensive analytics and insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Unlock advanced analytics:</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Detailed usage statistics and trends
                  </li>
                  <li className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Paper processing status tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    Storage and resource utilization
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    AI token usage insights
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const analytics = analyticsData?.data;

  if (!analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No analytics data available</p>
      </div>
    );
  }

  const { plan, usage, limits, charts } = analytics;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <BarChart3 className="h-8 w-8" />
                Analytics Dashboard
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Comprehensive insights into your research activity
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant={plan === "PRO" ? "default" : "secondary"}
                className="text-sm px-3 py-1"
              >
                {plan} Plan
              </Badge>
              <RoleBadge
                role={authUser?.role || USER_ROLES.RESEARCHER}
                size="lg"
              />
            </div>
          </div>
        </div>

        {/* Usage Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Papers */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <FileText className="h-5 w-5 text-blue-500" />
                <Badge variant="outline" className="text-xs">
                  {limits.maxPapers === -1
                    ? "Unlimited"
                    : `${usage.papers.total}/${limits.maxPapers}`}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {usage.papers.total}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Papers
                  </span>
                </div>
                {limits.maxPapers !== -1 && (
                  <Progress value={usage.papers.percentage} className="h-2" />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Collections */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <FolderOpen className="h-5 w-5 text-purple-500" />
                <Badge variant="outline" className="text-xs">
                  {limits.maxCollections === -1
                    ? "Unlimited"
                    : `${usage.collections.total}/${limits.maxCollections}`}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {usage.collections.total}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Collections
                  </span>
                </div>
                {limits.maxCollections !== -1 && (
                  <Progress
                    value={usage.collections.percentage}
                    className="h-2"
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Storage */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Database className="h-5 w-5 text-green-500" />
                <Badge variant="outline" className="text-xs">
                  {usage.storage.used.toFixed(2)} / {limits.maxStorage}{" "}
                  {usage.storage.unit}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {usage.storage.used.toFixed(0)}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    MB Used
                  </span>
                </div>
                <Progress
                  value={Math.min(usage.storage.percentage, 100)}
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* AI Tokens */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Sparkles className="h-5 w-5 text-amber-500" />
                <Badge variant="outline" className="text-xs">
                  {usage.tokens.used.toLocaleString()} /{" "}
                  {limits.maxTokens.toLocaleString()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {(usage.tokens.used / 1000).toFixed(1)}K
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    AI Tokens
                  </span>
                </div>
                <Progress
                  value={Math.min(usage.tokens.percentage, 100)}
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Papers Over Time */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Papers Uploaded (Last 30 Days)
              </CardTitle>
              <CardDescription>Daily paper upload activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={charts.papersOverTime}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      }
                      fontSize={12}
                    />
                    <YAxis fontSize={12} />
                    <Tooltip
                      content={({ active, payload }: any) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
                              <p className="text-sm font-medium">
                                {new Date(
                                  payload[0].payload.date
                                ).toLocaleDateString()}
                              </p>
                              <p className="text-sm text-blue-600">
                                Papers: {payload[0].value}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke={COLORS.primary}
                      fill={COLORS.primary}
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Collections Over Time */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                Collections Created (Last 30 Days)
              </CardTitle>
              <CardDescription>
                Daily collection creation activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={charts.collectionsOverTime}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      }
                      fontSize={12}
                    />
                    <YAxis fontSize={12} />
                    <Tooltip
                      content={({ active, payload }: any) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
                              <p className="text-sm font-medium">
                                {new Date(
                                  payload[0].payload.date
                                ).toLocaleDateString()}
                              </p>
                              <p className="text-sm text-purple-600">
                                Collections: {payload[0].value}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#a855f7"
                      strokeWidth={2}
                      dot={{ fill: "#a855f7", r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Storage Over Time */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Storage Usage (Last 6 Months)
              </CardTitle>
              <CardDescription>
                Monthly storage consumption trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.storageOverTime}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis
                      dataKey="month"
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString("en-US", {
                          month: "short",
                        })
                      }
                      fontSize={12}
                    />
                    <YAxis fontSize={12} />
                    <Tooltip
                      content={({ active, payload }: any) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
                              <p className="text-sm font-medium">
                                {new Date(
                                  payload[0].payload.month
                                ).toLocaleDateString("en-US", {
                                  month: "long",
                                  year: "numeric",
                                })}
                              </p>
                              <p className="text-sm text-green-600">
                                Storage: {Number(payload[0].value).toFixed(2)}{" "}
                                MB
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar
                      dataKey="size"
                      fill={COLORS.success}
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Papers by Status */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Papers by Processing Status
              </CardTitle>
              <CardDescription>
                Distribution of paper processing states
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={charts.papersByStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry: any) =>
                        `${entry.status}: ${entry.count} (${(entry.percent * 100).toFixed(0)}%)`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {charts.papersByStatus.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={STATUS_COLORS[entry.status] || COLORS.info}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }: any) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
                              <p className="text-sm font-medium">
                                {payload[0].payload.status}
                              </p>
                              <p className="text-sm">
                                Count: {payload[0].value}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
