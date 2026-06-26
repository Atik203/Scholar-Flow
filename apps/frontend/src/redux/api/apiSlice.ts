import {
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
import { API_BASE_URL } from "@/lib/apiUrl";

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
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState, endpoint }) => {
    // Get token from Redux auth state
    const token = (getState() as RootState).auth.accessToken;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    } else if (process.env.NODE_ENV !== "production") {
      // Dev-only diagnostic: a request fired without a token usually means
      // stale Redux state. Helps track down auth state bugs.
      console.warn(
        `[apiSlice] No accessToken for endpoint: ${String(endpoint)}`
      );
    }

    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: [
    "Paper",
    "Collection",
    "CollectionPaper",
    "CollectionMember",
    "CollectionInvite",
    "Workspace",
    "Team",
    "User",
    "UserPreferences",
    "UserActivity",
    "Annotation",
    "ProcessingStatus",
    "AIInsight",
    "AIProvider",
    "AIProviderConfig",
    "AIChat",
    "Admin",
    "Note",
    "Notification",
    "NotificationSettings",
    "SearchHistory",
    "Recommendation",
    "Import",
    "Notebook",
    "NotebookSection",
    "Discussion",
    "DiscussionMessage",
    "Citation",
    "CitationExport",
    "Analytics",
    "AdminReport",
    "AdminAudit",
    "AdminWebhook",
    "AdminApiKey",
    "AdminModeration",
    "SystemAlert",
    "ActivityLog",
    "LoginHistory",
  ],
  // Performance optimizations
  keepUnusedDataFor: 300, // Keep data for 5 minutes (stable data like user profiles, papers)
  refetchOnMountOrArgChange: 60, // Only refetch if data is older than 1 minute
  refetchOnFocus: false, // Disable expensive refetch on window focus
  refetchOnReconnect: true, // Refetch when internet reconnects
  endpoints: () => ({}),
});
