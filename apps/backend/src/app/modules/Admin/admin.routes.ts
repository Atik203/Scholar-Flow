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

/**
 * @swagger
 * /api/admin/analytics/revenue:
 *   get:
 *     summary: Get Revenue Analytics
 *     description: Retrieve comprehensive revenue analytics including MRR, ARR, subscription metrics, and trends
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: timeRange
 *         schema:
 *           type: string
 *           enum: [7d, 30d, 90d, 1y]
 *           default: 30d
 *         description: Time range for analytics
 *     responses:
 *       200:
 *         description: Revenue analytics retrieved successfully
 *       401:
 *         description: Unauthorized - Admin access required
 */
router.get(
  "/analytics/revenue",
  authMiddleware,
  requireAdmin,
  rateLimiter,
  adminController.getRevenueAnalytics
);

/**
 * @swagger
 * /api/admin/analytics/top-customers:
 *   get:
 *     summary: Get Top Paying Customers
 *     description: Retrieve list of top paying customers with their subscription details
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of customers to return
 *     responses:
 *       200:
 *         description: Top customers retrieved successfully
 *       401:
 *         description: Unauthorized - Admin access required
 */
router.get(
  "/analytics/top-customers",
  authMiddleware,
  requireAdmin,
  rateLimiter,
  adminController.getTopCustomers
);

/**
 * @swagger
 * /api/admin/analytics/subscribers:
 *   get:
 *     summary: Get Subscriber Details
 *     description: Retrieve detailed list of all subscribers with pagination and filtering
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
 *           default: 20
 *         description: Items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, TRIALING, CANCELED, EXPIRED, PAST_DUE, all]
 *         description: Filter by subscription status
 *       - in: query
 *         name: planId
 *         schema:
 *           type: string
 *         description: Filter by plan ID
 *     responses:
 *       200:
 *         description: Subscriber details retrieved successfully
 *       401:
 *         description: Unauthorized - Admin access required
 */
router.get(
  "/analytics/subscribers",
  authMiddleware,
  requireAdmin,
  rateLimiter,
  adminController.getSubscriberDetails
);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get All Users
 *     description: Retrieve all users with pagination, search, and filtering capabilities
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
 *           default: 20
 *         description: Items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name or email
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [RESEARCHER, PRO_RESEARCHER, TEAM_LEAD, ADMIN, all]
 *         description: Filter by role
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, all]
 *         description: Filter by account status
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *       401:
 *         description: Unauthorized - Admin access required
 */
router.get(
  "/users",
  authMiddleware,
  requireAdmin,
  rateLimiter,
  adminController.getAllUsers
);

/**
 * @swagger
 * /api/admin/users/stats:
 *   get:
 *     summary: Get User Statistics
 *     description: Retrieve user statistics for dashboard cards
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User statistics retrieved successfully
 *       401:
 *         description: Unauthorized - Admin access required
 */
router.get(
  "/users/stats",
  authMiddleware,
  requireAdmin,
  rateLimiter,
  adminController.getUserStats
);

/**
 * @swagger
 * /api/admin/users/{id}/role:
 *   patch:
 *     summary: Update User Role
 *     description: Update a user's role. Cannot change own role.
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [RESEARCHER, PRO_RESEARCHER, TEAM_LEAD, ADMIN]
 *     responses:
 *       200:
 *         description: User role updated successfully
 *       400:
 *         description: Invalid role
 *       403:
 *         description: Cannot change own role
 *       404:
 *         description: User not found
 */
router.patch(
  "/users/:id/role",
  authMiddleware,
  requireAdmin,
  rateLimiter,
  adminController.updateUserRole
);

/**
 * @swagger
 * /api/admin/users/{id}/deactivate:
 *   patch:
 *     summary: Deactivate User
 *     description: Soft delete a user account. Cannot deactivate own account.
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deactivated successfully
 *       400:
 *         description: User already deactivated
 *       403:
 *         description: Cannot deactivate own account
 *       404:
 *         description: User not found
 */
router.patch(
  "/users/:id/deactivate",
  authMiddleware,
  requireAdmin,
  rateLimiter,
  adminController.deactivateUser
);

/**
 * @swagger
 * /api/admin/users/{id}/reactivate:
 *   patch:
 *     summary: Reactivate User
 *     description: Restore a soft-deleted user account
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User reactivated successfully
 *       400:
 *         description: User is already active
 *       404:
 *         description: User not found
 */
router.patch(
  "/users/:id/reactivate",
  authMiddleware,
  requireAdmin,
  rateLimiter,
  adminController.reactivateUser
);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     summary: Permanently Delete User
 *     description: Hard delete a user account. This action cannot be undone. Cannot delete own account.
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User permanently deleted
 *       403:
 *         description: Cannot delete own account
 *       404:
 *         description: User not found
 */
router.delete(
  "/users/:id",
  authMiddleware,
  requireAdmin,
  rateLimiter,
  adminController.permanentlyDeleteUser
);

const adminRoutes: import("express").Router = router;
export { adminRoutes };
