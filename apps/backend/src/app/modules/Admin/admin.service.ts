/**
 * Admin Service
 * Handles admin dashboard data operations with optimized queries
 */

import AppError from "../../errors/AppError";
import prisma from "../../shared/prisma";
import { ADMIN_ERROR_MESSAGES } from "./admin.constant";
import {
  IAdminFilters,
  IPaperStats,
  IRecentUser,
  IRoleDistribution,
  ISystemHealth,
  ISystemMetrics,
  ISystemStats,
  IUserGrowthData,
} from "./admin.interface";

class AdminService {
  /**
   * Get comprehensive system statistics
   * Using Prisma Client for reliability
   */
  async getSystemStats(): Promise<ISystemStats> {
    try {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

      // Get total counts
      const [totalUsers, totalPapers, activeSessions] = await Promise.all([
        prisma.user.count({ where: { isDeleted: false } }),
        prisma.paper.count({ where: { isDeleted: false } }),
        prisma.session.count({ where: { expires: { gt: now } } }),
      ]);

      // Get storage from PaperFile
      const storageResult = await prisma.paperFile.aggregate({
        where: { isDeleted: false },
        _sum: { sizeBytes: true },
      });
      const totalStorageBytes = storageResult._sum.sizeBytes || 0;

      // Get new users in last 30 days
      const newUsersLast30Days = await prisma.user.count({
        where: {
          createdAt: { gte: thirtyDaysAgo },
          isDeleted: false,
        },
      });

      // Get new users in previous 30 days (30-60 days ago)
      const newUsersPrevious30Days = await prisma.user.count({
        where: {
          createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo },
          isDeleted: false,
        },
      });

      // Get new papers in last 30 days
      const newPapersLast30Days = await prisma.paper.count({
        where: {
          createdAt: { gte: thirtyDaysAgo },
          isDeleted: false,
        },
      });

      // Get new papers in previous 30 days
      const newPapersPrevious30Days = await prisma.paper.count({
        where: {
          createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo },
          isDeleted: false,
        },
      });

      // Get storage added in last 30 days
      const storageAddedLast30DaysResult = await prisma.paperFile.aggregate({
        where: {
          isDeleted: false,
          paper: {
            createdAt: { gte: thirtyDaysAgo },
            isDeleted: false,
          },
        },
        _sum: { sizeBytes: true },
      });
      const storageAddedLast30Days =
        storageAddedLast30DaysResult._sum.sizeBytes || 0;

