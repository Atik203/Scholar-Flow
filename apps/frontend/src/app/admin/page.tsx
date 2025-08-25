"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RoleBadge } from "@/components/auth/RoleBadge";
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
  Activity,
  Database,
  Download,
  Edit,
  FileText,
  MoreHorizontal,
  Plus,
  Settings,
  Shield,
  Trash2,
  Users,
} from "lucide-react";
import { useState } from "react";

// Mock data for admin dashboard
const systemStats = [
  {
    title: "Total Users",
    value: "1,234",
    change: "+12% this month",
    icon: Users,
    color: "text-blue-600",
  },
  {
    title: "Research Papers",
    value: "5,678",
    change: "+23% this month",
    icon: FileText,
    color: "text-green-600",
  },
  {
    title: "Active Sessions",
    value: "89",
    change: "+5% this week",
    icon: Activity,
    color: "text-purple-600",
  },
  {
    title: "Storage Used",
    value: "2.4 TB",
    change: "+8% this month",
    icon: Database,
    color: "text-orange-600",
  },
];

const recentUsers = [
  {
    id: "1",
    name: "Dr. John Smith",
    email: "john.smith@university.edu",
    role: USER_ROLES.RESEARCHER,
    status: "Active",
    joinDate: "2024-01-15",
  },
  {
    id: "2",
    name: "Prof. Sarah Johnson",
    email: "sarah.j@institute.org",
    role: USER_ROLES.PRO_RESEARCHER,
    status: "Active",
    joinDate: "2024-01-10",
  },
  {
    id: "3",
    name: "Dr. Mike Wilson",
    email: "m.wilson@research.com",
    role: USER_ROLES.TEAM_LEAD,
    status: "Active",
    joinDate: "2024-01-08",
  },
  {
    id: "4",
    name: "Dr. Emily Davis",
    email: "emily.d@lab.edu",
    role: USER_ROLES.RESEARCHER,
    status: "Inactive",
    joinDate: "2024-01-05",
  },
];

const adminActions = [
  {
    title: "User Management",
    description: "Manage user accounts, roles, and permissions",
    icon: Users,
    href: "/admin/users",
    color: "bg-blue-500 hover:bg-blue-600",
  },
  {
    title: "System Settings",
    description: "Configure platform settings and policies",
    icon: Settings,
    href: "/admin/settings",
    color: "bg-gray-500 hover:bg-gray-600",
  },
  {
    title: "Security Center",
    description: "Monitor security events and manage access",
    icon: Shield,
    href: "/admin/security",
    color: "bg-red-500 hover:bg-red-600",
  },
  {
    title: "Analytics Dashboard",
    description: "View detailed platform analytics and reports",
    icon: Activity,
    href: "/admin/analytics",
    color: "bg-purple-500 hover:bg-purple-600",
  },
];

export default function AdminPage() {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const handleUserAction = (action: string, userId?: string) => {
    switch (action) {
      case "edit":
        showSuccessToast("Edit User", `Opening edit form for user ${userId}`);
        break;
      case "delete":
        showErrorToast("Delete User", `This would delete user ${userId}`);
        break;
      case "export":
        showSuccessToast("Export Data", "User data export started");
        break;
      default:
        break;
    }
  };

  return (
    <ProtectedRoute requiredRole={USER_ROLES.ADMIN}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <Shield className="h-8 w-8 text-red-500" />
                  Admin Dashboard
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  System administration and user management
                </p>
              </div>
              <RoleBadge role={USER_ROLES.ADMIN} size="lg" />
            </div>
          </div>

          {/* System Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {systemStats.map((stat, index) => (
              <Card
                key={index}
                className="dark:bg-gray-800 dark:border-gray-700"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-400">
                        {stat.change}
                      </p>
                    </div>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Admin Actions */}
          <Card className="mb-8 dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">Admin Actions</CardTitle>
              <CardDescription className="dark:text-gray-400">
                Quick access to administrative functions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {adminActions.map((action, index) => (
                  <Button
                    key={index}
                    asChild
                    variant="outline"
                    className="h-auto p-6 flex-col items-start space-y-3 hover:shadow-lg transition-all duration-300 dark:border-gray-600 dark:hover:bg-gray-700"
                  >
                    <a href={action.href}>
                      <div
                        className={`p-3 rounded-lg ${action.color} text-white`}
                      >
                        <action.icon className="h-6 w-6" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {action.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {action.description}
                        </p>
                      </div>
                    </a>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Users Table */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="dark:text-white">Recent Users</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Latest user registrations and activity
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUserAction("export")}
                  className="dark:border-gray-600"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button
                  size="sm"
                  onClick={() =>
                    showSuccessToast("Add User", "Opening user creation form")
                  }
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="dark:border-gray-700">
                    <TableHead className="dark:text-gray-300">Name</TableHead>
                    <TableHead className="dark:text-gray-300">Email</TableHead>
                    <TableHead className="dark:text-gray-300">Role</TableHead>
                    <TableHead className="dark:text-gray-300">Status</TableHead>
                    <TableHead className="dark:text-gray-300">
                      Join Date
                    </TableHead>
                    <TableHead className="dark:text-gray-300">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentUsers.map((user) => (
                    <TableRow key={user.id} className="dark:border-gray-700">
                      <TableCell className="font-medium dark:text-white">
                        {user.name}
                      </TableCell>
                      <TableCell className="dark:text-gray-300">
                        {user.email}
                      </TableCell>
                      <TableCell>
                        <RoleBadge role={user.role} size="sm" />
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.status === "Active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                          }`}
                        >
                          {user.status}
                        </span>
                      </TableCell>
                      <TableCell className="dark:text-gray-300">
                        {user.joinDate}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUserAction("edit", user.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUserAction("delete", user.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 dark:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
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
      </div>
    </ProtectedRoute>
  );
}
