/**
 * Admin Module Constants
 * Success and error messages for admin operations
 */

export const ADMIN_SUCCESS_MESSAGES = {
  STATS_RETRIEVED: "System statistics retrieved successfully",
  USERS_RETRIEVED: "Recent users retrieved successfully",
  GROWTH_DATA_RETRIEVED: "User growth data retrieved successfully",
  HEALTH_CHECK_SUCCESS: "System health check completed",
  ROLE_DISTRIBUTION_RETRIEVED: "Role distribution retrieved successfully",
  PAPER_STATS_RETRIEVED: "Paper statistics retrieved successfully",
} as const;

export const ADMIN_ERROR_MESSAGES = {
  UNAUTHORIZED: "Admin access required",
  STATS_FETCH_FAILED: "Failed to fetch system statistics",
  USERS_FETCH_FAILED: "Failed to fetch recent users",
  GROWTH_DATA_FAILED: "Failed to fetch growth data",
  HEALTH_CHECK_FAILED: "System health check failed",
  INVALID_DATE_RANGE: "Invalid date range provided",
  INVALID_FILTERS: "Invalid filter parameters",
} as const;

export const CACHE_DURATIONS = {
  SYSTEM_STATS: 30, // 30 seconds
  RECENT_USERS: 60, // 1 minute
  GROWTH_DATA: 300, // 5 minutes
  HEALTH_CHECK: 60, // 1 minute
} as const;
