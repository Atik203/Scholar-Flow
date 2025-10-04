import compression from "compression";
import cors from "cors";
import express, {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import config from "./app/config";
import { setupSwagger } from "./app/config/swagger";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import { healthCheck, routeNotFound } from "./app/middleware/routeHandler";
import router from "./app/routes";
import {
  captureStripeRawBody,
  isStripeWebhookPath,
} from "./app/utils/stripeWebhook";

// Initialize queue processing
import "./app/services/pdfProcessingQueue";

const app: import("express").Express = express();
const PORT = config.port || 5000;

// Trust proxy when behind Vercel/reverse proxy (required for rate limiting and IP detection)
if (process.env.VERCEL === "1" || config.env === "production") {
  app.set("trust proxy", true);
  console.log("[Config] Trust proxy enabled for production/Vercel environment");
}

// Security middleware with enhanced CSP and security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        connectSrc: [
          "'self'",
          "https://api.openai.com",
          "https://generativelanguage.googleapis.com",
        ],
        frameSrc: ["'self'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    },
    frameguard: {
      action: "deny", // Prevent clickjacking
    },
    noSniff: true, // Prevent MIME type sniffing
    xssFilter: true, // Enable XSS filter
    referrerPolicy: {
      policy: "strict-origin-when-cross-origin",
    },
  }) as unknown as RequestHandler
);
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
  max: 1000, // TESTING: Increased from 100 to 1000 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
// Cast to any to avoid TS overload mismatch while bootstrapping
app.use("/api/", limiter as unknown as import("express").RequestHandler);

// Stripe webhook - MUST be before express.json() to preserve raw body
import { webhookController } from "./app/modules/Billing/webhook.controller";
app.post(
  "/webhooks/stripe",
  express.raw({ type: "application/json" }),
  captureStripeRawBody,
  webhookController.handleStripeWebhook as unknown as RequestHandler
);

// Request parsing
const jsonParser = express.json({ limit: "50mb" });
const urlencodedParser = express.urlencoded({
  extended: true,
  limit: "50mb",
});

app.use((req: Request, res: Response, next: NextFunction) => {
  if (isStripeWebhookPath(req)) {
    return next();
  }

  return jsonParser(req, res, next);
});

app.use((req: Request, res: Response, next: NextFunction) => {
  if (isStripeWebhookPath(req)) {
    return next();
  }

  return urlencodedParser(req, res, next);
});

// Logging
if (config.env !== "production") {
  app.use(morgan("dev") as unknown as RequestHandler);
}

// Performance monitoring
import { performanceMonitor } from "./app/middleware/performanceMonitor";
app.use(performanceMonitor as unknown as RequestHandler);

// Root endpoint
const rootHandler: import("express").RequestHandler = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Scholar-Flow API",
    version: "1.1.5",
    documentation: "/docs",
    api: "/api",
    health: "/health",
  });
};
app.get("/", rootHandler as unknown as RequestHandler);

// Setup API Documentation
setupSwagger(app);

// Health check endpoint
app.get("/health", healthCheck as unknown as RequestHandler);
// Support health check under /api as well (useful when deployed behind a rewrite to /api/$1)
app.get("/api/health", healthCheck as unknown as RequestHandler);

// API routes
app.use("/api", router);

// Global error handler
app.use(globalErrorHandler as unknown as RequestHandler);

// 404 handler
app.use("*", routeNotFound as unknown as RequestHandler);

// Only start server if not in Vercel environment
if (process.env.VERCEL !== "1") {
  // Start server with graceful fallback & diagnostics
  const startServer = (desiredPort: number, attempt = 0) => {
    const server = app.listen(desiredPort, () => {
      console.log(`🚀 Scholar-Flow API running on port ${desiredPort}`);
      console.log(
        "[Boot] DATABASE_URL present:",
        Boolean(process.env.DATABASE_URL)
      );
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
}

export default app;

// Also expose CommonJS export for Vercel @vercel/node when using dist/server.js directly
// Note: TypeScript will emit both default and CJS exports under commonjs module target
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(module as any).exports = app;
