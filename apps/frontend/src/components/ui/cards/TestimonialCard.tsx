import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import * as React from "react";
import { cardVariants, type CardVariantsProps } from "../card-variants";

export interface TestimonialCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    CardVariantsProps {
  author: {
    name: string;
    role?: string;
    company?: string;
    avatar?: string;
  };
  content: string;
  rating: number;
  date?: string;
  verified?: boolean;
}

export const TestimonialCard = React.forwardRef<
  HTMLDivElement,
  TestimonialCardProps
>(
  (
    {
      className,
      author,
      content,
      rating,
      date,
      verified = false,
      variant = "default",
      padding = "md",
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
        content: "text-sm",
        author: "text-sm",
        role: "text-xs",
      },
      md: {
        content: "text-base",
        author: "text-base",
        role: "text-sm",
      },
      lg: {
        content: "text-lg",
        author: "text-lg",
        role: "text-base",
      },
    };

    const renderStars = (rating: number) => {
      return Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            "h-4 w-4",
            i < rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200"
          )}
        />
      ));
    };

    return (
      <div
        ref={ref}
        className={cn(
          cardVariants({ variant, padding, hover }),
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {/* Rating */}
        <div className="flex items-center gap-1 mb-4">
          {renderStars(rating)}
          <span className="ml-2 text-sm text-muted-foreground">{rating}/5</span>
        </div>

        {/* Content */}
        <blockquote className={cn("mb-6", textSizes[size].content)}>
          "{content}"
        </blockquote>

        {/* Author Info */}
        <div className="flex items-center gap-3">
          {author.avatar ? (
            <img
              src={author.avatar}
              alt={author.name}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-semibold text-primary">
                {author.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <cite
                className={cn(
                  "font-semibold not-italic",
                  textSizes[size].author
                )}
              >
                {author.name}
              </cite>
              {verified && (
                <div className="h-4 w-4 rounded-full bg-blue-500 flex items-center justify-center">
                  <svg
                    className="h-2.5 w-2.5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>

            {(author.role || author.company) && (
              <p className={cn("text-muted-foreground", textSizes[size].role)}>
                {author.role}
                {author.role && author.company && " at "}
                {author.company}
              </p>
            )}

            {date && (
              <p className={cn("text-muted-foreground", textSizes[size].role)}>
                {date}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }
);

TestimonialCard.displayName = "TestimonialCard";
