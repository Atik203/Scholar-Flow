"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const routes_1 = __importDefault(require("./app/routes"));
const config_1 = __importDefault(require("./config"));
const app = (0, express_1.default)();
const PORT = config_1.default.port || 5000;
app.use((0, helmet_1.default)());
app.use((0, compression_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
}));
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later.",
});
app.use("/api/", limiter);
app.use(express_1.default.json({ limit: "50mb" }));
app.use(express_1.default.urlencoded({
    extended: true,
    limit: "50mb",
}));
if (config_1.default.env !== "production") {
    app.use((0, morgan_1.default)("dev"));
}
const healthHandler = (req, res) => {
    res.status(200).json({
        success: true,
        message: "Scholar-Flow API is running!",
        timestamp: new Date().toISOString(),
    });
};
app.get("/health", healthHandler);
app.get("/api/health", healthHandler);
app.use("/api", routes_1.default);
app.use(globalErrorHandler_1.default);
app.use("*", ((req, res) => {
    res.status(404).json({
        success: false,
        message: "API endpoint not found",
    });
}));
if (process.env.VERCEL !== "1") {
    const startServer = (desiredPort, attempt = 0) => {
        const server = app.listen(desiredPort, () => {
            console.log(`🚀 Scholar-Flow API running on port ${desiredPort}`);
            console.log(`📖 Environment: ${config_1.default.env}`);
        });
        server.on("error", (err) => {
            if (err.code === "EACCES") {
                console.error(`\n⛔ Permission denied binding to port ${desiredPort}.`);
                if (attempt < 3) {
                    const nextPort = desiredPort + 1;
                    console.log(`🔁 Retrying on port ${nextPort} (attempt ${attempt + 1})...`);
                    startServer(nextPort, attempt + 1);
                }
                else {
                    console.error("❌ Exhausted port fallback attempts.");
                    process.exit(1);
                }
            }
            else if (err.code === "EADDRINUSE") {
                console.error(`\n⚠️ Port ${desiredPort} already in use.`);
                if (attempt < 3) {
                    const nextPort = desiredPort + 1;
                    console.log(`🔁 Trying next port ${nextPort}...`);
                    startServer(nextPort, attempt + 1);
                }
                else {
                    console.error("❌ Could not acquire a free port after retries.");
                    process.exit(1);
                }
            }
            else {
                console.error("❌ Failed to start server", err);
                process.exit(1);
            }
        });
    };
    startServer(Number(PORT));
}
exports.default = app;
module.exports = app;
//# sourceMappingURL=server.js.map