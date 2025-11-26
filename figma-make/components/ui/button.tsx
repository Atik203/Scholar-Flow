import * as React from "react";

// Utility function for class names
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

// Button variants
const buttonVariants = {
  default: "bg-primary text-white shadow-lg hover:shadow-xl hover:opacity-90",
  destructive: "bg-destructive text-white shadow-lg hover:opacity-90",
  outline: "border border-border bg-transparent hover:bg-muted",
  secondary:
    "bg-secondary text-secondary-foreground shadow-md hover:opacity-90",
  ghost: "hover:bg-muted hover:text-foreground",
  link: "text-primary underline-offset-4 hover:underline",
  gradient:
    "bg-gradient-to-r from-primary to-chart-1 text-white shadow-xl hover:shadow-2xl",
};

const buttonSizes = {
  sm: "h-8 px-3 text-sm",
  default: "h-9 px-4 py-2",
  lg: "h-10 px-6",
  xl: "h-12 px-8 text-base",
  icon: "h-9 w-9",
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof buttonSizes;
  children: React.ReactNode;
}

export function Button({
  className,
  variant = "default",
  size = "default",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        buttonVariants[variant],
        buttonSizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