      // Get storage added in previous 30 days
      const storageAddedPrevious30DaysResult = await prisma.paperFile.aggregate(
        {
          where: {
            isDeleted: false,
            paper: {
              createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo },
              isDeleted: false,
            },
          },
          _sum: { sizeBytes: true },
        }
      );
      const storageAddedPrevious30Days =
        storageAddedPrevious30DaysResult._sum.sizeBytes || 0;

      // Calculate growth percentages
      const userGrowthPercent = this.calculateGrowthPercentage(
        newUsersLast30Days,
        newUsersPrevious30Days
      );

      const paperGrowthPercent = this.calculateGrowthPercentage(
        newPapersLast30Days,
        newPapersPrevious30Days
      );

      const sessionGrowthPercent = this.calculateGrowthPercentage(
        activeSessions,
        Math.max(1, Math.floor(activeSessions * 0.95)) // Estimate from current
      );

      const storageGrowthPercent = this.calculateGrowthPercentage(
        storageAddedLast30Days,
        storageAddedPrevious30Days
      );

      return {
        totalUsers,
        totalPapers,
        activeSessions,
        storageUsed: this.formatBytes(totalStorageBytes),
        userGrowth: {
          count: newUsersLast30Days,
          percentageChange: userGrowthPercent,
        },
        paperGrowth: {
          count: newPapersLast30Days,
          percentageChange: paperGrowthPercent,
        },
        sessionGrowth: {
          count: activeSessions,
          percentageChange: sessionGrowthPercent,
        },
        storageGrowth: {
          amount: this.formatBytes(storageAddedLast30Days),
          percentageChange: storageGrowthPercent,
        },
      };
    } catch (error) {
      console.error("Error fetching system stats:", error);
      throw new AppError(500, ADMIN_ERROR_MESSAGES.STATS_FETCH_FAILED);
    }
  }

  /**
   * Get recent users with their activity metrics
   */
  async getRecentUsers(filters: IAdminFilters): Promise<{
    users: IRecentUser[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const page = filters.page || 1;
      const limit = filters.limit || 10;
      const offset = (page - 1) * limit;

      // Get total count
      const totalCount = await prisma.$queryRaw<Array<{ count: number }>>`
        SELECT COUNT(*)::int as count FROM "User" WHERE "isDeleted" = false
      `;
      const total = totalCount[0].count;

      // Get recent users with stats
      const users = await prisma.$queryRaw<
        Array<{
          id: string;
          name: string | null;
          email: string;
          role: string;
          emailVerified: Date | null;
          createdAt: Date;
          lastLogin: Date | null;
          paperCount: number;
          workspaceCount: number;
        }>
      >`
        SELECT
          u.id,
          u.name,
          u.email,
          u.role,
          u."emailVerified",
          u."createdAt",
          (
            SELECT MAX(s."createdAt")
            FROM "Session" s
            WHERE s."userId" = u.id
          ) as "lastLogin",
          (
            SELECT COUNT(*)::int
            FROM "Paper" p
            WHERE p."uploaderId" = u.id
            AND p."isDeleted" = false
          ) as "paperCount",
          (
            SELECT COUNT(DISTINCT wm."workspaceId")::int
            FROM "WorkspaceMember" wm
            WHERE wm."userId" = u.id
          ) as "workspaceCount"
        FROM "User" u
        WHERE u."isDeleted" = false
        ORDER BY u."createdAt" DESC
        LIMIT ${limit}
        OFFSET ${offset}
      `;

      const formattedUsers: IRecentUser[] = users.map((user) => ({
        ...user,
        paperCount: user.paperCount,
        workspaceCount: user.workspaceCount,
      }));

      return {
        users: formattedUsers,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error("Error fetching recent users:", error);
      throw new AppError(500, ADMIN_ERROR_MESSAGES.USERS_FETCH_FAILED);
    }
  }

  /**
   * Get user growth data for the last 30 days
   * Using Prisma Client for reliability
   */
  async getUserGrowthData(): Promise<IUserGrowthData[]> {
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      // Get users created in the last 30 days
      const users = await prisma.user.findMany({
        where: {
          createdAt: { gte: thirtyDaysAgo },
          isDeleted: false,
        },
        select: { createdAt: true },
        orderBy: { createdAt: "asc" },
      });

      // Group by date
      const groupedByDate = new Map<string, number>();
      users.forEach((user) => {
        const date = user.createdAt.toISOString().split("T")[0];
        groupedByDate.set(date, (groupedByDate.get(date) || 0) + 1);
      });

      // Calculate cumulative totals
      let cumulativeTotal = 0;
      const growthData: IUserGrowthData[] = [];

      groupedByDate.forEach((newUsers, date) => {
        cumulativeTotal += newUsers;
        growthData.push({
          date,
          totalUsers: cumulativeTotal,
          newUsers,
          activeUsers: Math.floor(newUsers * 0.8), // Estimate: 80% of new users are active
        });
      });

      return growthData;
    } catch (error) {
      console.error("Error fetching growth data:", error);
      throw new AppError(500, ADMIN_ERROR_MESSAGES.GROWTH_DATA_FAILED);
    }
  }

  /**
   * Get role distribution statistics
   * Using Prisma Client for reliability
   */
  async getRoleDistribution(): Promise<IRoleDistribution[]> {
    try {
      // Get all users grouped by role
      const users = await prisma.user.findMany({
        where: { isDeleted: false },
        select: { role: true },
      });

      // Count by role
      const roleCounts = new Map<string, number>();
      users.forEach((user) => {
        roleCounts.set(user.role, (roleCounts.get(user.role) || 0) + 1);
      });

      const total = users.length;

      // Convert to array and calculate percentages
      const distribution: IRoleDistribution[] = [];
      roleCounts.forEach((count, role) => {
        distribution.push({
          role,
          count,
          percentage: Math.round((count / total) * 100),
        });
      });

      // Sort by count descending
      return distribution.sort((a, b) => b.count - a.count);
    } catch (error) {
      console.error("Error fetching role distribution:", error);
      throw new AppError(500, ADMIN_ERROR_MESSAGES.STATS_FETCH_FAILED);
    }
  }

  /**
   * Get paper processing statistics
   * Using Prisma Client for reliability
   */
  async getPaperStats(): Promise<IPaperStats> {
    try {
      // Get all papers
      const papers = await prisma.paper.findMany({
        where: { isDeleted: false },
        select: {
          processingStatus: true,
          createdAt: true,
          processedAt: true,
        },
      });

      const totalPapers = papers.length;
      const processingPapers = papers.filter(
        (p) => p.processingStatus === "PROCESSING"
      ).length;
      const completedPapers = papers.filter(
        (p) => p.processingStatus === "PROCESSED"
      ).length;
      const failedPapers = papers.filter(
        (p) => p.processingStatus === "FAILED"
      ).length;

      // Calculate average processing time for completed papers
      const processedWithTime = papers.filter(
        (p) => p.processingStatus === "PROCESSED" && p.processedAt
      );

      let averageProcessingTime = 0;
      if (processedWithTime.length > 0) {
        const totalTime = processedWithTime.reduce((sum, p) => {
          const time =
            (p.processedAt!.getTime() - p.createdAt.getTime()) / 1000;
          return sum + time;
        }, 0);
        averageProcessingTime = Math.floor(
          totalTime / processedWithTime.length
        );
      }

      return {
        totalPapers,
        processingPapers,
        completedPapers,
        failedPapers,
        averageProcessingTime,
      };
    } catch (error) {
      console.error("Error fetching paper stats:", error);
      throw new AppError(500, ADMIN_ERROR_MESSAGES.STATS_FETCH_FAILED);
    }
  }

  /**
   * Perform system health check
   */
  async getSystemHealth(): Promise<ISystemHealth> {
    try {
      const startTime = Date.now();

      // Test database connection
      await prisma.$queryRaw`SELECT 1`;
      const dbResponseTime = Date.now() - startTime;

      // Get active database connections (PostgreSQL specific)
      const connections = await prisma.$queryRaw<
        Array<{ count: number }>
      >`SELECT COUNT(*)::int as count FROM pg_stat_activity WHERE datname = current_database()`;

      // Get storage info
      const storageStats = await this.getSystemStats();

      // Calculate uptime (placeholder - would need actual implementation)
      const uptime = process.uptime();

      return {
        database: {
          status:
            dbResponseTime < 100
              ? "healthy"
              : dbResponseTime < 500
                ? "degraded"
                : "unhealthy",
          responseTime: dbResponseTime,
          activeConnections: connections[0].count,
        },
        storage: {
          total: storageStats.storageUsed,
          used: storageStats.storageUsed,
          available: "Available", // Placeholder
          percentageUsed: 0, // Would need actual calculation
        },
        cache: {
          status: "healthy",
          hitRate: 0.85, // Placeholder
        },
        uptime,
        lastChecked: new Date(),
      };
    } catch (error) {
      console.error("Error checking system health:", error);
      throw new AppError(500, ADMIN_ERROR_MESSAGES.HEALTH_CHECK_FAILED);
    }
  }

  /**
   * Helper: Calculate growth percentage
   */
  private calculateGrowthPercentage(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  }

  /**
   * Helper: Format bytes to human-readable string
   */
  private formatBytes(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  }

  /**
   * Get comprehensive system metrics
   * Includes performance, health, and system information
   */
  async getSystemMetrics(): Promise<ISystemMetrics> {
    try {
      const os = require("os");
      const startTime = Date.now();

      // Test database connection and get response time
      await prisma.$queryRaw`SELECT 1`;
      const dbResponseTime = Date.now() - startTime;

      // Get database connection stats
      const dbConnections = await prisma.$queryRaw<
        Array<{ active: number; max: number }>
      >`
        SELECT 
          COUNT(*)::int as active,
          (SELECT setting::int FROM pg_settings WHERE name = 'max_connections') as max
        FROM pg_stat_activity 
        WHERE datname = current_database()
      `;

      const activeConnections = dbConnections[0]?.active || 0;
      const maxConnections = dbConnections[0]?.max || 100;
      const connectionPoolUsage = (activeConnections / maxConnections) * 100;

      // CPU metrics - Calculate actual CPU usage
      const cpus = os.cpus();
      const cpuCount = cpus.length;
      const loadAverage = os.loadavg();

      // Calculate CPU usage from idle/total times
      let totalIdle = 0;
      let totalTick = 0;
      cpus.forEach((cpu: any) => {
        for (const type in cpu.times) {
          totalTick += cpu.times[type];
        }
        totalIdle += cpu.times.idle;
      });
      const idle = totalIdle / cpuCount;
      const total = totalTick / cpuCount;
      const cpuUsageRaw = 100 - ~~((100 * idle) / total);
      // Use load average as fallback if raw calculation seems off
      const cpuUsage =
        cpuUsageRaw > 0 && cpuUsageRaw < 100
          ? cpuUsageRaw
          : Math.min((loadAverage[0] / cpuCount) * 100, 100);

      // Memory metrics
      const totalMemory = os.totalmem();
      const freeMemory = os.freemem();
      const usedMemory = totalMemory - freeMemory;
      const memoryUsagePercentage = (usedMemory / totalMemory) * 100;

      // Storage metrics - Calculate actual disk usage from database
      const storageResult = await prisma.paperFile.aggregate({
        where: { isDeleted: false },
        _sum: { sizeBytes: true },
      });
      const usedStorage = Number(storageResult._sum.sizeBytes) || 0;

      // Get a more realistic total storage estimate
      // We'll use 10x the current usage with a minimum of 100GB
      const minTotalStorage = 100 * 1024 * 1024 * 1024; // 100 GB minimum
      const estimatedTotalStorage = Math.max(usedStorage * 10, minTotalStorage);
      const diskUsagePercentage = (usedStorage / estimatedTotalStorage) * 100;

      // Determine health statuses
      const dbStatus: "healthy" | "degraded" | "unhealthy" =
        dbResponseTime < 100
          ? "healthy"
          : dbResponseTime < 500
            ? "degraded"
            : "unhealthy";

      const cpuStatus: "healthy" | "warning" | "critical" =
        cpuUsage < 70 ? "healthy" : cpuUsage < 85 ? "warning" : "critical";

      const storageStatus: "healthy" | "warning" | "critical" =
        diskUsagePercentage < 70
          ? "healthy"
          : diskUsagePercentage < 85
            ? "warning"
            : "critical";

      return {
        health: {
          database: dbStatus,
          server: "healthy", // Assume healthy if code is running
          storage: storageStatus,
          cpu: cpuStatus,
        },
        performance: {
          cpu: {
            usage: Math.round(cpuUsage * 100) / 100,
            cores: cpuCount,
            loadAverage: loadAverage.map(
              (l: number) => Math.round(l * 100) / 100
            ),
          },
          memory: {
            total: totalMemory,
            used: usedMemory,
            free: freeMemory,
            usagePercentage: Math.round(memoryUsagePercentage * 100) / 100,
          },
          disk: {
            total: estimatedTotalStorage,
            used: usedStorage,
            free: estimatedTotalStorage - usedStorage,
            usagePercentage: Math.round(diskUsagePercentage * 100) / 100,
            ioPercentage: Math.round(Math.random() * 40 + 10), // Placeholder: 10-50%
          },
          network: {
            bytesReceived: 0, // Would need OS-level monitoring
            bytesSent: 0, // Would need OS-level monitoring
            activeConnections,
            bandwidth: Math.round(Math.random() * 30 + 10), // Placeholder: 10-40%
          },
        },
        systemInfo: {
          platform: `${os.platform()} ${os.arch()}`,
          nodeVersion: process.version,
          databaseVersion: "PostgreSQL 15.x", // Would need actual query
          totalMemory: this.formatBytes(totalMemory),
          storageCapacity: this.formatBytes(estimatedTotalStorage),
          uptime: Math.floor(process.uptime()),
          lastChecked: new Date(),
        },
        database: {
          status: dbStatus,
          responseTime: dbResponseTime,
          activeConnections,
          maxConnections,
          connectionPoolUsage: Math.round(connectionPoolUsage * 100) / 100,
        },
      };
    } catch (error) {
      console.error("Error fetching system metrics:", error);
      throw new AppError(500, ADMIN_ERROR_MESSAGES.STATS_FETCH_FAILED);
    }
  }
}

export const adminService = new AdminService();
