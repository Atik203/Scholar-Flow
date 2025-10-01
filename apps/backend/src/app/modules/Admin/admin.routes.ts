/**
 * Admin Routes
 * Routes for admin dashboard and system management
 */

import express from "express";
import { authMiddleware, requireAdmin } from "../../middleware/auth";
import { performanceMonitor } from "../../middleware/performanceMonitor";
import { rateLimiter } from "../../middleware/rateLimiter";
import { adminController } from "./admin.controller";

const router = express.Router();

// Apply performance monitoring to all admin routes
router.use(performanceMonitor as any);

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Get System Statistics
 *     description: Retrieve comprehensive system statistics including users, papers, sessions, and storage. Admin only.
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: System statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/SystemStats'
 *       401:
 *         description: Unauthorized - Admin access required
 *       500:
 *         description: Server error
 */
router.get(
  "/stats",
  authMiddleware,
  requireAdmin,
  rateLimiter,
  adminController.getSystemStats
);

/**
 * @swagger
 * /api/admin/users/recent:
 *   get:
 *     summary: Get Recent Users
 *     description: Retrieve recent users with their activity metrics. Supports pagination.
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [RESEARCHER, PRO_RESEARCHER, TEAM_LEAD, ADMIN]
 *         description: Filter by role
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, all]
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: Recent users retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/users/recent",
  authMiddleware,
  requireAdmin,
  rateLimiter,
  adminController.getRecentUsers
);

/**
 * @swagger
 * /api/admin/growth:
 *   get:
 *     summary: Get User Growth Data
 *     description: Retrieve user growth statistics for the last 30 days
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Growth data retrieved successfully
 */
router.get(
  "/growth",
  authMiddleware,
  requireAdmin,
  rateLimiter,
  adminController.getUserGrowthData
);

/**
 * @swagger
 * /api/admin/roles/distribution:
 *   get:
 *     summary: Get Role Distribution
 *     description: Retrieve statistics about user role distribution
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Role distribution retrieved successfully
 */
router.get(
  "/roles/distribution",
  authMiddleware,
  requireAdmin,
  rateLimiter,
  adminController.getRoleDistribution
);

/**
 * @swagger
 * /api/admin/papers/stats:
 *   get:
 *     summary: Get Paper Statistics
 *     description: Retrieve paper processing statistics
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Paper stats retrieved successfully
 */
router.get(
  "/papers/stats",
  authMiddleware,
  requireAdmin,
  rateLimiter,
  adminController.getPaperStats
);

/**
 * @swagger
 * /api/admin/health:
 *   get:
 *     summary: System Health Check
 *     description: Check system health including database, storage, and cache status
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Health check completed successfully
 */
router.get(
  "/health",
  authMiddleware,
  requireAdmin,
  rateLimiter,
  adminController.getSystemHealth
);

/**
 * @swagger
 * /api/admin/system/metrics:
 *   get:
 *     summary: Get System Metrics
 *     description: Retrieve comprehensive system metrics including CPU, memory, disk, network, and database performance. Real-time monitoring endpoint.
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: System metrics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/SystemMetrics'
 *       401:
 *         description: Unauthorized - Admin access required
 *       500:
 *         description: Server error
 */
router.get(
  "/system/metrics",
  authMiddleware,
  requireAdmin,
  rateLimiter,
  adminController.getSystemMetrics
);

const adminRoutes: import("express").Router = router;
export { adminRoutes };
