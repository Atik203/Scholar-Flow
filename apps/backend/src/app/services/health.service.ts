import { Request, Response } from "express";
import config from "../config";
import ApiError from "../errors/ApiError";
import catchAsync from "../shared/catchAsync";
import prisma from "../shared/prisma";

interface HealthCheckResult {
  service: string;
  status: "healthy" | "unhealthy" | "degraded";
  responseTime?: number;
  error?: string;
  details?: Record<string, any>;
}

interface HealthCheckResponse {
  status: "healthy" | "unhealthy" | "degraded";
  timestamp: string;
  uptime: number;
  environment: string;
  version: string;
  services: HealthCheckResult[];
  overall: {
    healthy: number;
    unhealthy: number;
    degraded: number;
    total: number;
  };
}

// Database health check
const checkDatabase = async (): Promise<HealthCheckResult> => {
  const start = Date.now();
  try {
    // Test basic connectivity
    await prisma.$queryRaw`SELECT 1 as test`;

    // Test a more complex query to ensure the database is fully operational
    const userCount =
      await prisma.$queryRaw`SELECT COUNT(*)::integer as count FROM "User"`;
    const responseTime = Date.now() - start;

    return {
      service: "database",
      status: "healthy",
      responseTime,
      details: {
        connection: "active",
        queryTest: "passed",
        userCount:
          Array.isArray(userCount) && userCount.length > 0
            ? userCount[0]
            : null,
      },
    };
  } catch (error) {
    const responseTime = Date.now() - start;
    return {
      service: "database",
      status: "unhealthy",
      responseTime,
      error: error instanceof Error ? error.message : "Unknown database error",
      details: {
        connection: "failed",
      },
    };
  }
};

// Memory health check
const checkMemory = (): HealthCheckResult => {
  const memUsage = process.memoryUsage();
  const totalMemMB = memUsage.heapTotal / 1024 / 1024;
  const usedMemMB = memUsage.heapUsed / 1024 / 1024;
  const memoryUsagePercent = (usedMemMB / totalMemMB) * 100;

  let status: "healthy" | "degraded" | "unhealthy" = "healthy";
  if (memoryUsagePercent > 90) {
    status = "unhealthy";
  } else if (memoryUsagePercent > 75) {
    status = "degraded";
  }

  return {
    service: "memory",
    status,
    details: {
      heapUsed: `${usedMemMB.toFixed(2)} MB`,
      heapTotal: `${totalMemMB.toFixed(2)} MB`,
      usagePercent: `${memoryUsagePercent.toFixed(2)}%`,
      rss: `${(memUsage.rss / 1024 / 1024).toFixed(2)} MB`,
      external: `${(memUsage.external / 1024 / 1024).toFixed(2)} MB`,
    },
  };
};

// Environment variables health check
const checkEnvironment = (): HealthCheckResult => {
  const requiredEnvVars = ["DATABASE_URL", "JWT_SECRET", "NEXTAUTH_SECRET"];

  const missingEnvVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  if (missingEnvVars.length > 0) {
    return {
      service: "environment",
      status: "unhealthy",
      error: `Missing environment variables: ${missingEnvVars.join(", ")}`,
      details: {
        required: requiredEnvVars,
        missing: missingEnvVars,
      },
    };
  }

  return {
    service: "environment",
    status: "healthy",
    details: {
      nodeEnv: process.env.NODE_ENV || "development",
      nodeVersion: process.version,
      platform: process.platform,
      architecture: process.arch,
    },
  };
};

