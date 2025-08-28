import { cn } from "@/lib/utils";
import * as React from "react";

export interface FloatingInputProps extends React.ComponentProps<"input"> {
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

  return (
    <div className="relative">
      <input
        ref={ref}
        id={inputId}
        className={cn(
          "peer w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-3 text-foreground placeholder-transparent focus:border-primary focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-destructive focus:border-destructive",
          className
        )}
        placeholder={label}
        {...props}
      />
      <label
        htmlFor={inputId}
        className={cn(
          "absolute left-0 -top-3.5 text-sm text-muted-foreground transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-primary",
          error && "peer-focus:text-destructive",
          required && "after:content-['*'] after:ml-1 after:text-destructive"
        )}
      >
        {label}
      </label>
      {helperText && (
        <p
          className={cn(
            "mt-1 text-xs text-muted-foreground",
            error && "text-destructive"
          )}
        >
          {helperText}
        </p>
      )}
    </div>
  );
});

FloatingInput.displayName = "FloatingInput";
