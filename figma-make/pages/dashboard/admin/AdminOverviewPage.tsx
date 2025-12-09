"use client";

import {
  Activity,
  AlertCircle,
  ArrowUpRight,
  CheckCircle,
  Database,
  Download,
  FileText,
  Play,
  Plus,
  RefreshCw,
  Server,
  Settings,
  Shield,
  Terminal,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
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

interface AdminOverviewPageProps {
  onNavigate?: (path: string) => void;
  role?: UserRole;
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

// ============================================================================
// Quick Commands Data
// ============================================================================
const quickCommands = [
  {
    id: "clear-cache",
    label: "Clear Cache",
    description: "Clear all cached data",
    icon: RefreshCw,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    dangerous: false,
  },
  {
    id: "restart-workers",
    label: "Restart Workers",
    description: "Restart background processing workers",
    icon: Play,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    dangerous: false,
  },
  {
    id: "run-diagnostics",
    label: "Run Diagnostics",
    description: "Execute system health check",
    icon: Terminal,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    dangerous: false,
  },
  {
    id: "force-sync",
    label: "Force Sync",
    description: "Force synchronization of all data",
    icon: Zap,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    dangerous: true,
  },
];

// ============================================================================
// Real-time Health Indicator Component
// ============================================================================
interface LiveHealthIndicatorProps {
  status: "healthy" | "warning" | "error";
  latency: string;
  serviceName: string;
}

const LiveHealthIndicator: React.FC<LiveHealthIndicatorProps> = ({
  status,
  latency,
  serviceName,
}) => {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse((prev) => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const statusColors = {
    healthy: "bg-green-500",
    warning: "bg-yellow-500",
    error: "bg-red-500",
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className={cn("w-3 h-3 rounded-full", statusColors[status])} />
        <motion.div
          className={cn("absolute inset-0 rounded-full", statusColors[status])}
          animate={{
            scale: pulse ? [1, 1.8, 1] : 1,
            opacity: pulse ? [1, 0, 1] : 1,
          }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </div>
      <span className="text-xs font-mono text-muted-foreground">{latency}</span>
    </div>
  );
};

// ============================================================================
// Quick Command Modal
// ============================================================================
interface QuickCommandModalProps {
  isOpen: boolean;
  onClose: () => void;
  command: (typeof quickCommands)[0] | null;
  onExecute: (commandId: string) => void;
}

const QuickCommandModal: React.FC<QuickCommandModalProps> = ({
  isOpen,
  onClose,
  command,
  onExecute,
}) => {
  const [executing, setExecuting] = useState(false);
  const [result, setResult] = useState<"success" | "error" | null>(null);

  const handleExecute = async () => {
    if (!command) return;
    setExecuting(true);
    setResult(null);

    // Simulate command execution
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setExecuting(false);
    setResult("success");

    setTimeout(() => {
      onClose();
      setResult(null);
    }, 1000);
  };

  if (!command) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-card border rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className={cn("p-3 rounded-xl", command.bgColor)}>
                <command.icon className={cn("h-6 w-6", command.color)} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{command.label}</h3>
                <p className="text-sm text-muted-foreground">
                  {command.description}
                </p>
              </div>
            </div>

            {command.dangerous && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                <div className="flex items-center gap-2 text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Warning: This action may affect system performance
                  </span>
                </div>
              </div>
            )}

            {result === "success" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl"
              >
                <div className="flex items-center gap-2 text-green-500">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Command executed successfully
                  </span>
                </div>
              </motion.div>
            )}

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border rounded-xl hover:bg-muted transition-colors"
                disabled={executing}
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleExecute}
                disabled={executing || result === "success"}
                className={cn(
                  "flex-1 px-4 py-2 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors",
                  command.dangerous
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-primary hover:bg-primary/90 text-primary-foreground"
                )}
              >
                {executing ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Executing...
                  </>
                ) : result === "success" ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Done
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Execute
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
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
    title: "Subscriptions",
    description: "Manage user subscriptions and plans",
    icon: Shield,
    path: "/admin/subscriptions",
    color: "bg-green-500",
    hoverColor: "hover:bg-green-600",
  },
  {
    title: "Reports",
    description: "View detailed platform analytics and reports",
    icon: Activity,
    path: "/admin/reports",
    color: "bg-purple-500",
    hoverColor: "hover:bg-purple-600",
  },
  {
    title: "Audit Log",
    description: "Review all system activities and events",
    icon: FileText,
    path: "/admin/audit",
    color: "bg-orange-500",
    hoverColor: "hover:bg-orange-600",
  },
  {
    title: "Manage Plans",
    description: "Configure subscription plans and pricing",
    icon: TrendingUp,
    path: "/admin/plans",
    color: "bg-cyan-500",
    hoverColor: "hover:bg-cyan-600",
  },
  {
    title: "Payments",
    description: "Review payment history and refunds",
    icon: Download,
    path: "/admin/payments",
    color: "bg-emerald-500",
    hoverColor: "hover:bg-emerald-600",
  },
  {
    title: "Content Moderation",
    description: "Review flagged content and take action",
    icon: AlertCircle,
    path: "/admin/moderation",
    color: "bg-red-500",
    hoverColor: "hover:bg-red-600",
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
export function AdminOverviewPage({
  onNavigate,
  role: propRole,
}: AdminOverviewPageProps) {
  const { role: contextRole } = useRole();
  const effectiveRole = propRole ?? contextRole;
  const user = { ...defaultUser, role: effectiveRole };

  // Quick command modal state
  const [showCommandModal, setShowCommandModal] = useState(false);
  const [selectedCommand, setSelectedCommand] = useState<
    (typeof quickCommands)[0] | null
  >(null);

  const handleCommandClick = (command: (typeof quickCommands)[0]) => {
    setSelectedCommand(command);
    setShowCommandModal(true);
  };

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
      user={user}
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

          {/* System Health with Live Indicators */}
          <div className="rounded-xl border bg-card">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Server className="h-5 w-5" />
                    System Health
                    <span className="ml-2 px-2 py-0.5 bg-green-500/10 text-green-500 text-xs font-medium rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      Live
                    </span>
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Real-time system monitoring
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 border rounded-lg hover:bg-muted transition-colors"
                  title="Refresh health status"
                >
                  <RefreshCw className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {Object.entries(systemHealth).map(([service, data]) => (
                <motion.div
                  key={service}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-medium capitalize">{service}</span>
                      <LiveHealthIndicator
                        status={data.status as "healthy" | "warning" | "error"}
                        latency={data.latency}
                        serviceName={service}
                      />
                    </div>
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
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick Commands */}
          <div className="rounded-xl border bg-card">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Terminal className="h-5 w-5" />
                Quick Commands
              </h2>
              <p className="text-muted-foreground text-sm">
                Execute system operations
              </p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-3">
                {quickCommands.map((command) => (
                  <motion.button
                    key={command.id}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleCommandClick(command)}
                    className="p-4 border rounded-xl text-left hover:shadow-lg transition-all flex items-center gap-4 group"
                  >
                    <div className={cn("p-2.5 rounded-xl", command.bgColor)}>
                      <command.icon className={cn("h-5 w-5", command.color)} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium flex items-center gap-2">
                        {command.label}
                        {command.dangerous && (
                          <span className="px-1.5 py-0.5 bg-red-500/10 text-red-500 text-xs rounded">
                            Caution
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {command.description}
                      </p>
                    </div>
                    <Play className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Command Modal */}
        <QuickCommandModal
          isOpen={showCommandModal}
          onClose={() => setShowCommandModal(false)}
          command={selectedCommand}
          onExecute={(id) => console.log("Executing command:", id)}
        />

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

        {/* Developer Tools */}
        <div className="rounded-xl border bg-card">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Developer Tools</h2>
            <p className="text-muted-foreground text-sm">
              Integrations and API management
            </p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate?.("/admin/webhooks")}
                className="p-4 border rounded-xl text-left hover:shadow-lg transition-all flex items-center gap-4"
              >
                <div className="p-3 rounded-lg bg-indigo-500 text-white">
                  <Server className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Webhooks</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure webhook endpoints and view logs
                  </p>
                </div>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground ml-auto" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate?.("/admin/api-keys")}
                className="p-4 border rounded-xl text-left hover:shadow-lg transition-all flex items-center gap-4"
              >
                <div className="p-3 rounded-lg bg-teal-500 text-white">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">API Keys</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage API keys for integrations
                  </p>
                </div>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground ml-auto" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AdminOverviewPage;
