"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to monitoring service in production
    if (process.env.NODE_ENV === "production") {
      console.error("Global error:", {
        message: error.message,
        digest: error.digest,
        stack: error.stack,
      });
    } else {
      console.error("Global error:", error);
    }
  }, [error]);

  // Hide detailed error in production
  const showDetails = process.env.NODE_ENV !== "production";

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
          <div className="text-center space-y-6 max-w-md p-6">
            <div className="relative">
              <div className="h-20 w-20 mx-auto rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center">
                <AlertTriangle className="h-10 w-10 text-destructive" />
              </div>
              <div className="absolute inset-0 h-20 w-20 mx-auto rounded-full bg-gradient-to-r from-destructive/5 via-destructive/15 to-destructive/5 animate-pulse" />
            </div>
            <div className="space-y-4">
              <h1 className="text-2xl font-bold">
                {showDetails ? "Application Error" : "Something went wrong"}
              </h1>
              <p className="text-muted-foreground leading-relaxed">
                {showDetails
                  ? "Something went wrong with the application. This is likely a temporary issue."
                  : "We apologize for the inconvenience. Please try refreshing the page."}
              </p>
              {showDetails && error.message && (
                <p className="text-xs text-muted-foreground font-mono bg-muted/50 px-3 py-2 rounded">
                  {error.message}
                </p>
              )}
              {error.digest && (
                <p className="text-xs text-muted-foreground/70 font-mono bg-muted/50 px-3 py-2 rounded">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={reset} variant="outline" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Try again
              </Button>
              <Button
                onClick={() => (window.location.href = "/")}
                className="gap-2"
              >
                <Home className="h-4 w-4" />
                Go home
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
