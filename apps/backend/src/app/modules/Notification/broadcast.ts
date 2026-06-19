/**
 * Notification Broadcaster
 *
 * In-process pub/sub for real-time notification delivery to connected SSE clients.
 *
 * For multi-node deployments, replace the EventEmitter with a Redis pub/sub
 * adapter that publishes on the same channel name and subscribes per worker.
 * The public interface (subscribe / unsubscribe / publish) is stable.
 */

import { EventEmitter } from "events";
import type { Response } from "express";

export interface SseEvent<T = unknown> {
  type: string;
  data: T;
  id?: string;
  ts: number;
}

const CHANNEL = "scholarflow:notifications";
const MAX_CONNECTIONS_PER_USER = 5;

class NotificationBroadcaster {
  private readonly emitter = new EventEmitter();
  private readonly connectionsByUser = new Map<string, Set<Response>>();

  constructor() {
    // Avoid memory-leak warnings when many users are connected in dev.
    this.emitter.setMaxListeners(0);
  }

  /**
   * Register an SSE response for a user. Returns an unsubscribe function.
   * Caps simultaneous connections per user to MAX_CONNECTIONS_PER_USER,
   * dropping the oldest connection when the cap is exceeded.
   */
  subscribe(userId: string, res: Response): () => void {
    let connections = this.connectionsByUser.get(userId);
    if (!connections) {
      connections = new Set();
      this.connectionsByUser.set(userId, connections);
    }

    if (connections.size >= MAX_CONNECTIONS_PER_USER) {
      const oldest = connections.values().next().value as Response | undefined;
      if (oldest) {
        try {
          oldest.end();
        } catch {
          // best-effort close
        }
        connections.delete(oldest);
      }
    }

    connections.add(res);

    const localListener = (event: SseEvent) => {
      this.writeEvent(res, event);
    };
    this.emitter.on(CHANNEL, localListener);

    return () => {
      this.emitter.off(CHANNEL, localListener);
      const set = this.connectionsByUser.get(userId);
      if (set) {
        set.delete(res);
        if (set.size === 0) {
          this.connectionsByUser.delete(userId);
        }
      }
    };
  }

  /**
   * Publish an event to all subscribers for the given user.
   */
  publish(userId: string, event: Omit<SseEvent, "ts">): void {
    const payload: SseEvent = { ...event, ts: Date.now() };
    // Emit with a per-user channel suffix so we only wake listeners for that user.
    this.emitter.emit(`${CHANNEL}:${userId}`, payload);
  }

  /**
   * Direct-write an event to a single response in SSE format.
   * Used by the per-user local listener registered in subscribe().
   */
  private writeEvent(res: Response, event: SseEvent): void {
    try {
      const lines: string[] = [];
      if (event.id) lines.push(`id: ${event.id}`);
      lines.push(`event: ${event.type}`);
      lines.push(`data: ${JSON.stringify(event.data)}`);
      lines.push("");
      lines.push("");
      res.write(lines.join("\n"));
    } catch {
      // ignore write errors; the request close handler will clean up
    }
  }
}

export const notificationBroadcaster = new NotificationBroadcaster();
export default notificationBroadcaster;
