"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-[50vh] p-6">
      <div className="text-center space-y-5 max-w-md">
        <div className="h-14 w-14 mx-auto rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center">
          <AlertCircle className="h-7 w-7 text-destructive" />
        </div>
        <div>
          <h2 className="text-lg font-bold">Dashboard Error</h2>
          <p className="text-sm text-muted-foreground mt-1">
            An error occurred while loading this page. Please try again.
          </p>
          {error.digest && (
            <p className="text-xs text-muted-foreground font-mono bg-muted/50 px-2 py-1 rounded mt-2 inline-block">
              ID: {error.digest}
            </p>
          )}
        </div>
        <div className="flex gap-3 justify-center">
          <Button onClick={reset} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-1.5" /> Retry
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-1.5" /> Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
