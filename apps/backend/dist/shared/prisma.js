"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const isDev = process.env.NODE_ENV !== "production";
const prismaClient = global.prisma ||
    new client_1.PrismaClient({
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
if (isDev)
    global.prisma = prismaClient;
if (isDev) {
    prismaClient.$on("query", (e) => {
        console.log("-------------------------------------------");
        console.log("Query: " + e.query);
        console.log("-------------------------------------------");
        console.log("Params: " + e.params);
        console.log("-------------------------------------------");
        console.log("Duration: " + e.duration + "ms");
        console.log("-------------------------------------------");
    });
}
exports.default = prismaClient;
//# sourceMappingURL=prisma.js.map