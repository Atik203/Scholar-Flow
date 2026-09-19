"use client";

import { useState } from "react";
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
  showErrorToast,
  showSuccessToast,
} from "@/components/providers/ToastProvider";
import {
  useGetSystemHealthQuery,
  useGetSystemMetricsQuery,
} from "@/redux/api/adminApi";
import {
  useClearSystemCacheMutation,
  useExportSystemLogsMutation,
  useRunSystemDiagnosticsMutation,
  type SystemDiagnostics,
} from "@/redux/api/adminExtendedApi";
import {
  Activity,
  CheckCircle2,
  Cpu,
  Database,
  Download,
  HardDrive,
  Loader2,
  MemoryStick,
  PlayCircle,
  Server,
  Trash2,
  XCircle,
} from "lucide-react";
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

const apiErrorMessage = (err: unknown, fallback: string): string => {
  const message = (err as { data?: { message?: string } })?.data?.message;
  return message && typeof message === "string" ? message : fallback;
};

export default function AdminSystemPage() {
  // Fetch system metrics with 10s polling for real-time updates
  const {
    data: metrics,
    isLoading,
    error,
  } = useGetSystemMetricsQuery(undefined, {
    pollingInterval: 10000, // 10 seconds
  });

  // Cache health (drives the Clear Cache enablement)
  const { data: systemHealth } = useGetSystemHealthQuery(undefined, {
    pollingInterval: 10000,
  });
  const cacheNotConfigured = systemHealth?.cache.status === "not_configured";

  // System actions
  const [runDiagnostics, { isLoading: isDiagnosing }] =
    useRunSystemDiagnosticsMutation();
  const [clearCache, { isLoading: isClearingCache }] =
    useClearSystemCacheMutation();
  const [exportLogs, { isLoading: isExportingLogs }] =
    useExportSystemLogsMutation();
  const [diagnostics, setDiagnostics] = useState<SystemDiagnostics | null>(null);

  const handleRunDiagnostics = async () => {
    try {
      const result = await runDiagnostics().unwrap();
      setDiagnostics(result.data);
      showSuccessToast(
        "Diagnostics complete",
        `Overall status: ${result.data.status}`
      );
    } catch (err) {
      showErrorToast(
        "Diagnostics failed",
        apiErrorMessage(err, "Could not run system diagnostics")
      );
    }
  };

  const handleClearCache = async () => {
    try {
      const result = await clearCache().unwrap();
      showSuccessToast(
        "Cache cleared",
        `Redis flushed, ${result.data.memoryEntriesCleared} in-memory entries cleared`
      );
    } catch (err) {
      showErrorToast(
        "Clear cache failed",
        apiErrorMessage(err, "Could not clear the system cache")
      );
    }
  };

  const handleExportLogs = async () => {
    try {
      const blob = await exportLogs().unwrap();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `scholar-flow-logs-${new Date()
        .toISOString()
        .slice(0, 10)}.log`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      showSuccessToast("Logs exported", "Backend log file downloaded");
    } catch (err) {
      showErrorToast(
        "Export failed",
        apiErrorMessage(err, "Could not export system logs")
      );
    }
  };

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
            <HealthCard
              title="Cache"
              status={systemHealth?.cache.status ?? "healthy"}
              detail={
                systemHealth?.cache.hitRate != null
                  ? `${(systemHealth.cache.hitRate * 100).toFixed(1)}% hit rate`
                  : systemHealth?.cache.status === "not_configured"
                    ? "Redis not configured (in-memory fallback)"
                    : "No lookups yet"
              }
              icon={MemoryStick}
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
                  label="Storage Usage"
                  value={metrics?.performance.disk.usagePercentage || 0}
                  isLoading={isLoading}
                />
              </Suspense>
              <Suspense fallback={<Skeleton className="h-12 w-full" />}>
                <PerformanceBar
                  label="DB Pool Usage"
                  value={metrics?.database.connectionPoolUsage || 0}
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
              Run diagnostics, clear the cache, or export recent backend logs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleRunDiagnostics}
                disabled={isDiagnosing}
                className="gap-2"
              >
                {isDiagnosing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <PlayCircle className="h-4 w-4" />
                )}
                {isDiagnosing ? "Running..." : "Run Diagnostics"}
              </Button>
              <Button
                variant="outline"
                onClick={handleClearCache}
                disabled={isClearingCache || cacheNotConfigured}
                title={
                  cacheNotConfigured
                    ? "Redis is not configured on this deployment"
                    : "Flush Redis cache and the in-memory fallback"
                }
                className="gap-2"
              >
                {isClearingCache ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                {isClearingCache ? "Clearing..." : "Clear Cache"}
              </Button>
              <Button
                variant="outline"
                onClick={handleExportLogs}
                disabled={isExportingLogs}
                className="gap-2"
              >
                {isExportingLogs ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                {isExportingLogs ? "Exporting..." : "Export Logs"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Diagnostics pings the database and checks memory/cache health. Logs
              are captured in an in-memory ring buffer (last 1000 entries) and
              reset when the backend restarts. Restart Server and Backup Database
              are handled by the hosting platform.
            </p>

            {diagnostics && (
              <div className="mt-5 rounded-lg border p-4 space-y-3">
                <div className="flex items-center gap-2">
                  {diagnostics.status === "healthy" ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : diagnostics.status === "degraded" ? (
                    <Activity className="h-5 w-5 text-yellow-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <p className="font-medium capitalize">
                    Diagnostics: {diagnostics.status}
                  </p>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {new Date(diagnostics.generatedAt).toLocaleString()}
                  </span>
                </div>
                <ul className="space-y-2">
                  {diagnostics.checks.map((check) => (
                    <li
                      key={check.name}
                      className="flex items-start gap-2 text-sm"
                    >
                      {check.status === "healthy" ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                      ) : (
                        <XCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                      )}
                      <div>
                        <span className="font-medium">{check.name}</span>
                        <span className="text-muted-foreground">
                          {" "}
                          — {check.detail}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm pt-1">
                  <div>
                    <p className="text-xs text-muted-foreground">Heap Used</p>
                    <p className="font-medium">{diagnostics.memory.heapUsedMB}MB</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">RSS</p>
                    <p className="font-medium">{diagnostics.memory.rssMB}MB</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">DB Ping</p>
                    <p className="font-medium">
                      {diagnostics.database.responseTime}ms
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Pool</p>
                    <p className="font-medium">
                      {diagnostics.database.activeConnections}/
                      {diagnostics.database.maxConnections}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
    </div>
  );
}
