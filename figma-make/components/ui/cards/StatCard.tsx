import {
  ArrowDownRight,
  ArrowUpRight,
  Minus,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { cardVariants, type CardVariants } from "../card-variants";

/**
 * StatCard - Card component for displaying statistics
 * Matches frontend/src/components/ui/cards/StatCard.tsx
 */

export interface StatCardProps extends CardVariants {
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
  className?: string;
}

export function StatCard({
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
}: StatCardProps) {
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

  const currentSize = (size as "sm" | "md" | "lg") || "md";
  const sizeConfig = textSizes[currentSize] || textSizes.md;

  const getTrendIcon = () => {
    if (!trend || !showTrend) return null;

    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case "neutral":
        return <Minus className="h-4 w-4 text-muted-foreground" />;
      default:
        return null;
    }
  };

  const getChangeIcon = () => {
    if (change === undefined) return null;

    if (change > 0) {
      return <ArrowUpRight className="h-4 w-4" />;
    } else if (change < 0) {
      return <ArrowDownRight className="h-4 w-4" />;
    }
    return <Minus className="h-4 w-4" />;
  };

  const getChangeColor = () => {
    if (change === undefined) return "";
    if (change > 0) return "text-green-500";
    if (change < 0) return "text-red-500";
    return "text-muted-foreground";
  };

  const displayValue = formatValue
    ? formatValue(value)
    : typeof value === "number"
      ? value.toLocaleString()
      : value;

  const displayChange =
    change !== undefined
      ? changeType === "percentage"
        ? `${change > 0 ? "+" : ""}${change}%`
        : `${change > 0 ? "+" : ""}${change}`
      : null;

  if (loading) {
    return (
      <div
        className={`${cardVariants({ variant, padding, hover, size })} ${sizeClasses[currentSize]} ${className || ""}`}
      >
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-1/2" />
          <div className="h-8 bg-muted rounded w-3/4" />
          <div className="h-3 bg-muted rounded w-1/4" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${cardVariants({ variant, padding, hover, size })} ${sizeClasses[currentSize]} ${onClick ? "cursor-pointer" : ""} ${className || ""}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p
            className={`text-muted-foreground font-medium ${sizeConfig.title}`}
          >
            {title}
          </p>
          <p className={`font-bold mt-2 ${sizeConfig.value}`}>{displayValue}</p>

          {/* Change indicator */}
          {displayChange && (
            <div
              className={`flex items-center gap-1 mt-2 ${getChangeColor()} ${sizeConfig.change}`}
            >
              {getChangeIcon()}
              <span>{displayChange}</span>
              {getTrendIcon()}
            </div>
          )}

          {/* Description */}
          {description && (
            <p
              className={`text-muted-foreground mt-2 ${sizeConfig.description}`}
            >
              {description}
            </p>
          )}
        </div>

        {/* Icon */}
        {Icon && (
          <div className="p-3 rounded-lg bg-primary/10">
            <Icon className={`text-primary ${iconSizes[currentSize]}`} />
          </div>
        )}
      </div>
    </div>
  );
}
