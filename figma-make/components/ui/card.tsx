import * as React from "react";

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm transition-all duration-300",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: CardProps) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-[data-slot=card-action]:grid-cols-[1fr_auto]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: CardProps) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardDescription({ className, children, ...props }: CardProps) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardAction({ className, children, ...props }: CardProps) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardContent({ className, children, ...props }: CardProps) {
  return (
    <div data-slot="card-content" className={cn("px-6", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: CardProps) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6", className)}
      {...props}
    >
      {children}
    </div>
  );
}

// CardWithVariants component with advanced hover effects
type CardVariant =
  | "default"
  | "ghost"
  | "elevated"
  | "interactive"
  | "outline"
  | "filled"
  | "gradient";
type CardHover = "none" | "lift" | "scale" | "glow" | "border";
type CardPadding = "none" | "sm" | "md" | "lg";

const cardVariantStyles: Record<CardVariant, string> = {
  default: "bg-card border border-border shadow-sm",
  ghost: "bg-transparent border-none shadow-none",
  elevated: "bg-card border border-border shadow-lg",
  interactive: "bg-card border border-border shadow-sm cursor-pointer",
  outline: "bg-transparent border-2 border-border",
  filled: "bg-muted border-none",
  gradient:
    "bg-gradient-to-b from-primary/5 to-chart-1/5 border border-primary/20",
};

const cardHoverStyles: Record<CardHover, string> = {
  none: "",
  lift: "hover:shadow-xl hover:-translate-y-1 transition-all duration-300",
  scale: "hover:scale-[1.02] transition-transform duration-300",
  glow: "hover:shadow-lg hover:shadow-primary/20 transition-shadow duration-300",
  border: "hover:border-primary/50 transition-colors duration-300",
};

const cardPaddingStyles: Record<CardPadding, string> = {
  none: "p-0",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

interface CardWithVariantsProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  hover?: CardHover;
  padding?: CardPadding;
  children: React.ReactNode;
}

export function CardWithVariants({
  className,
  variant = "default",
  hover = "none",
  padding = "md",
  children,
  ...props
}: CardWithVariantsProps) {
  return (
    <div
      className={cn(
        "rounded-xl text-card-foreground",
        cardVariantStyles[variant],
        cardHoverStyles[hover],
        cardPaddingStyles[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
