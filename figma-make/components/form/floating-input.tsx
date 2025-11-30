"use client";

import { motion } from "motion/react";
import React from "react";

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

// ============================================================================
// Floating Input
// ============================================================================
export interface FloatingInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: boolean;
  helperText?: string;
  required?: boolean;
}

export const FloatingInput = React.forwardRef<
  HTMLInputElement,
  FloatingInputProps
>(({ className, label, error, helperText, required, id, ...props }, ref) => {
  const inputId =
    id || `floating-input-${Math.random().toString(36).substr(2, 9)}`;
  const [isFocused, setIsFocused] = React.useState(false);
  const [hasValue, setHasValue] = React.useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    setHasValue(!!e.target.value);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(!!e.target.value);
    props.onChange?.(e);
  };

  const isFloating = isFocused || hasValue;

  return (
    <div className="relative">
      <input
        ref={ref}
        id={inputId}
        className={cn(
          "peer w-full border-0 border-b-2 border-gray-300 dark:border-gray-600",
          "bg-transparent px-0 py-3 text-foreground",
          "placeholder-transparent focus:border-primary focus:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "transition-colors duration-200",
          error && "border-destructive focus:border-destructive",
          className
        )}
        placeholder={label}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        {...props}
      />
      <motion.label
        htmlFor={inputId}
        initial={false}
        animate={{
          y: isFloating ? -24 : 0,
          scale: isFloating ? 0.85 : 1,
          color: isFloating
            ? error
              ? "var(--destructive)"
              : "var(--primary)"
            : "var(--muted-foreground)",
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={cn(
          "absolute left-0 top-3 origin-left pointer-events-none",
          "text-base transition-all duration-200",
          required && "after:content-['*'] after:ml-1 after:text-destructive"
        )}
      >
        {label}
      </motion.label>
      {helperText && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "mt-1 text-xs text-muted-foreground",
            error && "text-destructive"
          )}
        >
          {helperText}
        </motion.p>
      )}
    </div>
  );
});

FloatingInput.displayName = "FloatingInput";

export default FloatingInput;
