"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle, Home, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-6 max-w-md">
        <div className="relative">
          <div className="h-16 w-16 mx-auto rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <div className="absolute inset-0 h-16 w-16 mx-auto rounded-full bg-gradient-to-r from-destructive/5 via-destructive/10 to-destructive/5 animate-pulse" />
        </div>
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">
            Something went wrong
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We&apos;re sorry, but something unexpected happened. Please try again or
            return to the home page.
          </p>
          {error.digest && (
            <p className="text-xs text-muted-foreground/70 font-mono bg-muted/50 px-2 py-1 rounded">
              Error ID: {error.digest}
            </p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Try again
          </Button>
          <Button asChild className="gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              Go home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
