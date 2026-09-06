"use client";

import { cn } from "@/lib/utils";

interface StatusDotProps {
  status: "active" | "pending" | "inactive" | "invited";
  className?: string;
  pulse?: boolean;
}

const COLORS = {
  active: "bg-green-500",
  pending: "bg-yellow-500",
  inactive: "bg-gray-400",
  invited: "bg-blue-500",
};

export function StatusDot({ status, className, pulse = false }: StatusDotProps) {
  return (
    <span
      className={cn(
        "inline-block h-2.5 w-2.5 rounded-full border-2 border-card",
        COLORS[status],
        pulse && status === "active" && "animate-pulse",
        className
      )}
      aria-label={status}
    />
  );
}
