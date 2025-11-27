import { ArrowRight } from "lucide-react";
import { cardVariants, type CardVariants } from "../card-variants";

/**
 * FeatureCard - Card component for displaying features
 * Matches frontend/src/components/ui/cards/FeatureCard.tsx
 */

export interface FeatureCardProps extends CardVariants {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  loading?: boolean;
  iconPosition?: "top" | "left";
  showArrow?: boolean;
  className?: string;
  iconColor?: string;
}

export function FeatureCard({
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
  iconColor = "primary",
}: FeatureCardProps) {
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

  const currentSize = (size as "sm" | "md" | "lg") || "md";
  const sizeConfig = textSizes[currentSize] || textSizes.md;
  const isTopIcon = iconPosition === "top";

  if (loading) {
    return (
      <div
        className={`${cardVariants({ variant, padding, hover, size })} ${sizeClasses[currentSize]} ${className || ""}`}
      >
        <div className="animate-pulse">
          <div className={`bg-muted rounded ${iconSizes[currentSize]} mb-4`} />
          <div className="h-5 bg-muted rounded w-3/4 mb-2" />
          <div className="h-4 bg-muted rounded w-full" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${cardVariants({ variant, padding, hover, size })} ${sizeClasses[currentSize]} ${onClick ? "cursor-pointer group" : ""} ${className || ""}`}
      onClick={onClick}
    >
      <div
        className={`flex ${
          isTopIcon
            ? "flex-col items-center text-center"
            : "flex-row items-start gap-4"
        }`}
      >
        {/* Icon */}
        <div className={`flex-shrink-0 ${isTopIcon ? "mb-4" : "mt-1"}`}>
          <div className={`p-3 rounded-lg bg-${iconColor}/10`}>
            <Icon
              className={`text-${iconColor} ${iconSizes[currentSize]} ${
                onClick
                  ? "group-hover:scale-110 transition-transform duration-300"
                  : ""
              }`}
            />
          </div>
        </div>

        {/* Content */}
        <div className={`flex-1 ${isTopIcon ? "text-center" : "min-w-0"}`}>
          <h3
            className={`font-semibold text-foreground mb-2 ${sizeConfig.title}`}
          >
            {title}
          </h3>

          <p
            className={`text-muted-foreground leading-relaxed ${sizeConfig.description}`}
          >
            {description}
          </p>

          {/* Arrow indicator */}
          {showArrow && onClick && (
            <div
              className={`mt-4 transition-transform duration-300 ${
                isTopIcon ? "mx-auto" : ""
              } group-hover:translate-x-1`}
            >
              <ArrowRight className="h-4 w-4 text-primary" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
