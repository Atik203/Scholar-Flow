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
  // Query logging handled by Prisma log config above
  // Extended client logs are managed through the optimize extension
}

// Apply extensions to create the final client
const prismaClient =
  globalForPrisma.prisma ?? createExtendedClient(basePrismaClient);

if (isDev) {
  globalForPrisma.prisma = prismaClient;
  globalForPrisma.basePrismaClient = basePrismaClient;
}

export default prismaClient;
