import { NextFunction, Request, Response } from "express";
import ApiError from "../errors/ApiError";

/**
 * 404 Route Not Found middleware
 */
export const routeNotFound = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = new ApiError(
    404,
    `Route not found: ${req.method} ${req.originalUrl}`
  );
  next(error);
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
