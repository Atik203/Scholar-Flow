"use client";

/**
 * NotificationStreamProvider
 *
 * Mounts the SSE connection once for the entire (app) tree. The
 * useNotificationStream hook is also called from NotificationCenterPage
 * and NotificationBell for safety; EventSource is idempotent on the
 * server (capped at MAX_CONNECTIONS_PER_USER).
 */

import { useNotificationStream } from "@/hooks/useNotificationStream";

export function NotificationStreamProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Mounted at the layout level so a single SSE connection is shared.
  useNotificationStream();
  return <>{children}</>;
}

export default NotificationStreamProvider;
