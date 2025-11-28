"use client";

import {
  Activity,
  AlertCircle,
  ArrowUpRight,
  CheckCircle,
  Database,
  Download,
  FileText,
  Plus,
  Server,
  Settings,
  Shield,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
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

interface AdminOverviewPageProps {
  onNavigate?: (path: string) => void;
}

// ============================================================================
// Utility Functions
// ============================================================================
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

// ============================================================================
// Dummy Data
// ============================================================================
const systemStats = {
  totalUsers: 12847,
  userGrowth: 12.5,
  totalPapers: 45892,
  paperGrowth: 8.3,
  activeSessions: 1284,
  sessionGrowth: 15.2,
  storageUsed: "2.4 TB",
  storageGrowth: 5.8,
};

const recentUsers = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@university.edu",
    role: "PRO_RESEARCHER",
    status: "active",
    joinedAt: "2024-01-20T10:30:00Z",
    paperCount: 24,
  },
  {
    id: "2",
    name: "Prof. Michael Chen",
    email: "m.chen@research.org",
    role: "TEAM_LEAD",
    status: "active",
    joinedAt: "2024-01-19T14:22:00Z",
    paperCount: 156,
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "e.rodriguez@lab.com",
    role: "RESEARCHER",
    status: "active",
    joinedAt: "2024-01-18T09:15:00Z",
    paperCount: 8,
  },
  {
    id: "4",
    name: "James Wilson",
    email: "j.wilson@institute.edu",
    role: "PRO_RESEARCHER",
    status: "inactive",
    joinedAt: "2024-01-17T16:45:00Z",
    paperCount: 42,
  },
  {
    id: "5",
    name: "Dr. Amanda Lee",
    email: "amanda.lee@medical.org",
    role: "RESEARCHER",
    status: "active",
    joinedAt: "2024-01-16T11:30:00Z",
    paperCount: 15,
  },
];

const systemHealth = {
  database: { status: "healthy", latency: "12ms", uptime: "99.99%" },
  api: { status: "healthy", latency: "45ms", uptime: "99.95%" },
  storage: { status: "healthy", latency: "8ms", uptime: "99.99%" },
  cache: { status: "warning", latency: "125ms", uptime: "99.80%" },
};

const adminActions = [
  {
    title: "User Management",
    description: "Manage user accounts, roles, and permissions",
    icon: Users,
    path: "/admin/users",
    color: "bg-blue-500",
    hoverColor: "hover:bg-blue-600",
  },
  {
    title: "System Settings",
    description: "Configure platform settings and policies",
    icon: Settings,
    path: "/admin/settings",
    color: "bg-gray-500",
    hoverColor: "hover:bg-gray-600",
  },
  {
    title: "Security Center",
    description: "Monitor security events and manage access",
    icon: Shield,
    path: "/admin/system",
    color: "bg-red-500",
    hoverColor: "hover:bg-red-600",
  },
  {
    title: "Analytics Dashboard",
    description: "View detailed platform analytics and reports",
    icon: Activity,
    path: "/analytics",
    color: "bg-purple-500",
    hoverColor: "hover:bg-purple-600",
  },
];

const paperStats = {
  processing: 23,
  completed: 45678,
  failed: 12,
  pending: 179,
};

// ============================================================================
// Stats Card Component
// ============================================================================
const StatsCard = ({
  title,
  value,
  change,
  icon: Icon,
  iconColor,
}: {
  title: string;
  value: string | number;
  change: string;
  icon: React.ElementType;
  iconColor: string;
}) => (
  <motion.div
    whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
    className="rounded-xl border bg-card p-6"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
        <div className="flex items-center gap-1 mt-2">
          <TrendingUp className="h-3 w-3 text-green-500" />
          <span className="text-xs text-green-500">{change}</span>
        </div>
      </div>
      <div
        className={cn(
          "p-3 rounded-xl",
          iconColor.replace("text-", "bg-") + "/10"
        )}
      >
        <Icon className={cn("h-6 w-6", iconColor)} />
      </div>
    </div>
  </motion.div>
);

// ============================================================================
// Role Badge Component
// ============================================================================
const RoleBadge = ({ role }: { role: string }) => {
  const roleColors: Record<string, string> = {
    ADMIN: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    TEAM_LEAD:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    PRO_RESEARCHER:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    RESEARCHER:
      "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
  };

  const roleLabels: Record<string, string> = {
    ADMIN: "Admin",
    TEAM_LEAD: "Team Lead",
    PRO_RESEARCHER: "Pro",
    RESEARCHER: "Researcher",
  };

  return (
    <span
      className={cn(
        "px-2 py-0.5 rounded-full text-xs font-medium",
        roleColors[role] || roleColors.RESEARCHER
      )}
    >
      {roleLabels[role] || role}
    </span>
  );
};

