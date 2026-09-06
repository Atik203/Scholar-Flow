import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import prisma from "../../shared/prisma";

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userName?: string;
}

type RoomName = `workspace:${string}` | `paper:${string}` | `discussion:${string}`;

// NOTE: no ^/$ anchors inside the fragment — they'd break the combined regex
// (a ^ in the middle of a pattern only matches position 0).
const UUID_SOURCE = "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}";

const ROOM_RE = new RegExp(
  `^(paper|discussion|workspace):(${UUID_SOURCE})$`,
  "i"
);

/**
 * Membership check for live rooms. The REST layer enforces access on every
 * endpoint, but socket rooms were previously joinable by ANY authenticated
 * user — a caller could join `paper:<id>` or `discussion:<id>` rooms and
 * receive presence/typing/editor events for content they cannot read.
 *
 * Rules (mirror the paper module's access model):
 *  - workspace:<id>     owner or active member
 *  - paper:<id>         uploader, or member of the paper's workspace
 *  - discussion:<id>    thread author, or access to the thread's scope
 *                       (paper / collection member / workspace member)
 */
async function canAccessRoom(userId: string, room: string): Promise<boolean> {
  const match = ROOM_RE.exec(room);
  if (!match) return false;
  const kind = match[1].toLowerCase();
  const id = match[2];

  switch (kind) {
    case "workspace": {
      const ws = await prisma.workspace.findFirst({
        where: {
          id,
          isDeleted: false,
          OR: [
            { ownerId: userId },
            { members: { some: { userId, isDeleted: false } } },
          ],
        },
        select: { id: true },
      });
      return Boolean(ws);
    }
    case "paper": {
      const paper = await prisma.paper.findFirst({
        where: {
          id,
          isDeleted: false,
          OR: [
            { uploaderId: userId },
            {
              workspace: {
                isDeleted: false,
                OR: [
                  { ownerId: userId },
                  { members: { some: { userId, isDeleted: false } } },
                ],
              },
            },
          ],
        },
        select: { id: true },
      });
      return Boolean(paper);
    }
    case "discussion": {
      const thread = await prisma.discussionThread.findFirst({
        where: { id, isDeleted: false },
        select: { userId: true, paperId: true, collectionId: true, workspaceId: true },
      });
      if (!thread) return false;
      if (thread.userId === userId) return true;
      if (thread.paperId) return canAccessRoom(userId, `paper:${thread.paperId}`);
      if (thread.collectionId) {
        const col = await prisma.collection.findFirst({
          where: {
            id: thread.collectionId,
            isDeleted: false,
            OR: [
              { ownerId: userId },
              {
                members: {
                  some: { userId, isDeleted: false, status: "ACCEPTED" },
                },
              },
            ],
          },
          select: { id: true },
        });
        return Boolean(col);
      }
      if (thread.workspaceId) {
        return canAccessRoom(userId, `workspace:${thread.workspaceId}`);
      }
      return false;
    }
    default:
      return false;
  }
}

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
  // NOTE: access tokens are signed with NEXTAUTH_SECRET (see middleware/auth.ts
  // + auth controller signIn). The refresh-token secret (config.jwt.jwt_secret /
  // JWT_SECRET) is a DIFFERENT key — verifying with it rejected every client
  // until 2026-08-10. Keep this in sync with the standalone socket-server.
  io.use((socket: Socket, next) => {
    const token =
      socket.handshake.auth.token ||
      socket.handshake.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return next(new Error("Authentication required"));
    }

    const jwtSecret = process.env.NEXTAUTH_SECRET;
    if (!jwtSecret) {
      return next(new Error("JWT secret not configured"));
    }

    try {
      // Access tokens carry the user id in `sub` (see middleware/auth.ts) —
      // reading only `decoded.id` left userId undefined and disconnected
      // every client immediately after connect (fixed 2026-08-10).
      const decoded = jwt.verify(token, jwtSecret) as {
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

    socket.on("room:join", async (room: string) => {
      // Authorization: only join rooms the user may access (2026-08-10)
      try {
        const allowed = await canAccessRoom(userId!, room);
        if (!allowed) {
          socket.emit("room:error", { room, message: "Access denied" });
          return;
        }
      } catch {
        socket.emit("room:error", { room, message: "Access denied" });
        return;
      }

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
