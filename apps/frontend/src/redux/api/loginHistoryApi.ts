import { apiSlice } from "./apiSlice";

export interface LoginHistoryEntry {
  id: string;
  provider: string;
  device: string | null;
  ip: string | null;
  createdAt: string;
}

export interface LoginHistoryResponse {
  success: boolean;
  message: string;
  data: {
    items: LoginHistoryEntry[];
    cursor: string | null;
  };
}

export interface LoginSummary {
  lastLogin: LoginHistoryEntry | null;
  recentLogins: LoginHistoryEntry[];
  totalLogins: number;
}

export interface LoginSummaryResponse {
  success: boolean;
  message: string;
  data: LoginSummary;
}

export const loginHistoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLoginHistory: builder.query<
      LoginHistoryResponse,
      { limit?: number; cursor?: string }
    >({
      query: (params) => ({
        url: "/auth/login-history",
        params,
      }),
      providesTags: (result) =>
        result?.data?.items
          ? [
              ...result.data.items.map(({ id }) => ({
                type: "LoginHistory" as const,
                id,
              })),
              { type: "LoginHistory", id: "LIST" },
            ]
          : [{ type: "LoginHistory", id: "LIST" }],
    }),
    getLoginSummary: builder.query<LoginSummaryResponse, void>({
      query: () => "/auth/login-summary",
      providesTags: [{ type: "LoginHistory", id: "SUMMARY" }],
    }),
  }),
});

export const { useGetLoginHistoryQuery, useGetLoginSummaryQuery } = loginHistoryApi;
