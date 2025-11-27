import { Check, X } from "lucide-react";
import { Button } from "../button";
import { cardVariants, type CardVariants } from "../card-variants";

/**
 * PricingCard - Card component for pricing plans
 * Matches frontend/src/components/ui/cards/PricingCard.tsx
 */

export interface PricingCardProps extends CardVariants {
  title: string;
  description: string;
  price: {
    amount: number | string;
    currency?: string;
    period?: string;
    originalPrice?: number;
  };
  features: string[];
  limitations?: string[];
  popular?: boolean;
  ctaText?: string;
  ctaVariant?: "default" | "outline" | "secondary" | "destructive" | "ghost";
  onCtaClick?: () => void;
  loading?: boolean;
  className?: string;
}

export function PricingCard({
  className,
  title,
  description,
  price,
  features,
  limitations = [],
  popular = false,
  ctaText = "Get Started",
  ctaVariant = "default",
  onCtaClick,
  loading = false,
  variant = "default",
  padding = "lg",
  hover = "lift",
  size = "md",
}: PricingCardProps) {
  const textSizes = {
    sm: {
      title: "text-lg",
      description: "text-sm",
      price: "text-2xl",
      features: "text-sm",
    },
    md: {
      title: "text-xl",
      description: "text-base",
      price: "text-3xl",
      features: "text-sm",
    },
    lg: {
      title: "text-2xl",
      description: "text-lg",
      price: "text-4xl",
      features: "text-base",
    },
    xl: {
      title: "text-3xl",
      description: "text-xl",
      price: "text-5xl",
      features: "text-lg",
    },
    full: {
      title: "text-xl",
      description: "text-base",
      price: "text-3xl",
      features: "text-sm",
    },
  };

  const currentSize = size || "md";
  const sizeConfig =
    textSizes[currentSize as keyof typeof textSizes] || textSizes.md;

  return (
    <div
      className={`${cardVariants({ variant, padding, hover, size })} ${
        popular ? "ring-2 ring-primary/20 scale-105" : ""
      } ${className || ""}`}
    >
      {/* Popular Badge */}
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-primary text-primary-foreground">
            Most Popular
          </span>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h3 className={`font-bold ${sizeConfig.title} mb-2`}>{title}</h3>
        <p className={`text-muted-foreground ${sizeConfig.description}`}>
          {description}
        </p>
      </div>

      {/* Price */}
      <div className="mb-6">
        {price.originalPrice && (
          <span className="text-sm text-muted-foreground line-through mr-2">
            {price.currency || "$"}
            {price.originalPrice}
          </span>
        )}
        <div className="flex items-baseline gap-1">
          <span className={`font-bold ${sizeConfig.price}`}>
            {typeof price.amount === "number"
              ? `${price.currency || "$"}${price.amount}`
              : price.amount}
          </span>
          {price.period && (
            <span className="text-muted-foreground text-sm">
              /{price.period}
            </span>
          )}
        </div>
      </div>

      {/* CTA Button */}
      <Button
        className="w-full mb-6"
        variant={popular ? "default" : ctaVariant}
        onClick={onCtaClick}
        disabled={loading}
      >
        {loading ? "Loading..." : ctaText}
      </Button>

      {/* Features */}
      <div className="space-y-3">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className={sizeConfig.features}>{feature}</span>
          </div>
        ))}

        {/* Limitations */}
        {limitations.map((limitation, index) => (
          <div
            key={`limit-${index}`}
            className="flex items-start gap-3 text-muted-foreground"
          >
            <X className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <span className={sizeConfig.features}>{limitation}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
