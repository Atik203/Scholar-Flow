"use client";

import {
  AlertCircle,
  Ban,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  Edit,
  Loader2,
  RotateCcw,
  Search,
  Trash2,
  UserCheck,
  UserX,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
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

interface UserManagementPageProps {
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
const userStats = {
  totalUsers: 12847,
  activeUsers: 11523,
  proUsers: 3456,
  adminUsers: 12,
};

const dummyUsers = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@university.edu",
    role: "PRO_RESEARCHER",
    isDeleted: false,
    paperCount: 24,
    planName: "Pro Monthly",
    subscriptionStatus: "ACTIVE",
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    name: "Prof. Michael Chen",
    email: "m.chen@research.org",
    role: "TEAM_LEAD",
    isDeleted: false,
    paperCount: 156,
    planName: "Team Annual",
    subscriptionStatus: "ACTIVE",
    createdAt: "2023-11-20T14:22:00Z",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "e.rodriguez@lab.com",
    role: "RESEARCHER",
    isDeleted: false,
    paperCount: 8,
    planName: null,
    subscriptionStatus: null,
    createdAt: "2024-01-18T09:15:00Z",
  },
  {
    id: "4",
    name: "James Wilson",
    email: "j.wilson@institute.edu",
    role: "PRO_RESEARCHER",
    isDeleted: true,
    paperCount: 42,
    planName: "Pro Monthly",
    subscriptionStatus: "CANCELED",
    createdAt: "2023-08-10T16:45:00Z",
  },
  {
    id: "5",
    name: "Dr. Amanda Lee",
    email: "amanda.lee@medical.org",
    role: "RESEARCHER",
    isDeleted: false,
    paperCount: 15,
    planName: null,
    subscriptionStatus: null,
    createdAt: "2024-01-16T11:30:00Z",
  },
  {
    id: "6",
    name: "Robert Taylor",
    email: "r.taylor@science.edu",
    role: "ADMIN",
    isDeleted: false,
    paperCount: 0,
    planName: null,
    subscriptionStatus: null,
    createdAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "7",
    name: "Jennifer Martinez",
    email: "j.martinez@biotech.com",
    role: "PRO_RESEARCHER",
    isDeleted: false,
    paperCount: 87,
    planName: "Pro Annual",
    subscriptionStatus: "ACTIVE",
    createdAt: "2023-06-15T08:00:00Z",
  },
  {
    id: "8",
    name: "David Kim",
    email: "d.kim@physics.org",
    role: "RESEARCHER",
    isDeleted: false,
    paperCount: 12,
    planName: null,
    subscriptionStatus: null,
    createdAt: "2024-01-10T13:20:00Z",
  },
];

const roles = [
  { value: "RESEARCHER", label: "Researcher" },
  { value: "PRO_RESEARCHER", label: "Pro Researcher" },
  { value: "TEAM_LEAD", label: "Team Lead" },
  { value: "ADMIN", label: "Admin" },
];

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
// Stats Card Component
// ============================================================================
const StatsCard = ({
  title,
  value,
  description,
}: {
  title: string;
  value: number;
  description: string;
}) => (
  <motion.div whileHover={{ y: -2 }} className="rounded-xl border bg-card p-6">
    <p className="text-sm font-medium text-muted-foreground">{title}</p>
    <p className="text-2xl font-bold mt-1">{value.toLocaleString()}</p>
    <p className="text-xs text-muted-foreground mt-1">{description}</p>
  </motion.div>
);

