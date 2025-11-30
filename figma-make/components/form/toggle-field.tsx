"use client";

import { motion } from "motion/react";
import React from "react";

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

// ============================================================================
// Toggle Field (Switch with Label)
// ============================================================================
export interface ToggleFieldProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeConfig = {
  sm: {
    track: "h-4 w-7",
    thumb: "h-3 w-3",
    translate: "translate-x-3",
    text: "text-sm",
  },
  md: {
    track: "h-6 w-11",
    thumb: "h-5 w-5",
    translate: "translate-x-5",
    text: "text-base",
  },
  lg: {
    track: "h-8 w-14",
    thumb: "h-7 w-7",
    translate: "translate-x-6",
    text: "text-lg",
  },
};

export const ToggleField: React.FC<ToggleFieldProps> = ({
  checked,
  onCheckedChange,
  label,
  description,
  disabled = false,
  className,
  size = "md",
}) => {
  const config = sizeConfig[size];

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onCheckedChange(!checked)}
        className={cn(
          "relative inline-flex shrink-0 cursor-pointer rounded-full",
          "border-2 border-transparent transition-colors duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          config.track,
          checked ? "bg-primary" : "bg-input"
        )}
      >
        <motion.span
          initial={false}
          animate={{
            x: checked ? (size === "sm" ? 12 : size === "md" ? 20 : 24) : 0,
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={cn(
            "pointer-events-none inline-block rounded-full",
            "bg-background shadow-lg ring-0",
            config.thumb
          )}
        />
      </button>

      {(label || description) && (
        <div className="space-y-0.5">
          {label && (
            <label
              className={cn(
                "font-medium leading-none cursor-pointer",
                "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                config.text,
                disabled && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => !disabled && onCheckedChange(!checked)}
            >
              {label}
            </label>
          )}

          {description && (
            <p
              className={cn(
                "text-muted-foreground",
                size === "sm" ? "text-xs" : "text-sm"
              )}
            >
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ToggleField;
