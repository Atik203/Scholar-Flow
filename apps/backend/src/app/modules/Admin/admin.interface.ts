/**
 * Admin Module Interfaces
 * Type definitions for admin dashboard operations
 */

export interface ISystemStats {
  totalUsers: number;
  totalPapers: number;
  activeSessions: number;
  storageUsed: string;
  userGrowth: {
    count: number;
    percentageChange: number;
  };
  paperGrowth: {
    count: number;
    percentageChange: number;
  };
  sessionGrowth: {
    count: number;
    percentageChange: number;
  };
  storageGrowth: {
    amount: string;
    percentageChange: number;
  };
}

export interface IRecentUser {
  id: string;
  name: string | null;
  email: string;
  role: string;
  emailVerified: Date | null;
  createdAt: Date;
  lastLogin: Date | null;
  paperCount: number;
  workspaceCount: number;
}

export interface IUserGrowthData {
  date: string;
  totalUsers: number;
  newUsers: number;
  activeUsers: number;
}

export interface ISystemHealth {
  database: {
    status: "healthy" | "degraded" | "unhealthy";
    responseTime: number;
    activeConnections: number;
  };
  storage: {
    total: string;
    used: string;
    available: string;
    percentageUsed: number;
  };
  cache: {
    status: "healthy" | "degraded" | "unhealthy";
    hitRate: number;
  };
  uptime: number;
  lastChecked: Date;
}

export interface IAdminFilters {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  role?: string;
  status?: "active" | "inactive" | "all";
}

export interface IRoleDistribution {
  role: string;
  count: number;
  percentage: number;
}

export interface IPaperStats {
  totalPapers: number;
  processingPapers: number;
  completedPapers: number;
  failedPapers: number;
  averageProcessingTime: number;
}

export interface ISystemMetrics {
  health: {
    database: "healthy" | "degraded" | "unhealthy";
    server: "healthy" | "degraded" | "unhealthy";
    storage: "healthy" | "warning" | "critical";
    cpu: "healthy" | "warning" | "critical";
  };
  performance: {
    cpu: {
      usage: number; // percentage
      cores: number;
      loadAverage: number[];
    };
    memory: {
      total: number; // bytes
      used: number; // bytes
      free: number; // bytes
      usagePercentage: number;
    };
    disk: {
      total: number; // bytes
      used: number; // bytes
      free: number; // bytes
      usagePercentage: number;
      ioPercentage: number;
    };
    network: {
      bytesReceived: number;
      bytesSent: number;
      activeConnections: number;
      bandwidth: number; // percentage
    };
  };
  systemInfo: {
    platform: string;
    nodeVersion: string;
    databaseVersion: string;
    totalMemory: string;
    storageCapacity: string;
    uptime: number; // seconds
    lastChecked: Date;
  };
  database: {
    status: "healthy" | "degraded" | "unhealthy";
    responseTime: number; // ms
    activeConnections: number;
    maxConnections: number;
    connectionPoolUsage: number; // percentage
  };
}
