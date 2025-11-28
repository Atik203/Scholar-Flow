"use client";

import { AlertCircle, Home, RefreshCw } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "../components/ui/button";

// ============================================================================
// Types
// ============================================================================
interface ErrorPageProps {
  onNavigate?: (path: string) => void;
  error?: {
    message?: string;
    digest?: string;
  };
  onReset?: () => void;
}

// ============================================================================
// Error Page Component
// ============================================================================
export function ErrorPage({ onNavigate, error, onReset }: ErrorPageProps) {
  const handleReset = () => {
    if (onReset) {
      onReset();
    } else {
      // Default behavior: reload the page
      window.location.reload();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-6 max-w-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
            <div className="h-16 w-16 mx-auto rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <div className="absolute inset-0 h-16 w-16 mx-auto rounded-full bg-gradient-to-r from-destructive/5 via-destructive/10 to-destructive/5 animate-pulse" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-3"
        >
          <h2 className="text-xl font-bold text-foreground">
            Something went wrong
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We're sorry, but something unexpected happened. Please try again or
            return to the home page.
          </p>
          {error?.digest && (
            <p className="text-xs text-muted-foreground/70 font-mono bg-muted/50 px-2 py-1 rounded inline-block">
              Error ID: {error.digest}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Button variant="outline" className="gap-2" onClick={handleReset}>
            <RefreshCw className="h-4 w-4" />
            Try again
          </Button>
          <Button className="gap-2" onClick={() => onNavigate?.("/")}>
            <Home className="h-4 w-4" />
            Go home
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

// ============================================================================
// Global Error Page Component (for root-level errors)
// ============================================================================
interface GlobalErrorPageProps {
  error?: {
    message?: string;
    digest?: string;
  };
  onReset?: () => void;
}

export function GlobalErrorPage({ error, onReset }: GlobalErrorPageProps) {
  const handleReset = () => {
    if (onReset) {
      onReset();
    } else {
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    window.location.href = "/";
  };

  // Determine if we should show detailed error info
  const showDetails = process.env.NODE_ENV !== "production";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="text-center space-y-6 max-w-md p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
            <div className="h-20 w-20 mx-auto rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center">
              <AlertCircle className="h-10 w-10 text-destructive" />
            </div>
            <div className="absolute inset-0 h-20 w-20 mx-auto rounded-full bg-gradient-to-r from-destructive/5 via-destructive/15 to-destructive/5 animate-pulse" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-4"
        >
          <h1 className="text-2xl font-bold">
            {showDetails ? "Application Error" : "Something went wrong"}
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            {showDetails
              ? "Something went wrong with the application. This is likely a temporary issue."
              : "We apologize for the inconvenience. Please try refreshing the page."}
          </p>
          {showDetails && error?.message && (
            <p className="text-xs text-muted-foreground font-mono bg-muted/50 px-3 py-2 rounded">
              {error.message}
            </p>
          )}
          {error?.digest && (
            <p className="text-xs text-muted-foreground/70 font-mono bg-muted/50 px-3 py-2 rounded">
              Error ID: {error.digest}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Button variant="outline" className="gap-2" onClick={handleReset}>
            <RefreshCw className="h-4 w-4" />
            Try again
          </Button>
          <Button className="gap-2" onClick={handleGoHome}>
            <Home className="h-4 w-4" />
            Go home
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
