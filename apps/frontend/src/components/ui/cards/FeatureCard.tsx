import { cn } from "@/lib/utils";
import * as React from "react";
import { cardVariants, type CardVariants } from "../card-variants";

export interface FeatureCardProps
  extends Omit<React.ComponentProps<"div">, "onClick">,
    CardVariants {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  loading?: boolean;
  size?: "sm" | "md" | "lg";
  iconPosition?: "top" | "left";
  showArrow?: boolean;
  variant?: "default" | "gradient" | "outline" | "filled";
}

export const FeatureCard = React.forwardRef<HTMLDivElement, FeatureCardProps>(
  (
    {
      className,
      title,
      description,
      icon: Icon,
      onClick,
      loading = false,
      size = "md",
      iconPosition = "top",
      showArrow = false,
      variant = "default",
      padding = "md",
      hover = "lift",
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
        title: "text-base",
        description: "text-sm",
      },
      md: {
        title: "text-lg",
        description: "text-base",
      },
      lg: {
        title: "text-xl",
        description: "text-lg",
      },
    };

    const isTopIcon = iconPosition === "top";
    const isLeftIcon = iconPosition === "left";

    return (
      <div
        ref={ref}
        className={cn(
          cardVariants({ variant, padding, hover }),
          sizeClasses[size],
          onClick && "cursor-pointer group",
          className
        )}
        onClick={onClick}
        {...props}
      >
        <div
          className={cn(
            "flex",
            isTopIcon
              ? "flex-col items-center text-center"
              : "flex-row items-start gap-4"
          )}
        >
          {/* Icon */}
          <div className={cn("flex-shrink-0", isTopIcon ? "mb-4" : "mt-1")}>
            {loading ? (
              <div
                className={cn(
                  "bg-muted animate-pulse rounded",
                  iconSizes[size]
                )}
              />
            ) : (
              <Icon
                className={cn(
                  "text-primary",
                  iconSizes[size],
                  onClick &&
                    "group-hover:scale-110 transition-transform duration-300"
                )}
              />
            )}
          </div>

          {/* Content */}
          <div className={cn("flex-1", isTopIcon ? "text-center" : "min-w-0")}>
            {loading ? (
              <div className="space-y-2">
                <div className="h-5 bg-muted animate-pulse rounded w-3/4 mx-auto" />
                <div className="h-4 bg-muted animate-pulse rounded w-full" />
              </div>
            ) : (
              <>
                <h3
                  className={cn(
                    "font-semibold text-foreground mb-2",
                    textSizes[size].title,
                    isTopIcon ? "mx-auto" : ""
                  )}
                >
                  {title}
                </h3>

                <p
                  className={cn(
                    "text-muted-foreground leading-relaxed",
                    textSizes[size].description
                  )}
                >
                  {description}
                </p>

                {/* Arrow indicator */}
                {showArrow && onClick && (
                  <div
                    className={cn(
                      "mt-4 transition-transform duration-300",
                      isTopIcon ? "mx-auto" : "",
                      "group-hover:translate-x-1"
                    )}
                  >
                    <svg
                      className="h-4 w-4 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
);

FeatureCard.displayName = "FeatureCard";
