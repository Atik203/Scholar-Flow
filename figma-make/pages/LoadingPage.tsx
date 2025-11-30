"use client";

import { motion } from "motion/react";

// ============================================================================
// Types
// ============================================================================
interface LoadingPageProps {
  message?: string;
  description?: string;
}

// ============================================================================
// Loading Page Component
// ============================================================================
export function LoadingPage({
  message = "Loading...",
  description = "Just a moment while we get things ready",
}: LoadingPageProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative">
            <div className="h-12 w-12 mx-auto rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
            <div className="absolute inset-0 h-12 w-12 mx-auto rounded-full bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 animate-pulse" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="space-y-2"
        >
          <h2 className="text-lg font-semibold text-foreground">{message}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </motion.div>
      </div>
    </div>
  );
}

// ============================================================================
// Full Page Loading Component
// ============================================================================
export function FullPageLoading({
  message = "Loading...",
  description = "Just a moment while we get things ready",
}: LoadingPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative">
            <div className="h-16 w-16 mx-auto rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
            <div className="absolute inset-0 h-16 w-16 mx-auto rounded-full bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 animate-pulse" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="space-y-2"
        >
          <h2 className="text-xl font-semibold text-foreground">{message}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </motion.div>
      </div>
    </div>
  );
}

// ============================================================================
// Skeleton Loading Components
// ============================================================================
export function CardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-6 animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        <div className="h-12 w-12 rounded-full bg-muted" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-3 bg-muted rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-muted rounded" />
        <div className="h-3 bg-muted rounded w-5/6" />
        <div className="h-3 bg-muted rounded w-4/6" />
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 py-4 animate-pulse">
      <div className="h-10 w-10 rounded-full bg-muted" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-muted rounded w-1/4" />
        <div className="h-3 bg-muted rounded w-1/6" />
      </div>
      <div className="h-8 w-20 bg-muted rounded" />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 bg-muted rounded w-48" />
          <div className="h-4 bg-muted rounded w-64" />
        </div>
        <div className="h-10 w-32 bg-muted rounded" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl border bg-card p-6">
            <div className="h-4 bg-muted rounded w-1/2 mb-4" />
            <div className="h-8 bg-muted rounded w-3/4 mb-2" />
            <div className="h-3 bg-muted rounded w-1/3" />
          </div>
        ))}
      </div>

      {/* Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border bg-card p-6">
          <div className="h-6 bg-muted rounded w-1/3 mb-6" />
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <TableRowSkeleton key={i} />
            ))}
          </div>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <div className="h-6 bg-muted rounded w-1/3 mb-6" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    </div>
  );
}
