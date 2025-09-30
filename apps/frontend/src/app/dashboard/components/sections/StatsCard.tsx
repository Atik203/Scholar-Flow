import { Skeleton } from "@/components/ui/skeleton";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: string | number;
  subtext: string;
  icon: LucideIcon;
  iconColor: string;
  isLoading?: boolean;
}

export function StatsCard({
  label,
  value,
  subtext,
  icon: Icon,
  iconColor,
  isLoading = false,
}: StatsCardProps) {
  return (
    <div className="rounded-lg border p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">{label}</span>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </div>
      <div className="text-2xl font-bold">
        {isLoading ? <Skeleton className="h-8 w-16" /> : value}
      </div>
      <p className="text-xs text-muted-foreground mt-1">{subtext}</p>
    </div>
  );
}