// ============================================================================
// User Management Page Component
// ============================================================================
export function UserManagementPage({
  onNavigate,
  role: propRole,
}: UserManagementPageProps) {
  const { role: contextRole } = useRole();
  const effectiveRole = propRole ?? contextRole;
  const user = { ...defaultUser, role: effectiveRole };

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<
    (typeof dummyUsers)[0] | null
  >(null);
  const [newRole, setNewRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Bulk selection state
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [showBulkActionConfirm, setShowBulkActionConfirm] = useState(false);
  const [bulkAction, setBulkAction] = useState<
    "delete" | "suspend" | "activate" | "export" | null
  >(null);

  // Toggle user selection
  const toggleUserSelection = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // Select all users
  const toggleSelectAll = () => {
    if (selectedUserIds.length === filteredUsers.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(filteredUsers.map((u) => u.id));
    }
  };

  // Handle bulk action
  const handleBulkAction = (
    action: "delete" | "suspend" | "activate" | "export"
  ) => {
    setBulkAction(action);
    if (action === "export") {
      // Export doesn't need confirmation
      console.log("Exporting users:", selectedUserIds);
      setSelectedUserIds([]);
    } else {
      setShowBulkActionConfirm(true);
    }
  };

  // Execute bulk action
  const executeBulkAction = () => {
    console.log(`Executing ${bulkAction} on users:`, selectedUserIds);
    setShowBulkActionConfirm(false);
    setSelectedUserIds([]);
    setBulkAction(null);
  };

  // Filter users
  const filteredUsers = dummyUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && !user.isDeleted) ||
      (statusFilter === "inactive" && user.isDeleted);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleEditRole = (user: (typeof dummyUsers)[0]) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setEditDialogOpen(true);
  };

  const handleSaveRole = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setEditDialogOpen(false);
      setSelectedUser(null);
    }, 1000);
  };

  const handleToggleStatus = (user: (typeof dummyUsers)[0]) => {
    // Demo action
    console.log("Toggle status for:", user.email);
  };

  const handleDeleteConfirm = (user: (typeof dummyUsers)[0]) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handlePermanentDelete = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setDeleteDialogOpen(false);
      setSelectedUser(null);
    }, 1000);
  };

  return (
    <DashboardLayout
      user={user}
      onNavigate={onNavigate}
      currentPath="/admin/users"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
            <Users className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground">
              Manage user accounts, roles, and permissions
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatsCard
            title="Total Users"
            value={userStats.totalUsers}
            description="All registered"
          />
          <StatsCard
            title="Active Users"
            value={userStats.activeUsers}
            description="Not deleted"
          />
          <StatsCard
            title="Pro Users"
            value={userStats.proUsers}
            description="Premium subscribers"
          />
          <StatsCard
            title="Admins"
            value={userStats.adminUsers}
            description="System administrators"
          />
        </div>

        {/* Users Table Card */}
        <div className="rounded-xl border bg-card">
          <div className="p-6 border-b">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">All Users</h2>
                <p className="text-muted-foreground text-sm">
                  Manage and monitor all platform users
                </p>
              </div>
              <div className="flex flex-col md:flex-row gap-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 border rounded-lg text-sm w-full md:w-[200px] bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                {/* Role Filter */}
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Roles</option>
                  {roles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/30">
                <tr>
                  <th className="px-3 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={
                        selectedUserIds.length === filteredUsers.length &&
                        filteredUsers.length > 0
                      }
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Email
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
                    Subscription
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                      <p className="text-muted-foreground">No users found</p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={cn(
                        "hover:bg-muted/30",
                        selectedUserIds.includes(user.id) && "bg-primary/5"
                      )}
                    >
                      <td className="px-3 py-4">
                        <input
                          type="checkbox"
                          checked={selectedUserIds.includes(user.id)}
                          onChange={() => toggleUserSelection(user.id)}
                          className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                      </td>
                      <td className="px-6 py-4 font-medium">{user.name}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {user.email}
                      </td>
                      <td className="px-6 py-4">
                        <RoleBadge role={user.role} />
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                            !user.isDeleted
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
                          )}
                        >
                          {!user.isDeleted ? (
                            <>
                              <CheckCircle className="h-3 w-3" />
                              Active
                            </>
                          ) : (
                            <>
                              <AlertCircle className="h-3 w-3" />
                              Inactive
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">{user.paperCount}</td>
                      <td className="px-6 py-4 text-sm">
                        {user.planName ? (
                          <span>{user.planName}</span>
                        ) : (
                          <span className="text-muted-foreground">None</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEditRole(user)}
                            className="p-2 hover:bg-muted rounded-lg"
                            title="Edit role"
                          >
                            <Edit className="h-4 w-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleToggleStatus(user)}
                            className="p-2 hover:bg-muted rounded-lg"
                            title={user.isDeleted ? "Reactivate" : "Deactivate"}
                          >
                            {user.isDeleted ? (
                              <RotateCcw className="h-4 w-4 text-green-500" />
                            ) : (
                              <UserX className="h-4 w-4 text-yellow-500" />
                            )}
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteConfirm(user)}
                            className="p-2 hover:bg-destructive/10 text-destructive rounded-lg"
                            title="Delete permanently"
                          >
                            <Trash2 className="h-4 w-4" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredUsers.length} of {dummyUsers.length} users
            </p>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </motion.button>
              <span className="px-3 py-1 bg-muted rounded-lg text-sm">
                Page {currentPage}
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="p-2 border rounded-lg hover:bg-muted"
              >
                <ChevronRight className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Edit Role Dialog */}
        <AnimatePresence>
          {editDialogOpen && selectedUser && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
              onClick={() => setEditDialogOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-background border rounded-xl p-6 w-full max-w-md"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Edit User Role</h3>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setEditDialogOpen(false)}
                    className="p-1 hover:bg-muted rounded"
                  >
                    <X className="h-5 w-5" />
                  </motion.button>
                </div>
                <p className="text-muted-foreground text-sm mb-4">
                  Change role for {selectedUser.name}
                </p>
                <div className="mb-6">
                  <label className="text-sm font-medium mb-2 block">
                    New Role
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {roles.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-3 justify-end">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setEditDialogOpen(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-muted"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSaveRole}
                    disabled={isLoading}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg flex items-center gap-2"
                  >
                    {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                    Save Changes
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Dialog */}
        <AnimatePresence>
          {deleteDialogOpen && selectedUser && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
              onClick={() => setDeleteDialogOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-background border rounded-xl p-6 w-full max-w-md"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                    <Trash2 className="h-6 w-6 text-red-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-red-600">
                    Delete User Permanently
                  </h3>
                </div>
                <p className="text-muted-foreground text-sm mb-2">
                  Are you sure you want to permanently delete{" "}
                  <strong>{selectedUser.name}</strong>?
                </p>
                <p className="text-sm text-red-600 mb-6">
                  This action cannot be undone. All user data will be lost.
                </p>
                <div className="flex gap-3 justify-end">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setDeleteDialogOpen(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-muted"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePermanentDelete}
                    disabled={isLoading}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                  >
                    {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                    Delete Permanently
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bulk Action Toolbar */}
        <AnimatePresence>
          {selectedUserIds.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
            >
              <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-2xl shadow-2xl px-6 py-3 flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-sm font-bold">
                    {selectedUserIds.length}
                  </div>
                  <span className="text-sm font-medium">users selected</span>
                </div>
                <div className="h-6 w-px bg-gray-700 dark:bg-gray-300" />
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleBulkAction("activate")}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm flex items-center gap-2 transition-colors text-white"
                  >
                    <UserCheck className="h-4 w-4" />
                    Activate
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleBulkAction("suspend")}
                    className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-sm flex items-center gap-2 transition-colors text-white"
                  >
                    <Ban className="h-4 w-4" />
                    Suspend
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleBulkAction("export")}
                    className="px-4 py-2 bg-gray-700 dark:bg-gray-200 hover:bg-gray-600 dark:hover:bg-gray-300 rounded-lg text-sm flex items-center gap-2 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Export
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleBulkAction("delete")}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm flex items-center gap-2 transition-colors text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </motion.button>
                </div>
                <button
                  onClick={() => setSelectedUserIds([])}
                  className="p-2 hover:bg-gray-700 dark:hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bulk Action Confirmation Modal */}
        <AnimatePresence>
          {showBulkActionConfirm && bulkAction && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowBulkActionConfirm(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-card rounded-2xl border shadow-xl max-w-md w-full p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={cn(
                      "p-3 rounded-xl",
                      bulkAction === "delete"
                        ? "bg-red-100 dark:bg-red-900/30"
                        : bulkAction === "suspend"
                          ? "bg-yellow-100 dark:bg-yellow-900/30"
                          : "bg-green-100 dark:bg-green-900/30"
                    )}
                  >
                    {bulkAction === "delete" ? (
                      <Trash2 className="h-6 w-6 text-red-600" />
                    ) : bulkAction === "suspend" ? (
                      <Ban className="h-6 w-6 text-yellow-600" />
                    ) : (
                      <UserCheck className="h-6 w-6 text-green-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold capitalize">
                      {bulkAction} {selectedUserIds.length} Users
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      This action will{" "}
                      {bulkAction === "delete"
                        ? "permanently remove"
                        : bulkAction}{" "}
                      the selected users
                    </p>
                  </div>
                </div>

                {bulkAction === "delete" && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl mb-4">
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        This action cannot be undone
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowBulkActionConfirm(false)}
                    className="flex-1 px-4 py-2 border rounded-xl hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={executeBulkAction}
                    className={cn(
                      "flex-1 px-4 py-2 rounded-xl font-medium transition-colors",
                      bulkAction === "delete"
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : bulkAction === "suspend"
                          ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                          : "bg-green-600 hover:bg-green-700 text-white"
                    )}
                  >
                    Confirm {bulkAction}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}

export default UserManagementPage;
