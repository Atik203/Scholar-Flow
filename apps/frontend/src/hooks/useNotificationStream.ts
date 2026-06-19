"use client";

/**
 * useNotificationStream
 *
 * Subscribes to /api/notifications/stream (SSE) and dispatches a callback
 * for each `notification.created` event. Reconnects with exponential backoff
 * (1s, 2s, 4s, max 30s) on disconnect. Cleans up on unmount.
 *
 * EventSource does not support custom headers, so we send the JWT in a
 * query parameter. The backend reads it from req.query.token first, falling
 * back to the Authorization header (handled in sse.controller.ts).
 */

import { useEffect, useRef } from "react";
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

  useEffect(() => {
    if (!enabled || !accessToken) return;

    let closed = false;
    let retryDelay = 1000;
    const maxDelay = 30000;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let es: EventSource | null = null;

    const connect = () => {
      if (closed) return;
      const base =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";
      const url = `${base}/notifications/stream?token=${encodeURIComponent(
        accessToken
      )}`;

      try {
        es = new EventSource(url, { withCredentials: false });
      } catch (err) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("[SSE] Failed to construct EventSource:", err);
        }
        scheduleReconnect();
        return;
      }

      es.addEventListener("connected", () => {
        retryDelay = 1000;
      });

      es.addEventListener("notification.created", (ev) => {
        try {
          const data = JSON.parse((ev as MessageEvent).data);
          // Invalidate RTK cache so lists refetch
          dispatch(notificationApi.util.invalidateTags(["Notification"]));
          dispatch(apiSlice.util.invalidateTags([{ type: "Notification", id: "UNREAD_COUNT" }]));
          // Show toast
          showSuccessToast(data.title ?? "New notification", data.message);
          // Forward to caller
          if (onEventRef.current) {
            onEventRef.current({
              id: (ev as MessageEvent).lastEventId || data.id,
              type: "notification.created",
              data,
            });
          }
        } catch (err) {
          if (process.env.NODE_ENV !== "production") {
            console.warn("[SSE] Bad event payload:", err);
          }
        }
      });

      es.onerror = () => {
        if (es) {
          es.close();
          es = null;
        }
        scheduleReconnect();
      };
    };

    const scheduleReconnect = () => {
      if (closed) return;
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        retryDelay = Math.min(retryDelay * 2, maxDelay);
        connect();
      }, retryDelay);
    };

    connect();

    return () => {
      closed = true;
      if (timeoutId) clearTimeout(timeoutId);
      if (es) {
        es.close();
        es = null;
      }
    };
  }, [accessToken, enabled, dispatch]);
}

export default useNotificationStream;
