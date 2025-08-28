import * as React from "react";
import { cn } from "@/lib/utils";
import { Slider } from "../../ui/slider";

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
  const formatValue = (val: number) => {
    if (valueFormat) return valueFormat(val);
    return val.toString();
  };

  const displayValue = value.length === 1 
    ? formatValue(value[0])
    : `${formatValue(value[0])} - ${formatValue(value[value.length - 1])}`;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        {label && (
          <label className="text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        
        {showValue && (
          <span className="text-sm text-muted-foreground font-mono">
            {displayValue}
          </span>
        )}
      </div>
      
      <Slider
        value={value}
        onValueChange={onValueChange}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className={cn(
          "w-full",
          error && "border-destructive"
        )}
      />
      
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{formatValue(min)}</span>
        <span>{formatValue(max)}</span>
      </div>
      
      {helperText && !error && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
      
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
};
