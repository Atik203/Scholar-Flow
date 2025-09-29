import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import config from "../config";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/status:
 *   get:
 *     summary: Comprehensive API Status
 *     description: Get detailed status information including database connectivity, system info, and feature flags
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Comprehensive API status information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "API status retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     api:
 *                       type: object
 *                       properties:
 *                         status:
 *                           type: string
 *                           example: "healthy"
 *                         version:
 *                           type: string
 *                           example: "1.0.0"
 *                         environment:
 *                           type: string
 *                           example: "development"
 *                         uptime:
 *                           type: number
 *                           example: 3600.5
 *                         timestamp:
 *                           type: string
 *                           format: date-time
 *                     database:
 *                       type: object
 *                       properties:
 *                         status:
 *                           type: string
 *                           example: "connected"
 *                         responseTime:
 *                           type: number
 *                           example: 25.5
 *                     features:
 *                       type: object
 *                       properties:
 *                         pgvectorEnabled:
 *                           type: boolean
 *                           example: true
 *                         aiSearchEnabled:
 *                           type: boolean
 *                           example: true
 *                         fileUploadEnabled:
 *                           type: boolean
 *                           example: true
 *                     endpoints:
 *                       type: object
 *                       properties:
 *                         documentation:
 *                           type: string
 *                           example: "/docs"
 *                         health:
 *                           type: string
 *                           example: "/health"
 *                         apiBase:
 *                           type: string
 *                           example: "/api"
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
export const getApiStatus = async (req: Request, res: Response) => {
  try {
    // Check database connectivity
    let dbStatus = "disconnected";
    let dbResponseTime = 0;

    try {
      const dbStart = Date.now();
      await prisma.$queryRaw`SELECT 1`;
      dbResponseTime = Date.now() - dbStart;
      dbStatus = "connected";
    } catch (error) {
      console.error("Database health check failed:", error);
    }

    // Check feature flags
    const aiProvidersConfigured = config.ai.providerFallbackOrder.map(
      (provider) => ({
        provider,
        configured:
          (provider === "openai" && !!config.openai.apiKey) ||
          (provider === "gemini" && !!config.gemini.apiKey) ||
          (provider === "deepseek" && !!config.deepseek.apiKey),
      })
    );

    const features = {
      pgvectorEnabled: process.env.USE_PGVECTOR === "true",
      aiSearchEnabled:
        config.ai.featuresEnabled &&
        aiProvidersConfigured.some((item) => item.configured),
      aiProviderFallbackOrder: config.ai.providerFallbackOrder,
      aiProvidersConfigured,
      fileUploadEnabled:
        config.featureFlags.uploads &&
        (!!config.aws.access_key_id || !!process.env.AWS_S3_BUCKET),
      oauthEnabled: !!process.env.GOOGLE_CLIENT_ID,
    };

    const status = {
      api: {
        status: "healthy",
        version: process.env.npm_package_version || "1.0.0",
        environment: process.env.NODE_ENV || "development",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      },
      database: {
        status: dbStatus,
        responseTime: dbResponseTime,
      },
      features,
      endpoints: {
        documentation: "/docs",
        health: "/health",
        apiBase: "/api",
      },
    };

    res.status(200).json({
      success: true,
      message: "API status retrieved successfully",
      data: status,
    });
  } catch (error) {
    console.error("Status check failed:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve API status",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};

/**
 * @swagger
 * /api/routes:
 *   get:
 *     summary: Available API Routes
 *     description: Get a list of all available API routes and their methods
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Available routes retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Available routes retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     routes:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           path:
 *                             type: string
 *                             example: "/api/auth/oauth/signin"
 *                           method:
 *                             type: string
 *                             example: "POST"
 *                           description:
 *                             type: string
 *                             example: "OAuth Sign-in"
 *                     documentation:
 *                       type: string
 *                       example: "Visit /docs for interactive API documentation"
 */
export const getAvailableRoutes = (req: Request, res: Response) => {
  const routes = [
    // Health & Status
    { path: "/health", method: "GET", description: "Health Check" },
    { path: "/api/health", method: "GET", description: "Health Check (API)" },
    {
      path: "/api/status",
      method: "GET",
      description: "Comprehensive API Status",
    },
    { path: "/api/routes", method: "GET", description: "Available API Routes" },

    // Authentication
    {
      path: "/api/auth/oauth/signin",
      method: "POST",
      description: "OAuth Sign-in",
    },
    {
      path: "/api/auth/session/validate",
      method: "POST",
      description: "Validate Session Token",
    },
    {
      path: "/api/auth/session/get",
      method: "POST",
      description: "Get Session Information",
    },
    {
      path: "/api/auth/session",
      method: "DELETE",
      description: "Logout (Delete Session)",
    },
    {
      path: "/api/auth/me",
      method: "GET",
      description: "Get Current User Profile (Protected)",
    },
    {
      path: "/api/auth/profile",
      method: "GET",
      description: "Get User Profile (Optional Auth)",
    },

    // Users
    {
      path: "/api/user",
      method: "GET",
      description: "Get All Users (Paginated)",
    },
    { path: "/api/user/me", method: "GET", description: "Get My Profile" },
    {
      path: "/api/user/change-password",
      method: "POST",
      description: "Change Password",
    },

    // Documentation
    {
      path: "/docs",
      method: "GET",
      description: "Interactive API Documentation (Swagger UI)",
    },
    {
      path: "/docs.json",
      method: "GET",
      description: "OpenAPI JSON Specification",
    },
  ];

  res.status(200).json({
    success: true,
    message: "Available routes retrieved successfully",
    data: {
      routes,
      totalRoutes: routes.length,
      documentation:
        "Visit /docs for interactive API documentation with 'Try it out' functionality",
    },
  });
};
