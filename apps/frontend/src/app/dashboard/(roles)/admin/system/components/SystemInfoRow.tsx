/**
 * System Info Row Component
 * Displays a key-value pair for system information
 */

import { Skeleton } from "@/components/ui/skeleton";

interface SystemInfoRowProps {
  label: string;
  value: string | number;
  isLoading?: boolean;
}

export function SystemInfoRow({
  label,
  value,
  isLoading = false,
}: SystemInfoRowProps) {
  if (isLoading) {
    return (
      <div className="flex justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-32" />
      </div>
    );
  }

  return (
    <div className="flex justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
