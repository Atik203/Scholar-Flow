import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import * as React from "react";
import { Button } from "../button";
import { cardVariants, type CardVariantsProps } from "../card-variants";

export interface PricingCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    CardVariantsProps {
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
  ctaVariant?:
    | "default"
    | "outline"
    | "secondary"
    | "destructive"
    | "ghost"
    | "link";
  onCtaClick?: () => void;
  loading?: boolean;
}

export const PricingCard = React.forwardRef<HTMLDivElement, PricingCardProps>(
  (
    {
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
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    };

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
    };

    return (
      <div
        ref={ref}
        className={cn(
          cardVariants({ variant, padding, hover }),
          sizeClasses[size],
          popular && "ring-2 ring-primary/20 scale-105",
          className
        )}
        {...props}
      >
        {/* Popular Badge */}
        {popular && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
              Most Popular
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-6">
          <h3 className={cn("font-bold mb-2", textSizes[size].title)}>
            {title}
          </h3>
          <p
            className={cn("text-muted-foreground", textSizes[size].description)}
          >
            {description}
          </p>
        </div>

        {/* Pricing */}
        <div className="text-center mb-6">
          <div className={cn("font-bold", textSizes[size].price)}>
            {typeof price.amount === "number" ? (
              <>
                {price.currency || "$"}
                {price.amount}
                {price.period && (
                  <span className="text-lg font-normal text-muted-foreground">
                    /{price.period}
                  </span>
                )}
              </>
            ) : (
              price.amount
            )}
          </div>

          {price.originalPrice && typeof price.amount === "number" && (
            <div className="text-sm text-muted-foreground line-through mt-1">
              {price.currency || "$"}
              {price.originalPrice}/{price.period}
            </div>
          )}
        </div>

        {/* Features */}
        <div className="mb-6">
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span
                  className={cn(
                    "text-muted-foreground",
                    textSizes[size].features
                  )}
                >
                  {feature}
                </span>
              </li>
            ))}

            {limitations.map((limitation, index) => (
              <li key={index} className="flex items-start gap-3 opacity-60">
                <X className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <span
                  className={cn(
                    "text-muted-foreground",
                    textSizes[size].features
                  )}
                >
                  {limitation}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA Button */}
        <Button
          className="w-full"
          variant={ctaVariant}
          onClick={onCtaClick}
          loading={loading}
          size={size === "sm" ? "sm" : size === "lg" ? "lg" : "default"}
        >
          {ctaText}
        </Button>
      </div>
    );
  }
);

PricingCard.displayName = "PricingCard";
