/**
 * Auth-aware fetch helpers.
 *
 * Use these instead of raw `fetch()` from any client component that
 * needs to call the backend with a bearer token. They read the
 * accessToken from the Redux store via the storeAccess module so we
 * don't rely on a window global (which was a previous bug).
 */
import { getAppStore } from "@/redux/storeAccess";

import { API_BASE_URL } from "@/lib/apiUrl";

export interface AuthedFetchOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  signal?: AbortSignal;
}

function getAuthHeader(): Record<string, string> {
  const store = getAppStore();
  const token = store?.getState()?.auth?.accessToken;
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

export async function authedFetch(
  path: string,
  options: AuthedFetchOptions = {}
): Promise<Response> {
  const { body, headers, ...rest } = options;
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
  return fetch(url, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
      ...(headers as Record<string, string> | undefined),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

/**
 * Fetch an SSE stream. Returns the raw Response so the caller can
 * iterate the body via getReader(). Throws on non-2xx.
 */
export async function streamingFetch(
  path: string,
  options: AuthedFetchOptions = {}
): Promise<Response> {
  const res = await authedFetch(path, options);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Stream request failed: ${res.status} ${res.statusText} ${text}`
    );
  }
  if (!res.body) {
    throw new Error("Stream response has no body");
  }
  return res;
}
