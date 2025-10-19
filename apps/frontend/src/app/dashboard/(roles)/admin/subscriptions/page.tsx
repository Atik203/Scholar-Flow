"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import {
  useGetRevenueAnalyticsQuery,
  useGetTopCustomersQuery,
} from "@/redux/api/adminApi";
import {
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  CreditCard,
  DollarSign,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import { useState } from "react";

export default function AdminSubscriptionsPage() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "1y">(
    "30d"
  );

  const {
    data: revenueData,
    isLoading: revenueLoading,
    error: revenueError,
  } = useGetRevenueAnalyticsQuery({ timeRange });

  const {
    data: topCustomers,
    isLoading: customersLoading,
    error: customersError,
  } = useGetTopCustomersQuery({ limit: 10 });

  const isLoading = revenueLoading || customersLoading;
  const hasError = revenueError || customersError;

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(2)}K`;
    }
    return num.toFixed(2);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<
      string,
      { variant: "default" | "secondary" | "destructive"; icon: any }
    > = {
      ACTIVE: { variant: "default", icon: CheckCircle2 },
      CANCELED: { variant: "destructive", icon: XCircle },
      EXPIRED: { variant: "destructive", icon: AlertCircle },
      PAST_DUE: { variant: "destructive", icon: AlertCircle },
    };

    const config = statusMap[status] || {
      variant: "secondary" as const,
      icon: AlertCircle,
    };
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    );
  };

  if (hasError) {
    return (
      <DashboardLayout>
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center h-96">
            <Card className="w-full max-w-md">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center gap-4 text-center">
                  <AlertCircle className="h-12 w-12 text-destructive" />
                  <div>
                    <h3 className="font-semibold text-lg">
                      Failed to Load Data
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Unable to fetch subscription analytics. Please try again
                      later.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Subscription & Revenue Analytics
            </h1>
            <p className="text-muted-foreground mt-1">
              Monitor subscription metrics, revenue trends, and customer
              insights
            </p>
          </div>

          <Select
            value={timeRange}
            onValueChange={(value) =>
              setTimeRange(value as "7d" | "30d" | "90d" | "1y")
            }
          >
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* MRR Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Monthly Recurring Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-32" />
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {formatCurrency(
                      revenueData?.mrr.amount || 0,
                      revenueData?.mrr.currency || "USD"
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Active subscriptions only
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          {/* ARR Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Annual Recurring Revenue
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-32" />
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {formatCurrency(
                      revenueData?.arr.amount || 0,
                      revenueData?.arr.currency || "USD"
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Annualized from MRR
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          {/* Total Revenue Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-32" />
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {formatCurrency(
                      revenueData?.totalRevenue.amount || 0,
                      revenueData?.totalRevenue.currency || "USD"
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {revenueData?.totalRevenue.period || "Period"} total
                    payments
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          {/* Active Users Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Active Subscribers
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-32" />
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {revenueData?.metrics.activeUsers || 0}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Paying customers
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Subscription Metrics Row */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* ARPU Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Average Revenue Per User
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <div className="text-3xl font-bold">
                    {formatCurrency(
                      revenueData?.metrics.arpu || 0,
                      revenueData?.mrr.currency || "USD"
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Per active subscriber
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          {/* New Subscriptions Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                New Subscriptions
                <ArrowUpRight className="h-4 w-4 text-green-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-3xl font-bold text-green-600">
                    +{revenueData?.subscriptions.new || 0}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    In {timeRange}
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          {/* Churn Rate Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                Churn Rate
                <ArrowDownRight className="h-4 w-4 text-destructive" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-3xl font-bold text-destructive">
                    {revenueData?.metrics.churnRate.toFixed(2) || 0}%
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {revenueData?.subscriptions.canceled || 0} canceled in{" "}
                    {timeRange}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Subscriptions by Status & Plan */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Subscriptions by Status */}
          <Card>
            <CardHeader>
              <CardTitle>Subscriptions by Status</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-6 w-12" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {revenueData?.subscriptions.byStatus.map((status) => (
                    <div
                      key={status.status}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        {getStatusBadge(status.status)}
                      </div>
                      <span className="text-2xl font-bold">{status.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Subscriptions by Plan */}
          <Card>
            <CardHeader>
              <CardTitle>Subscriptions by Plan</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-6 w-12" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {revenueData?.subscriptions.byPlan.map((plan) => (
                    <div
                      key={plan.plan}
                      className="flex items-center justify-between"
                    >
                      <span className="font-medium">{plan.plan}</span>
                      <Badge variant="secondary" className="text-lg">
                        {plan.count}
                      </Badge>
                    </div>
                  ))}
                  {(!revenueData?.subscriptions.byPlan ||
                    revenueData.subscriptions.byPlan.length === 0) && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No active subscriptions
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Top Paying Customers */}
        <Card>
          <CardHeader>
            <CardTitle>Top Paying Customers</CardTitle>
            <p className="text-sm text-muted-foreground">
              Customers with highest total revenue contribution
            </p>
          </CardHeader>
          <CardContent>
            {customersLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">#</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Current Plan</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Total Spent</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topCustomers && topCustomers.length > 0 ? (
                      topCustomers.map((customer, index) => (
                        <TableRow key={customer.userId}>
                          <TableCell className="font-medium">
                            {index + 1}
                          </TableCell>
                          <TableCell className="font-medium">
                            {customer.name || "N/A"}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {customer.email}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {customer.currentPlan || "No Plan"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {customer.subscriptionStatus ? (
                              getStatusBadge(customer.subscriptionStatus)
                            ) : (
                              <Badge variant="secondary">No Subscription</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right font-bold">
                            {formatCurrency(customer.totalSpent, "USD")}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center text-muted-foreground py-8"
                        >
                          No customer data available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Insights</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-16 w-full" />
            ) : (
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/30">
                  <div className="p-2 rounded-full bg-green-100 dark:bg-green-900">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Successful Transactions
                    </p>
                    <p className="text-2xl font-bold">
                      {revenueData?.revenueTrend.reduce(
                        (sum, r) => sum + r.transactionCount,
                        0
                      ) || 0}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/30">
                  <div className="p-2 rounded-full bg-red-100 dark:bg-red-900">
                    <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Failed Payments
                    </p>
                    <p className="text-2xl font-bold">
                      {revenueData?.payments.failed || 0}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/30">
                  <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
                    <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Success Rate
                    </p>
                    <p className="text-2xl font-bold">
                      {(() => {
                        if (
                          !revenueData?.revenueTrend ||
                          revenueData.payments.failed === undefined
                        ) {
                          return "0.0";
                        }
                        const successfulCount = revenueData.revenueTrend.reduce(
                          (sum, r) => sum + r.transactionCount,
                          0
                        );
                        const totalCount =
                          successfulCount + revenueData.payments.failed;

                        if (totalCount === 0) {
                          return "0.0";
                        }

                        return ((successfulCount / totalCount) * 100).toFixed(
                          1
                        );
                      })()}
                      %
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
