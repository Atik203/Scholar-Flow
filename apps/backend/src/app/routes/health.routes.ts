import express, { Router } from "express";
import {
  basicHealthCheck,
  detailedHealthCheck,
  livenessProbe,
  readinessProbe,
} from "../services/health.service";

const router: Router = express.Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Basic health check
 *     description: Returns basic health status of the API
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "healthy"
 *                 message:
 *                   type: string
 *                   example: "Scholar-Flow API is running!"
 *                 timestamp:
 *                   type: string
 *                   example: "2024-01-01T12:00:00.000Z"
 *                 environment:
 *                   type: string
 *                   example: "development"
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 *                 uptime:
 *                   type: number
 *                   example: 3600.123
 */
router.get("/", basicHealthCheck);

/**
 * @swagger
 * /health/detailed:
 *   get:
 *     summary: Detailed health check
 *     description: Returns comprehensive health status including database, memory, and environment checks
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: All services are healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [healthy, degraded, unhealthy]
 *                 timestamp:
 *                   type: string
 *                 uptime:
 *                   type: number
 *                 environment:
 *                   type: string
 *                 version:
 *                   type: string
 *                 services:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       service:
 *                         type: string
 *                       status:
 *                         type: string
 *                         enum: [healthy, degraded, unhealthy]
 *                       responseTime:
 *                         type: number
 *                       error:
 *                         type: string
 *                       details:
 *                         type: object
 *                 overall:
 *                   type: object
 *                   properties:
 *                     healthy:
 *                       type: number
 *                     unhealthy:
 *                       type: number
 *                     degraded:
 *                       type: number
 *                     total:
 *                       type: number
 *       207:
 *         description: Some services are degraded
 *       503:
 *         description: One or more services are unhealthy
 */
router.get("/detailed", detailedHealthCheck);

/**
 * @swagger
 * /health/live:
 *   get:
 *     summary: Liveness probe
 *     description: Kubernetes/Docker liveness probe - checks if the application is alive
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Application is alive
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "alive"
 *                 timestamp:
 *                   type: string
 */
router.get("/live", livenessProbe);

/**
 * @swagger
 * /health/ready:
 *   get:
 *     summary: Readiness probe
 *     description: Kubernetes/Docker readiness probe - checks if the application is ready to serve traffic
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Application is ready
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "ready"
 *                 timestamp:
 *                   type: string
 *       503:
 *         description: Application is not ready (database unavailable)
 */
router.get("/ready", readinessProbe);

export default router;
