import { cva, type VariantProps } from "class-variance-authority";

/**
 * Card Variants - Configurable card styles using class-variance-authority
 * Matches frontend/src/components/ui/card-variants.tsx
 */

export const cardVariants = cva(
  "rounded-xl border transition-all duration-300",
  {
    variants: {
      variant: {
        default: "border-border bg-card text-card-foreground shadow-sm",
        ghost: "border-transparent hover:border-border bg-transparent",
        elevated:
          "border-border bg-card shadow-lg hover:shadow-xl transition-shadow duration-300",
        interactive:
          "border-border/40 bg-background/60 backdrop-blur-sm hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 cursor-pointer",
        outline: "border-border bg-background hover:bg-accent/50",
        filled: "border-transparent bg-muted/50 hover:bg-muted/80",
        gradient:
          "border-transparent bg-gradient-to-br from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20",
      },
      padding: {
        none: "p-0",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
        xl: "p-10",
      },
      hover: {
        none: "",
        lift: "hover:-translate-y-1 hover:shadow-lg transition-transform duration-300",
        scale: "hover:scale-[1.02] transition-transform duration-300",
        glow: "hover:shadow-lg hover:shadow-primary/20 transition-shadow duration-300",
        border: "hover:border-primary/50 transition-colors duration-300",
      },
      size: {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        full: "w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
      hover: "none",
      size: "full",
    },
  }
);

export type CardVariants = VariantProps<typeof cardVariants>;

// Utility function to apply card variants
export const getCardClasses = (variants: CardVariants, className?: string) => {
  const classes = cardVariants(variants);
  return className ? `${classes} ${className}` : classes;
};

// Predefined card combinations for common use cases
export const cardPresets = {
  // Basic card
  basic: "rounded-xl border bg-card p-6 shadow-sm",

  // Interactive card with hover effects
  interactive:
    "rounded-xl border border-border/40 bg-background/60 backdrop-blur-sm hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer",

  // Elevated card with shadow
  elevated:
    "rounded-xl border border-border bg-card shadow-lg hover:shadow-xl transition-shadow duration-300",

  // Ghost card for subtle interactions
  ghost:
    "rounded-xl border border-transparent hover:border-border bg-transparent hover:bg-accent/50 transition-all duration-300",

  // Gradient card for highlights
  gradient:
    "rounded-xl border border-transparent bg-gradient-to-br from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20 transition-all duration-300",

  // Compact card for lists
  compact: "rounded-xl border bg-card p-4 shadow-sm",

  // Spacious card for content
  spacious: "rounded-xl border bg-card p-8 shadow-sm",
} as const;
