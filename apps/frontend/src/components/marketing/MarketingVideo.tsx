"use client";
import { useReducedMotion } from "framer-motion";
import React from "react";

interface MarketingVideoProps {
  className?: string;
  highSrc: string; // 1280x720
  lowSrc: string; // smaller variant
  poster?: string;
  label?: string; // accessible label if not purely decorative
  priority?: boolean;
}

/**
 * Responsive autoplaying marketing video (decorative by default) that respects
 * `prefers-reduced-motion` and provides a static fallback.
 * Usage: <MarketingVideo highSrc="/work_in_progress_hd.webm" lowSrc="/work_in_progress.webm" />
 */
export const MarketingVideo: React.FC<MarketingVideoProps> = ({
  className = "",
  highSrc,
  lowSrc,
  poster,
  label,
  priority,
}) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div
        className={
          "flex items-center justify-center bg-muted text-xs text-muted-foreground select-none " +
          className
        }
        aria-label={label || undefined}
      >
        Demo preview (motion reduced)
      </div>
    );
  }

  return (
    <video
      className={"w-full h-full object-cover " + className}
      autoPlay
      playsInline
      muted
      loop
      poster={poster}
      aria-label={label}
      {...(priority ? { preload: "auto" } : { preload: "metadata" })}
    >
      {/* Provide smaller source first for mobile via media query */}
      <source src={lowSrc} type="video/webm" media="(max-width: 900px)" />
      <source src={highSrc} type="video/webm" />
      {/* Fallback text */}
      Your browser does not support the video tag.
    </video>
  );
};