// ============================================================================
// Health Status Component
// ============================================================================
const HealthStatus = ({ status }: { status: string }) => {
  const statusConfig: Record<
    string,
    { color: string; icon: React.ElementType }
  > = {
    healthy: { color: "text-green-500", icon: CheckCircle },
    warning: { color: "text-yellow-500", icon: AlertCircle },
    critical: { color: "text-red-500", icon: AlertCircle },
  };

  const config = statusConfig[status] || statusConfig.healthy;
  const Icon = config.icon;

  return (
    <div className={cn("flex items-center gap-1", config.color)}>
      <Icon className="h-4 w-4" />
      <span className="text-sm font-medium capitalize">{status}</span>
    </div>
  );
};

// ============================================================================
// Admin Overview Page Component
// ============================================================================
export function AdminOverviewPage({ onNavigate }: AdminOverviewPageProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <DashboardLayout
      user={defaultUser}
      onNavigate={onNavigate}
      currentPath="/admin-overview"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
              <Shield className="h-8 w-8 text-red-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                System administration and user management overview
              </p>
            </div>
          </div>
          <span className="px-4 py-2 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full text-sm font-medium self-start">
            Administrator
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Users"
            value={systemStats.totalUsers.toLocaleString()}
            change={`+${systemStats.userGrowth}% this month`}
            icon={Users}
            iconColor="text-blue-600"
          />
          <StatsCard
            title="Research Papers"
            value={systemStats.totalPapers.toLocaleString()}
            change={`+${systemStats.paperGrowth}% this month`}
            icon={FileText}
            iconColor="text-green-600"
          />
          <StatsCard
            title="Active Sessions"
            value={systemStats.activeSessions.toLocaleString()}
            change={`+${systemStats.sessionGrowth}% this week`}
            icon={Activity}
            iconColor="text-purple-600"
          />
          <StatsCard
            title="Storage Used"
            value={systemStats.storageUsed}
            change={`+${systemStats.storageGrowth}% this month`}
            icon={Database}
            iconColor="text-orange-600"
          />
        </div>

        {/* Admin Actions */}
        <div className="rounded-xl border bg-card">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Admin Actions</h2>
            <p className="text-muted-foreground text-sm">
              Quick access to high-impact administration tasks
            </p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {adminActions.map((action) => (
                <motion.button
                  key={action.title}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate?.(action.path)}
                  className="p-6 border rounded-xl text-left hover:shadow-lg transition-all"
                >
                  <div
                    className={cn(
                      "p-3 rounded-lg text-white w-fit",
                      action.color
                    )}
                  >
                    <action.icon className="h-6 w-6" />
                  </div>
                  <div className="mt-4 space-y-1">
                    <h3 className="font-semibold flex items-center gap-2">
                      {action.title}
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Users */}
          <div className="lg:col-span-2 rounded-xl border bg-card">
            <div className="p-6 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Recent Users</h2>
                <p className="text-muted-foreground text-sm">
                  Latest user registrations and activity
                </p>
              </div>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-3 py-2 border rounded-lg text-sm flex items-center gap-2 hover:bg-muted"
                >
                  <Download className="h-4 w-4" />
                  Export
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add User
                </motion.button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-muted/30">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                      Papers
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {recentUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-muted/30">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <RoleBadge role={user.role} />
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                            user.status === "active"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
                          )}
                        >
                          {user.status === "active" ? (
                            <CheckCircle className="h-3 w-3" />
                          ) : (
                            <AlertCircle className="h-3 w-3" />
                          )}
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">{user.paperCount}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {formatDate(user.joinedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* System Health */}
          <div className="rounded-xl border bg-card">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Server className="h-5 w-5" />
                System Health
              </h2>
              <p className="text-muted-foreground text-sm">
                Real-time system monitoring
              </p>
            </div>
            <div className="p-6 space-y-4">
              {Object.entries(systemHealth).map(([service, data]) => (
                <div key={service} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium capitalize">{service}</span>
                    <HealthStatus status={data.status} />
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Latency</p>
                      <p className="font-medium">{data.latency}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Uptime</p>
                      <p className="font-medium">{data.uptime}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Paper Processing Stats */}
        <div className="rounded-xl border bg-card">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">
              Paper Processing Statistics
            </h2>
            <p className="text-muted-foreground text-sm">
              Overview of paper processing status
            </p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                <p className="text-3xl font-bold text-yellow-600">
                  {paperStats.processing}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Processing</p>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <p className="text-3xl font-bold text-green-600">
                  {paperStats.completed.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Completed</p>
              </div>
              <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
                <p className="text-3xl font-bold text-red-600">
                  {paperStats.failed}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Failed</p>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <p className="text-3xl font-bold text-blue-600">
                  {paperStats.pending}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Pending</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AdminOverviewPage;
