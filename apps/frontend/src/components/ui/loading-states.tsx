import { cn } from "@/lib/utils";
import * as React from "react";

// Skeleton component for loading placeholders
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular" | "rounded";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | "none";
}

export const LoadingSkeleton: React.FC<SkeletonProps> = ({
  className,
  variant = "rectangular",
  width,
  height,
  animation = "pulse",
  ...props
}) => {
  const baseClasses = "bg-muted animate-pulse";

  const variantClasses = {
    text: "h-4 rounded",
    circular: "rounded-full",
    rectangular: "",
    rounded: "rounded-md",
  };

  const animationClasses = {
    pulse: "animate-pulse",
    wave: "animate-pulse bg-gradient-to-r from-muted via-muted/50 to-muted",
    none: "",
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === "number" ? `${width}px` : width;
  if (height)
    style.height = typeof height === "number" ? `${height}px` : height;

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      style={style}
      {...props}
    />
  );
};

// Progress bar component
export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  variant?: "default" | "success" | "warning" | "error";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  animated?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  className,
  value,
  max = 100,
  variant = "default",
  size = "md",
  showLabel = false,
  animated = true,
  ...props
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeClasses = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  };

  const variantClasses = {
    default: "bg-primary",
    success: "bg-success",
    warning: "bg-warning",
    error: "bg-destructive",
  };

  return (
    <div className={cn("w-full", className)} {...props}>
      {showLabel && (
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}

      <div
        className={cn(
          "w-full bg-muted rounded-full overflow-hidden",
          sizeClasses[size]
        )}
      >
        <div
          className={cn(
            "h-full transition-all duration-300 ease-out",
            variantClasses[variant],
            animated && "animate-pulse"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// Shimmer effect component
export interface ShimmerProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  duration?: number;
}

export const Shimmer: React.FC<ShimmerProps> = ({
  className,
  width = "100%",
  height = "20px",
  duration = 1.5,
  ...props
}) => {
  const style: React.CSSProperties = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
  };

  return (
    <div
      className={cn("relative overflow-hidden bg-muted rounded", className)}
      style={style}
      {...props}
    >
      <div
        className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"
        style={{
          animationDuration: `${duration}s`,
        }}
      />
    </div>
  );
};

// Content loader with multiple skeleton items
export interface ContentLoaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  rows?: number;
  variant?: "text" | "card" | "list" | "table";
  showAvatar?: boolean;
  showTitle?: boolean;
  showDescription?: boolean;
}

export const ContentLoader: React.FC<ContentLoaderProps> = ({
  className,
  rows = 3,
  variant = "text",
  showAvatar = false,
  showTitle = true,
  showDescription = true,
  ...props
}) => {
  const renderTextLoader = () => (
    <div className="space-y-3">
      {showTitle && <LoadingSkeleton variant="text" width="60%" />}
      {Array.from({ length: rows }).map((_, i) => (
        <LoadingSkeleton
          key={i}
          variant="text"
          width={i === rows - 1 ? "80%" : "100%"}
        />
      ))}
    </div>
  );

  const renderCardLoader = () => (
    <div className="space-y-4">
      {showAvatar && (
        <div className="flex items-center gap-3">
          <LoadingSkeleton variant="circular" width={40} height={40} />
          <div className="space-y-2 flex-1">
            <LoadingSkeleton variant="text" width="40%" />
            <LoadingSkeleton variant="text" width="60%" />
          </div>
        </div>
      )}
      {showTitle && <LoadingSkeleton variant="text" width="70%" />}
      {showDescription && (
        <div className="space-y-2">
          <LoadingSkeleton variant="text" width="100%" />
          <LoadingSkeleton variant="text" width="90%" />
          <LoadingSkeleton variant="text" width="80%" />
        </div>
      )}
    </div>
  );

  const renderListLoader = () => (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          {showAvatar && (
            <LoadingSkeleton variant="circular" width={32} height={32} />
          )}
          <div className="space-y-2 flex-1">
            <LoadingSkeleton variant="text" width="60%" />
            <LoadingSkeleton variant="text" width="40%" />
          </div>
        </div>
      ))}
    </div>
  );

  const renderTableLoader = () => (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex gap-4">
        <LoadingSkeleton variant="text" width="20%" />
        <LoadingSkeleton variant="text" width="30%" />
        <LoadingSkeleton variant="text" width="25%" />
        <LoadingSkeleton variant="text" width="25%" />
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <LoadingSkeleton variant="text" width="20%" />
          <LoadingSkeleton variant="text" width="30%" />
          <LoadingSkeleton variant="text" width="25%" />
          <LoadingSkeleton variant="text" width="25%" />
        </div>
      ))}
    </div>
  );

  const renderContent = () => {
    switch (variant) {
      case "text":
        return renderTextLoader();
      case "card":
        return renderCardLoader();
      case "list":
        return renderListLoader();
      case "table":
        return renderTableLoader();
      default:
        return renderTextLoader();
    }
  };

  return (
    <div className={cn("animate-pulse", className)} {...props}>
      {renderContent()}
    </div>
  );
};

// Spinner variations
export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "dots" | "bars" | "pulse";
  color?: "primary" | "success" | "warning" | "error";
}

export const Spinner: React.FC<SpinnerProps> = ({
  className,
  size = "md",
  variant = "default",
  color = "primary",
  ...props
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12",
  };

  const colorClasses = {
    primary: "border-primary",
    success: "border-success",
    warning: "border-warning",
    error: "border-destructive",
  };

  const renderSpinner = () => {
    switch (variant) {
      case "dots":
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  "rounded-full bg-current animate-bounce",
                  sizeClasses[size],
                  colorClasses[color]
                )}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        );

      case "bars":
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  "bg-current animate-pulse",
                  sizeClasses[size],
                  colorClasses[color]
                )}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        );

      case "pulse":
        return (
          <div
            className={cn(
              "rounded-full bg-current animate-ping",
              sizeClasses[size],
              colorClasses[color]
            )}
          />
        );

      default:
        return (
          <div
            className={cn(
              "animate-spin rounded-full border-2 border-t-transparent",
              sizeClasses[size],
              colorClasses[color]
            )}
          />
        );
    }
  };

  return (
    <div
      className={cn("flex items-center justify-center", className)}
      {...props}
    >
      {renderSpinner()}
    </div>
  );
};
