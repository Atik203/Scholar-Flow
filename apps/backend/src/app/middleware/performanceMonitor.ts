import { NextFunction, Request, Response } from "express";

/**
 * Performance monitoring middleware to track request duration and identify slow requests
 */
export const performanceMonitor = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();
  const startTime = process.hrtime.bigint();

  // Use response finish event to capture timing without overriding methods
  res.on("finish", () => {
    const duration = Date.now() - start;
    const hrDuration = process.hrtime.bigint() - startTime;
    const hrMs = Number(hrDuration) / 1000000; // Convert nanoseconds to milliseconds

    // Add performance headers (if not already sent)
    if (!res.headersSent) {
      res.setHeader("X-Response-Time", `${duration}ms`);
      res.setHeader("X-Response-Time-HR", `${hrMs.toFixed(3)}ms`);
    }

    // Log performance metrics
    logRequestPerformance(req, res, duration, hrMs);
  });

  next();
};

/**
 * Log request performance with different levels based on duration
 */
function logRequestPerformance(
  req: Request,
  res: Response,
  duration: number,
  hrDuration: number
) {
  const method = req.method;
  const url = req.originalUrl || req.url;
  const statusCode = res.statusCode;
  const userAgent = req.get("User-Agent") || "unknown";
  const ip = req.ip || req.connection.remoteAddress;

  // Basic request info
  const logData = {
    method,
    url,
    statusCode,
    duration: `${duration}ms`,
    hrDuration: `${hrDuration.toFixed(3)}ms`,
    ip: ip?.replace(/^.*:/, ""), // Clean IPv6-mapped IPv4 addresses
    timestamp: new Date().toISOString(),
  };

  // Categorize and log based on performance
  if (duration >= 5000) {
    // Very slow requests (5+ seconds)
    console.error("🚨 VERY SLOW REQUEST:", {
      ...logData,
      level: "CRITICAL",
      userAgent: userAgent.substring(0, 100), // Truncate long user agents
    });
  } else if (duration >= 2000) {
    // Slow requests (2-5 seconds)
    console.warn("⚠️  SLOW REQUEST:", {
      ...logData,
      level: "WARNING",
    });
  } else if (duration >= 1000) {
    // Moderate requests (1-2 seconds)
    console.info("📊 MODERATE REQUEST:", {
      ...logData,
      level: "INFO",
    });
  } else if (process.env.NODE_ENV === "development" && duration >= 500) {
    // Log requests over 500ms in development
    console.log("⏱️  REQUEST:", {
      ...logData,
      level: "DEBUG",
    });
  }

  // Log errors separately
  if (statusCode >= 500) {
    console.error("💥 SERVER ERROR:", {
      ...logData,
      level: "ERROR",
    });
  } else if (statusCode >= 400) {
    console.warn("⚠️  CLIENT ERROR:", {
      ...logData,
      level: "WARNING",
    });
  }

  // Additional monitoring for specific endpoints
  if (url.includes("/papers") && duration > 1000) {
    console.warn("📄 SLOW PAPER OPERATION:", {
      ...logData,
      endpoint: "papers",
      level: "PAPER_PERFORMANCE",
    });
  }

  if (url.includes("/auth") && duration > 500) {
    console.warn("🔐 SLOW AUTH OPERATION:", {
      ...logData,
      endpoint: "auth",
      level: "AUTH_PERFORMANCE",
    });
  }
}

/**
 * Express middleware to add performance timing to specific routes
 */
export const routePerformanceMonitor = (routeName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    res.on("finish", () => {
      const duration = Date.now() - start;

      if (duration > 1000) {
        console.warn(`🎯 SLOW ROUTE [${routeName}]:`, {
          method: req.method,
          url: req.originalUrl,
          duration: `${duration}ms`,
          statusCode: res.statusCode,
          route: routeName,
          timestamp: new Date().toISOString(),
        });
      }
    });

    next();
  };
};

/**
 * Memory and CPU usage monitoring middleware (use sparingly)
 */
export const resourceMonitor = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startMemory = process.memoryUsage();
  const startCpu = process.cpuUsage();

  res.on("finish", () => {
    const endMemory = process.memoryUsage();
    const endCpu = process.cpuUsage(startCpu);

    const memoryDelta = {
      rss: endMemory.rss - startMemory.rss,
      heapUsed: endMemory.heapUsed - startMemory.heapUsed,
      heapTotal: endMemory.heapTotal - startMemory.heapTotal,
    };

    // Only log if significant resource usage
    if (
      Math.abs(memoryDelta.heapUsed) > 10 * 1024 * 1024 ||
      endCpu.user + endCpu.system > 100000
    ) {
      console.info("📊 RESOURCE USAGE:", {
        method: req.method,
        url: req.originalUrl,
        memoryDelta: {
          rss: `${(memoryDelta.rss / 1024 / 1024).toFixed(2)}MB`,
          heapUsed: `${(memoryDelta.heapUsed / 1024 / 1024).toFixed(2)}MB`,
          heapTotal: `${(memoryDelta.heapTotal / 1024 / 1024).toFixed(2)}MB`,
        },
        cpu: {
          user: `${(endCpu.user / 1000).toFixed(2)}ms`,
          system: `${(endCpu.system / 1000).toFixed(2)}ms`,
        },
        timestamp: new Date().toISOString(),
      });
    }
  });

  next();
};

export default performanceMonitor;
