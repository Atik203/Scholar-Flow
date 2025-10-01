/**
 * Performance Bar Component
 * Displays a labeled progress bar for performance metrics
 */

import { Skeleton } from "@/components/ui/skeleton";

interface PerformanceBarProps {
  label: string;
  value: number; // percentage 0-100
  color?: "blue" | "green" | "purple" | "orange" | "red" | "yellow";
  isLoading?: boolean;
}

export function PerformanceBar({
  label,
  value,
  color = "blue",
  isLoading = false,
}: PerformanceBarProps) {
  const getBarColor = () => {
    switch (color) {
      case "blue":
        return "bg-blue-600";
      case "green":
        return "bg-green-600";
      case "purple":
        return "bg-purple-600";
      case "orange":
        return "bg-orange-600";
      case "red":
        return "bg-red-600";
      case "yellow":
        return "bg-yellow-600";
      default:
        return "bg-blue-600";
    }
  };

  // Auto-select color based on value if not specified
  const getAutoColor = () => {
    if (value < 50) return "bg-green-600";
    if (value < 70) return "bg-blue-600";
    if (value < 85) return "bg-yellow-600";
    return "bg-red-600";
  };

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm text-muted-foreground">
          {Math.round(value)}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`${getAutoColor()} h-2 rounded-full transition-all duration-300`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
}
