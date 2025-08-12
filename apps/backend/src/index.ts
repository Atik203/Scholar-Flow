import compression from "compression";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import router from "./app/routes";
import config from "./config";

const app = express();
const PORT = config.port || 5000;

// Security middleware
app.use(helmet());
app.use(compression());

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api/", limiter);

// Request parsing
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Logging
if (config.env !== "production") {
  app.use(morgan("dev"));
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
app.use(globalErrorHandler);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Scholar-Flow API running on port ${PORT}`);
  console.log(`📖 Environment: ${config.env}`);
});

export default app;
