import { Router } from "express";
import { ActivityLogService } from "../services/activityLog.service";
import { authMiddleware } from "../middleware/auth";
import { validateRequest } from "../middleware/validateRequest";
import { z } from "zod";

const router: Router = Router();

// Validation schemas
const getActivityLogSchema = z.object({
  query: z.object({
    userId: z.string().uuid().optional(),
    workspaceId: z.string().uuid().optional(),
    entity: z.string().optional(),
    entityId: z.string().uuid().optional(),
    action: z.string().optional(),
    severity: z.enum(['INFO', 'WARNING', 'ERROR', 'CRITICAL']).optional(),
    startDate: z.string().datetime().optional().transform(val => val ? new Date(val) : undefined),
    endDate: z.string().datetime().optional().transform(val => val ? new Date(val) : undefined),
    limit: z.string().transform(Number).optional().default("50"),
    offset: z.string().transform(Number).optional().default("0")
  })
});

const getActivitySummarySchema = z.object({
  query: z.object({
    workspaceId: z.string().uuid().optional(),
    days: z.string().transform(Number).optional().default("7")
  })
});

const getEntityActivitySchema = z.object({
  params: z.object({
    entity: z.string(),
    entityId: z.string().uuid()
  })
});

const exportActivityLogSchema = z.object({
  query: z.object({
    userId: z.string().uuid().optional(),
    workspaceId: z.string().uuid().optional(),
    entity: z.string().optional(),
    entityId: z.string().uuid().optional(),
    action: z.string().optional(),
    severity: z.enum(['INFO', 'WARNING', 'ERROR', 'CRITICAL']).optional(),
    startDate: z.string().datetime().optional().transform(val => val ? new Date(val) : undefined),
    endDate: z.string().datetime().optional().transform(val => val ? new Date(val) : undefined),
    format: z.enum(['json', 'csv']).optional().default('json')
  })
});

/**
 * @swagger
 * /api/activity-log:
 *   get:
 *     summary: Get activity log entries
 *     description: Retrieve activity log entries with filtering options
 *     tags: [Activity Log]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by user ID
 *       - in: query
 *         name: workspaceId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by workspace ID
 *       - in: query
 *         name: entity
 *         schema:
 *           type: string
 *         description: Filter by entity type (paper, collection, workspace, discussion, etc.)
 *       - in: query
 *         name: entityId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by entity ID
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *         description: Filter by action type
 *       - in: query
 *         name: severity
 *         schema:
 *           type: string
 *           enum: [INFO, WARNING, ERROR, CRITICAL]
 *         description: Filter by severity level
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter by start date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter by end date
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Number of entries to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of entries to skip
 *     responses:
 *       200:
 *         description: Activity log entries retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get(
  "/",
  authMiddleware,
  validateRequest(getActivityLogSchema),
  async (req, res, next) => {
    try {
      const result = await ActivityLogService.getActivityLog(req, req.query);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /api/activity-log/summary:
 *   get:
 *     summary: Get activity summary
 *     description: Get activity summary for dashboard with trends and statistics
 *     tags: [Activity Log]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: workspaceId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by workspace ID
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 7
 *         description: Number of days to include in summary
 *     responses:
 *       200:
 *         description: Activity summary retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalActivities:
 *                       type: number
 *                       description: Total number of activities
 *                     activitiesByType:
 *                       type: object
 *                       description: Activities grouped by entity type
 *                     activitiesBySeverity:
 *                       type: object
 *                       description: Activities grouped by severity
 *                     recentActivities:
 *                       type: array
 *                       description: Most recent activities
 *                     trends:
 *                       type: object
 *                       description: Daily activity trends
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get(
  "/summary",
  authMiddleware,
  validateRequest(getActivitySummarySchema),
  async (req, res, next) => {
    try {
      const result = await ActivityLogService.getActivitySummary(
        req,
        req.query.workspaceId as string,
        Number(req.query.days)
      );
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /api/activity-log/entity/{entity}/{entityId}:
 *   get:
 *     summary: Get activity log for a specific entity
 *     description: Retrieve activity log entries for a specific entity (paper, collection, workspace, etc.)
 *     tags: [Activity Log]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: entity
 *         required: true
 *         schema:
 *           type: string
 *         description: Entity type (paper, collection, workspace, discussion, etc.)
 *       - in: path
 *         name: entityId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Entity ID
 *     responses:
 *       200:
 *         description: Entity activity log retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Entity not found or access denied
 *       500:
 *         description: Internal server error
 */
router.get(
  "/entity/:entity/:entityId",
  authMiddleware,
  validateRequest(getEntityActivitySchema),
  async (req, res, next) => {
    try {
      const activities = await ActivityLogService.getEntityActivity(
        req,
        req.params.entity,
        req.params.entityId
      );
      
      res.json({
        success: true,
        data: activities
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /api/activity-log/export:
 *   get:
 *     summary: Export activity log data
 *     description: Export activity log data in JSON or CSV format
 *     tags: [Activity Log]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by user ID
 *       - in: query
 *         name: workspaceId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by workspace ID
 *       - in: query
 *         name: entity
 *         schema:
 *           type: string
 *         description: Filter by entity type
 *       - in: query
 *         name: entityId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by entity ID
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *         description: Filter by action type
 *       - in: query
 *         name: severity
 *         schema:
 *           type: string
 *           enum: [INFO, WARNING, ERROR, CRITICAL]
 *         description: Filter by severity level
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter by start date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter by end date
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [json, csv]
 *           default: json
 *         description: Export format
 *     responses:
 *       200:
 *         description: Activity log exported successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     content:
 *                       type: string
 *                       description: Exported content
 *                     filename:
 *                       type: string
 *                       description: Suggested filename
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get(
  "/export",
  authMiddleware,
  validateRequest(exportActivityLogSchema),
  async (req, res, next) => {
    try {
      const result = await ActivityLogService.exportActivityLog(
        req,
        req.query,
        req.query.format as 'json' | 'csv'
      );
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
);

export { router as activityLogRoutes };
