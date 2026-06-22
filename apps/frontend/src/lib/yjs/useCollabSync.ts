"use client";

import { useCallback, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import * as Y from "yjs";
import { IndexeddbPersistence } from "y-indexeddb";

const SOCKET_URL = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:5001";

function getAuthToken(): string | null {
  try {
    const store = (window as any).__REDUX_STORE__;
    if (store) return store.getState().auth?.accessToken || null;
  } catch {}
  return null;
}

function getUserName(): string {
  try {
    const store = (window as any).__REDUX_STORE__;
    if (store) return store.getState().auth?.user?.name || "Anonymous";
  } catch {}
  return "Anonymous";
}

function getUserId(): string {
  try {
    const store = (window as any).__REDUX_STORE__;
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
  awareness: AwarenessBridge | null;
}

class AwarenessBridge {
  private states = new Map<number, any>();
  private listeners: Array<{ event: string; cb: (...args: any[]) => void }> = [];
  private localState: any = { cursor: null, user: { name: getUserName(), color: "#666" } };
  private clientId: number;
  private socket: Socket | null = null;
  private room: string = "";

  constructor(ydoc: Y.Doc) {
    this.clientId = ydoc.clientID;
  }

  setSocket(socket: Socket) {
    this.socket = socket;
  }

  setRoom(room: string) {
    this.room = room;
  }

  getStates(): Map<number, any> {
    return this.states;
  }

  setLocalState(state: any) {
    this.localState = { ...this.localState, ...state };
    this.states.set(this.clientId, this.localState);
    this.emit("change", [{ added: [], updated: [this.clientId], removed: [] }]);
    this.broadcast();
  }

  setLocalStateField(field: string, value: any) {
    this.setLocalState({ [field]: value });
  }

  getLocalState() {
    return this.localState;
  }

  applyRemoteState(clientId: number, state: any) {
    if (clientId === this.clientId) return;
    const prev = this.states.get(clientId);
    this.states.set(clientId, state);
    const updated = prev ? [clientId] : [];
    const added = prev ? [] : [clientId];
    this.emit("change", [{ added, updated, removed: [] }]);
  }

  removeClient(clientId: number) {
    this.states.delete(clientId);
    this.emit("change", [{ added: [], updated: [], removed: [clientId] }]);
  }

  private broadcast() {
    if (!this.socket?.connected) return;
    this.socket.emit("editor:awareness", {
      room: this.room,
      state: this.localState,
    });
  }

  private emit(event: string, args: any[]) {
    this.listeners
      .filter((l) => l.event === event)
      .forEach((l) => l.cb(...args));
  }

  on(event: string, cb: (...args: any[]) => void) {
    this.listeners.push({ event, cb });
  }

  off(event: string, cb: (...args: any[]) => void) {
    this.listeners = this.listeners.filter(
      (l) => !(l.event === event && l.cb === cb)
    );
  }

  destroy() {
    this.listeners = [];
    this.states.clear();
  }
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
  const socketRef = useRef<Socket | null>(null);
  const awarenessRef = useRef<AwarenessBridge | null>(null);
  const syncedRef = useRef(false);
  const pendingUpdatesRef = useRef<Uint8Array[]>([]);

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
    const awareness = new AwarenessBridge(ydoc);
    awarenessRef.current = awareness;

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

    awareness.setSocket(socket);
    awareness.setRoom(room);

    socket.on("connect", () => {
      socket.emit("room:join", room);
      // Flush any offline queue
      flushPending(ydoc);

      // Request fresh state from peers after reconnect
      if (syncedRef.current) {
        socket.emit("editor:sync-request");
      }
    });

    socket.on("disconnect", () => {
      // Save snapshot for offline recovery
      saveSnapshot();
    });

    // Handle Y.js document updates from peers
    socket.on("editor:update", ({ userId, update }: { userId: string; update: number[] }) => {
      if (userId === socket.id) return;
      try {
        const u8 = new Uint8Array(update);
        Y.applyUpdate(ydoc, u8);
      } catch {}
    });

    // Handle initial sync
    socket.on("editor:sync-response", ({ update }: { update: number[] }) => {
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

    // Awareness relay
    socket.on("editor:awareness", ({ userId, state }: { userId: string; state: any }) => {
      if (userId === socket.id) return;
      const clientId = parseInt(userId.replace(/\D/g, ""), 10) || Date.now();
      awareness.applyRemoteState(clientId, state);
    });

    // Presence tracking for awareness cleanup
    socket.on("presence:left", ({ userId }: { userId: string }) => {
      const clientId = parseInt(userId.replace(/\D/g, ""), 10) || Date.now();
      awareness.removeClient(clientId);
    });

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
      socket.emit("room:leave", room);
      awareness.destroy();
      if (indexeddbProvider) {
        indexeddbProvider.destroy();
      }
      socket.disconnect();
      socketRef.current = null;
    };
  }, [paperId, initialContent, enabled, saveSnapshot, restoreSnapshot, flushPending]);

  return {
    ydoc: ydocRef.current,
    provider: socketRef.current,
    awareness: awarenessRef.current,
  };
}
