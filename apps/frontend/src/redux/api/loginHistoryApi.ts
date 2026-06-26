import { apiSlice } from "./apiSlice";

export interface LoginHistoryEntry {
  id: string;
  userId: string;
  provider: string;
  ip: string | null;
  userAgent: string | null;
  device: string | null;
  location: string | null;
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
  }),
});

export const { useGetLoginHistoryQuery } = loginHistoryApi;
