import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Building2,
  CheckCircle2,
  FileText,
  Settings,
  Shield,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";
import Link from "next/link";
import { StatsCard } from "./StatsCard";

interface AdminSystemHealthProps {
  usersData: any;
  usersLoading: boolean;
  workspacesTotal: number;
  processingStats: {
    total: number;
    processed: number;
    processing: number;
    failed: number;
    extracted: number;
  };
  scopedHref: (href: string) => string;
}

export function AdminSystemHealth({
  usersData,
  usersLoading,
  workspacesTotal,
  processingStats,
  scopedHref,
}: AdminSystemHealthProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
          System Health Overview
          <Badge variant="outline" className="text-xs">
            Admin Only
          </Badge>
        </CardTitle>
        <CardDescription className="text-sm">
          Real-time system statistics and platform health metrics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            label="Total Users"
            value={usersData?.meta?.total || 0}
            subtext="Registered accounts"
            icon={Users}
            iconColor="text-blue-600"
            isLoading={usersLoading}
          />

          <StatsCard
            label="Workspaces"
            value={workspacesTotal}
            subtext="Active workspaces"
            icon={Building2}
            iconColor="text-purple-600"
          />

          <StatsCard
            label="System Papers"
            value={processingStats.total}
            subtext={`${processingStats.processed} processed`}
            icon={FileText}
            iconColor="text-green-600"
          />

          <StatsCard
            label="Health Status"
            value={processingStats.failed === 0 ? "Good" : "Warning"}
            subtext={`${processingStats.failed} failed papers`}
            icon={CheckCircle2}
            iconColor="text-emerald-600"
          />
        </div>

        {/* Recent Users Activity */}
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            Recent User Registrations
          </h4>
          <div className="space-y-2">
            {usersLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-2 rounded-lg border"
                >
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-2 w-24" />
                  </div>
                </div>
              ))
            ) : usersData?.data && usersData.data.length > 0 ? (
              usersData.data.slice(0, 5).map((user: any) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-2 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="rounded-full bg-blue-100 dark:bg-blue-900/20 p-2">
                    <UserPlus className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {user.role || "USER"}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No user data available
              </p>
            )}
          </div>
        </div>

        {/* Admin Quick Actions */}
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Admin Quick Actions
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button
              asChild
              variant="outline"
              className="justify-start h-auto p-3"
            >
              <Link
                href={scopedHref("/users")}
                className="flex items-center gap-2 w-full"
              >
                <Users className="h-4 w-4" />
                <span>Manage Users</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="justify-start h-auto p-3"
            >
              <Link
                href={scopedHref("/workspaces")}
                className="flex items-center gap-2 w-full"
              >
                <Building2 className="h-4 w-4" />
                <span>All Workspaces</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="justify-start h-auto p-3"
            >
              <Link
                href={scopedHref("/settings")}
                className="flex items-center gap-2 w-full"
              >
                <Settings className="h-4 w-4" />
                <span>System Settings</span>
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
