"use client";

import * as React from "react";

// Utility function for class names
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

interface SliderProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange"
  > {
  value?: number[];
  onValueChange?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      className,
      value = [0],
      onValueChange,
      min = 0,
      max = 100,
      step = 1,
      disabled,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(value[0]);
    const currentValue = value[0] ?? internalValue;
    const percentage = ((currentValue - min) / (max - min)) * 100;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(e.target.value);
      setInternalValue(newValue);
      onValueChange?.([newValue]);
    };

    return (
      <div
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          className
        )}
      >
        {/* Track */}
        <div className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
          {/* Range */}
          <div
            className="absolute h-full bg-primary transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Hidden native input for accessibility */}
        <input
          ref={ref}
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentValue}
          onChange={handleChange}
          disabled={disabled}
          className={cn(
            "absolute inset-0 h-full w-full cursor-pointer opacity-0",
            disabled && "cursor-not-allowed"
          )}
          {...props}
        />

        {/* Thumb (visual only) */}
        <div
          className={cn(
            "absolute block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            disabled && "pointer-events-none opacity-50"
          )}
          style={{ left: `calc(${percentage}% - 10px)` }}
        />
      </div>
    );
  }
);
Slider.displayName = "Slider";

export { Slider };
