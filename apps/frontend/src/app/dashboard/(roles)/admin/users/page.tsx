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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { USER_ROLES } from "@/lib/auth/roles";
import {
  Edit,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import { useState } from "react";

const mockUsers = [
  {
    id: "1",
    name: "Dr. John Smith",
    email: "john.smith@university.edu",
    role: USER_ROLES.RESEARCHER as string,
    status: "Active",
    joinDate: "2024-01-15",
    papers: 12,
  },
  {
    id: "2",
    name: "Prof. Sarah Johnson",
    email: "sarah.j@institute.org",
    role: USER_ROLES.PRO_RESEARCHER as string,
    status: "Active",
    joinDate: "2024-01-10",
    papers: 25,
  },
  {
    id: "3",
    name: "Dr. Mike Wilson",
    email: "m.wilson@research.com",
    role: USER_ROLES.TEAM_LEAD as string,
    status: "Active",
    joinDate: "2024-01-08",
    papers: 18,
  },
  {
    id: "4",
    name: "Dr. Emily Davis",
    email: "emily.d@lab.edu",
    role: USER_ROLES.RESEARCHER as string,
    status: "Inactive",
    joinDate: "2024-01-05",
    papers: 5,
  },
  {
    id: "5",
    name: "Admin User",
    email: "admin@scholarflow.com",
    role: USER_ROLES.ADMIN as string,
    status: "Active",
    joinDate: "2024-01-01",
    papers: 0,
  },
];

export default function AdminUsersPage() {
  const [users] = useState(mockUsers);
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
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
                {users.filter((u) => u.status === "Active").length}
              </div>
              <p className="text-xs text-muted-foreground">Currently online</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pro Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  users.filter((u) => u.role === USER_ROLES.PRO_RESEARCHER)
                    .length
                }
              </div>
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
              <div className="text-2xl font-bold">
                {users.filter((u) => u.role === USER_ROLES.ADMIN).length}
              </div>
              <p className="text-xs text-muted-foreground">
                System administrators
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Users</CardTitle>
                <CardDescription>
                  Manage and monitor all platform users
                </CardDescription>
              </div>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="pl-8 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Papers</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <RoleBadge role={user.role as any} />
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          user.status === "Active"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
                        }`}
                      >
                        {user.status}
                      </span>
                    </TableCell>
                    <TableCell>{user.papers}</TableCell>
                    <TableCell>{user.joinDate}</TableCell>
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
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
