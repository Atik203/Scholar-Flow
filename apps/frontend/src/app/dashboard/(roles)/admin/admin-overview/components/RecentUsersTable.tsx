/**
 * RecentUsersTable Component
 * Table displaying recent user registrations with pagination
 */

"use client";

import { RoleBadge } from "@/components/auth/RoleBadge";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/providers/ToastProvider";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RecentUser } from "@/redux/api/adminApi";
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";

interface RecentUsersTableProps {
  users: RecentUser[];
  isLoading: boolean;
  onPageChange?: (page: number) => void;
  currentPage?: number;
}

export function RecentUsersTable({ users, isLoading }: RecentUsersTableProps) {
  const handleUserAction = (action: string, userId?: string) => {
    switch (action) {
      case "edit":
        showSuccessToast("Edit User", `Opening edit form for user ${userId}`);
        break;
      case "delete":
        showErrorToast("Delete User", `This would delete user ${userId}`);
        break;
      default:
        break;
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
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.name || "N/A"}</TableCell>
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
                  onClick={() => handleUserAction("edit", user.id)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleUserAction("delete", user.id)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
