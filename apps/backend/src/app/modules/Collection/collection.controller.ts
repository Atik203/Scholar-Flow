import { Request, Response } from "express";
import ApiError from "../../errors/ApiError";
import { AuthenticatedRequest } from "../../interfaces/common";
import catchAsync from "../../shared/catchAsync";
import {
  sendPaginatedResponse,
  sendSuccessResponse,
} from "../../shared/sendResponse";
import prisma from "../../shared/prisma";
import { CollectionService } from "./collection.service";
import { createCollectionSchema, updateCollectionSchema, addPaperToCollectionSchema, removePaperFromCollectionSchema, paperCollectionParamsSchema } from "./collection.validation";

export const collectionController = {
  // Create a new collection
  create: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) {
      throw new ApiError(401, "Authentication required");
    }

    const parsed = createCollectionSchema.safeParse(req.body);
    if (!parsed.success) {
      const errorDetails = parsed.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join(", ");
      throw new ApiError(400, `Validation failed: ${errorDetails}`);
    }

    const { name, description, isPublic, workspaceId } = parsed.data;
    const userId = authReq.user.id;

    // Verify workspace ownership or create one if it doesn't exist
    let workspace = await prisma.workspace.findFirst({
      where: {
        id: workspaceId,
        ownerId: userId,
        isDeleted: false,
      },
    });

    // If workspace doesn't exist, create one for the user
    if (!workspace) {
      try {
        workspace = await prisma.workspace.create({
          data: {
            id: workspaceId,
            name: `${(authReq.user as any).name || authReq.user.email}'s Workspace`,
            ownerId: userId,
          },
        });

        // Also create a workspace member record
        await prisma.workspaceMember.create({
          data: {
            workspaceId: workspace.id,
            userId: userId,
            role: "RESEARCHER",
          },
        });
      } catch (workspaceError) {
        console.error("Error creating workspace:", workspaceError);
        throw new ApiError(500, "Failed to create workspace for collection");
      }
    }

    try {
      const collection = await prisma.collection.create({
        data: {
          name,
          description,
          isPublic: isPublic || false,
          workspaceId,
          ownerId: userId,
        },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              papers: true,
            },
          },
        },
      });

      sendSuccessResponse(res, collection, "Collection created successfully", 201);
    } catch (collectionError) {
      console.error("Error creating collection:", collectionError);
      throw new ApiError(500, "Failed to create collection");
    }
  }),

  // Get user's collections
  getMyCollections: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) {
      throw new ApiError(401, "Authentication required");
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const result = await CollectionService.getUserCollections(
      authReq.user.id,
      limit,
      skip
    );

    sendPaginatedResponse(
      res,
      result.result,
      result.meta,
      "Collections retrieved successfully"
    );
  }),

  // Get all public collections
  getPublicCollections: catchAsync(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const result = await CollectionService.getCollectionsWithCounts(
      limit,
      skip,
      true // isPublic = true
    );

    sendPaginatedResponse(
      res,
      result.result,
      result.meta,
      "Public collections retrieved successfully"
    );
  }),

  // Get a specific collection
  getOne: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const authReq = req as AuthenticatedRequest;

    const collection = await prisma.collection.findUnique({
      where: { id, isDeleted: false },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        papers: {
          include: {
            paper: {
              include: {
                file: true,
              },
            },
          },
          orderBy: {
            addedAt: 'desc',
          },
        },
        _count: {
          select: {
            papers: true,
            members: true,
          },
        },
      },
    });

    if (!collection) {
      throw new ApiError(404, "Collection not found");
    }

    // Check access permissions
    const isOwner = authReq.user?.id === collection.ownerId;
    const isPublic = collection.isPublic;
    const isMember = authReq.user?.id ? await prisma.collectionMember.findFirst({
      where: {
        collectionId: id,
        userId: authReq.user.id,
        isDeleted: false,
      },
    }) : null;

    if (!isOwner && !isPublic && !isMember) {
      throw new ApiError(403, "Access denied");
    }

    sendSuccessResponse(res, collection, "Collection retrieved successfully");
  }),

  // Update a collection
  update: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) {
      throw new ApiError(401, "Authentication required");
    }

    const { id } = req.params;
    const parsed = updateCollectionSchema.safeParse(req.body);
    if (!parsed.success) {
      const errorDetails = parsed.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join(", ");
      throw new ApiError(400, `Validation failed: ${errorDetails}`);
    }

    // Check ownership
    const collection = await prisma.collection.findFirst({
      where: {
        id,
        ownerId: authReq.user.id,
        isDeleted: false,
      },
    });

    if (!collection) {
      throw new ApiError(404, "Collection not found or access denied");
    }

    const updated = await prisma.collection.update({
      where: { id },
      data: parsed.data,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            papers: true,
          },
        },
      },
    });

    sendSuccessResponse(res, updated, "Collection updated successfully");
  }),

  // Delete a collection
  delete: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) {
      throw new ApiError(401, "Authentication required");
    }

    const { id } = req.params;

    // Check ownership
    const collection = await prisma.collection.findFirst({
      where: {
        id,
        ownerId: authReq.user.id,
        isDeleted: false,
      },
    });

    if (!collection) {
      throw new ApiError(404, "Collection not found or access denied");
    }

    // Soft delete the collection
    await prisma.collection.update({
      where: { id },
      data: { isDeleted: true },
    });

    sendSuccessResponse(res, null, "Collection deleted successfully");
  }),

  // Search collections
  search: catchAsync(async (req: Request, res: Response) => {
    const { q } = req.query;
    if (!q || typeof q !== 'string') {
      throw new ApiError(400, "Search query is required");
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const result = await CollectionService.searchCollections(q, limit, skip);

    sendPaginatedResponse(
      res,
      result.result,
      { page: 1, limit: 50, total: result.result.length, totalPage: 1, ...result.meta },
      "Search results retrieved successfully"
    );
  }),

  // Get collection statistics
  getStats: catchAsync(async (req: Request, res: Response) => {
    const stats = await CollectionService.getCollectionStats();
    sendSuccessResponse(res, stats, "Collection statistics retrieved successfully");
  }),

  // Add paper to collection
  addPaper: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) {
      throw new ApiError(401, "Authentication required");
    }

    const { collectionId } = req.params;
    const parsed = addPaperToCollectionSchema.safeParse(req.body);
    if (!parsed.success) {
      const errorDetails = parsed.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join(", ");
      throw new ApiError(400, `Validation failed: ${errorDetails}`);
    }

    const { paperId } = parsed.data;
    const userId = authReq.user.id;

    // Check if collection exists and user has access
    const collection = await prisma.collection.findFirst({
      where: {
        id: collectionId,
        isDeleted: false,
        OR: [
          { ownerId: userId },
          { 
            members: {
              some: {
                userId: userId,
                isDeleted: false,
                role: { in: ['RESEARCHER', 'PRO_RESEARCHER', 'TEAM_LEAD', 'ADMIN'] }
              }
            }
          }
        ]
      },
    });

    if (!collection) {
      throw new ApiError(404, "Collection not found or access denied");
    }

    // Check if paper exists and user has access
    const paper = await prisma.paper.findFirst({
      where: {
        id: paperId,
        isDeleted: false,
        OR: [
          { uploaderId: userId },
          { workspaceId: collection.workspaceId }
        ]
      },
    });

    if (!paper) {
      throw new ApiError(404, "Paper not found or access denied");
    }

    // Check if paper is already in collection
    const existingJoin = await prisma.collectionPaper.findFirst({
      where: {
        collectionId,
        paperId,
        isDeleted: false,
      },
    });

    if (existingJoin) {
      throw new ApiError(400, "Paper is already in this collection");
    }

    // Add paper to collection
    const collectionPaper = await prisma.collectionPaper.create({
      data: {
        collectionId,
        paperId,
        addedById: userId,
      },
      include: {
        paper: {
          include: {
            file: true,
          },
        },
      },
    });

    sendSuccessResponse(res, collectionPaper, "Paper added to collection successfully", 201);
  }),

  // Remove paper from collection
  removePaper: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) {
      throw new ApiError(401, "Authentication required");
    }

    const { collectionId, paperId } = req.params;
    const userId = authReq.user.id;

    // Check if collection exists and user has access
    const collection = await prisma.collection.findFirst({
      where: {
        id: collectionId,
        isDeleted: false,
        OR: [
          { ownerId: userId },
          { 
            members: {
              some: {
                userId: userId,
                isDeleted: false,
                role: { in: ['RESEARCHER', 'PRO_RESEARCHER', 'TEAM_LEAD', 'ADMIN'] }
              }
            }
          }
        ]
      },
    });

    if (!collection) {
      throw new ApiError(404, "Collection not found or access denied");
    }

    // Check if paper is in collection
    const collectionPaper = await prisma.collectionPaper.findFirst({
      where: {
        collectionId,
        paperId,
        isDeleted: false,
      },
    });

    if (!collectionPaper) {
      throw new ApiError(404, "Paper not found in this collection");
    }

    // Soft delete the collection-paper relationship
    await prisma.collectionPaper.update({
      where: { id: collectionPaper.id },
      data: { isDeleted: true },
    });

    sendSuccessResponse(res, null, "Paper removed from collection successfully");
  }),

  // Get papers in a collection
  getCollectionPapers: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const { collectionId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Check if collection exists and user has access
    const collection = await prisma.collection.findFirst({
      where: {
        id: collectionId,
        isDeleted: false,
        OR: [
          { isPublic: true },
          { ownerId: authReq.user?.id },
          { 
            members: {
              some: {
                userId: authReq.user?.id,
                isDeleted: false,
              }
            }
          }
        ]
      },
    });

    if (!collection) {
      throw new ApiError(404, "Collection not found or access denied");
    }

    // Get papers in collection
    const [papers, totalResult] = await Promise.all([
      prisma.collectionPaper.findMany({
        where: {
          collectionId,
          isDeleted: false,
        },
        include: {
          paper: {
            include: {
              file: true,
              uploader: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
        orderBy: {
          addedAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.collectionPaper.count({
        where: {
          collectionId,
          isDeleted: false,
        },
      }),
    ]);

    const total = totalResult;
    const totalPage = Math.ceil(total / limit);

    sendPaginatedResponse(
      res,
      papers,
      { page, limit, total, totalPage },
      "Collection papers retrieved successfully"
    );
  }),
};
