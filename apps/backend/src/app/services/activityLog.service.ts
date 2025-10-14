import prisma from "../shared/prisma";
import ApiError from "../errors/ApiError";
import { AuthRequest } from "../middleware/auth";

export interface ActivityLogFilters {
  userId?: string;
  workspaceId?: string;
  entity?: string;
  entityId?: string;
  action?: string;
  severity?: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

export interface ActivityLogEntry {
  id: string;
  userId?: string | null;
  workspaceId?: string | null;
  entity: string;
  entityId: string;
  action: string;
  details?: any;
  metadata?: any;
  severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  createdAt: Date;
  user?: {
    id: string;
    name?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    image?: string | null;
  } | null;
  workspace?: {
    id: string;
    name: string;
  } | null;
}

export class ActivityLogService {
  /**
   * Log an activity entry
   */
  static async logActivity(
    userId: string | null,
    workspaceId: string | null,
    entity: string,
    entityId: string,
    action: string,
    details?: any,
    metadata?: any,
    severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL' = 'INFO'
  ): Promise<void> {
    try {
      await prisma.activityLogEntry.create({
        data: {
          userId,
          workspaceId,
          entity,
          entityId,
          action,
          details,
          metadata,
          severity
        }
      });
    } catch (error) {
      // Don't throw error for logging failures to avoid breaking main operations
      console.error('Failed to log activity:', error);
    }
  }

  /**
   * Get activity log entries with filtering
   */
  static async getActivityLog(
    req: AuthRequest,
    filters: ActivityLogFilters
  ): Promise<{ entries: ActivityLogEntry[]; total: number }> {
    const currentUserId = req.user?.id;
    if (!currentUserId) {
      throw new ApiError(401, 'User not authenticated');
    }

    try {
      const where: any = {
        isDeleted: false
      };

      // Apply filters
      if (filters.userId) {
        where.userId = filters.userId;
      }

      if (filters.workspaceId) {
        where.workspaceId = filters.workspaceId;
        
        // Verify user has access to this workspace
        const workspace = await prisma.workspace.findFirst({
          where: {
            id: filters.workspaceId,
            isDeleted: false,
            OR: [
              { ownerId: currentUserId },
              {
                members: {
                  some: {
                    userId: currentUserId,
                    isDeleted: false
                  }
                }
              }
            ]
          }
        });

        if (!workspace) {
          throw new ApiError(404, 'Workspace not found or access denied');
        }
      }

      if (filters.entity) {
        where.entity = filters.entity;
      }

      if (filters.entityId) {
        where.entityId = filters.entityId;
      }

      if (filters.action) {
        where.action = filters.action;
      }

      if (filters.severity) {
        where.severity = filters.severity;
      }

      if (filters.startDate || filters.endDate) {
        where.createdAt = {};
        if (filters.startDate) {
          where.createdAt.gte = filters.startDate;
        }
        if (filters.endDate) {
          where.createdAt.lte = filters.endDate;
        }
      }

      // If no specific workspace is requested, only show activities from workspaces user has access to
      if (!filters.workspaceId && !filters.userId) {
        const userWorkspaces = await prisma.workspace.findMany({
          where: {
            isDeleted: false,
            OR: [
              { ownerId: currentUserId },
              {
                members: {
                  some: {
                    userId: currentUserId,
                    isDeleted: false
                  }
                }
              }
            ]
          },
          select: { id: true }
        });

        const workspaceIds = userWorkspaces.map((w: any) => w.id);
        where.OR = [
          { workspaceId: { in: workspaceIds } },
          { userId: currentUserId } // Include user's own activities
        ];
      }

      const [entries, total] = await Promise.all([
        prisma.activityLogEntry.findMany({
          where,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                firstName: true,
                lastName: true,
                image: true
              }
            },
            workspace: {
              select: {
                id: true,
                name: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: filters.limit || 50,
          skip: filters.offset || 0
        }),
        prisma.activityLogEntry.count({ where })
      ]);

      return { entries, total };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Failed to fetch activity log');
    }
  }

