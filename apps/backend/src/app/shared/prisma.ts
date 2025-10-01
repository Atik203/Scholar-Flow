import { PrismaClient } from "@prisma/client";
import { withOptimize } from "@prisma/extension-optimize";

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

const createExtendedClient = (baseClient: PrismaClient) =>
  baseClient.$extends(
    withOptimize({
      apiKey: process.env.OPTIMIZE_API_KEY!,
    })
  );

type OptimizePrismaClient = ReturnType<typeof createExtendedClient>;

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: OptimizePrismaClient;
  basePrismaClient?: PrismaClient;
};

const basePrismaClient =
  globalForPrisma.basePrismaClient ?? createBasePrismaClient();

// Attach event listeners to base client before extensions
if (isDev) {
  // Query performance logging for development using event listeners
  basePrismaClient.$on("query" as never, (e: any) => {
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

// Apply extensions to create the final client
const prismaClient =
  globalForPrisma.prisma ?? createExtendedClient(basePrismaClient);

if (isDev) {
  globalForPrisma.prisma = prismaClient;
  globalForPrisma.basePrismaClient = basePrismaClient;
}

export default prismaClient;
