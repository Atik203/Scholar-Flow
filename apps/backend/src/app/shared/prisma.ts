import { PrismaClient } from "@prisma/client";

const isDev = process.env.NODE_ENV !== "production";

// Use a global cached instance to avoid exhausting connections in serverless
// Enrich global type for TypeScript
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prismaClient =
  global.prisma ||
  new PrismaClient({
    log: isDev
      ? [
          { emit: "event", level: "query" },
          { emit: "event", level: "error" },
          { emit: "event", level: "info" },
          { emit: "event", level: "warn" },
        ]
      : [
          { emit: "event", level: "error" },
          { emit: "event", level: "warn" },
        ],
  });

if (isDev) global.prisma = prismaClient;

// Optional performance-focused query log only in dev
if (isDev) {
  // @ts-expect-error: Prisma Client extension type issue
  prismaClient.$on("query", (e: any) => {
    // Only log slow queries (>100ms) to reduce console noise
    if (e.duration > 100) {
      console.log(
        `[SLOW QUERY] ${e.duration}ms: ${e.query.substring(0, 100)}...`
      );
    }
  });
}

export default prismaClient;
