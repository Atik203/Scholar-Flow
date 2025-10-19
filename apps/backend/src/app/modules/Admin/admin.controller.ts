/**
 * Admin Controller
 * Handles admin dashboard HTTP requests with caching optimization
 */

import { Response } from "express";
import { AuthRequest } from "../../middleware/auth";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { AsyncAuthRequestHandler } from "../../types/express";
import { ADMIN_SUCCESS_MESSAGES, CACHE_DURATIONS } from "./admin.constant";
import { IAdminFilters } from "./admin.interface";
import { adminService } from "./admin.service";
import { analyticsService } from "./analytics.service";

class AdminController {
  /**
   * Get comprehensive system statistics
   * GET /api/admin/stats
   */
  getSystemStats: AsyncAuthRequestHandler = catchAsync(
    async (req: AuthRequest, res: Response) => {
      const stats = await adminService.getSystemStats();

      // Set cache headers for performance
      res.set({
        "Cache-Control": `public, max-age=${CACHE_DURATIONS.SYSTEM_STATS}`,
        "X-Cache-Duration": `${CACHE_DURATIONS.SYSTEM_STATS}s`,
      });

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: ADMIN_SUCCESS_MESSAGES.STATS_RETRIEVED,
        data: stats,
      });
    }
  );

  /**
   * Get recent users with activity metrics
   * GET /api/admin/users/recent
   */
  getRecentUsers: AsyncAuthRequestHandler = catchAsync(
    async (req: AuthRequest, res: Response) => {
      const filters: IAdminFilters = {
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        role: req.query.role as string | undefined,
        status: req.query.status as "active" | "inactive" | "all" | undefined,
      };

      const result = await adminService.getRecentUsers(filters);

      // Set cache headers
      res.set({
        "Cache-Control": `public, max-age=${CACHE_DURATIONS.RECENT_USERS}`,
        "X-Cache-Duration": `${CACHE_DURATIONS.RECENT_USERS}s`,
      });

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: ADMIN_SUCCESS_MESSAGES.USERS_RETRIEVED,
        data: result.users,
        meta: {
          page: result.page,
          limit: filters.limit || 10,
          total: result.total,
          totalPage: result.totalPages,
        },
      });
    }
  );

  /**
   * Get user growth data
   * GET /api/admin/growth
   */
  getUserGrowthData: AsyncAuthRequestHandler = catchAsync(
    async (req: AuthRequest, res: Response) => {
      const growthData = await adminService.getUserGrowthData();

      // Set cache headers
      res.set({
        "Cache-Control": `public, max-age=${CACHE_DURATIONS.GROWTH_DATA}`,
        "X-Cache-Duration": `${CACHE_DURATIONS.GROWTH_DATA}s`,
      });

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: ADMIN_SUCCESS_MESSAGES.GROWTH_DATA_RETRIEVED,
        data: growthData,
      });
    }
  );

  /**
   * Get role distribution statistics
   * GET /api/admin/roles/distribution
   */
  getRoleDistribution: AsyncAuthRequestHandler = catchAsync(
    async (req: AuthRequest, res: Response) => {
      const distribution = await adminService.getRoleDistribution();

      res.set({
        "Cache-Control": `public, max-age=${CACHE_DURATIONS.SYSTEM_STATS}`,
      });

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: ADMIN_SUCCESS_MESSAGES.ROLE_DISTRIBUTION_RETRIEVED,
        data: distribution,
      });
    }
  );

  /**
   * Get paper processing statistics
   * GET /api/admin/papers/stats
   */
  getPaperStats: AsyncAuthRequestHandler = catchAsync(
    async (req: AuthRequest, res: Response) => {
      const paperStats = await adminService.getPaperStats();

      res.set({
        "Cache-Control": `public, max-age=${CACHE_DURATIONS.SYSTEM_STATS}`,
      });

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: ADMIN_SUCCESS_MESSAGES.PAPER_STATS_RETRIEVED,
        data: paperStats,
      });
    }
  );

  /**
   * Get system health status
   * GET /api/admin/health
   */
  getSystemHealth: AsyncAuthRequestHandler = catchAsync(
    async (req: AuthRequest, res: Response) => {
      const health = await adminService.getSystemHealth();

      res.set({
        "Cache-Control": `public, max-age=${CACHE_DURATIONS.HEALTH_CHECK}`,
        "X-Cache-Duration": `${CACHE_DURATIONS.HEALTH_CHECK}s`,
      });

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: ADMIN_SUCCESS_MESSAGES.HEALTH_CHECK_SUCCESS,
        data: health,
      });
    }
  );

  /**
   * Get comprehensive system metrics
   * GET /api/admin/system/metrics
   */
  getSystemMetrics: AsyncAuthRequestHandler = catchAsync(
    async (req: AuthRequest, res: Response) => {
      const metrics = await adminService.getSystemMetrics();

      // Set aggressive cache for real-time monitoring (10 seconds)
      res.set({
        "Cache-Control": `public, max-age=10`,
        "X-Cache-Duration": "10s",
      });

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "System metrics retrieved successfully",
        data: metrics,
      });
    }
  );

  /**
   * Get revenue analytics for admin dashboard
   * GET /api/admin/analytics/revenue
   */
  getRevenueAnalytics: AsyncAuthRequestHandler = catchAsync(
    async (req: AuthRequest, res: Response) => {
      const timeRange =
        (req.query.timeRange as "7d" | "30d" | "90d" | "1y") || "30d";
      const analytics = await analyticsService.getRevenueAnalytics(timeRange);

      // Cache for 5 minutes - revenue data doesn't change frequently
      res.set({
        "Cache-Control": `public, max-age=${CACHE_DURATIONS.SYSTEM_STATS}`,
        "X-Cache-Duration": `${CACHE_DURATIONS.SYSTEM_STATS}s`,
      });

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Revenue analytics retrieved successfully",
        data: analytics,
      });
    }
  );

  /**
   * Get top paying customers
   * GET /api/admin/analytics/top-customers
   */
  getTopCustomers: AsyncAuthRequestHandler = catchAsync(
    async (req: AuthRequest, res: Response) => {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const customers = await analyticsService.getTopCustomers(limit);

      res.set({
        "Cache-Control": `public, max-age=${CACHE_DURATIONS.USER_ACTIVITY}`,
        "X-Cache-Duration": `${CACHE_DURATIONS.USER_ACTIVITY}s`,
      });

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Top customers retrieved successfully",
        data: customers,
      });
    }
  );

  /**
   * Get subscriber details with pagination
   * GET /api/admin/analytics/subscribers
   */
  getSubscriberDetails: AsyncAuthRequestHandler = catchAsync(
    async (req: AuthRequest, res: Response) => {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const status = req.query.status as string | undefined;
      const planId = req.query.planId as string | undefined;

      const result = await analyticsService.getSubscriberDetails(
        page,
        limit,
        status,
        planId
      );

      res.set({
        "Cache-Control": `public, max-age=${CACHE_DURATIONS.USER_ACTIVITY}`,
        "X-Cache-Duration": `${CACHE_DURATIONS.USER_ACTIVITY}s`,
      });

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Subscriber details retrieved successfully",
        data: result.subscribers,
        meta: {
          page: result.pagination.page,
          limit: result.pagination.limit,
          total: result.pagination.total,
          totalPage: result.pagination.totalPages,
        },
      });
    }
  );
}

export const adminController = new AdminController();
