import * as React from "react";

// Utility function for class names
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

// Skeleton component for loading placeholders
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular" | "rounded";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | "shimmer" | "none";
}

export const LoadingSkeleton: React.FC<SkeletonProps> = ({
  className,
  variant = "rectangular",
  width,
  height,
  animation = "pulse",
  ...props
}) => {
  const baseClasses = "bg-muted";

  const variantClasses = {
    text: "h-4 rounded",
    circular: "rounded-full",
    rectangular: "rounded-none",
    rounded: "rounded-md",
  };

  const animationClasses = {
    pulse: "animate-pulse",
    wave: "animate-pulse",
    shimmer:
      "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
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
  variant?: "default" | "success" | "warning" | "error" | "info";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  animated?: boolean;
  striped?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  className,
  value,
  max = 100,
  variant = "default",
  size = "md",
  showLabel = false,
  animated = false,
  striped = false,
  ...props
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeClasses = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  const variantClasses = {
    default: "bg-primary",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    error: "bg-red-500",
    info: "bg-blue-500",
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
            "h-full transition-all duration-500 ease-out rounded-full",
            variantClasses[variant],
            striped && "bg-stripes",
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
  borderRadius?: string | number;
}

export const Shimmer: React.FC<ShimmerProps> = ({
  className,
  width = "100%",
  height = "20px",
  borderRadius = "4px",
  ...props
}) => {
  const style: React.CSSProperties = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
    borderRadius:
      typeof borderRadius === "number" ? `${borderRadius}px` : borderRadius,
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-muted",
        "before:absolute before:inset-0 before:-translate-x-full",
        "before:animate-[shimmer_1.5s_infinite]",
        "before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
        className
      )}
      style={style}
      {...props}
    />
  );
};

// Content loader with multiple skeleton items
export interface ContentLoaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  rows?: number;
  variant?: "text" | "card" | "list" | "avatar";
  gap?: "sm" | "md" | "lg";
}

export const ContentLoader: React.FC<ContentLoaderProps> = ({
  className,
  rows = 3,
  variant = "text",
  gap = "md",
  ...props
}) => {
  const gapClasses = {
    sm: "space-y-2",
    md: "space-y-3",
    lg: "space-y-4",
  };

  const renderTextLoader = () => (
    <div className={gapClasses[gap]}>
      <LoadingSkeleton variant="text" width="60%" />
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
    <div className={gapClasses[gap]}>
      <LoadingSkeleton variant="rounded" height={200} />
      <LoadingSkeleton variant="text" width="70%" />
      <LoadingSkeleton variant="text" width="50%" />
    </div>
  );

  const renderListLoader = () => (
    <div className={gapClasses[gap]}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <LoadingSkeleton variant="circular" width={40} height={40} />
          <div className="flex-1 space-y-2">
            <LoadingSkeleton variant="text" width="60%" />
            <LoadingSkeleton variant="text" width="40%" />
          </div>
        </div>
      ))}
    </div>
  );

  const renderAvatarLoader = () => (
    <div className="flex items-center gap-3">
      <LoadingSkeleton variant="circular" width={48} height={48} />
      <div className="space-y-2">
        <LoadingSkeleton variant="text" width={120} />
        <LoadingSkeleton variant="text" width={80} />
      </div>
    </div>
  );

  const loaders = {
    text: renderTextLoader,
    card: renderCardLoader,
    list: renderListLoader,
    avatar: renderAvatarLoader,
  };

  return (
    <div className={cn(className)} {...props}>
      {loaders[variant]()}
    </div>
  );
};

// Page Loading Component
export interface PageLoadingProps {
  message?: string;
}

export const PageLoading: React.FC<PageLoadingProps> = ({
  message = "Loading...",
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-primary" />
      <p className="text-muted-foreground animate-pulse">{message}</p>
    </div>
  );
};

// Inline Loading
export const InlineLoading: React.FC<{ text?: string }> = ({
  text = "Loading",
}) => {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      <span>{text}</span>
    </span>
  );
};
