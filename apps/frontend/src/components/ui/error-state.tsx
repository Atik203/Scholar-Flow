"use client";

import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "./button";

export interface ErrorStateProps {
  title?: string;
  message: string;
  statusCode?: number;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export function ErrorState({
  title,
  message,
  statusCode,
  onRetry,
  retryLabel = "Try again",
  className = "",
}: ErrorStateProps) {
  const displayTitle =
    title || (statusCode ? `Error ${statusCode}` : "Something went wrong");

  return (
    <div
      className={`flex flex-col items-center justify-center py-16 px-4 ${className}`}
    >
      <div className="mb-4 rounded-full bg-destructive/10 p-4">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">
        {displayTitle}
      </h3>
      <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">
        {message}
      </p>
      {onRetry && (
        <Button
          variant="outline"
          onClick={onRetry}
          size="sm"
          className="gap-2"
        >
          <RefreshCcw className="h-4 w-4" />
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