  /**
   * Get activity summary for dashboard
   */
  static async getActivitySummary(
    req: AuthRequest,
    workspaceId?: string,
    days: number = 7
  ): Promise<{
    totalActivities: number;
    activitiesByType: { [key: string]: number };
    activitiesBySeverity: { [key: string]: number };
    recentActivities: ActivityLogEntry[];
    trends: { [key: string]: number };
  }> {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, 'User not authenticated');
    }
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    try {
      const where: any = {
        isDeleted: false,
        createdAt: {
          gte: startDate
        }
      };

      if (workspaceId) {
        where.workspaceId = workspaceId;
        
        // Verify access to workspace
        const workspace = await prisma.workspace.findFirst({
          where: {
            id: workspaceId,
            isDeleted: false,
            OR: [
              { ownerId: userId },
              {
                members: {
                  some: {
                    userId: userId,
                    isDeleted: false
                  }
                }
              }
            ]
          }
        });

        if (!workspace) {
          throw new ApiError(404, 'Workspace not found or access denied');
        }
      } else {
        // Get activities from user's workspaces
        const userWorkspaces = await prisma.workspace.findMany({
          where: {
            isDeleted: false,
            OR: [
              { ownerId: userId },
              {
                members: {
                  some: {
                    userId: userId,
                    isDeleted: false
                  }
                }
              }
            ]
          },
          select: { id: true }
        });

        const workspaceIds = userWorkspaces.map((w: any) => w.id);
        where.OR = [
          { workspaceId: { in: workspaceIds } },
          { userId: userId }
        ];
      }

      const [totalActivities, activitiesByType, activitiesBySeverity, recentActivities] = await Promise.all([
        prisma.activityLogEntry.count({ where }),
        
        prisma.activityLogEntry.groupBy({
          by: ['entity'],
          where,
          _count: {
            entity: true
          }
        }),
        
        prisma.activityLogEntry.groupBy({
          by: ['severity'],
          where,
          _count: {
            severity: true
          }
        }),
        
        prisma.activityLogEntry.findMany({
          where,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                firstName: true,
                lastName: true,
                image: true
              }
            },
            workspace: {
              select: {
                id: true,
                name: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        })
      ]);

      // Calculate trends (activities per day)
      const trends: { [key: string]: number } = {};
      for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayStart = new Date(date);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(date);
        dayEnd.setHours(23, 59, 59, 999);

        const dayActivities = await prisma.activityLogEntry.count({
          where: {
            ...where,
            createdAt: {
              gte: dayStart,
              lte: dayEnd
            }
          }
        });

        trends[date.toISOString().split('T')[0]] = dayActivities;
      }

