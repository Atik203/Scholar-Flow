/**
 * SystemHealthIndicator Component
 * Visual indicator for system health status
 */

"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SystemHealth } from "@/redux/api/adminApi";
import { Activity, AlertTriangle, CheckCircle, Database } from "lucide-react";

interface SystemHealthIndicatorProps {
  health: SystemHealth | undefined;
  isLoading: boolean;
}

export function SystemHealthIndicator({
  health,
  isLoading,
}: SystemHealthIndicatorProps) {
  if (isLoading || !health) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>System Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = (status: "healthy" | "degraded" | "unhealthy") => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "degraded":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case "unhealthy":
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
    }
  };

  const getStatusBadge = (status: "healthy" | "degraded" | "unhealthy") => {
    switch (status) {
      case "healthy":
        return <Badge className="bg-green-600">Healthy</Badge>;
      case "degraded":
        return <Badge className="bg-yellow-600">Degraded</Badge>;
      case "unhealthy":
        return <Badge className="bg-red-600">Unhealthy</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          System Health
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Database Health */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Database className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Database</p>
                <p className="text-sm text-muted-foreground">
                  Response: {health.database.responseTime}ms • Connections:{" "}
                  {health.database.activeConnections}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(health.database.status)}
              {getStatusBadge(health.database.status)}
            </div>
          </div>

          {/* Cache Health */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Cache</p>
                <p className="text-sm text-muted-foreground">
                  Hit Rate: {(health.cache.hitRate * 100).toFixed(1)}%
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(health.cache.status)}
              {getStatusBadge(health.cache.status)}
            </div>
          </div>

          {/* Uptime */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <p className="font-medium">System Uptime</p>
              <p className="text-sm text-muted-foreground">
                {Math.floor(health.uptime / 3600)}h{" "}
                {Math.floor((health.uptime % 3600) / 60)}m
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
