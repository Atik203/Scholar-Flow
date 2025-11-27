/**
 * Skeleton Component
 * Matches frontend/src/components/ui/skeleton.tsx
 */

export interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return <div className={`animate-pulse rounded-md bg-muted ${className}`} />;
}
