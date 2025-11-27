import { Star } from "lucide-react";
import { cardVariants, type CardVariants } from "../card-variants";

/**
 * TestimonialCard - Card component for displaying testimonials
 * Matches frontend/src/components/ui/cards/TestimonialCard.tsx
 */

export interface TestimonialCardProps extends CardVariants {
  quote: string;
  author: {
    name: string;
    role: string;
    company?: string;
    avatar?: string;
  };
  rating?: number;
  className?: string;
}

export function TestimonialCard({
  className,
  quote,
  author,
  rating = 5,
  variant = "default",
  padding = "lg",
  hover = "lift",
  size = "full",
}: TestimonialCardProps) {
  return (
    <div
      className={`${cardVariants({ variant, padding, hover, size })} ${className || ""}`}
    >
      {/* Rating Stars */}
      {rating > 0 && (
        <div className="flex gap-1 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${
                i < rating
                  ? "text-yellow-500 fill-yellow-500"
                  : "text-muted-foreground"
              }`}
            />
          ))}
        </div>
      )}

      {/* Quote */}
      <blockquote className="text-lg text-foreground leading-relaxed mb-6">
        &ldquo;{quote}&rdquo;
      </blockquote>

      {/* Author */}
      <div className="flex items-center gap-4">
        {author.avatar ? (
          <img
            src={author.avatar}
            alt={author.name}
            className="h-12 w-12 rounded-full object-cover"
          />
        ) : (
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-semibold text-lg">
              {author.name.charAt(0)}
            </span>
          </div>
        )}
        <div>
          <p className="font-semibold text-foreground">{author.name}</p>
          <p className="text-sm text-muted-foreground">
            {author.role}
            {author.company && ` at ${author.company}`}
          </p>
        </div>
      </div>
    </div>
  );
}
