"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function PaperDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to monitoring service in production
    if (process.env.NODE_ENV === "production") {
      console.error("Paper detail page error:", error);
    } else {
      console.error("Paper detail error:", error);
    }
  }, [error]);

  // Hide detailed error in production
  const showDetails = process.env.NODE_ENV !== "production";

  return (
    <div className="flex min-h-[600px] flex-col items-center justify-center space-y-4 p-6">
      <AlertCircle className="h-16 w-16 text-destructive" />
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">
          {showDetails ? "Something went wrong!" : "Unable to load paper"}
        </h2>
        {showDetails && (
          <p className="text-sm text-muted-foreground max-w-md">
            {error.message}
          </p>
        )}
        <p className="text-sm text-muted-foreground">
          The paper you're looking for might not exist or you don't have
          permission to view it.
        </p>
      </div>
      <div className="flex gap-3">
        <Button onClick={reset} variant="default">
          Try again
        </Button>
        <Button asChild variant="outline">
          <Link href="/dashboard/papers">Back to Papers</Link>
        </Button>
      </div>
    </div>
  );
}
