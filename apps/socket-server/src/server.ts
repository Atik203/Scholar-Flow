import cors from "cors";
import express from "express";
import http from "http";
import jwt from "jsonwebtoken";
import { Server, Socket } from "socket.io";

const PORT = parseInt(process.env.PORT || "5001", 10);
const JWT_SECRET = process.env.NEXTAUTH_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userName?: string;
}

const app = express();

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: FRONTEND_URL,
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
  if (!JWT_SECRET) {
    return next(new Error("JWT secret not configured"));
  }

  try {
    // Access tokens carry the user id in `sub` (backend middleware/auth.ts);
    // `decoded.id` alone leaves userId undefined and the server disconnects
    // every client right after connect (fixed 2026-08-10, same fix as the
    // in-process socket server).
    const decoded = jwt.verify(token, JWT_SECRET) as unknown as {
      sub?: string;
      id?: string;
      name?: string;
    };
    const userId = decoded.sub || decoded.id;
    if (!userId) {
      return next(new Error("Invalid token: missing user identifier"));
    }
    (socket as AuthenticatedSocket).userId = userId;
    (socket as AuthenticatedSocket).userName = decoded.name || "Unknown";
    next();
  } catch {
    next(new Error("Invalid or expired token"));
  }
});

const onlineUsers = new Map<string, Set<string>>();

// Strict room-name allowlist: only paper:/discussion:/workspace: + UUID.
// The standalone server has no DB access — full membership checks run on the
// in-process socket server (apps/backend .../WebSocket/socketServer.ts).
// This guard stops arbitrary room names (e.g. any string) from being joined.
// NOTE: no ^/$ anchors inside the fragment — a ^ mid-pattern only matches pos 0.
const UUID_SOURCE = "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}";
const ROOM_RE = new RegExp(
  `^(paper|discussion|workspace):(${UUID_SOURCE})$`,
  "i"
);

io.on("connection", (socket: AuthenticatedSocket) => {
  const { userId, userName } = socket;
  if (!userId) { socket.disconnect(true); return; }

  if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set());
  onlineUsers.get(userId)!.add(socket.id);

  console.log(`[WS] ${userName} (${userId}) connected`);

  socket.broadcast.emit("presence:online", {
    userId, userName, timestamp: new Date().toISOString(),
  });

  socket.on("room:join", (room: string) => {
    if (typeof room !== "string" || !ROOM_RE.test(room)) {
      socket.emit("room:error", { room, message: "Access denied: invalid room" });
      return;
    }
    socket.join(room);
    const count = io.sockets.adapter.rooms.get(room)?.size || 0;
    socket.emit("room:joined", { room, memberCount: count });
    socket.to(room).emit("presence:joined", { userId, userName, room, memberCount: count });
  });

  socket.on("room:leave", (room: string) => {
    socket.leave(room);
    const count = io.sockets.adapter.rooms.get(room)?.size || 0;
    socket.to(room).emit("presence:left", { userId, userName, room, memberCount: count });
  });

  socket.on("typing:start", ({ room, context }: { room: string; context?: string }) => {
    socket.to(room).emit("typing:update", { userId, userName, room, isTyping: true, context });
  });

  socket.on("typing:stop", ({ room }: { room: string }) => {
    socket.to(room).emit("typing:update", { userId, userName, room, isTyping: false });
  });

  socket.on("editor:update", ({ room, update }: { room: string; update: number[] }) => {
    socket.to(room).emit("editor:update", { userId, update });
  });

  socket.on("editor:awareness", ({ room, state }: { room: string; state: any }) => {
    socket.to(room).emit("editor:awareness", { userId, userName, state });
  });

  socket.on("editor:sync-request", () => {
    // Relayed to other clients — they respond with full state
    socket.broadcast.emit("editor:sync-request");
  });

  socket.on("editor:sync-response", ({ room, update }: { room: string; update: number[] }) => {
    socket.to(room).emit("editor:sync-response", { update });
  });

  socket.on("discussion:message", ({ room, content, threadId }: { room: string; content: string; threadId?: string }) => {
    const message = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      userId, userName, content, threadId,
      timestamp: new Date().toISOString(),
    };
    io.to(room).emit("discussion:message", message);
  });

  socket.on("disconnect", () => {
    if (userId && onlineUsers.has(userId)) {
      onlineUsers.get(userId)!.delete(socket.id);
      if (onlineUsers.get(userId)!.size === 0) onlineUsers.delete(userId);
    }
    socket.broadcast.emit("presence:offline", { userId, userName, timestamp: new Date().toISOString() });
    console.log(`[WS] ${userName} (${userId}) disconnected`);
  });

  socket.emit("auth:success", { userId, userName });
});

httpServer.listen(PORT, () => {
  console.log(`[SocketServer] Running on port ${PORT}`);
  console.log(`[SocketServer] CORS origin: ${FRONTEND_URL}`);
});

export default app;
