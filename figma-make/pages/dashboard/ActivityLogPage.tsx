"use client";

import {
  Activity,
  AlertCircle,
  AlertTriangle,
  BookOpen,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Filter,
  Info,
  Layers,
  Loader2,
  MessageSquare,
  RefreshCw,
  Search,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Button } from "../../components/ui/button";

// ============================================================================
// Default User for Demo
// ============================================================================
const defaultUser = {
  name: "John Researcher",
  email: "john@example.com",
  image: undefined,
  role: "researcher" as const,
};

// ============================================================================
// Types
// ============================================================================
interface ActivityLogPageProps {
  onNavigate?: (path: string) => void;
  role?: "researcher" | "pro_researcher" | "team_lead" | "admin";
}

interface ActivityLogEntry {
  id: string;
  entity: "paper" | "collection" | "workspace" | "discussion" | "user";
  entityId: string;
  entityName: string;
  action: string;
  details?: string;
  severity: "INFO" | "WARNING" | "ERROR" | "CRITICAL";
  createdAt: string;
  user: {
    id: string;
    name: string;
    image?: string;
  };
  workspace?: {
    id: string;
    name: string;
  };
}

// ============================================================================
// Sample Data
// ============================================================================
const sampleActivities: ActivityLogEntry[] = [
  {
    id: "1",
    entity: "paper",
    entityId: "paper-1",
    entityName: "Machine Learning in Healthcare",
    action: "created",
    severity: "INFO",
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    user: { id: "1", name: "Dr. Sarah Chen", image: "" },
    workspace: { id: "ws-1", name: "AI Research Lab" },
  },
  {
    id: "2",
    entity: "collection",
    entityId: "col-1",
    entityName: "Deep Learning Papers",
    action: "shared",
    details: "Shared with 3 team members",
    severity: "INFO",
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    user: { id: "2", name: "Prof. John Smith" },
    workspace: { id: "ws-1", name: "AI Research Lab" },
  },
  {
    id: "3",
    entity: "workspace",
    entityId: "ws-2",
    entityName: "Climate Science Team",
    action: "updated",
    details: "Settings modified",
    severity: "INFO",
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    user: { id: "3", name: "Dr. Emily Davis" },
  },
  {
    id: "4",
    entity: "discussion",
    entityId: "disc-1",
    entityName: "Research Methodology Discussion",
    action: "message_added",
    details: "New reply added",
    severity: "INFO",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    user: { id: "1", name: "Dr. Sarah Chen" },
    workspace: { id: "ws-1", name: "AI Research Lab" },
  },
  {
    id: "5",
    entity: "paper",
    entityId: "paper-2",
    entityName: "Quantum Computing Overview",
    action: "deleted",
    severity: "WARNING",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    user: { id: "4", name: "Dr. Michael Brown" },
    workspace: { id: "ws-3", name: "Quantum Lab" },
  },
  {
    id: "6",
    entity: "user",
    entityId: "user-5",
    entityName: "New Team Member",
    action: "created",
    details: "Joined workspace",
    severity: "INFO",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    user: { id: "5", name: "Alex Johnson" },
    workspace: { id: "ws-1", name: "AI Research Lab" },
  },
  {
    id: "7",
    entity: "paper",
    entityId: "paper-3",
    entityName: "Neural Network Architectures",
    action: "exported",
    details: "Exported to PDF",
    severity: "INFO",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    user: { id: "2", name: "Prof. John Smith" },
  },
  {
    id: "8",
    entity: "collection",
    entityId: "col-2",
    entityName: "Archived Papers",
    action: "updated",
    details: "5 papers added",
    severity: "INFO",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    user: { id: "3", name: "Dr. Emily Davis" },
    workspace: { id: "ws-2", name: "Climate Science Team" },
  },
];

// ============================================================================
// Helper Functions
// ============================================================================
const getEntityIcon = (entity: string) => {
  switch (entity) {
    case "paper":
      return FileText;
    case "collection":
      return BookOpen;
    case "workspace":
      return Layers;
    case "discussion":
      return MessageSquare;
    case "user":
      return User;
    default:
      return Activity;
  }
};

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case "INFO":
      return Info;
    case "WARNING":
      return AlertTriangle;
    case "ERROR":
    case "CRITICAL":
      return AlertCircle;
    default:
      return Info;
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "INFO":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    case "WARNING":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "ERROR":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    case "CRITICAL":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
  }
};

