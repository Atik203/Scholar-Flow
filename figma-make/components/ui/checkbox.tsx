/**
 * Checkbox Component
 * Matches frontend/src/components/ui/checkbox.tsx
 */

import { Check } from "lucide-react";

export interface CheckboxProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export function Checkbox({
  checked = false,
  onCheckedChange,
  disabled = false,
  className = "",
  id,
}: CheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      id={id}
      disabled={disabled}
      onClick={() => onCheckedChange?.(!checked)}
      className={`peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
        checked ? "bg-primary text-primary-foreground" : "bg-background"
      } ${className}`}
    >
      {checked && <Check className="h-4 w-4" />}
    </button>
  );
}
