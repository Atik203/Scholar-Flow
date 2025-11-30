"use client";

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
import { motion } from "framer-motion";
import { useState } from "react";
import { useRole, type UserRole } from "../../../components/context";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";

// ============================================================================
// Default User for Demo (Admin)
// ============================================================================
const defaultUser = {
  name: "Admin User",
  email: "admin@scholarflow.com",
  image: undefined,
  role: "admin" as const,
};

interface SubscriptionsPageProps {
  onNavigate?: (path: string) => void;
  role?: UserRole;
}

// ============================================================================
// Utility Functions
// ============================================================================
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

// ============================================================================
// Dummy Data
// ============================================================================
const revenueData = {
  mrr: { amount: 24580, currency: "USD" },
  arr: { amount: 294960, currency: "USD" },
  totalRevenue: { amount: 156780, currency: "USD", period: "Last 30 days" },
  activeSubscriptions: 1284,
  churnRate: 2.3,
  avgRevenuePerUser: 19.14,
  newSubscriptions: 156,
  canceledSubscriptions: 32,
};

const subscriptionBreakdown = [
  { plan: "Free", count: 8547, percentage: 66.5, revenue: 0 },
  { plan: "Pro Monthly", count: 2156, percentage: 16.8, revenue: 21560 },
  { plan: "Pro Annual", count: 1423, percentage: 11.1, revenue: 170760 },
  { plan: "Team", count: 721, percentage: 5.6, revenue: 86520 },
];

const topCustomers = [
  {
    id: "1",
    name: "Stanford University",
    email: "billing@stanford.edu",
    plan: "Team Annual",
    status: "ACTIVE",
    totalSpent: 12500,
    memberCount: 45,
    startDate: "2023-01-15",
  },
  {
    id: "2",
    name: "MIT Research Labs",
    email: "accounts@mit.edu",
    plan: "Team Annual",
    status: "ACTIVE",
    totalSpent: 9800,
    memberCount: 38,
    startDate: "2023-03-20",
  },
  {
    id: "3",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@university.edu",
    plan: "Pro Annual",
    status: "ACTIVE",
    totalSpent: 1188,
    memberCount: 1,
    startDate: "2023-06-10",
  },
  {
    id: "4",
    name: "BioTech Research Inc",
    email: "finance@biotech.com",
    plan: "Team Annual",
    status: "ACTIVE",
    totalSpent: 7200,
    memberCount: 28,
    startDate: "2023-08-05",
  },
  {
    id: "5",
    name: "Prof. Michael Chen",
    email: "m.chen@research.org",
    plan: "Pro Monthly",
    status: "ACTIVE",
    totalSpent: 468,
    memberCount: 1,
    startDate: "2024-01-01",
  },
  {
    id: "6",
    name: "Oxford Research Group",
    email: "admin@oxford.ac.uk",
    plan: "Team Annual",
    status: "PAST_DUE",
    totalSpent: 5400,
    memberCount: 22,
    startDate: "2023-04-15",
  },
  {
    id: "7",
    name: "Jennifer Martinez",
    email: "j.martinez@biotech.com",
    plan: "Pro Annual",
    status: "ACTIVE",
    totalSpent: 792,
    memberCount: 1,
    startDate: "2023-09-20",
  },
  {
    id: "8",
    name: "Harvard Medical School",
    email: "subscriptions@harvard.edu",
    plan: "Team Annual",
    status: "ACTIVE",
    totalSpent: 15600,
    memberCount: 62,
    startDate: "2022-11-01",
  },
];

const recentTransactions = [
  {
    id: "1",
    customer: "Stanford University",
    amount: 1200,
    type: "payment",
    date: "2024-01-20",
    status: "completed",
  },
  {
    id: "2",
    customer: "Dr. Sarah Johnson",
    amount: 99,
    type: "payment",
    date: "2024-01-20",
    status: "completed",
  },
  {
    id: "3",
    customer: "MIT Research Labs",
    amount: 980,
    type: "payment",
    date: "2024-01-19",
    status: "completed",
  },
  {
    id: "4",
    customer: "Oxford Research Group",
    amount: 450,
    type: "refund",
    date: "2024-01-19",
    status: "completed",
  },
  {
    id: "5",
    customer: "BioTech Research Inc",
    amount: 600,
    type: "payment",
    date: "2024-01-18",
    status: "completed",
  },
];

const timeRanges = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "1y", label: "Last year" },
];

// ============================================================================
// Stats Card Component
// ============================================================================
const RevenueCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  trend?: "up" | "down";
  trendValue?: string;
}) => (
  <motion.div
    whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
    className="rounded-xl border bg-card p-6"
  >
    <div className="flex items-center justify-between mb-4">
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </div>
    <p className="text-2xl font-bold">{value}</p>
    <div className="flex items-center gap-2 mt-2">
      {trend && (
        <span
          className={cn(
            "flex items-center text-xs font-medium",
            trend === "up" ? "text-green-500" : "text-red-500"
          )}
        >
          {trend === "up" ? (
            <ArrowUpRight className="h-3 w-3" />
          ) : (
            <ArrowDownRight className="h-3 w-3" />
          )}
          {trendValue}
        </span>
      )}
      <p className="text-xs text-muted-foreground">{subtitle}</p>
    </div>
  </motion.div>
);

