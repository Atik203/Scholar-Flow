import compression from "compression";
import cors from "cors";
import express, { RequestHandler } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import router from "./app/routes";
import config from "./config";

const app: import("express").Express = express();
const PORT = config.port || 5000;

// Security middleware
app.use(helmet() as unknown as RequestHandler);
app.use(compression() as unknown as RequestHandler);

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }) as unknown as RequestHandler
);

// Rate limiting (typing relaxed for dev boot)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
// Cast to any to avoid TS overload mismatch while bootstrapping
app.use("/api/", limiter as unknown as import("express").RequestHandler);

// Request parsing
app.use(express.json({ limit: "50mb" }) as unknown as RequestHandler);
app.use(
  express.urlencoded({
    extended: true,
    limit: "50mb",
  }) as unknown as RequestHandler
);

// Logging
if (config.env !== "production") {
  app.use(morgan("dev") as unknown as RequestHandler);
}

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Scholar-Flow API is running!",
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use("/api", router);

// Global error handler
app.use(globalErrorHandler as unknown as RequestHandler);

// 404 handler
app.use("*", ((
  req: import("express").Request,
  res: import("express").Response
) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
  });
}) as unknown as RequestHandler);

// Start server with graceful fallback & diagnostics
const startServer = (desiredPort: number, attempt = 0) => {
  const server = app.listen(desiredPort, () => {
    console.log(`🚀 Scholar-Flow API running on port ${desiredPort}`);
    console.log(`📖 Environment: ${config.env}`);
  });

  server.on("error", (err: any) => {
    if (err.code === "EACCES") {
      console.error(`\n⛔ Permission denied binding to port ${desiredPort}.`);
      if (attempt < 3) {
        const nextPort = desiredPort + 1;
        console.log(
          `🔁 Retrying on port ${nextPort} (attempt ${attempt + 1})...`
        );
        startServer(nextPort, attempt + 1);
      } else {
        console.error("❌ Exhausted port fallback attempts.");
        process.exit(1);
      }
    } else if (err.code === "EADDRINUSE") {
      console.error(`\n⚠️ Port ${desiredPort} already in use.`);
      if (attempt < 3) {
        const nextPort = desiredPort + 1;
        console.log(`🔁 Trying next port ${nextPort}...`);
        startServer(nextPort, attempt + 1);
      } else {
        console.error("❌ Could not acquire a free port after retries.");
        process.exit(1);
      }
    } else {
      console.error("❌ Failed to start server", err);
      process.exit(1);
    }
  });
};

startServer(Number(PORT));

export default app;
