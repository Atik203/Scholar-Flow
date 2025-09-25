import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export interface ApiErrorResponse {
  success: false;
  message: string;
  statusCode: number;
  errorCode?: string;
  details?: Record<string, any>;
  timestamp?: string;
}

// Type guard to check if an error is a FetchBaseQueryError
export const isFetchBaseQueryError = (
  error: unknown
): error is FetchBaseQueryError => {
  return typeof error === "object" && error !== null && "status" in error;
};

// Type guard to check if an error is a SerializedError
export const isSerializedError = (error: unknown): error is SerializedError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    !("status" in error)
  );
};

// Extract error message from RTK Query error
export const getErrorMessage = (
  error: FetchBaseQueryError | SerializedError | undefined
): string => {
  if (!error) return "An unknown error occurred";

  if (isFetchBaseQueryError(error)) {
    // Check if it's our API error format
    if ("data" in error && error.data) {
      const apiError = error.data as ApiErrorResponse;
      return apiError.message || `Request failed with status ${error.status}`;
    }

    // Handle specific status codes
    switch (error.status) {
      case 400:
        return "Invalid request. Please check your input and try again.";
      case 401:
        return "Authentication required. Please sign in and try again.";
      case 403:
        return "You do not have permission to perform this action.";
      case 404:
        return "The requested resource was not found.";
      case 409:
        return "A conflict occurred. The resource may already exist.";
      case 413:
        return "File too large. Please select a smaller file.";
      case 429:
        return "Too many requests. Please wait a moment and try again.";
      case 500:
        return "Server error. Please try again later.";
      case 503:
        return "Service temporarily unavailable. Please try again later.";
      case "FETCH_ERROR":
        return "Network error. Please check your connection and try again.";
      case "TIMEOUT_ERROR":
        return "Request timed out. Please try again.";
      case "PARSING_ERROR":
        return "Invalid server response. Please try again.";
      default:
        return `Request failed with status ${error.status}`;
    }
  }

  if (isSerializedError(error)) {
    return error.message || "An error occurred";
  }

  return "An unknown error occurred";
};

// Get error details for debugging
export const getErrorDetails = (
  error: FetchBaseQueryError | SerializedError | undefined
) => {
  if (!error) return null;

  if (isFetchBaseQueryError(error)) {
    if ("data" in error && error.data) {
      const apiError = error.data as ApiErrorResponse;
      return {
        statusCode: error.status,
        errorCode: apiError.errorCode,
        message: apiError.message,
        details: apiError.details,
        timestamp: apiError.timestamp,
      };
    }

    return {
      statusCode: error.status,
      message: getErrorMessage(error),
    };
  }

  if (isSerializedError(error)) {
    return {
      message: error.message,
      code: error.code,
      name: error.name,
      stack: error.stack,
    };
  }

  return null;
};

// Show error toast notification
export const showApiErrorToast = (
  error: FetchBaseQueryError | SerializedError | undefined,
  fallbackMessage?: string
) => {
  const message =
    getErrorMessage(error) || fallbackMessage || "Something went wrong";

  // Only show toast if it's not a network error that might be retried
  if (
    isFetchBaseQueryError(error) &&
    (error.status === "FETCH_ERROR" || error.status === 0)
  ) {
    // Don't show toast for network errors during retries
    return;
  }

  // Import the toast function dynamically to avoid circular dependency
  import("@/components/providers/ToastProvider").then(({ showErrorToast }) => {
    showErrorToast(message);
  });
};

// Retry utilities
export const shouldRetryRequest = (
  error: FetchBaseQueryError | SerializedError | undefined
): boolean => {
  if (!error) return false;

  if (isFetchBaseQueryError(error)) {
    const status = error.status;
    // Retry on server errors (5xx) or network errors
    return (
      (typeof status === "number" && (status >= 500 || status === 0)) ||
      status === "FETCH_ERROR" ||
      status === "TIMEOUT_ERROR"
    );
  }

  return false;
};

// Custom error class for application errors
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorCode?: string;
  public readonly details?: Record<string, any>;

  constructor(
    message: string,
    statusCode: number = 500,
    errorCode?: string,
    details?: Record<string, any>
  ) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
  }
}
