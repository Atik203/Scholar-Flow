/**
 * AdminStatsCard Component
 * Reusable stats card with loading states for admin dashboard
 */

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LucideIcon } from "lucide-react";

interface AdminStatsCardProps {
  title: string;
  value: string | number;
  change: string;
  icon: LucideIcon;
  iconColor: string;
  isLoading?: boolean;
}

export function AdminStatsCard({
  title,
  value,
  change,
  icon: Icon,
  iconColor,
  isLoading = false,
}: AdminStatsCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {isLoading ? (
              <>
                <Skeleton className="h-8 w-24 mt-1" />
                <Skeleton className="h-4 w-32 mt-1" />
              </>
            ) : (
              <>
                <p className="text-2xl font-bold mt-1">{value}</p>
                <p className="text-xs text-emerald-600 mt-1">{change}</p>
              </>
            )}
          </div>
          <Icon className={`h-8 w-8 ${iconColor}`} />
        </div>
      </CardContent>
    </Card>
  );
}
