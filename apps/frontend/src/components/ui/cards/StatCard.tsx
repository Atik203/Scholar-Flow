import { cn } from "@/lib/utils";
import {
  ArrowDownRight,
  ArrowUpRight,
  Minus,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import * as React from "react";
import { cardVariants, type CardVariants } from "../card-variants";

export interface StatCardProps
  extends Omit<React.ComponentProps<"div">, "onClick">,
    CardVariants {
  title: string;
  value: string | number;
  change?: number;
  changeType?: "percentage" | "absolute";
  trend?: "up" | "down" | "neutral";
  icon?: React.ComponentType<{ className?: string }>;
  description?: string;
  onClick?: () => void;
  loading?: boolean;
  formatValue?: (value: number | string) => string;
  showTrend?: boolean;
  size?: "sm" | "md" | "lg";
}

export const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  (
    {
      className,
      title,
      value,
      change,
      changeType = "percentage",
      trend,
      icon: Icon,
      description,
      onClick,
      loading = false,
      formatValue,
      showTrend = true,
      size = "md",
      variant = "default",
      padding = "md",
      hover = "none",
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    };

    const iconSizes = {
      sm: "h-8 w-8",
      md: "h-10 w-10",
      lg: "h-12 w-12",
    };

    const textSizes = {
      sm: {
        title: "text-sm",
        value: "text-2xl",
        change: "text-xs",
        description: "text-xs",
      },
      md: {
        title: "text-sm",
        value: "text-3xl",
        change: "text-sm",
        description: "text-sm",
      },
      lg: {
        title: "text-base",
        value: "text-4xl",
        change: "text-base",
        description: "text-sm",
      },
    };

    const getTrendIcon = () => {
      if (!trend || !showTrend) return null;

      switch (trend) {
        case "up":
          return <TrendingUp className="h-4 w-4 text-success" />;
        case "down":
          return <TrendingDown className="h-4 w-4 text-destructive" />;
        case "neutral":
          return <Minus className="h-4 w-4 text-muted-foreground" />;
        default:
          return null;
      }
    };

    const getChangeIcon = () => {
      if (change === undefined || !showTrend) return null;

      if (change > 0) {
        return <ArrowUpRight className="h-4 w-4 text-success" />;
      } else if (change < 0) {
        return <ArrowDownRight className="h-4 w-4 text-destructive" />;
      }
      return null;
    };

    const formatChange = (change: number) => {
      if (changeType === "percentage") {
        return `${change > 0 ? "+" : ""}${change.toFixed(1)}%`;
      }
      return `${change > 0 ? "+" : ""}${change.toLocaleString()}`;
    };

    const getChangeColor = (change: number) => {
      if (change > 0) return "text-success";
      if (change < 0) return "text-destructive";
      return "text-muted-foreground";
    };

    const displayValue = formatValue ? formatValue(value) : value;

    return (
      <div
        ref={ref}
        className={cn(
          cardVariants({ variant, padding, hover }),
          sizeClasses[size],
          onClick && "cursor-pointer",
          className
        )}
        onClick={onClick}
        {...props}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {Icon && (
                <Icon
                  className={cn("text-muted-foreground", iconSizes[size])}
                />
              )}
              <div className="flex items-center gap-1">
                {getTrendIcon()}
                <p
                  className={cn(
                    "text-muted-foreground font-medium",
                    textSizes[size].title
                  )}
                >
                  {title}
                </p>
              </div>
            </div>

            {loading ? (
              <div className="space-y-2">
                <div className="h-8 bg-muted animate-pulse rounded" />
                {description && (
                  <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                )}
              </div>
            ) : (
              <>
                <p
                  className={cn(
                    "font-bold text-foreground",
                    textSizes[size].value
                  )}
                >
                  {displayValue}
                </p>

                {description && (
                  <p
                    className={cn(
                      "text-muted-foreground mt-1",
                      textSizes[size].description
                    )}
                  >
                    {description}
                  </p>
                )}
              </>
            )}
          </div>

          {change !== undefined && showTrend && !loading && (
            <div className="flex items-center gap-1">
              {getChangeIcon()}
              <span
                className={cn(
                  "font-medium",
                  textSizes[size].change,
                  getChangeColor(change)
                )}
              >
                {formatChange(change)}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
);

StatCard.displayName = "StatCard";
