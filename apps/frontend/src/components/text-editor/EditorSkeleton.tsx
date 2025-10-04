"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading skeleton for the TipTap editor
 * Displayed while the heavy TipTap bundle is being loaded
 */
export function EditorSkeleton() {
  return (
    <div className="min-h-screen space-y-6">
      {/* Toolbar skeleton */}
      <Card>
        <CardHeader className="space-y-0 pb-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-9 w-32" /> {/* Back button */}
            <div className="flex gap-2">
              <Skeleton className="h-9 w-24" /> {/* Save button */}
              <Skeleton className="h-9 w-24" /> {/* Export button */}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Toolbar buttons */}
          <div className="flex gap-1 p-2 border-b">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-1 mx-1" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-1 mx-1" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-1 mx-1" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </CardContent>
      </Card>

      {/* Editor content skeleton */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          {/* Title */}
          <Skeleton className="h-8 w-3/4" />

          {/* Paragraphs */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>

          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>

          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
      </Card>

      {/* Metadata skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-28" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
