"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetSystemMetricsQuery } from "@/redux/api/adminApi";
import { Activity, Cpu, Database, HardDrive, Server } from "lucide-react";
import { Suspense, lazy } from "react";

// Lazy load components for better performance
const HealthCard = lazy(() =>
  import("./components").then((mod) => ({ default: mod.HealthCard }))
);
const PerformanceBar = lazy(() =>
  import("./components").then((mod) => ({ default: mod.PerformanceBar }))
);
const SystemInfoRow = lazy(() =>
  import("./components").then((mod) => ({ default: mod.SystemInfoRow }))
);

export default function AdminSystemPage() {
  // Fetch system metrics with 10s polling for real-time updates
  const {
    data: metrics,
    isLoading,
    error,
  } = useGetSystemMetricsQuery(undefined, {
    pollingInterval: 10000, // 10 seconds
  });

  // Helper: Format uptime
  const formatUptime = (seconds: number): string => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  // Helper: Format bytes
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Database className="h-8 w-8 text-orange-600" />
            System Health & Monitoring
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitor system performance and health status in real-time
          </p>
        </div>

        <Suspense
          fallback={
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-5 w-24 mb-2" />
                    <Skeleton className="h-3 w-32" />
                  </CardContent>
                </Card>
              ))}
            </div>
          }
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <HealthCard
              title="Database"
              status={metrics?.health.database || "healthy"}
              detail={`Response: ${metrics?.database.responseTime || 0}ms`}
              icon={Database}
              isLoading={isLoading}
            />
            <HealthCard
              title="Server"
              status={metrics?.health.server || "healthy"}
              detail={`Uptime: ${formatUptime(metrics?.systemInfo.uptime || 0)}`}
              icon={Server}
              isLoading={isLoading}
            />
            <HealthCard
              title="Storage"
              status={metrics?.health.storage || "healthy"}
              detail={`${metrics?.performance.disk.usagePercentage?.toFixed(1) || 0}% capacity`}
              icon={HardDrive}
              isLoading={isLoading}
            />
            <HealthCard
              title="CPU Usage"
              status={metrics?.health.cpu || "healthy"}
              detail={`Average: ${metrics?.performance.cpu.usage?.toFixed(1) || 0}%`}
              icon={Cpu}
              isLoading={isLoading}
            />
          </div>
        </Suspense>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Performance Metrics
              </CardTitle>
              <CardDescription>Real-time system performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Suspense fallback={<Skeleton className="h-12 w-full" />}>
                <PerformanceBar
                  label="CPU Usage"
                  value={metrics?.performance.cpu.usage || 0}
                  isLoading={isLoading}
                />
              </Suspense>
              <Suspense fallback={<Skeleton className="h-12 w-full" />}>
                <PerformanceBar
                  label="Memory Usage"
                  value={metrics?.performance.memory.usagePercentage || 0}
                  isLoading={isLoading}
                />
              </Suspense>
              <Suspense fallback={<Skeleton className="h-12 w-full" />}>
                <PerformanceBar
                  label="Disk I/O"
                  value={metrics?.performance.disk.ioPercentage || 0}
                  isLoading={isLoading}
                />
              </Suspense>
              <Suspense fallback={<Skeleton className="h-12 w-full" />}>
                <PerformanceBar
                  label="Network"
                  value={metrics?.performance.network.bandwidth || 0}
                  isLoading={isLoading}
                />
              </Suspense>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
              <CardDescription>Server and environment details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Suspense fallback={<Skeleton className="h-5 w-full" />}>
                <SystemInfoRow
                  label="Platform"
                  value={metrics?.systemInfo.platform || "Loading..."}
                  isLoading={isLoading}
                />
              </Suspense>
              <Suspense fallback={<Skeleton className="h-5 w-full" />}>
                <SystemInfoRow
                  label="Node.js"
                  value={metrics?.systemInfo.nodeVersion || "Loading..."}
                  isLoading={isLoading}
                />
              </Suspense>
              <Suspense fallback={<Skeleton className="h-5 w-full" />}>
                <SystemInfoRow
                  label="Database"
                  value={metrics?.systemInfo.databaseVersion || "Loading..."}
                  isLoading={isLoading}
                />
              </Suspense>
              <Suspense fallback={<Skeleton className="h-5 w-full" />}>
                <SystemInfoRow
                  label="Total Memory"
                  value={metrics?.systemInfo.totalMemory || "Loading..."}
                  isLoading={isLoading}
                />
              </Suspense>
              <Suspense fallback={<Skeleton className="h-5 w-full" />}>
                <SystemInfoRow
                  label="Storage"
                  value={metrics?.systemInfo.storageCapacity || "Loading..."}
                  isLoading={isLoading}
                />
              </Suspense>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>System Actions</CardTitle>
            <CardDescription>
              Perform maintenance and system operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button disabled>Clear Cache</Button>
              <Button variant="outline" disabled>
                Restart Server
              </Button>
              <Button variant="outline" disabled>
                Run Diagnostics
              </Button>
              <Button variant="outline" disabled>
                Export Logs
              </Button>
              <Button variant="outline" disabled>
                Backup Database
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              System actions are temporarily disabled. Full functionality coming
              soon.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
