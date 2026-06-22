import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import config from "../../config";

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userName?: string;
}

type RoomName = `workspace:${string}` | `paper:${string}` | `discussion:${string}`;

const onlineUsers = new Map<string, Set<string>>(); // userId -> Set<socketId>

export function setupWebSocket(server: HttpServer): Server {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // JWT auth middleware for socket connections
  io.use((socket: Socket, next) => {
    const token =
      socket.handshake.auth.token ||
      socket.handshake.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return next(new Error("Authentication required"));
    }

    try {
      const decoded = jwt.verify(token, config.jwt.jwt_secret!) as {
        id: string;
        name?: string;
      };

      (socket as AuthenticatedSocket).userId = decoded.id;
      (socket as AuthenticatedSocket).userName = decoded.name || "Unknown";
      next();
    } catch {
      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", (socket: AuthenticatedSocket) => {
    const { userId, userName } = socket;

    if (!userId) {
      socket.disconnect(true);
      return;
    }

    // Track online presence
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }
    onlineUsers.get(userId)!.add(socket.id);

    console.log(
      `[WS] ${userName} (${userId}) connected — ${socket.id}`
    );

    // Broadcast user online status to their workspaces
    socket.broadcast.emit("presence:online", {
      userId,
      userName,
      timestamp: new Date().toISOString(),
    });

    // --- Room management ---

    socket.on("room:join", (room: string) => {
      socket.join(room);
      const memberCount = io.sockets.adapter.rooms.get(room)?.size || 0;
      socket.emit("room:joined", { room, memberCount });
      socket.to(room).emit("presence:joined", {
        userId,
        userName,
        room,
        memberCount,
      });
    });

    socket.on("room:leave", (room: string) => {
      socket.leave(room);
      const memberCount = io.sockets.adapter.rooms.get(room)?.size || 0;
      socket.to(room).emit("presence:left", {
        userId,
        userName,
        room,
        memberCount,
      });
    });

    // --- Typing indicators ---

    socket.on(
      "typing:start",
      ({ room, context }: { room: string; context?: string }) => {
        socket.to(room).emit("typing:update", {
          userId,
          userName,
          room,
          isTyping: true,
          context,
        });
      }
    );

    socket.on("typing:stop", ({ room }: { room: string }) => {
      socket.to(room).emit("typing:update", {
        userId,
        userName,
        room,
        isTyping: false,
      });
    });

    // --- Collaborative editing ---

    socket.on(
      "editor:update",
      ({ room, update }: { room: string; update: Uint8Array }) => {
        socket.to(room).emit("editor:update", { userId, update });
      }
    );

    socket.on(
      "editor:awareness",
      ({ room, state }: { room: string; state: any }) => {
        socket.to(room).emit("editor:awareness", {
          userId,
          userName,
          state,
        });
      }
    );

    // --- Live discussion chat ---

    socket.on(
      "discussion:message",
      ({
        room,
        content,
        threadId,
      }: {
        room: string;
        content: string;
        threadId?: string;
      }) => {
        const message = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          userId,
          userName,
          content,
          threadId,
          timestamp: new Date().toISOString(),
        };
        io.to(room).emit("discussion:message", message);
      }
    );

    // --- Disconnect ---

    socket.on("disconnect", () => {
      if (userId && onlineUsers.has(userId)) {
        onlineUsers.get(userId)!.delete(socket.id);
        if (onlineUsers.get(userId)!.size === 0) {
          onlineUsers.delete(userId);
        }
      }

      socket.broadcast.emit("presence:offline", {
        userId,
        userName,
        timestamp: new Date().toISOString(),
      });

      console.log(
        `[WS] ${userName} (${userId}) disconnected — ${socket.id}`
      );
    });

    // Notify client of successful auth
    socket.emit("auth:success", { userId, userName });
  });

  console.log("[WS] Socket.IO server initialized");
  return io;
}

export function getOnlineUsers(): Map<string, Set<string>> {
  return onlineUsers;
}
