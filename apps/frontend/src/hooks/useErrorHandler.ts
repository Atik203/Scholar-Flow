import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useEffect } from "react";
import {
  getErrorDetails,
  getErrorMessage,
  shouldRetryRequest,
  showApiErrorToast,
} from "../lib/errorHandling";

export interface UseErrorHandlerOptions {
  showToast?: boolean;
  logError?: boolean;
  onError?: (error: FetchBaseQueryError | SerializedError) => void;
  retryCallback?: () => void;
}

/**
 * Custom hook to handle RTK Query errors consistently
 */
export const useErrorHandler = (
  error: FetchBaseQueryError | SerializedError | undefined,
  options: UseErrorHandlerOptions = {}
) => {
  const { showToast = true, logError = true, onError, retryCallback } = options;

  useEffect(() => {
    if (!error) return;

    // Log error details in development
    if (logError && process.env.NODE_ENV === "development") {
      console.error("API Error Details:", getErrorDetails(error));
    }

    // Show toast notification
    if (showToast) {
      showApiErrorToast(error);
    }

    // Call custom error handler
    if (onError) {
      onError(error);
    }

    // Auto-retry if applicable and retry callback is provided
    if (shouldRetryRequest(error) && retryCallback) {
      const retryDelay = 1000; // 1 second delay
      setTimeout(() => {
        retryCallback();
      }, retryDelay);
    }
  }, [error, showToast, logError, onError, retryCallback]);

  return {
    errorMessage: getErrorMessage(error),
    errorDetails: getErrorDetails(error),
    shouldRetry: shouldRetryRequest(error),
  };
};

/**
 * Hook specifically for handling mutation errors with retry capability
 */
export const useMutationErrorHandler = <T = unknown>(
  mutationResult: {
    error?: FetchBaseQueryError | SerializedError;
    isLoading: boolean;
    isError: boolean;
    reset: () => void;
  },
  retryMutation?: () => Promise<T>,
  options: UseErrorHandlerOptions = {}
) => {
  const errorHandler = useErrorHandler(mutationResult.error, {
    ...options,
    retryCallback: retryMutation
      ? () => {
          mutationResult.reset();
          retryMutation();
        }
      : undefined,
  });

  return {
    ...errorHandler,
    retry: retryMutation
      ? async () => {
          mutationResult.reset();
          return await retryMutation();
        }
      : undefined,
    isRetryable: shouldRetryRequest(mutationResult.error),
  };
};

/**
 * Hook specifically for handling query errors with refetch capability
 */
export const useQueryErrorHandler = (
  queryResult: {
    error?: FetchBaseQueryError | SerializedError;
    isLoading: boolean;
    isError: boolean;
    refetch: () => void;
  },
  options: UseErrorHandlerOptions = {}
) => {
  const errorHandler = useErrorHandler(queryResult.error, {
    ...options,
    retryCallback: queryResult.refetch,
  });

  return {
    ...errorHandler,
    retry: queryResult.refetch,
    isRetryable: shouldRetryRequest(queryResult.error),
  };
};
