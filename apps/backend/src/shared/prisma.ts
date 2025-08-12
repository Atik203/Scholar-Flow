import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: [
    {
      emit: "event",
      level: "query",
    },
    {
      emit: "event",
      level: "error",
    },
    {
      emit: "event",
      level: "info",
    },
    {
      emit: "event",
      level: "warn",
    },
  ],
});

// TODO: type the event payload properly when enabling query logging in prod
prisma.$on("query", (e: any) => {
  console.log("-------------------------------------------");
  console.log("Query: " + e.query);
  console.log("-------------------------------------------");
  console.log("Params: " + e.params);
  console.log("-------------------------------------------");
  console.log("Duration: " + e.duration + "ms");
  console.log("-------------------------------------------");
});

export default prisma;
