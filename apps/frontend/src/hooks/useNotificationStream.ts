"use client";

/**
 * useNotificationStream
 *
 * Subscribes to /api/notifications/stream (SSE) and dispatches a callback
 * for each `notification.created` event. Reconnects with exponential backoff
 * (1s, 2s, 4s, max 30s) on disconnect.
 *
 * SINGLETON: the module keeps ONE shared EventSource per token with a
 * refcount. Previously every consumer (layout provider, both NotificationBell
 * instances, the notifications center page) opened its own connection —
 * up to 4 per tab against a backend cap of 5 per user. Now all consumers
 * attach to the same stream; RTK invalidation + toast fire once per event.
 *
 * EventSource does not support custom headers, so we send the JWT in a
 * query parameter. The backend reads it from req.query.token first, falling
 * back to the Authorization header (handled in sse.controller.ts).
 */

import { useEffect, useRef } from "react";
import { getApiBaseUrl } from "@/lib/apiUrl";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import type { RootState } from "@/redux/store";
import { apiSlice } from "@/redux/api/apiSlice";
import { notificationApi } from "@/redux/api/notificationApi";
import { showSuccessToast } from "@/components/providers/ToastProvider";
import type { AppNotification } from "@/redux/api/notificationApi";

export interface SseNotificationEvent {
  id: string;
  type: "notification.created";
  data: AppNotification;
}

export interface UseNotificationStreamOptions {
  onEvent?: (event: SseNotificationEvent) => void;
  enabled?: boolean;
}

// ---------------------------------------------------------------------------
// Module-level shared connection state.
// ---------------------------------------------------------------------------
let _activeSource: EventSource | null = null;
let _activeToken: string | null = null;
let _refCount = 0;
const _listeners = new Set<(event: SseNotificationEvent) => void>();
let _reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let _retryDelay = 1000;
const MAX_RETRY_DELAY = 30000;
let _generation = 0; // bumped on close, so stale callbacks bail out

let _dispatchRef: ((action: unknown) => void) | null = null;

const scheduleReconnect = () => {
  if (_reconnectTimer) clearTimeout(_reconnectTimer);
  _reconnectTimer = setTimeout(() => {
    _retryDelay = Math.min(_retryDelay * 2, MAX_RETRY_DELAY);
    ensureConnection();
  }, _retryDelay);
};

const ensureConnection = () => {
  const gen = _generation;
  const token = _activeToken;
  if (!token || _refCount <= 0) return;
  if (_activeSource) return; // already connected for this token

  const base = getApiBaseUrl();
  const url = `${base}/notifications/stream?token=${encodeURIComponent(token)}`;

  let es: EventSource;
  try {
    es = new EventSource(url, { withCredentials: false });
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[SSE] Failed to construct EventSource:", err);
    }
    scheduleReconnect();
    return;
  }

  _activeSource = es;

  es.addEventListener("connected", () => {
    _retryDelay = 1000;
  });

  es.addEventListener("notification.created", (ev) => {
    if (gen !== _generation) return;
    try {
      const data = JSON.parse((ev as MessageEvent).data);
      // Invalidate RTK cache so lists refetch
      _dispatchRef?.(notificationApi.util.invalidateTags(["Notification"]));
      _dispatchRef?.(apiSlice.util.invalidateTags([{ type: "Notification", id: "UNREAD_COUNT" }]));
      // Show toast
      showSuccessToast(data.title ?? "New notification", data.message);
      // Forward to all registered consumers
      const event: SseNotificationEvent = {
        id: (ev as MessageEvent).lastEventId || data.id,
        type: "notification.created",
        data,
      };
      _listeners.forEach((listener) => listener(event));
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[SSE] Bad event payload:", err);
      }
    }
  });

  es.onerror = () => {
    if (_activeSource === es) {
      _activeSource.close();
      _activeSource = null;
    }
    scheduleReconnect();
  };
};

const teardownConnection = () => {
  _generation += 1;
  if (_reconnectTimer) {
    clearTimeout(_reconnectTimer);
    _reconnectTimer = null;
  }
  if (_activeSource) {
    try {
      _activeSource.close();
    } catch {
      // best-effort close
    }
    _activeSource = null;
  }
  _activeToken = null;
};

/**
 * Force-close the active notification SSE connection, if any.
 * Safe to call from signout() — handles the no-stream case.
 */
export function closeNotificationStream(): void {
  teardownConnection();
}

export function useNotificationStream(
  options: UseNotificationStreamOptions = {}
) {
  const { onEvent, enabled = true } = options;
  const accessToken = useSelector(
    (s: RootState) => s.auth.accessToken
  );
  const dispatch = useDispatch();
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  // Register the dispatch handle once so the shared stream can invalidate.
  useEffect(() => {
    _dispatchRef = dispatch as unknown as (action: unknown) => void;
  }, [dispatch]);

  useEffect(() => {
    if (!enabled || !accessToken) return;
    if (onEventRef.current) {
      _listeners.add(onEventRef.current);
    }
    _refCount += 1;

    // Token changed (e.g. re-login)? Rebuild the connection.
    if (_activeToken && _activeToken !== accessToken) {
      teardownConnection();
    }
    _activeToken = accessToken;
    ensureConnection();

    return () => {
      if (onEventRef.current) {
        _listeners.delete(onEventRef.current);
      }
      _refCount = Math.max(0, _refCount - 1);
      if (_refCount === 0) {
        teardownConnection();
      }
    };
  }, [accessToken, enabled]);

  return null;
}

export default useNotificationStream;
