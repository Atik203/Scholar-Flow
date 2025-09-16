import {
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
  retry,
} from "@reduxjs/toolkit/query/react";
import { getSession } from "next-auth/react";

// Enhanced error response interface
export interface ApiErrorResponse {
  success: false;
  message: string;
  statusCode: number;
  errorCode?: string;
  details?: Record<string, any>;
  timestamp?: string;
}

// Custom error transformer
const transformErrorResponse = (
  response: FetchBaseQueryError
): ApiErrorResponse => {
  if ("data" in response && response.data) {
    // Backend API error response
    const apiError = response.data as ApiErrorResponse;
    return {
      success: false,
      message: apiError.message || "An error occurred",
      statusCode: response.status as number,
      errorCode: apiError.errorCode,
      details: apiError.details,
      timestamp: apiError.timestamp || new Date().toISOString(),
    };
  }

  // Network or other errors
  if ("error" in response) {
    return {
      success: false,
      message: response.error,
      statusCode: 0, // Network error
      errorCode: "NETWORK_ERROR",
      timestamp: new Date().toISOString(),
    };
  }

  // Fallback
  return {
    success: false,
    message: `Request failed with status ${response.status}`,
    statusCode: response.status as number,
    errorCode: "UNKNOWN_ERROR",
    timestamp: new Date().toISOString(),
  };
};

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 30000, // 30 second timeout
  prepareHeaders: async (headers) => {
    const session = await getSession();
    const token = (session as { accessToken?: string } | null)?.accessToken;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Enhanced base query with retry logic and error handling
const baseQueryWithRetry = retry(baseQuery, {
  maxRetries: 3,
});

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithRetry,
  tagTypes: ["Paper", "Collection", "Workspace", "User", "Annotation"],
  endpoints: () => ({}),
});
