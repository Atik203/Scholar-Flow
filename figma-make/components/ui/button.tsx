import { Loader2 } from "lucide-react";
import * as React from "react";

// Utility function for class names
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

// Button variants with advanced hover effects and animations
const buttonVariants = {
  default:
    "bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:shadow-primary/25 hover:bg-primary/90 before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
  destructive:
    "bg-destructive text-destructive-foreground shadow-lg hover:shadow-xl hover:shadow-destructive/25 hover:bg-destructive/90 before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
  outline:
    "border border-border bg-background text-foreground shadow-sm hover:shadow-md hover:bg-accent hover:text-accent-foreground hover:border-primary/30 before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/5 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
  secondary:
    "bg-secondary text-secondary-foreground shadow-md hover:shadow-lg hover:shadow-secondary/20 hover:bg-secondary/80 before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
  ghost:
    "text-foreground hover:bg-accent hover:text-accent-foreground hover:shadow-sm before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/5 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
  link: "text-primary underline-offset-4 hover:underline hover:text-primary/80",
  gradient:
    "bg-gradient-to-r from-primary to-chart-1 text-primary-foreground shadow-xl hover:shadow-2xl hover:shadow-primary/25 hover:from-primary/90 hover:to-chart-1/90 hover:-translate-y-0.5 before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
};

const buttonSizes = {
  sm: "h-8 px-3 text-sm rounded-md gap-1.5",
  default: "h-9 px-4 py-2 rounded-md",
  lg: "h-10 px-6 rounded-md",
  xl: "h-12 px-8 text-base rounded-lg",
  icon: "h-9 w-9 rounded-md",
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof buttonSizes;
  children: React.ReactNode;
  loading?: boolean;
  loadingText?: string;
}

export function Button({
  className,
  variant = "default",
  size = "default",
  children,
  loading = false,
  loadingText,
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      className={cn(
        "relative overflow-hidden inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 group",
        buttonVariants[variant],
        buttonSizes[size],
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {loading && loadingText ? loadingText : children}
    </button>
  );
}
