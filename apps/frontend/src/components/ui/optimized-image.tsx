import { cn } from "@/lib/utils";
import Image from "next/image";
import * as React from "react";

export interface OptimizedImageProps
  extends Omit<
    React.ComponentProps<typeof Image>,
    "placeholder" | "blurDataURL"
  > {
  fallback?: string;
  showPlaceholder?: boolean;
  aspectRatio?: "square" | "video" | "wide" | "ultrawide";
  priority?: boolean;
}

export const OptimizedImage = React.forwardRef<
  React.ElementRef<typeof Image>,
  OptimizedImageProps
>(
  (
    {
      src,
      alt,
      className,
      fallback = "/placeholder-image.jpg",
      showPlaceholder = true,
      aspectRatio = "square",
      priority = false,
      ...props
    },
    ref
  ) => {
    const [imageSrc, setImageSrc] = React.useState(src);
    const [isLoading, setIsLoading] = React.useState(true);
    const [hasError, setHasError] = React.useState(false);

    const aspectRatioClasses = {
      square: "aspect-square",
      video: "aspect-video",
      wide: "aspect-[16/10]",
      ultrawide: "aspect-[21/9]",
    };

    const generateBlurDataURL = (width: number, height: number) => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.fillStyle = "#f3f4f6";
        ctx.fillRect(0, 0, width, height);

        // Add subtle pattern
        for (let i = 0; i < width; i += 20) {
          for (let j = 0; j < height; j += 20) {
            ctx.fillStyle = "#e5e7eb";
            ctx.fillRect(i, j, 10, 10);
          }
        }
      }

      return canvas.toDataURL();
    };

    const handleError = () => {
      if (fallback && imageSrc !== fallback) {
        setImageSrc(fallback);
        setHasError(true);
      }
    };

    const handleLoad = () => {
      setIsLoading(false);
    };

    return (
      <div
        className={cn(
          "relative overflow-hidden",
          aspectRatioClasses[aspectRatio]
        )}
      >
        <Image
          ref={ref}
          src={imageSrc}
          alt={alt}
          fill
          className={cn(
            "object-cover transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100",
            className
          )}
          placeholder={showPlaceholder ? "blur" : "empty"}
          blurDataURL={
            showPlaceholder ? generateBlurDataURL(400, 400) : undefined
          }
          loading={priority ? "eager" : "lazy"}
          priority={priority}
          onError={handleError}
          onLoad={handleLoad}
          {...props}
        />

        {/* Loading Skeleton */}
        {isLoading && showPlaceholder && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
        )}

        {/* Error Fallback */}
        {hasError && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="mt-2 text-sm">Image unavailable</p>
            </div>
          </div>
        )}
      </div>
    );
  }
);

OptimizedImage.displayName = "OptimizedImage";