const getActionLabel = (action: string) => {
  const labels: Record<string, string> = {
    created: "Created",
    updated: "Updated",
    deleted: "Deleted",
    shared: "Shared",
    exported: "Exported",
    message_added: "Message Added",
    message_updated: "Message Updated",
    message_deleted: "Message Deleted",
  };
  return labels[action] || action;
};

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString();
};

// ============================================================================
// Activity Log Page Component
// ============================================================================
export function ActivityLogPage({ onNavigate, role }: ActivityLogPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [entityFilter, setEntityFilter] = useState<string>("");
  const [severityFilter, setSeverityFilter] = useState<string>("");
  const [actionFilter, setActionFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Create user with the correct role
  const user = {
    ...defaultUser,
    role: role || defaultUser.role,
  };

  // Filter activities
  const filteredActivities = sampleActivities.filter((activity) => {
    const matchesSearch =
      !searchQuery ||
      activity.entityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.action.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesEntity = !entityFilter || activity.entity === entityFilter;
    const matchesSeverity =
      !severityFilter || activity.severity === severityFilter;
    const matchesAction = !actionFilter || activity.action === actionFilter;

    return matchesSearch && matchesEntity && matchesSeverity && matchesAction;
  });

  // Pagination
  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const paginatedActivities = filteredActivities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleExport = () => {
    // Simulate export
    console.log("Exporting activity log...");
  };

  const clearFilters = () => {
    setSearchQuery("");
    setEntityFilter("");
    setSeverityFilter("");
    setActionFilter("");
    setCurrentPage(1);
  };

  return (
    <DashboardLayout
      user={user}
      onNavigate={onNavigate}
      currentPath="/activity-log"
    >
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground">Activity Log</h1>
            <p className="text-muted-foreground mt-1">
              Track and monitor all activities across your workspace
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border bg-card p-4"
        >
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold">Filters</h3>
            {(searchQuery ||
              entityFilter ||
              severityFilter ||
              actionFilter) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="ml-auto text-xs"
              >
                Clear all
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            {/* Entity Filter */}
            <select
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">All Entities</option>
              <option value="paper">Papers</option>
              <option value="collection">Collections</option>
              <option value="workspace">Workspaces</option>
              <option value="discussion">Discussions</option>
              <option value="user">Users</option>
            </select>

            {/* Severity Filter */}
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">All Severities</option>
              <option value="INFO">Info</option>
              <option value="WARNING">Warning</option>
              <option value="ERROR">Error</option>
              <option value="CRITICAL">Critical</option>
            </select>

            {/* Action Filter */}
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">All Actions</option>
              <option value="created">Created</option>
              <option value="updated">Updated</option>
              <option value="deleted">Deleted</option>
              <option value="shared">Shared</option>
              <option value="exported">Exported</option>
              <option value="message_added">Message Added</option>
            </select>
          </div>
        </motion.div>

        {/* Activity List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : paginatedActivities.length === 0 ? (
            <div className="rounded-xl border bg-card p-12 text-center">
              <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No activities found</h3>
              <p className="text-muted-foreground text-sm">
                {searchQuery || entityFilter || severityFilter || actionFilter
                  ? "Try adjusting your filters"
                  : "Activities will appear here as you use the platform"}
              </p>
            </div>
          ) : (
            paginatedActivities.map((activity, index) => {
              const EntityIcon = getEntityIcon(activity.entity);
              const SeverityIcon = getSeverityIcon(activity.severity);

              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-xl border bg-card p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    {/* User Avatar */}
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-primary">
                        {activity.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-foreground">
                          {activity.user.name}
                        </span>
                        <span className="text-muted-foreground">
                          {getActionLabel(activity.action).toLowerCase()}
                        </span>
                        <div className="flex items-center gap-1">
                          <EntityIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-foreground truncate max-w-[200px]">
                            {activity.entityName}
                          </span>
                        </div>
                      </div>

                      {activity.details && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {activity.details}
                        </p>
                      )}

                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatTimeAgo(activity.createdAt)}
                        </span>
                        {activity.workspace && (
                          <span className="flex items-center gap-1">
                            <Layers className="h-3 w-3" />
                            {activity.workspace.name}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Severity Badge */}
                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(activity.severity)}`}
                    >
                      <SeverityIcon className="h-3 w-3" />
                      {activity.severity}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-between"
          >
            <p className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredActivities.length)}{" "}
              of {filteredActivities.length} activities
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