// ============================================================================
// Status Badge Component
// ============================================================================
const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig: Record<
    string,
    { color: string; icon: React.ElementType }
  > = {
    ACTIVE: {
      color:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      icon: CheckCircle2,
    },
    CANCELED: {
      color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      icon: XCircle,
    },
    EXPIRED: {
      color: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
      icon: AlertCircle,
    },
    PAST_DUE: {
      color:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      icon: AlertCircle,
    },
  };

  const config = statusConfig[status] || statusConfig.EXPIRED;
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
        config.color
      )}
    >
      <Icon className="h-3 w-3" />
      {status}
    </span>
  );
};

// ============================================================================
// Subscriptions Page Component
// ============================================================================
export function SubscriptionsPage({
  onNavigate,
  role: propRole,
}: SubscriptionsPageProps) {
  const { role: contextRole } = useRole();
  const effectiveRole = propRole ?? contextRole;
  const user = { ...defaultUser, role: effectiveRole };

  const [timeRange, setTimeRange] = useState("30d");

  return (
    <DashboardLayout
      user={user}
      onNavigate={onNavigate}
      currentPath="/admin/subscriptions"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <CreditCard className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                Subscription & Revenue Analytics
              </h1>
              <p className="text-muted-foreground">
                Monitor subscription metrics, revenue trends, and customer
                insights
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {timeRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Revenue Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <RevenueCard
            title="Monthly Recurring Revenue"
            value={formatCurrency(revenueData.mrr.amount)}
            subtitle="Active subscriptions only"
            icon={DollarSign}
            trend="up"
            trendValue="+12.5%"
          />
          <RevenueCard
            title="Annual Recurring Revenue"
            value={formatCurrency(revenueData.arr.amount)}
            subtitle="Annualized from MRR"
            icon={TrendingUp}
            trend="up"
            trendValue="+8.3%"
          />
          <RevenueCard
            title="Total Revenue"
            value={formatCurrency(revenueData.totalRevenue.amount)}
            subtitle={revenueData.totalRevenue.period}
            icon={CreditCard}
            trend="up"
            trendValue="+15.2%"
          />
          <RevenueCard
            title="Active Subscribers"
            value={revenueData.activeSubscriptions.toLocaleString()}
            subtitle="Paid plans only"
            icon={Users}
            trend="up"
            trendValue="+5.8%"
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-xl border bg-card p-4">
            <p className="text-sm text-muted-foreground">Churn Rate</p>
            <p className="text-xl font-bold text-red-500">
              {revenueData.churnRate}%
            </p>
          </div>
          <div className="rounded-xl border bg-card p-4">
            <p className="text-sm text-muted-foreground">ARPU</p>
            <p className="text-xl font-bold">
              {formatCurrency(revenueData.avgRevenuePerUser)}
            </p>
          </div>
          <div className="rounded-xl border bg-card p-4">
            <p className="text-sm text-muted-foreground">New Subscriptions</p>
            <p className="text-xl font-bold text-green-500">
              +{revenueData.newSubscriptions}
            </p>
          </div>
          <div className="rounded-xl border bg-card p-4">
            <p className="text-sm text-muted-foreground">Cancellations</p>
            <p className="text-xl font-bold text-red-500">
              -{revenueData.canceledSubscriptions}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Subscription Breakdown */}
          <div className="rounded-xl border bg-card">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Subscription Breakdown</h2>
              <p className="text-muted-foreground text-sm">
                Distribution by plan type
              </p>
            </div>
            <div className="p-6 space-y-4">
              {subscriptionBreakdown.map((item) => (
                <div key={item.plan} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{item.plan}</span>
                    <span className="text-sm text-muted-foreground">
                      {item.count.toLocaleString()} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className={cn(
                        "h-full rounded-full",
                        item.plan === "Free"
                          ? "bg-gray-400"
                          : item.plan === "Pro Monthly"
                            ? "bg-blue-500"
                            : item.plan === "Pro Annual"
                              ? "bg-purple-500"
                              : "bg-green-500"
                      )}
                    />
                  </div>
                  {item.revenue > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Revenue: {formatCurrency(item.revenue)}/mo
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Top Customers */}
          <div className="lg:col-span-2 rounded-xl border bg-card">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Top Customers</h2>
              <p className="text-muted-foreground text-sm">
                Highest value subscribers
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-muted/30">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                      Plan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                      Total Spent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                      Members
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {topCustomers.slice(0, 6).map((customer) => (
                    <tr key={customer.id} className="hover:bg-muted/30">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {customer.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">{customer.plan}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={customer.status} />
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {formatCurrency(customer.totalSpent)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {customer.memberCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="rounded-xl border bg-card">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Recent Transactions</h2>
            <p className="text-muted-foreground text-sm">
              Latest payment activity
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/30">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-muted/30">
                    <td className="px-6 py-4 font-medium">{tx.customer}</td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium capitalize",
                          tx.type === "payment"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        )}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={tx.type === "refund" ? "text-red-500" : ""}
                      >
                        {tx.type === "refund" ? "-" : "+"}
                        {formatCurrency(tx.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {tx.date}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-green-500 text-sm">
                        <CheckCircle2 className="h-3 w-3" />
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default SubscriptionsPage;
