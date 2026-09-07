import {
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query";
import type { RootState } from "../store";
import { API_BASE_URL } from "@/lib/apiUrl";

// ---------------------------------------------------------------------------
// Session-expiry handling.
//
// The backend issues JWTs with a 7-day lifetime and signs them with
// NEXTAUTH_SECRET. When that token expires (or the secret rotates), every
// request returns 401 "Invalid or expired token". redux-persist rehydrates
// the stale token on reload, so without a global handler the app keeps 401ing
// forever and every authenticated feature (workspaces, collections, adding
// papers) silently breaks. We clear auth state once per client session and
// hard-redirect to /login so the user can re-authenticate cleanly.
// ---------------------------------------------------------------------------
let sessionExpiryRedirected = false;

async function handleSessionExpired(): Promise<void> {
  if (sessionExpiryRedirected || typeof window === "undefined") return;
  sessionExpiryRedirected = true;
  try {
    // Reuse the canonical 7-step signout: reset RTK cache, purge persisted
    // state, clear credentials + cookies, close the SSE stream, then
    // window.location.href to /login.
    const { handleSignOut } = await import("@/lib/auth/signout");
    await handleSignOut("/login");
  } catch {
    // Last-resort fallback: clear in-memory auth and force a fresh login page.
    // Cannot throw here — a 401 handler must never break the request cycle.
    try {
      const { resetAppState } = await import("@/redux/storeAccess");
      resetAppState();
    } catch {
      // best-effort only
    }
    if (typeof window !== "undefined") {
      window.location.replace("/login");
    }
  }
}

type ApiBaseQuery = BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  {},
  FetchBaseQueryMeta
>;

const baseQueryWithAuth: ApiBaseQuery = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  // A 401 while a bearer token is attached means the persisted accessToken is
  // invalid or expired. Trigger a single session-expiry flow. Requests sent
  // without a token (e.g. login/registration, public endpoints) are ignored —
  // their 401 is an ordinary auth failure, not a stale persisted session.
  if (result.error && result.error.status === 401) {
    const state = api.getState() as RootState;
    if (state?.auth?.accessToken) {
      void handleSessionExpired();
    }
  }

  return result;
};

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
  baseQuery: baseQueryWithAuth,
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
    "UserSessions",
    "TwoFactor",
    "PrivacySettings",
    "SearchHistory",
    "Recommendation",
    "Import",
    "Notebook",
    "NotebookSection",
    "Discussion",
    "PaperShare",
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
