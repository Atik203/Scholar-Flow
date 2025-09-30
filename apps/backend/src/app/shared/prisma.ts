import { PrismaClient } from "@prisma/client";
import { withOptimize } from "@prisma/extension-optimize";

const isDev = process.env.NODE_ENV !== "production";

// Use a global cached instance to avoid exhausting connections in serverless
// Enrich global type for TypeScript
declare global {
  // eslint-disable-next-line no-var
  var prisma: any; // Use 'any' to support extended Prisma Client
  let basePrismaClient: PrismaClient | undefined;
}

// Create base Prisma client first
const basePrismaClient =
  global.basePrismaClient ||
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

// Attach event listeners to base client before extensions
if (isDev) {
  basePrismaClient.$on("query", (e: any) => {
    // Only log slow queries (>100ms) to reduce console noise
    if (e.duration > 100) {
      console.log(
        `[SLOW QUERY] ${e.duration}ms: ${e.query.substring(0, 100)}...`
      );
    }
  });
}

// Apply extensions to create the final client
const prismaClient =
  global.prisma ||
  basePrismaClient.$extends(
    withOptimize({
      apiKey: process.env.OPTIMIZE_API_KEY!,
    })
  );

if (isDev) {
  global.prisma = prismaClient;
  global.basePrismaClient = basePrismaClient;
}

export default prismaClient;
