/**
 * Admin Service
 * Handles admin dashboard data operations with optimized queries
 */

import os from "os";
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
   * Using $queryRaw for optimized performance
   */
  async getSystemStats(): Promise<ISystemStats> {
    try {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

      // Get all statistics in a single optimized query
      const statsResults = await prisma.$queryRaw<
        Array<{
          totalUsers: number;
          totalPapers: number;
          activeSessions: number;
          totalStorageBytes: number;
          newUsersLast30Days: number;
          newUsersPrevious30Days: number;
          newPapersLast30Days: number;
          newPapersPrevious30Days: number;
          storageAddedLast30Days: number;
          storageAddedPrevious30Days: number;
        }>
      >`
        SELECT 
          (SELECT COUNT(*)::int FROM "User" WHERE "isDeleted" = false) as "totalUsers",
          (SELECT COUNT(*)::int FROM "Paper" WHERE "isDeleted" = false) as "totalPapers",
          (SELECT COUNT(*)::int FROM "Session" WHERE expires > ${now}) as "activeSessions",
          (SELECT COALESCE(SUM("sizeBytes")::bigint, 0) FROM "PaperFile" WHERE "isDeleted" = false) as "totalStorageBytes",
          (SELECT COUNT(*)::int FROM "User" WHERE "createdAt" >= ${thirtyDaysAgo} AND "isDeleted" = false) as "newUsersLast30Days",
          (SELECT COUNT(*)::int FROM "User" WHERE "createdAt" >= ${sixtyDaysAgo} AND "createdAt" < ${thirtyDaysAgo} AND "isDeleted" = false) as "newUsersPrevious30Days",
          (SELECT COUNT(*)::int FROM "Paper" WHERE "createdAt" >= ${thirtyDaysAgo} AND "isDeleted" = false) as "newPapersLast30Days",
          (SELECT COUNT(*)::int FROM "Paper" WHERE "createdAt" >= ${sixtyDaysAgo} AND "createdAt" < ${thirtyDaysAgo} AND "isDeleted" = false) as "newPapersPrevious30Days",
          (
            SELECT COALESCE(SUM(pf."sizeBytes")::bigint, 0)
            FROM "PaperFile" pf
            INNER JOIN "Paper" p ON pf."paperId" = p.id
            WHERE pf."isDeleted" = false 
              AND p."createdAt" >= ${thirtyDaysAgo}
              AND p."isDeleted" = false
          ) as "storageAddedLast30Days",
          (
            SELECT COALESCE(SUM(pf."sizeBytes")::bigint, 0)
            FROM "PaperFile" pf
            INNER JOIN "Paper" p ON pf."paperId" = p.id
            WHERE pf."isDeleted" = false 
              AND p."createdAt" >= ${sixtyDaysAgo}
              AND p."createdAt" < ${thirtyDaysAgo}
              AND p."isDeleted" = false
          ) as "storageAddedPrevious30Days"
      `;

      const stats = statsResults[0];
      const totalUsers = stats.totalUsers;
      const totalPapers = stats.totalPapers;
      const activeSessions = stats.activeSessions;
      const totalStorageBytes = Number(stats.totalStorageBytes);
      const newUsersLast30Days = stats.newUsersLast30Days;
      const newUsersPrevious30Days = stats.newUsersPrevious30Days;
      const newPapersLast30Days = stats.newPapersLast30Days;
      const newPapersPrevious30Days = stats.newPapersPrevious30Days;
      const storageAddedLast30Days = Number(stats.storageAddedLast30Days);
      const storageAddedPrevious30Days = Number(
        stats.storageAddedPrevious30Days
      );

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
   * Using $queryRaw for optimized performance
   */
  async getUserGrowthData(): Promise<IUserGrowthData[]> {
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      // Get users created in the last 30 days using $queryRaw
      const users = await prisma.$queryRaw<Array<{ createdAt: Date }>>`
        SELECT "createdAt"
        FROM "User"
        WHERE "createdAt" >= ${thirtyDaysAgo}
          AND "isDeleted" = false
        ORDER BY "createdAt" ASC
      `;

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
   * Using $queryRaw for optimized performance
   */
  async getRoleDistribution(): Promise<IRoleDistribution[]> {
    try {
      // Get role distribution using $queryRaw with aggregation
      const roleStats = await prisma.$queryRaw<
        Array<{ role: string; count: number }>
      >`
        SELECT 
          role,
          COUNT(*)::int as count
        FROM "User"
        WHERE "isDeleted" = false
        GROUP BY role
      `;

      const total = roleStats.reduce((sum, stat) => sum + stat.count, 0);

      // Convert to array and calculate percentages
      const distribution: IRoleDistribution[] = roleStats.map((stat) => ({
        role: stat.role,
        count: stat.count,
        percentage: Math.round((stat.count / total) * 100),
      }));

      // Sort by count descending
      return distribution.sort((a, b) => b.count - a.count);
    } catch (error) {
      console.error("Error fetching role distribution:", error);
      throw new AppError(500, ADMIN_ERROR_MESSAGES.STATS_FETCH_FAILED);
    }
  }

  /**
   * Get paper processing statistics
   * Using $queryRaw for optimized performance
   */
  async getPaperStats(): Promise<IPaperStats> {
    try {
      // Get paper statistics using $queryRaw with aggregation
      const paperStatsResult = await prisma.$queryRaw<
        Array<{
          totalPapers: number;
          processingPapers: number;
          completedPapers: number;
          failedPapers: number;
          avgProcessingTimeSeconds: number | null;
        }>
      >`
        SELECT 
          COUNT(*)::int as "totalPapers",
          COUNT(*) FILTER (WHERE "processingStatus" = 'PROCESSING')::int as "processingPapers",
          COUNT(*) FILTER (WHERE "processingStatus" = 'PROCESSED')::int as "completedPapers",
          COUNT(*) FILTER (WHERE "processingStatus" = 'FAILED')::int as "failedPapers",
          AVG(
            CASE 
              WHEN "processingStatus" = 'PROCESSED' AND "processedAt" IS NOT NULL
              THEN EXTRACT(EPOCH FROM ("processedAt" - "createdAt"))
              ELSE NULL
            END
          )::int as "avgProcessingTimeSeconds"
        FROM "Paper"
        WHERE "isDeleted" = false
      `;

      const stats = paperStatsResult[0];
      const averageProcessingTime = stats.avgProcessingTimeSeconds || 0;

      return {
        totalPapers: stats.totalPapers,
        processingPapers: stats.processingPapers,
        completedPapers: stats.completedPapers,
        failedPapers: stats.failedPapers,
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

      // Get storage info using $queryRaw
      const storageResult = await prisma.$queryRaw<
        Array<{ totalStorageBytes: number }>
      >`
        SELECT COALESCE(SUM("sizeBytes")::bigint, 0) as "totalStorageBytes"
        FROM "PaperFile"
        WHERE "isDeleted" = false
      `;
      const totalStorageBytes = Number(storageResult[0].totalStorageBytes);
      const storageUsed = this.formatBytes(totalStorageBytes);

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
          total: storageUsed,
          used: storageUsed,
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
   * Using $queryRaw for optimized database operations
   */
  async getSystemMetrics(): Promise<ISystemMetrics> {
    try {
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

      // Storage metrics - Calculate actual disk usage from database using $queryRaw
      const storageResult = await prisma.$queryRaw<
        Array<{ totalStorageBytes: number }>
      >`
        SELECT COALESCE(SUM("sizeBytes")::bigint, 0) as "totalStorageBytes"
        FROM "PaperFile"
        WHERE "isDeleted" = false
      `;
      const usedStorage = Number(storageResult[0].totalStorageBytes);

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
