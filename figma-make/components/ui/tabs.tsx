/**
 * Tabs Components
 * Matches frontend/src/components/ui/tabs.tsx
 */

import { useState } from "react";

export interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({
  defaultValue,
  value: controlledValue,
  onValueChange,
  children,
  className = "",
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue || "");
  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const handleValueChange = (newValue: string) => {
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  };

  return (
    <div className={className} data-value={value}>
      {typeof children === "function"
        ? children({ value, onValueChange: handleValueChange })
        : children}
    </div>
  );
}

export interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

export function TabsList({ children, className = "" }: TabsListProps) {
  return (
    <div
      className={`inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground ${className}`}
    >
      {children}
    </div>
  );
}

export interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  isActive?: boolean;
  onClick?: () => void;
}

export function TabsTrigger({
  value,
  children,
  className = "",
  disabled = false,
  isActive = false,
  onClick,
}: TabsTriggerProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
        isActive
          ? "bg-background text-foreground shadow-sm"
          : "hover:bg-background/50"
      } ${className}`}
      data-value={value}
    >
      {children}
    </button>
  );
}

export interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  isActive?: boolean;
}

export function TabsContent({
  value,
  children,
  className = "",
  isActive = false,
}: TabsContentProps) {
  if (!isActive) return null;

  return (
    <div
      className={`mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className}`}
      data-value={value}
    >
      {children}
    </div>
  );
}