      return {
        totalActivities,
        activitiesByType: activitiesByType.reduce((acc: any, item: any) => {
          acc[item.entity] = item._count.entity;
          return acc;
        }, {} as { [key: string]: number }),
        activitiesBySeverity: activitiesBySeverity.reduce((acc: any, item: any) => {
          acc[item.severity] = item._count.severity;
          return acc;
        }, {} as { [key: string]: number }),
        recentActivities,
        trends
      };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Failed to fetch activity summary');
    }
  }

  /**
   * Get activity log for a specific entity
   */
  static async getEntityActivity(
    req: AuthRequest,
    entity: string,
    entityId: string
  ): Promise<ActivityLogEntry[]> {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, 'User not authenticated');
    }

    try {
      // Verify access to the entity based on its type
      let hasAccess = false;

      switch (entity) {
        case 'paper':
          const paper = await prisma.paper.findFirst({
            where: {
              id: entityId,
              isDeleted: false,
              OR: [
                { uploaderId: userId },
                {
                  workspace: {
                    members: {
                      some: {
                        userId: userId,
                        isDeleted: false
                      }
                    }
                  }
                }
              ]
            }
          });
          hasAccess = !!paper;
          break;

        case 'collection':
          const collection = await prisma.collection.findFirst({
            where: {
              id: entityId,
              isDeleted: false,
              OR: [
                { ownerId: userId },
                {
                  members: {
                    some: {
                      userId: userId,
                      status: 'ACCEPTED',
                      isDeleted: false
                    }
                  }
                }
              ]
            }
          });
          hasAccess = !!collection;
          break;

        case 'workspace':
          const workspace = await prisma.workspace.findFirst({
            where: {
              id: entityId,
              isDeleted: false,
              OR: [
                { ownerId: userId },
                {
                  members: {
                    some: {
                      userId: userId,
                      isDeleted: false
                    }
                  }
                }
              ]
            }
          });
          hasAccess = !!workspace;
          break;

        case 'discussion':
          const discussion = await prisma.discussionThread.findFirst({
            where: {
              id: entityId,
              isDeleted: false,
              OR: [
                { userId },
                { paperId: { not: null } },
                { collectionId: { not: null } },
                { workspaceId: { not: null } }
              ]
            }
          });
          hasAccess = !!discussion;
          break;

        default:
          hasAccess = false;
      }

      if (!hasAccess) {
        throw new ApiError(404, 'Entity not found or access denied');
      }

      const entries = await prisma.activityLogEntry.findMany({
        where: {
          entity,
          entityId,
          isDeleted: false
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              firstName: true,
              lastName: true,
              image: true
            }
          },
          workspace: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 100
      });

      return entries;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Failed to fetch entity activity');
    }
  }

  /**
   * Clean up old activity log entries (for maintenance)
   */
  static async cleanupOldEntries(
    daysToKeep: number = 90
  ): Promise<{ deletedCount: number }> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      const result = await prisma.activityLogEntry.updateMany({
        where: {
          createdAt: {
            lt: cutoffDate
          },
          severity: {
            in: ['INFO', 'WARNING'] // Keep ERROR and CRITICAL entries longer
          },
          isDeleted: false
        },
        data: {
          isDeleted: true
        }
      });

      return { deletedCount: result.count };
    } catch (error) {
      throw new ApiError(500, 'Failed to cleanup old activity entries');
    }
  }

  /**
   * Export activity log data
   */
  static async exportActivityLog(
    req: AuthRequest,
    filters: ActivityLogFilters,
    format: 'json' | 'csv' = 'json'
  ): Promise<{ content: string; filename: string }> {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, 'User not authenticated');
    }

    try {
      const { entries } = await this.getActivityLog(req, {
        ...filters,
        limit: 10000 // Large limit for export
      });

      const timestamp = new Date().toISOString().split('T')[0];
      
      if (format === 'csv') {
        const csvContent = this.convertToCSV(entries);
        return {
          content: csvContent,
          filename: `activity-log-${timestamp}.csv`
        };
      } else {
        return {
          content: JSON.stringify(entries, null, 2),
          filename: `activity-log-${timestamp}.json`
        };
      }
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Failed to export activity log');
    }
  }

  /**
   * Convert activity entries to CSV format
   */
  private static convertToCSV(entries: ActivityLogEntry[]): string {
    const headers = [
      'Timestamp',
      'User',
      'Workspace',
      'Entity',
      'Entity ID',
      'Action',
      'Severity',
      'Details'
    ];

    const rows = entries.map(entry => [
      entry.createdAt.toISOString(),
      entry.user ? `${entry.user.firstName || ''} ${entry.user.lastName || ''}`.trim() || entry.user.name || 'Unknown' : 'System',
      entry.workspace?.name || 'N/A',
      entry.entity,
      entry.entityId,
      entry.action,
      entry.severity,
      entry.details ? JSON.stringify(entry.details) : ''
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    return csvContent;
  }
}
