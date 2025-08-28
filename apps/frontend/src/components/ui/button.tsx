import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:focus-visible:ring-offset-background aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive relative overflow-hidden group",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground dark:text-white shadow-lg hover:shadow-xl hover:shadow-primary/25 dark:shadow-primary/20 dark:hover:shadow-primary/30 hover:bg-primary/90 dark:hover:bg-primary/80 dark:bg-primary/90 before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
        destructive:
          "bg-destructive text-destructive-foreground dark:text-white shadow-lg hover:shadow-xl hover:shadow-destructive/25 dark:shadow-destructive/20 dark:hover:shadow-destructive/30 hover:bg-destructive/90 dark:hover:bg-destructive/80 dark:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
        outline:
          "border border-border bg-background text-foreground dark:text-white shadow-sm hover:shadow-md hover:shadow-border/20 dark:shadow-border/10 dark:hover:shadow-border/20 hover:bg-accent hover:text-accent-foreground dark:hover:text-white dark:bg-input/20 dark:border-input/50 dark:hover:bg-input/30 dark:hover:border-input/70 dark:hover:shadow-input/20 before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/5 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
        secondary:
          "bg-secondary text-secondary-foreground dark:text-white shadow-md hover:shadow-lg hover:shadow-secondary/20 dark:shadow-secondary/10 dark:hover:shadow-secondary/20 hover:bg-secondary/80 dark:hover:bg-secondary/70 dark:bg-secondary/80 before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
        ghost:
          "text-foreground dark:text-white hover:bg-accent hover:text-accent-foreground dark:hover:text-white dark:hover:bg-accent/60 dark:hover:shadow-accent/10 hover:shadow-sm before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/5 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
        link: "text-primary dark:text-white underline-offset-4 hover:underline dark:hover:text-white hover:shadow-sm",
        gradient:
          "bg-gradient-to-r from-primary to-chart-1 text-primary-foreground dark:text-white shadow-xl hover:shadow-2xl hover:shadow-primary/25 dark:shadow-primary/20 dark:hover:shadow-primary/30 hover:from-primary/90 hover:to-chart-1/90 dark:from-primary/80 dark:to-chart-1/80 before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        xl: "h-12 rounded-lg px-8 has-[>svg]:px-6 text-base",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  loadingText?: string;
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  loadingText,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  // When using asChild, we need to handle loading differently to avoid multiple children
  if (asChild) {
    // For asChild, we'll clone the child and add our props to it
    return (
      <Slot
        className={cn(buttonVariants({ variant, size, className }))}
        {...(props as any)}
        disabled={isDisabled}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            {loadingText || children}
          </span>
        ) : (
          children
        )}
      </Slot>
    );
  }

  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={isDisabled}
      {...props}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {loading && loadingText ? loadingText : children}
    </button>
  );
}

export { Button, buttonVariants };