// Optional: Gotenberg connectivity health check (DOCX -> PDF engine)
const checkGotenberg = async (): Promise<HealthCheckResult> => {
  const start = Date.now();
  const engine = config.docxToPdf?.engine;
  const url = config.docxToPdf?.gotenbergUrl;

  if (engine !== "gotenberg") {
    return {
      service: "docxToPdf",
      status: "healthy",
      details: {
        engine,
        message: "Gotenberg check skipped (engine not set to 'gotenberg')",
      },
    };
  }

  if (!url) {
    return {
      service: "docxToPdf",
      status: "degraded",
      error: "GOTENBERG_URL is not configured",
      details: {
        engine,
      },
    };
  }

  try {
    // Gotenberg returns 405 on root; use /health for a lightweight check where available
    const controller = new AbortController();
    const timeout = setTimeout(
      () => controller.abort(),
      config.docxToPdf?.requestTimeoutMs || 8000
    );

    const target = url.replace(/\/$/, "") + "/health";
    const res = await fetch(target, {
      method: "GET",
      signal: controller.signal,
    }).catch(async (err) => {
      // Some deployments may not expose /health. Try root as fallback.
      const fallback = url;
      return fetch(fallback, { method: "GET", signal: controller.signal });
    });

    clearTimeout(timeout);

    const responseTime = Date.now() - start;
    const ok =
      !!res && (res.status === 200 || res.status === 204 || res.status === 405);

    return {
      service: "docxToPdf",
      status: ok ? "healthy" : "degraded",
      responseTime,
      details: {
        engine,
        url,
        statusCode: res ? res.status : "no-response",
      },
    };
  } catch (error) {
    const responseTime = Date.now() - start;
    return {
      service: "docxToPdf",
      status: "unhealthy",
      responseTime,
      error: error instanceof Error ? error.message : "Unknown Gotenberg error",
      details: {
        engine,
        url,
      },
    };
  }
};

// Basic health check (lightweight)
export const basicHealthCheck = catchAsync(
  async (req: Request, res: Response) => {
    const response = {
      status: "healthy",
      message: "Scholar-Flow API is running!",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      version: process.env.npm_package_version || "1.0.0",
      uptime: process.uptime(),
    };

    res.status(200).json(response);
  }
);

// Detailed health check (comprehensive)
export const detailedHealthCheck = catchAsync(
  async (req: Request, res: Response) => {
    const startTime = Date.now();

    // Run all health checks in parallel
    const [databaseResult, memoryResult, environmentResult, gotenbergResult] =
      await Promise.allSettled([
        checkDatabase(),
        Promise.resolve(checkMemory()),
        Promise.resolve(checkEnvironment()),
        checkGotenberg(),
      ]);

    const services: HealthCheckResult[] = [];

    // Process database check result
    if (databaseResult.status === "fulfilled") {
      services.push(databaseResult.value);
    } else {
      services.push({
        service: "database",
        status: "unhealthy",
        error: "Health check failed to execute",
      });
    }

    // Process memory check result
    if (memoryResult.status === "fulfilled") {
      services.push(memoryResult.value);
    }

    // Process environment check result
    if (environmentResult.status === "fulfilled") {
      services.push(environmentResult.value);
    }

    // Process gotenberg check result
    if (gotenbergResult.status === "fulfilled") {
      services.push(gotenbergResult.value);
    }

    // Calculate overall status
    const healthyCounts = services.reduce(
      (acc, service) => {
        acc[service.status]++;
        acc.total++;
        return acc;
      },
      { healthy: 0, unhealthy: 0, degraded: 0, total: 0 }
    );

    let overallStatus: "healthy" | "unhealthy" | "degraded" = "healthy";
    if (healthyCounts.unhealthy > 0) {
      overallStatus = "unhealthy";
    } else if (healthyCounts.degraded > 0) {
      overallStatus = "degraded";
    }

    const responseTime = Date.now() - startTime;

    const response: HealthCheckResponse = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
      version: process.env.npm_package_version || "1.0.0",
      services,
      overall: healthyCounts,
    };

    // Set appropriate HTTP status code
    let statusCode = 200;
    if (overallStatus === "degraded") {
      statusCode = 207; // Multi-Status
    } else if (overallStatus === "unhealthy") {
      statusCode = 503; // Service Unavailable
    }

    // Add performance header
    res.setHeader("X-Health-Check-Duration", `${responseTime}ms`);

    res.status(statusCode).json(response);
  }
);

// Liveness probe (for Kubernetes/Docker)
export const livenessProbe = catchAsync(async (req: Request, res: Response) => {
  // Basic check that the application is running
  res.status(200).json({
    status: "alive",
    timestamp: new Date().toISOString(),
  });
});

// Readiness probe (for Kubernetes/Docker)
export const readinessProbe = catchAsync(
  async (req: Request, res: Response) => {
    try {
      // Check if the app is ready to serve traffic
      await prisma.$queryRaw`SELECT 1`;

      res.status(200).json({
        status: "ready",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      throw new ApiError(503, "Service not ready");
    }
  }
);
