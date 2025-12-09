// Utility function for class names
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  variant?: "default" | "primary" | "white";
}

export function LoadingSpinner({
  size = "md",
  className,
  variant = "default",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-3",
    xl: "h-16 w-16 border-4",
  };

  const variantClasses = {
    default: "border-gray-300 border-t-primary",
    primary: "border-primary/30 border-t-primary",
    white: "border-white/30 border-t-white",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    />
  );
}

// Loading Dots Animation
interface LoadingDotsProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingDots({ size = "md", className }: LoadingDotsProps) {
  const sizeClasses = {
    sm: "h-1.5 w-1.5",
    md: "h-2 w-2",
    lg: "h-3 w-3",
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            "rounded-full bg-primary animate-bounce",
            sizeClasses[size]
          )}
          style={{
            animationDelay: `${i * 0.15}s`,
            animationDuration: "0.6s",
          }}
        />
      ))}
    </div>
  );
}

// Pulse Loading
interface PulseLoadingProps {
  className?: string;
  count?: number;
}

export function PulseLoading({ className, count = 3 }: PulseLoadingProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-3 w-3 rounded-full bg-primary/60 animate-pulse"
          style={{
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </div>
  );
}
