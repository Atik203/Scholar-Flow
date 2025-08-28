import * as React from "react";
import { cn } from "@/lib/utils";
import { Switch } from "../../ui/switch";

export interface ToggleFieldProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const ToggleField: React.FC<ToggleFieldProps> = ({
  checked,
  onCheckedChange,
  label,
  description,
  disabled = false,
  className,
  size = "md",
}) => {
  const sizeClasses = {
    sm: "h-4 w-7",
    md: "h-6 w-11",
    lg: "h-8 w-14",
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <div className={cn("flex items-center space-x-3", className)}>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className={sizeClasses[size]}
      />
      
      <div className="space-y-1">
        {label && (
          <label
            className={cn(
              "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
              textSizes[size]
            )}
          >
            {label}
          </label>
        )}
        
        {description && (
          <p className={cn(
            "text-sm text-muted-foreground",
            textSizes[size]
          )}>
            {description}
          </p>
        )}
      </div>
    </div>
  );
};
