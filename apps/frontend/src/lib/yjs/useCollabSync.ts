"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import * as Y from "yjs";
import { IndexeddbPersistence } from "y-indexeddb";
import {
  Awareness,
  applyAwarenessUpdate,
  encodeAwarenessUpdate,
  removeAwarenessStates,
} from "y-protocols/awareness";
import { getAppStore } from "@/redux/storeAccess";

const SOCKET_URL = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:5001";

function getAuthToken(): string | null {
  try {
    const store = getAppStore();
    if (store) return store.getState().auth?.accessToken || null;
  } catch {}
  return null;
}

function getUserName(): string {
  try {
    const store = getAppStore();
    if (store) return store.getState().auth?.user?.name || "Anonymous";
  } catch {}
  return "Anonymous";
}

function getUserId(): string {
  try {
    const store = getAppStore();
    if (store) return store.getState().auth?.user?.id || "unknown";
  } catch {}
  return "unknown";
}

interface UseCollabSyncOptions {
  paperId: string;
  initialContent: string | null;
  enabled: boolean;
}

interface UseCollabSyncResult {
  ydoc: Y.Doc;
  provider: Socket | null;
  awareness: Awareness;
  /** True once any peer update or sync response has been received. */
  hasRemoteState: boolean;
}

interface AwarenessChange {
  added: number[];
  updated: number[];
  removed: number[];
}

// y-indexeddb document name for offline persistence
function getDocKey(paperId: string) {
  return `scholar-flow:collab:${paperId}`;
}

