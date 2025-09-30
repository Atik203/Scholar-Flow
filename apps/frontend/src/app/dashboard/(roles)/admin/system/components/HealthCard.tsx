/**
 * System Health Card Component
 * Displays health status for system components
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, CheckCircle, LucideIcon } from "lucide-react";

interface HealthCardProps {
  title: string;
  status: "healthy" | "degraded" | "unhealthy" | "warning" | "critical";
  detail: string;
  icon: LucideIcon;
  isLoading?: boolean;
}

export function HealthCard({
  title,
  status,
  detail,
  icon: Icon,
  isLoading = false,
}: HealthCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case "healthy":
        return "text-green-600";
      case "degraded":
      case "warning":
        return "text-yellow-600";
      case "unhealthy":
      case "critical":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "healthy":
        return "Healthy";
      case "degraded":
        return "Degraded";
      case "unhealthy":
        return "Unhealthy";
      case "warning":
        return "Warning";
      case "critical":
        return "Critical";
      default:
        return "Unknown";
    }
  };

  const getStatusIcon = () => {
    if (status === "healthy") {
      return <CheckCircle className={`h-5 w-5 ${getStatusColor()}`} />;
    }
    return <AlertCircle className={`h-5 w-5 ${getStatusColor()}`} />;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-5 w-24 mb-2" />
          <Skeleton className="h-3 w-32" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className={`text-sm font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-2">{detail}</p>
      </CardContent>
    </Card>
  );
}
