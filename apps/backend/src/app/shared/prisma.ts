import { PrismaClient } from "@prisma/client";

const isDev = process.env.NODE_ENV !== "production";

const createBasePrismaClient = () =>
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

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

const prismaClient = globalForPrisma.prisma ?? createBasePrismaClient();

// Attach event listeners to base client before extensions
if (isDev && !globalForPrisma.prisma) {
  // Query performance logging for development using event listeners
  prismaClient.$on("query" as never, (e: any) => {
    const duration = e.duration;

    // Log slow queries (>100ms) to help identify optimization opportunities
    if (duration > 100) {
      console.warn(
        `⚠️ Slow query detected: ${e.query.substring(0, 100)}... took ${duration}ms`
      );
      if (duration > 500) {
        console.error(
          `🔴 VERY slow query: ${e.query.substring(0, 100)}... took ${duration}ms - NEEDS OPTIMIZATION!`
        );
      }
    }
  });
}

if (isDev) {
  globalForPrisma.prisma = prismaClient;
}

export default prismaClient;
