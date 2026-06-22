"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:5001";

function getAuthToken(): string | null {
  try {
    const store = (window as any).__REDUX_STORE__;
    if (store) return store.getState().auth?.accessToken || null;
  } catch {}
  return null;
}

export interface DiscussionMessage {
  id: string;
  userId: string;
  userName: string;
  content: string;
  threadId?: string;
  timestamp: string;
}

interface UseDiscussionSocketOptions {
  room: string;
  enabled: boolean;
  onMessage?: (msg: DiscussionMessage) => void;
}

export function useDiscussionSocket({
  room,
  enabled,
  onMessage,
}: UseDiscussionSocketOptions) {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [memberCount, setMemberCount] = useState(0);
  const [typingUsers, setTypingUsers] = useState<
    { userId: string; userName: string }[]
  >([]);

  useEffect(() => {
    if (!enabled || !room) return;

    const token = getAuthToken();
    if (!token) return;

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      socket.emit("room:join", room);
    });

    socket.on("room:joined", ({ memberCount: count }: { memberCount: number }) => {
      setMemberCount(count);
    });

    socket.on("presence:joined", ({ memberCount: count }: { memberCount: number }) => {
      setMemberCount(count);
    });

    socket.on("presence:left", ({ memberCount: count }: { memberCount: number }) => {
      setMemberCount(count);
    });

    socket.on("discussion:message", (msg: DiscussionMessage) => {
      onMessage?.(msg);
    });

    socket.on(
      "typing:update",
      ({
        userId,
        userName,
        isTyping,
      }: {
        userId: string;
        userName: string;
        isTyping: boolean;
      }) => {
        setTypingUsers((prev) => {
          if (isTyping) {
            const exists = prev.find((u) => u.userId === userId);
            if (exists) return prev;
            return [...prev, { userId, userName }];
          }
          return prev.filter((u) => u.userId !== userId);
        });
      }
    );

    socket.on("disconnect", () => {
      setConnected(false);
    });

    return () => {
      socket.emit("room:leave", room);
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
    };
  }, [room, enabled, onMessage]);

  const sendMessage = useCallback(
    (content: string, threadId?: string) => {
      if (!socketRef.current || !connected) return;
      socketRef.current.emit("discussion:message", {
        room,
        content,
        threadId,
      });
    },
    [room, connected]
  );

  const sendTyping = useCallback(
    (isTyping: boolean) => {
      if (!socketRef.current || !connected) return;
      if (isTyping) {
        socketRef.current.emit("typing:start", { room });
      } else {
        socketRef.current.emit("typing:stop", { room });
      }
    },
    [room, connected]
  );

  return { connected, memberCount, typingUsers, sendMessage, sendTyping };
}
