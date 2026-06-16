import { PrismaClient } from "../../generated/prisma/client";
import { Prisma } from "../../generated/prisma/client";
import { PrismaPostgresAdapter } from "@prisma/adapter-ppg";
import { prismaQueryInsights } from "@prisma/sqlcommenter-query-insights";

export * from "../../generated/prisma/client";
export { Prisma, PrismaClient };

const isDev = process.env.NODE_ENV !== "production";

const createPrismaClient = () => {
  const connectionString =
    process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL or DIRECT_DATABASE_URL is required");
  }

  const adapter = new PrismaPostgresAdapter({ connectionString });

  return new PrismaClient({
    adapter,
    comments: [prismaQueryInsights()],
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
};

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

const prismaClient = globalForPrisma.prisma ?? createPrismaClient();

if (isDev && !globalForPrisma.prisma) {
  prismaClient.$on("query" as never, (e: any) => {
    const duration = e.duration;
    if (duration > 50) {
      console.warn(
        `[SLOW QUERY] ${duration}ms | ${e.query.substring(0, 150)} | params: ${e.params?.substring(0, 80) || ""}`
      );
    }
  });
}

if (isDev) {
  globalForPrisma.prisma = prismaClient;
}

export default prismaClient;
