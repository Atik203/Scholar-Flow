/**
 * RecentUsersTable Component
 * Table displaying recent user registrations with real actions + pagination
 */

"use client";

import { RoleBadge } from "@/components/auth/RoleBadge";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/providers/ToastProvider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
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
import { USER_ROLES } from "@/lib/auth/roles";
import {
  RecentUser,
  useDeactivateUserMutation,
  usePermanentlyDeleteUserMutation,
  useUpdateUserRoleMutation,
} from "@/redux/api/adminApi";
import { ChevronLeft, ChevronRight, Edit, Trash2 } from "lucide-react";
import { useState } from "react";

interface RecentUsersTableProps {
  users: RecentUser[];
  isLoading: boolean;
  onPageChange?: (page: number) => void;
  currentPage?: number;
  totalPages?: number;
}

const ROLE_OPTIONS = [
  { value: USER_ROLES.RESEARCHER, label: "Researcher" },
  { value: USER_ROLES.PRO_RESEARCHER, label: "Pro Researcher" },
  { value: USER_ROLES.TEAM_LEAD, label: "Team Lead" },
  { value: USER_ROLES.ADMIN, label: "Administrator" },
];

export function RecentUsersTable({
  users,
  isLoading,
  onPageChange,
  currentPage = 1,
  totalPages = 1,
}: RecentUsersTableProps) {
  const [updateUserRole, { isLoading: isUpdatingRole }] =
    useUpdateUserRoleMutation();
  const [deactivateUser, { isLoading: isDeactivating }] =
    useDeactivateUserMutation();
  const [permanentlyDeleteUser, { isLoading: isDeleting }] =
    usePermanentlyDeleteUserMutation();

  const [editTarget, setEditTarget] = useState<RecentUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<RecentUser | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");

  const openEdit = (user: RecentUser) => {
    setEditTarget(user);
    setSelectedRole(user.role);
  };

  const handleSaveRole = async () => {
    if (!editTarget || !selectedRole) return;
    try {
      await updateUserRole({
        userId: editTarget.id,
        role: selectedRole,
      }).unwrap();
      showSuccessToast("Role updated", `${editTarget.email} is now ${selectedRole}`);
      setEditTarget(null);
    } catch {
      showErrorToast("Update failed", "Could not update the user role.");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deactivateUser(deleteTarget.id).unwrap();
      showSuccessToast("User deactivated", `${deleteTarget.email} was deactivated`);
      setDeleteTarget(null);
    } catch {
      showErrorToast("Deactivation failed", "Could not deactivate this user.");
    }
  };

  const handleHardDelete = async (user: RecentUser) => {
    try {
      await permanentlyDeleteUser(user.id).unwrap();
      showSuccessToast("User deleted", `${user.email} was permanently deleted`);
    } catch {
      showErrorToast("Delete failed", "Could not permanently delete this user.");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Join Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground py-8"
              >
                No users found.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  {user.name || "N/A"}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <RoleBadge role={user.role} size="sm" />
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.emailVerified
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                    }`}
                  >
                    {user.emailVerified ? "Active" : "Inactive"}
                  </span>
                </TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEdit(user)}
                      aria-label={`Edit role for ${user.email}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteTarget(user)}
                      className="text-destructive"
                      aria-label={`Deactivate ${user.email}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {onPageChange && totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Edit role dialog */}
      <Dialog
        open={Boolean(editTarget)}
        onOpenChange={(open) => !open && setEditTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User Role</DialogTitle>
            <DialogDescription>
              Change the global role for {editTarget?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="recent-user-role">Role</Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger id="recent-user-role">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {ROLE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTarget(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveRole}
              disabled={isUpdatingRole || selectedRole === editTarget?.role}
            >
              {isUpdatingRole ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deactivate confirm dialog */}
      <Dialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deactivate User</DialogTitle>
            <DialogDescription>
              {deleteTarget?.email} will be soft-deleted and can be reactivated
              later from the Users page.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                if (deleteTarget) {
                  const target = deleteTarget;
                  setDeleteTarget(null);
                  void handleHardDelete(target);
                }
              }}
              disabled={isDeleting}
              className="text-destructive"
            >
              {isDeleting ? "Deleting..." : "Delete permanently"}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeactivating}
            >
              {isDeactivating ? "Deactivating..." : "Deactivate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
