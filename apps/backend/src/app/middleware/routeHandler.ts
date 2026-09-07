import { Request, Response } from "express";

/**
 * 404 Route Not Found middleware.
 *
 * Responds with a clean JSON 404 directly instead of next(error) — with the
 * global error handler currently registered before this middleware in
 * server.ts, next(error) here fell through to Express's DEFAULT error
 * handler (HTML/500-style noise). Deterministic + never crashes the process.
 */
export const routeNotFound = (req: Request, res: Response) => {
  return res.status(404).json({
    success: false,
    statusCode: 404,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    errorSources: [
      {
        path: req.originalUrl,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
      },
    ],
  });
};

/**
 * Health check endpoint handler
 *
 * @swagger
 * /health:
 *   get:
 *     summary: Health Check
 *     description: Check the health status of the API server
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy and running
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
 *                   example: "Scholar-Flow API is running!"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-01-01T12:00:00.000Z"
 *                 environment:
 *                   type: string
 *                   example: "development"
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 *
 * /api/health:
 *   get:
 *     summary: Health Check (API Route)
 *     description: Check the health status of the API server (alternative endpoint under /api)
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy and running
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
 *                   example: "Scholar-Flow API is running!"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-01-01T12:00:00.000Z"
 *                 environment:
 *                   type: string
 *                   example: "development"
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 */
export const healthCheck = (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Scholar-Flow API is running!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    version: process.env.npm_package_version || "1.0.0",
  });
};
