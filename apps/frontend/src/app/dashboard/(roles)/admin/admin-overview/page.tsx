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
    href: "/dashboard/admin/users",
    color: "bg-blue-500 hover:bg-blue-600",
  },
  {
    title: "System Settings",
    description: "Configure platform settings and policies",
    icon: Settings,
    href: "/dashboard/admin/settings",
    color: "bg-gray-500 hover:bg-gray-600",
  },
  {
    title: "Security Center",
    description: "Monitor security events and manage access",
    icon: Shield,
    href: "/dashboard/admin/system",
    color: "bg-red-500 hover:bg-red-600",
  },
  {
    title: "Analytics Dashboard",
    description: "View detailed platform analytics and reports",
    icon: Activity,
    href: "/dashboard/admin/analytics",
    color: "bg-purple-500 hover:bg-purple-600",
  },
];

export default function AdminOverviewPage() {
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
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Shield className="h-8 w-8 text-red-500" />
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              System administration and user management overview.
            </p>
          </div>
          <RoleBadge role={USER_ROLES.ADMIN} size="lg" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {systemStats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    <p className="text-xs text-emerald-600 mt-1">
                      {stat.change}
                    </p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Admin Actions</CardTitle>
            <CardDescription>
              Quick access to high-impact administration tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {adminActions.map((action) => (
                <Button
                  key={action.title}
                  asChild
                  variant="outline"
                  className="h-auto p-6 flex-col items-start space-y-3 hover:shadow-lg transition-all duration-300"
                >
                  <a href={action.href}>
                    <div
                      className={`p-3 rounded-lg ${action.color} text-white`}
                    >
                      <action.icon className="h-6 w-6" />
                    </div>
                    <div className="text-left space-y-1">
                      <h3 className="font-semibold text-foreground">
                        {action.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {action.description}
                      </p>
                    </div>
                  </a>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Recent Users</CardTitle>
              <CardDescription>
                Latest user registrations and activity
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleUserAction("export")}
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
                {recentUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <RoleBadge role={user.role} size="sm" />
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.status === "Active"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                        }`}
                      >
                        {user.status}
                      </span>
                    </TableCell>
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
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
