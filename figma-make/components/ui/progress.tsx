/**
 * Progress Component
 * Matches frontend/src/components/ui/progress.tsx
 */

export interface ProgressProps {
  value?: number;
  max?: number;
  className?: string;
  indicatorClassName?: string;
}

export function Progress({
  value = 0,
  max = 100,
  className = "",
  indicatorClassName = "",
}: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div
      className={`relative h-4 w-full overflow-hidden rounded-full bg-secondary ${className}`}
    >
      <div
        className={`h-full bg-primary transition-all ${indicatorClassName}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
