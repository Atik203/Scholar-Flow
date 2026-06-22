import http from "http";
import express from "express";
import cors from "cors";
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";

const PORT = parseInt(process.env.PORT || "5001", 10);
const JWT_SECRET = process.env.JWT_SECRET || "5a2857498511e2dbf364e26a03c0dddb";
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

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; name?: string };
    (socket as AuthenticatedSocket).userId = decoded.id;
    (socket as AuthenticatedSocket).userName = decoded.name || "Unknown";
    next();
  } catch {
    next(new Error("Invalid or expired token"));
  }
});

const onlineUsers = new Map<string, Set<string>>();

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
