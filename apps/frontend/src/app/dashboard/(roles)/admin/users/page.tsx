"use client";

import { RoleBadge } from "@/components/auth/RoleBadge";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useDeactivateUserMutation,
  useGetAllUsersQuery,
  useGetUserStatsQuery,
  usePermanentlyDeleteUserMutation,
  useReactivateUserMutation,
  useUpdateUserRoleMutation,
} from "@/redux/api/adminApi";
import {
  AlertCircle,
  CheckCircle,
  Edit,
  Loader2,
  RotateCcw,
  Search,
  Trash2,
  UserX,
  Users,
} from "lucide-react";
import { useState } from "react";

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    name: string | null;
    email: string;
    role: string;
    isDeleted: boolean;
  } | null>(null);
  const [newRole, setNewRole] = useState<string>("");

  // API hooks
  const { data: usersData, isLoading: usersLoading } = useGetAllUsersQuery({
    page,
    limit: 20,
    search: searchQuery || undefined,
    role: roleFilter !== "all" ? roleFilter : undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
  });

  const { data: stats } = useGetUserStatsQuery();

  const [updateUserRole, { isLoading: updateRoleLoading }] =
    useUpdateUserRoleMutation();
  const [deactivateUser, { isLoading: deactivateLoading }] =
    useDeactivateUserMutation();
  const [reactivateUser, { isLoading: reactivateLoading }] =
    useReactivateUserMutation();
  const [permanentlyDeleteUser, { isLoading: deleteLoading }] =
    usePermanentlyDeleteUserMutation();

  const handleEditRole = (user: {
    id: string;
    name: string | null;
    email: string;
    role: string;
    isDeleted: boolean;
  }) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setEditDialogOpen(true);
  };

  const handleSaveRole = async () => {
    if (!selectedUser || !newRole) return;

    try {
      await updateUserRole({
        userId: selectedUser.id,
        role: newRole,
      }).unwrap();

      showSuccessToast(
        "Role Updated",
        `${selectedUser.name || selectedUser.email}'s role has been updated to ${newRole}`
      );
      setEditDialogOpen(false);
      setSelectedUser(null);
    } catch (error: any) {
      showErrorToast(
        "Update Failed",
        error?.data?.message || "Failed to update user role"
      );
    }
  };

  const handleToggleStatus = async (user: {
    id: string;
    name: string | null;
    email: string;
    isDeleted: boolean;
  }) => {
    try {
      if (user.isDeleted) {
        await reactivateUser(user.id).unwrap();
        showSuccessToast(
          "User Reactivated",
          `${user.name || user.email} has been reactivated`
        );
      } else {
        await deactivateUser(user.id).unwrap();
        showSuccessToast(
          "User Deactivated",
          `${user.name || user.email} has been deactivated`
        );
      }
    } catch (error: any) {
      showErrorToast(
        "Action Failed",
        error?.data?.message || "Failed to update user status"
      );
    }
  };

  const handleDeleteConfirm = (user: {
    id: string;
    name: string | null;
    email: string;
    role: string;
    isDeleted: boolean;
  }) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handlePermanentDelete = async () => {
    if (!selectedUser) return;

    try {
      await permanentlyDeleteUser(selectedUser.id).unwrap();
      showSuccessToast(
        "User Deleted",
        `${selectedUser.name || selectedUser.email} has been permanently deleted`
      );
      setDeleteDialogOpen(false);
      setSelectedUser(null);
    } catch (error: any) {
      showErrorToast(
        "Delete Failed",
        error?.data?.message || "Failed to delete user"
      );
    }
  };

  const users = usersData?.data || [];
  const meta = usersData?.meta;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              User Management
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage user accounts, roles, and permissions
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground">All registered</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.activeUsers || 0}
              </div>
              <p className="text-xs text-muted-foreground">Not deleted</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pro Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.proUsers || 0}</div>
              <p className="text-xs text-muted-foreground">
                Premium subscribers
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.adminUsers || 0}</div>
              <p className="text-xs text-muted-foreground">
                System administrators
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle>All Users</CardTitle>
                <CardDescription>
                  Manage and monitor all platform users
                </CardDescription>
              </div>
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="pl-8 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setPage(1);
                    }}
                  />
                </div>
                <Select
                  value={roleFilter}
                  onValueChange={(value) => {
                    setRoleFilter(value);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="RESEARCHER">Researcher</SelectItem>
                    <SelectItem value="PRO_RESEARCHER">
                      Pro Researcher
                    </SelectItem>
                    <SelectItem value="TEAM_LEAD">Team Lead</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={statusFilter}
                  onValueChange={(value) => {
                    setStatusFilter(value);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {usersLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No users found</p>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Papers</TableHead>
                      <TableHead>Subscription</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.name || "N/A"}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <RoleBadge role={user.role as any} />
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                              !user.isDeleted
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
                            }`}
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
                        </TableCell>
                        <TableCell>{user.paperCount}</TableCell>
                        <TableCell>
                          {user.subscriptionStatus ? (
                            <span className="text-xs">
                              {user.planName || "N/A"}
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              None
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditRole(user)}
                              disabled={updateRoleLoading}
                              title="Edit role"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleStatus(user)}
                              disabled={deactivateLoading || reactivateLoading}
                              title={
                                user.isDeleted
                                  ? "Reactivate user"
                                  : "Deactivate user"
                              }
                            >
                              {user.isDeleted ? (
                                <RotateCcw className="h-4 w-4" />
                              ) : (
                                <UserX className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteConfirm(user)}
                              disabled={deleteLoading}
                              title="Permanently delete"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {meta && meta.totalPage > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-muted-foreground">
                      Showing page {meta.page} of {meta.totalPage} ({meta.total}{" "}
                      total users)
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page - 1)}
                        disabled={!meta.hasPreviousPage}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page + 1)}
                        disabled={!meta.hasNextPage}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Edit Role Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User Role</DialogTitle>
              <DialogDescription>
                Change the role for {selectedUser?.name || selectedUser?.email}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <label className="text-sm font-medium mb-2 block">
                Select New Role
              </label>
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RESEARCHER">Researcher</SelectItem>
                  <SelectItem value="PRO_RESEARCHER">Pro Researcher</SelectItem>
                  <SelectItem value="TEAM_LEAD">Team Lead</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveRole}
                disabled={updateRoleLoading || !newRole}
              >
                {updateRoleLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-red-600">
                Permanently Delete User
              </DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete{" "}
                <strong>{selectedUser?.name || selectedUser?.email}</strong> and
                all their associated data.
              </DialogDescription>
            </DialogHeader>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div className="text-sm text-red-800 dark:text-red-200">
                  <p className="font-medium mb-1">Warning!</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>All user data will be permanently deleted</li>
                    <li>This action cannot be reversed</li>
                    <li>Papers and collaborations may be affected</li>
                  </ul>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handlePermanentDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Permanently"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
