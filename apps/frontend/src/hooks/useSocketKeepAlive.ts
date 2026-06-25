"use client";

import { useEffect, useRef } from "react";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:5001";
const PING_INTERVAL_MS = 4 * 60 * 1000; // 4 minutes — well within Render's 15min idle window

/**
 * Pings the socket server's HTTP /health endpoint on an interval
 * to prevent Render's free tier from spinning the server down after 15min of inactivity.
 *
 * Also fires once immediately on mount to wake a cold-started instance.
 * Cleans up the interval on unmount.
 */
export function useSocketKeepAlive() {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const ping = () => {
      fetch(`${WS_URL}/health`, { method: "GET", mode: "no-cors" }).catch(() => {
        // Swallow — the ping is fire-and-forget. A failed ping
        // (server still sleeping) is expected; next cycle will retry.
      });
    };

    // Ping immediately to wake a cold instance
    ping();

    // Then keep it warm
    intervalRef.current = setInterval(ping, PING_INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);
}
