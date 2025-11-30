"use client";

import { motion } from "motion/react";
import React from "react";

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

// ============================================================================
// Slider Field (Slider with Label and Value Display)
// ============================================================================
export interface SliderFieldProps {
  value: number[];
  onValueChange: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  showValue?: boolean;
  valueFormat?: (value: number) => string;
  className?: string;
}

export const SliderField: React.FC<SliderFieldProps> = ({
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  helperText,
  error,
  disabled = false,
  showValue = true,
  valueFormat,
  className,
}) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const trackRef = React.useRef<HTMLDivElement>(null);

  const formatValue = (val: number) => {
    if (valueFormat) return valueFormat(val);
    return val.toString();
  };

  const displayValue =
    value.length === 1
      ? formatValue(value[0])
      : `${formatValue(value[0])} - ${formatValue(value[value.length - 1])}`;

  const getPercentage = (val: number) => {
    return ((val - min) / (max - min)) * 100;
  };

  const getValueFromPosition = (clientX: number) => {
    if (!trackRef.current) return value[0];

    const rect = trackRef.current.getBoundingClientRect();
    const percentage = Math.max(
      0,
      Math.min(100, ((clientX - rect.left) / rect.width) * 100)
    );
    const rawValue = (percentage / 100) * (max - min) + min;
    const steppedValue = Math.round(rawValue / step) * step;
    return Math.max(min, Math.min(max, steppedValue));
  };

  const handleTrackClick = (e: React.MouseEvent) => {
    if (disabled) return;
    const newValue = getValueFromPosition(e.clientX);
    onValueChange([newValue]);
  };

  const handleMouseDown = (e: React.MouseEvent, thumbIndex: number) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragging(true);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const newValue = getValueFromPosition(moveEvent.clientX);
      const newValues = [...value];
      newValues[thumbIndex] = newValue;

      // Sort values if there are multiple thumbs
      if (newValues.length > 1) {
        newValues.sort((a, b) => a - b);
      }

      onValueChange(newValues);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const percentage0 = getPercentage(value[0]);
  const percentage1 = value.length > 1 ? getPercentage(value[1]) : percentage0;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        {label && (
          <label className="text-sm font-medium text-foreground">{label}</label>
        )}

        {showValue && (
          <motion.span
            key={displayValue}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-muted-foreground font-mono"
          >
            {displayValue}
          </motion.span>
        )}
      </div>

      {/* Slider Track */}
      <div
        ref={trackRef}
        onClick={handleTrackClick}
        className={cn(
          "relative h-2 w-full rounded-full bg-secondary cursor-pointer",
          disabled && "opacity-50 cursor-not-allowed",
          error && "ring-2 ring-destructive ring-offset-2"
        )}
      >
        {/* Filled Range */}
        <motion.div
          initial={false}
          animate={{
            left: value.length > 1 ? `${percentage0}%` : "0%",
            right: `${100 - percentage1}%`,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute h-full bg-primary rounded-full"
        />

        {/* Thumb(s) */}
        {value.map((val, index) => (
          <motion.div
            key={index}
            initial={false}
            animate={{ left: `${getPercentage(val)}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onMouseDown={(e) => handleMouseDown(e, index)}
            className={cn(
              "absolute top-1/2 -translate-x-1/2 -translate-y-1/2",
              "h-5 w-5 rounded-full",
              "bg-background border-2 border-primary",
              "shadow-md cursor-grab",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              "hover:scale-110 transition-transform",
              isDragging && "cursor-grabbing scale-110",
              disabled && "cursor-not-allowed"
            )}
          >
            {/* Inner dot */}
            <motion.div
              animate={{ scale: isDragging ? 1.2 : 1 }}
              className="absolute inset-1 rounded-full bg-primary"
            />
          </motion.div>
        ))}
      </div>

      {/* Min/Max Labels */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{formatValue(min)}</span>
        <span>{formatValue(max)}</span>
      </div>

      {helperText && !error && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};

export default SliderField;
