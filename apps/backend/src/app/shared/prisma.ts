import { PrismaClient } from "../../generated/prisma/client";
import { Prisma } from "../../generated/prisma/client";
import { PrismaPostgresAdapter } from "@prisma/adapter-ppg";

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
    if (duration > 100) {
      console.warn(
        `Slow query: ${e.query.substring(0, 100)}... took ${duration}ms`
      );
      if (duration > 500) {
        console.error(
          `VERY slow query: ${e.query.substring(0, 100)}... took ${duration}ms - NEEDS OPTIMIZATION!`
        );
      }
    }
  });
}

if (isDev) {
  globalForPrisma.prisma = prismaClient;
}

export default prismaClient;
