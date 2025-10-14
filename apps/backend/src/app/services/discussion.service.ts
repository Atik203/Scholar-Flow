import prisma from "../shared/prisma";
import ApiError from "../errors/ApiError";
import { AuthRequest } from "../middleware/auth";

export interface CreateDiscussionRequest {
  paperId?: string;
  collectionId?: string;
  workspaceId?: string;
  title: string;
  content: string;
  tags?: string[];
}

export interface CreateMessageRequest {
  threadId: string;
  content: string;
  parentId?: string;
}

export interface UpdateDiscussionRequest {
  title?: string;
  content?: string;
  isResolved?: boolean;
  isPinned?: boolean;
  tags?: string[];
}

export interface UpdateMessageRequest {
  content: string;
}

export class DiscussionService {
  /**
   * Create a new discussion thread
   */
  static async createThread(
    req: AuthRequest,
    data: CreateDiscussionRequest
  ): Promise<any> {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, 'User not authenticated');
    }

    try {
      // Validate access to the entity
      if (data.paperId) {
        const paper = await prisma.paper.findFirst({
          where: {
            id: data.paperId,
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

        if (!paper) {
          throw new ApiError(404, 'Paper not found or access denied');
        }
      }

      if (data.collectionId) {
        const collection = await prisma.collection.findFirst({
          where: {
            id: data.collectionId,
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

        if (!collection) {
          throw new ApiError(404, 'Collection not found or access denied');
        }
      }

      if (data.workspaceId) {
        const workspace = await prisma.workspace.findFirst({
          where: {
            id: data.workspaceId,
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
      }

      const thread = await prisma.discussionThread.create({
        data: {
          paperId: data.paperId,
          collectionId: data.collectionId,
          workspaceId: data.workspaceId,
          userId,
          title: data.title,
          content: data.content,
          tags: data.tags || []
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
          paper: {
            select: {
              id: true,
              title: true
            }
          },
          collection: {
            select: {
              id: true,
              name: true
            }
          },
          workspace: {
            select: {
              id: true,
              name: true
            }
          },
          _count: {
            select: {
              messages: true
            }
          }
        }
      });

      // Log activity
      await this.logActivity(userId, data.workspaceId || null, 'discussion', thread.id, 'created', {
        title: data.title,
        entityType: data.paperId ? 'paper' : data.collectionId ? 'collection' : 'workspace',
        entityId: data.paperId || data.collectionId || data.workspaceId
      });

      return thread;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Failed to create discussion thread');
    }
  }

  /**
   * Get discussion threads with filtering
   */
  static async getThreads(
    req: AuthRequest,
    filters: {
      paperId?: string;
      collectionId?: string;
      workspaceId?: string;
      isResolved?: boolean;
      isPinned?: boolean;
      tags?: string[];
      limit?: number;
      offset?: number;
    }
  ): Promise<{ threads: any[]; total: number }> {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, 'User not authenticated');
    }

    try {
      const where: any = {
        isDeleted: false,
        OR: [
          { userId }, // User's own threads
          { paperId: { not: null } }, // Paper discussions (if user has access)
          { collectionId: { not: null } }, // Collection discussions (if user has access)
          { workspaceId: { not: null } } // Workspace discussions (if user has access)
        ]
      };

      if (filters.paperId) {
        where.paperId = filters.paperId;
        // Verify access to paper
        const paper = await prisma.paper.findFirst({
          where: {
            id: filters.paperId,
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

        if (!paper) {
          throw new ApiError(404, 'Paper not found or access denied');
        }
      }

      if (filters.collectionId) {
        where.collectionId = filters.collectionId;
        // Verify access to collection
        const collection = await prisma.collection.findFirst({
          where: {
            id: filters.collectionId,
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

        if (!collection) {
          throw new ApiError(404, 'Collection not found or access denied');
        }
      }

      if (filters.workspaceId) {
        where.workspaceId = filters.workspaceId;
        // Verify access to workspace
        const workspace = await prisma.workspace.findFirst({
          where: {
            id: filters.workspaceId,
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
      }

      if (filters.isResolved !== undefined) {
        where.isResolved = filters.isResolved;
      }

      if (filters.isPinned !== undefined) {
        where.isPinned = filters.isPinned;
      }

      if (filters.tags && filters.tags.length > 0) {
        where.tags = {
          hasSome: filters.tags
        };
      }

      const [threads, total] = await Promise.all([
        prisma.discussionThread.findMany({
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
            paper: {
              select: {
                id: true,
                title: true
              }
            },
            collection: {
              select: {
                id: true,
                name: true
              }
            },
            workspace: {
              select: {
                id: true,
                name: true
              }
            },
            _count: {
              select: {
                messages: true
              }
            },
            messages: {
              take: 1,
              orderBy: {
                createdAt: 'desc'
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
                }
              }
            }
          },
          orderBy: [
            { isPinned: 'desc' },
            { createdAt: 'desc' }
          ],
          take: filters.limit || 20,
          skip: filters.offset || 0
        }),
        prisma.discussionThread.count({ where })
      ]);

      return { threads, total };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Failed to fetch discussion threads');
    }
  }

  /**
   * Get a specific discussion thread with messages
   */
  static async getThread(
    req: AuthRequest,
    threadId: string
  ): Promise<any> {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, 'User not authenticated');
    }

    try {
      const thread = await prisma.discussionThread.findFirst({
        where: {
          id: threadId,
          isDeleted: false,
          OR: [
            { userId }, // User's own thread
            { paperId: { not: null } }, // Paper discussions (if user has access)
            { collectionId: { not: null } }, // Collection discussions (if user has access)
            { workspaceId: { not: null } } // Workspace discussions (if user has access)
          ]
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
          paper: {
            select: {
              id: true,
              title: true
            }
          },
          collection: {
            select: {
              id: true,
              name: true
            }
          },
          workspace: {
            select: {
              id: true,
              name: true
            }
          },
          messages: {
            where: {
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
              replies: {
                where: {
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
                  }
                },
                orderBy: {
                  createdAt: 'asc'
                }
              }
            },
            orderBy: {
              createdAt: 'asc'
            }
          }
        }
      });

      if (!thread) {
        throw new ApiError(404, 'Discussion thread not found or access denied');
      }

      return thread;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Failed to fetch discussion thread');
    }
  }

  /**
   * Update a discussion thread
   */
  static async updateThread(
    req: AuthRequest,
    threadId: string,
    data: UpdateDiscussionRequest
  ): Promise<any> {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, 'User not authenticated');
    }

    try {
      const thread = await prisma.discussionThread.findFirst({
        where: {
          id: threadId,
          userId, // Only thread creator can update
          isDeleted: false
        }
      });

      if (!thread) {
        throw new ApiError(404, 'Discussion thread not found or access denied');
      }

      const updatedThread = await prisma.discussionThread.update({
        where: { id: threadId },
        data: {
          ...(data.title && { title: data.title }),
          ...(data.content && { content: data.content }),
          ...(data.isResolved !== undefined && { isResolved: data.isResolved }),
          ...(data.isPinned !== undefined && { isPinned: data.isPinned }),
          ...(data.tags && { tags: data.tags })
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
          paper: {
            select: {
              id: true,
              title: true
            }
          },
          collection: {
            select: {
              id: true,
              name: true
            }
          },
          workspace: {
            select: {
              id: true,
              name: true
            }
          },
          _count: {
            select: {
              messages: true
            }
          }
        }
      });

      // Log activity
      await this.logActivity(userId, thread.workspaceId, 'discussion', threadId, 'updated', {
        changes: Object.keys(data)
      });

      return updatedThread;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Failed to update discussion thread');
    }
  }

  /**
   * Delete a discussion thread
   */
  static async deleteThread(
    req: AuthRequest,
    threadId: string
  ): Promise<void> {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, 'User not authenticated');
    }

    try {
      const thread = await prisma.discussionThread.findFirst({
        where: {
          id: threadId,
          userId, // Only thread creator can delete
          isDeleted: false
        }
      });

      if (!thread) {
        throw new ApiError(404, 'Discussion thread not found or access denied');
      }

      await prisma.discussionThread.update({
        where: { id: threadId },
        data: { isDeleted: true }
      });

      // Also soft delete all messages
      await prisma.discussionMessage.updateMany({
        where: { threadId },
        data: { isDeleted: true }
      });

      // Log activity
      await this.logActivity(userId, thread.workspaceId, 'discussion', threadId, 'deleted', {
        title: thread.title
      });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Failed to delete discussion thread');
    }
  }

  /**
   * Add a message to a discussion thread
   */
  static async addMessage(
    req: AuthRequest,
    data: CreateMessageRequest
  ): Promise<any> {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, 'User not authenticated');
    }

    try {
      // Verify access to thread
      const thread = await prisma.discussionThread.findFirst({
        where: {
          id: data.threadId,
          isDeleted: false,
          OR: [
            { userId }, // User's own thread
            { paperId: { not: null } }, // Paper discussions (if user has access)
            { collectionId: { not: null } }, // Collection discussions (if user has access)
            { workspaceId: { not: null } } // Workspace discussions (if user has access)
          ]
        }
      });

      if (!thread) {
        throw new ApiError(404, 'Discussion thread not found or access denied');
      }

      // If replying to a message, verify parent exists
      if (data.parentId) {
        const parentMessage = await prisma.discussionMessage.findFirst({
          where: {
            id: data.parentId,
            threadId: data.threadId,
            isDeleted: false
          }
        });

        if (!parentMessage) {
          throw new ApiError(404, 'Parent message not found');
        }
      }

      const message = await prisma.discussionMessage.create({
        data: {
          threadId: data.threadId,
          userId,
          content: data.content,
          parentId: data.parentId
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
          parent: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  firstName: true,
                  lastName: true,
                  image: true
                }
              }
            }
          }
        }
      });

      // Update thread's updatedAt
      await prisma.discussionThread.update({
        where: { id: data.threadId },
        data: { updatedAt: new Date() }
      });

      // Log activity
      await this.logActivity(userId, thread.workspaceId, 'discussion', data.threadId, 'message_added', {
        messageId: message.id,
        isReply: !!data.parentId
      });

      return message;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Failed to add message to discussion');
    }
  }

  /**
   * Update a discussion message
   */
  static async updateMessage(
    req: AuthRequest,
    messageId: string,
    data: UpdateMessageRequest
  ): Promise<any> {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, 'User not authenticated');
    }

    try {
      const message = await prisma.discussionMessage.findFirst({
        where: {
          id: messageId,
          userId, // Only message author can update
          isDeleted: false
        },
        include: {
          thread: true
        }
      });

      if (!message) {
        throw new ApiError(404, 'Message not found or access denied');
      }

      // Store edit history
      const editHistory = message.editHistory as any[] || [];
      editHistory.push({
        previousContent: message.content,
        editedAt: new Date().toISOString(),
        editedBy: userId
      });

      const updatedMessage = await prisma.discussionMessage.update({
        where: { id: messageId },
        data: {
          content: data.content,
          isEdited: true,
          editHistory
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
          parent: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  firstName: true,
                  lastName: true,
                  image: true
                }
              }
            }
          }
        }
      });

      // Log activity
      await this.logActivity(userId, message.thread.workspaceId, 'discussion', message.threadId, 'message_updated', {
        messageId: messageId
      });

      return updatedMessage;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Failed to update message');
    }
  }

  /**
   * Delete a discussion message
   */
  static async deleteMessage(
    req: AuthRequest,
    messageId: string
  ): Promise<void> {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, 'User not authenticated');
    }

    try {
      const message = await prisma.discussionMessage.findFirst({
        where: {
          id: messageId,
          userId, // Only message author can delete
          isDeleted: false
        },
        include: {
          thread: true
        }
      });

      if (!message) {
        throw new ApiError(404, 'Message not found or access denied');
      }

      await prisma.discussionMessage.update({
        where: { id: messageId },
        data: { isDeleted: true }
      });

      // Log activity
      await this.logActivity(userId, message.thread.workspaceId, 'discussion', message.threadId, 'message_deleted', {
        messageId: messageId
      });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Failed to delete message');
    }
  }

  /**
   * Log activity for discussion actions
   */
  private static async logActivity(
    userId: string,
    workspaceId: string | null,
    entity: string,
    entityId: string,
    action: string,
    details?: any
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
          severity: 'INFO'
        }
      });
    } catch (error) {
      // Don't throw error for logging failures
      console.error('Failed to log activity:', error);
    }
  }
}
