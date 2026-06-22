"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import * as Y from "yjs";

const SOCKET_URL = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:5001";

function getAuthToken(): string | null {
  try {
    const store = (window as any).__REDUX_STORE__;
    if (store) return store.getState().auth?.accessToken || null;
  } catch {}
  return null;
}

interface UseCollabSyncOptions {
  paperId: string;
  initialContent: string | null;
  enabled: boolean;
}

interface UseCollabSyncResult {
  ydoc: Y.Doc;
  provider: Socket | null;
}

class SimpleAwareness {
  states = new Map<number, any>();
  private listeners: Array<() => void> = [];
  private localState: any = null;

  setLocalState(state: any) {
    this.localState = state;
  }
  getLocalState() { return this.localState; }
  getStates() { return this.states; }
  on(_event: string, cb: () => void) { this.listeners.push(cb); }
  off(_event: string, _cb: () => void) {
    this.listeners = this.listeners.filter((l) => l !== _cb);
  }
  setLocalStateField(field: string, value: any) {
    if (!this.localState) this.localState = {};
    this.localState[field] = value;
    this.listeners.forEach((l) => l());
  }
}

export function useCollabSync({
  paperId,
  initialContent,
  enabled,
}: UseCollabSyncOptions): UseCollabSyncResult {
  const ydocRef = useRef<Y.Doc>(new Y.Doc());
  const socketRef = useRef<Socket | null>(null);
  const syncedRef = useRef(false);

  useEffect(() => {
    if (!enabled || !paperId) return;

    const token = getAuthToken();
    if (!token) return;

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket"],
    });

    socketRef.current = socket;
    const room = `paper:${paperId}`;
    const ydoc = ydocRef.current;

    socket.on("connect", () => {
      socket.emit("room:join", room);
    });

    // Handle Y.js document updates from peers
    socket.on("editor:update", ({ userId, update }: { userId: string; update: number[] }) => {
      if (userId === socket.id) return;
      const u8 = new Uint8Array(update);
      Y.applyUpdate(ydoc, u8);
    });

    // Handle initial sync
    socket.on("editor:sync-response", ({ update }: { update: number[] }) => {
      if (syncedRef.current) return;
      syncedRef.current = true;
      const u8 = new Uint8Array(update);
      Y.applyUpdate(ydoc, u8);
    });

    socket.on("editor:sync-request", () => {
      const state = Y.encodeStateAsUpdate(ydoc);
      socket.emit("editor:sync-response", {
        room,
        update: Array.from(state),
      });
    });

    // Broadcast local Y.js updates to peers
    const updateHandler = (update: Uint8Array, origin: any) => {
      if (origin === socket) return;
      socket.emit("editor:update", {
        room,
        update: Array.from(update),
      });
    };

    ydoc.on("update", updateHandler);

    return () => {
      ydoc.off("update", updateHandler);
      socket.emit("room:leave", room);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [paperId, initialContent, enabled]);

  return {
    ydoc: ydocRef.current,
    provider: socketRef.current,
  };
}