export function useCollabSync({
  paperId,
  initialContent,
  enabled,
}: UseCollabSyncOptions): UseCollabSyncResult {
  const ydocRef = useRef<Y.Doc>(new Y.Doc());
  const [awareness] = useState(() => new Awareness(ydocRef.current));
  const socketRef = useRef<Socket | null>(null);
  const syncedRef = useRef(false);
  const pendingUpdatesRef = useRef<Uint8Array[]>([]);
  const [hasRemoteState, setHasRemoteState] = useState(false);

  const saveSnapshot = useCallback(() => {
    const ydoc = ydocRef.current;
    const snapshot = Y.encodeStateAsUpdate(ydoc);
    try {
      localStorage.setItem(getDocKey(paperId), JSON.stringify(Array.from(snapshot)));
    } catch {}
  }, [paperId]);

  const restoreSnapshot = useCallback(() => {
    try {
      const raw = localStorage.getItem(getDocKey(paperId));
      if (!raw) return null;
      const arr = JSON.parse(raw) as number[];
      return new Uint8Array(arr);
    } catch {
      return null;
    }
  }, [paperId]);

  const flushPending = useCallback((ydoc: Y.Doc) => {
    if (pendingUpdatesRef.current.length === 0) return;
    const updates = pendingUpdatesRef.current.slice();
    pendingUpdatesRef.current = [];
    for (const update of updates) {
      try {
        Y.applyUpdate(ydoc, update);
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (!enabled || !paperId) return;

    const token = getAuthToken();
    if (!token) return;

    const ydoc = ydocRef.current;
    syncedRef.current = false;
    setHasRemoteState(false);

    // Seed the local awareness entry. The cursor extension overwrites `user`
    // with the configured display name/color once the editor mounts.
    awareness.setLocalStateField("user", { name: getUserName(), color: "#666" });
    awareness.setLocalStateField("userId", getUserId());

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 15000,
      reconnectionAttempts: Infinity,
      timeout: 20000,
    });

    socketRef.current = socket;
    const room = `paper:${paperId}`;

    // y-indexeddb for local persistence
    let indexeddbProvider: IndexeddbPersistence | null = null;
    try {
      indexeddbProvider = new IndexeddbPersistence(getDocKey(paperId), ydoc);
    } catch {}

    // Restore last snapshot from localStorage as fallback
    const snapshot = restoreSnapshot();
    if (snapshot && !syncedRef.current) {
      Y.applyUpdate(ydoc, snapshot);
    }

    socket.on("connect", () => {
      socket.emit("room:join", room);
      // Flush any offline queue
      flushPending(ydoc);

      // Request fresh state from peers after reconnect (room-scoped)
      if (syncedRef.current) {
        socket.emit("editor:sync-request", { room });
      }

      // Re-announce presence so peers render our cursor after (re)connect
      if (awareness.getLocalState()) {
        socket.emit("editor:awareness", {
          room,
          state: Array.from(
            encodeAwarenessUpdate(awareness, [awareness.clientID])
          ),
        });
      }
    });

    socket.on("disconnect", () => {
      // Save snapshot for offline recovery
      saveSnapshot();

      // Drop stale remote cursors; peers re-announce on reconnect
      const remoteClientIds = Array.from(awareness.getStates().keys()).filter(
        (clientId) => clientId !== awareness.clientID
      );
      if (remoteClientIds.length > 0) {
        removeAwarenessStates(awareness, remoteClientIds, "disconnect");
      }
    });

    socket.on("connect_error", (error: Error) => {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[CollabSync] connect error:", error.message);
      }
    });

    // If someone is already in the room, the local doc must not be seeded
    socket.on(
      "room:joined",
      ({ memberCount }: { memberCount?: number } = {}) => {
        if ((memberCount ?? 0) > 1) setHasRemoteState(true);
      }
    );

    // Handle Y.js document updates from peers. Own echoes are idempotent in
    // Yjs, so no self-filter is needed (socket.id never matched the relayed
    // authenticated userId anyway).
    socket.on("editor:update", ({ update }: { update: number[] }) => {
      setHasRemoteState(true);
      try {
        const u8 = new Uint8Array(update);
        Y.applyUpdate(ydoc, u8);
      } catch {}
    });

    // Handle initial sync
    socket.on("editor:sync-response", ({ update }: { update: number[] }) => {
      setHasRemoteState(true);
      if (syncedRef.current) return;
      syncedRef.current = true;
      try {
        const u8 = new Uint8Array(update);
        Y.applyUpdate(ydoc, u8);
      } catch {}
    });

    socket.on("editor:sync-request", () => {
      const state = Y.encodeStateAsUpdate(ydoc);
      socket.emit("editor:sync-response", {
        room,
        update: Array.from(state),
      });
    });

    // Awareness relay — y-protocols binary update carried in `state`
    const awarenessUpdateHandler = (
      change: AwarenessChange,
      origin: unknown
    ) => {
      if (origin === "remote" || origin === "presence") return;
      if (!socket.connected) return;

      const changed = [...change.added, ...change.updated, ...change.removed];
      if (changed.length === 0) return;

      socket.emit("editor:awareness", {
        room,
        state: Array.from(encodeAwarenessUpdate(awareness, changed)),
      });
    };

    socket.on("editor:awareness", ({ state }: { state: number[] }) => {
      try {
        applyAwarenessUpdate(awareness, new Uint8Array(state), "remote");
      } catch {}
    });

    // Presence tracking for awareness cleanup
    socket.on("presence:left", ({ userId }: { userId: string }) => {
      const clientIds: number[] = [];
      awareness.getStates().forEach((state, clientId) => {
        if (clientId !== awareness.clientID && state?.userId === userId) {
          clientIds.push(clientId);
        }
      });
      if (clientIds.length > 0) {
        removeAwarenessStates(awareness, clientIds, "presence");
      }
    });

    awareness.on("update", awarenessUpdateHandler);

    // Broadcast local Y.js updates to peers with offline queue
    const updateHandler = (update: Uint8Array, origin: any) => {
      if (origin === socket) return;
      if (socket.connected) {
        socket.emit("editor:update", {
          room,
          update: Array.from(update),
        });
      } else {
        // Queue for later sync (offline queue)
        pendingUpdatesRef.current.push(update);
      }
      saveSnapshot();
    };

    ydoc.on("update", updateHandler);

    return () => {
      ydoc.off("update", updateHandler);
      awareness.off("update", awarenessUpdateHandler);
      socket.emit("room:leave", room);
      if (indexeddbProvider) {
        indexeddbProvider.destroy();
      }
      socket.disconnect();
      socketRef.current = null;
      syncedRef.current = false;
    };
  }, [
    paperId,
    initialContent,
    enabled,
    awareness,
    saveSnapshot,
    restoreSnapshot,
    flushPending,
  ]);

  return {
    ydoc: ydocRef.current,
    provider: socketRef.current,
    awareness,
    hasRemoteState,
  };
}
