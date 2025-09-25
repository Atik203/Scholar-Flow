import { Request, Response } from "express";
import ApiError from "../../errors/ApiError";
import { AuthenticatedRequest } from "../../interfaces/common";
import catchAsync from "../../shared/catchAsync";
import emailService from "../../shared/emailService";
import prisma from "../../shared/prisma";
import {
  sendPaginatedResponse,
  sendSuccessResponse,
} from "../../shared/sendResponse";
import { CollectionService } from "./collection.service";
import {
  addPaperToCollectionSchema,
  createCollectionSchema,
  inviteMemberSchema,
  updateCollectionSchema,
} from "./collection.validation";

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

      // Automatically add the creator as an ACCEPTED member
      await prisma.collectionMember.create({
        data: {
          collectionId: collection.id,
          userId: userId,
          role: "RESEARCHER",
          status: "ACCEPTED",
          acceptedAt: new Date(),
          invitedAt: new Date(),
        },
      });

      sendSuccessResponse(
        res,
        collection,
        "Collection created successfully",
        201
      );
    } catch (collectionError) {
      console.error("Error creating collection:", collectionError);
      throw new ApiError(500, "Failed to create collection");
    }
  }),

  // Get collections shared with the authenticated user (accepted or pending)
  getSharedCollections: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) {
      throw new ApiError(401, "Authentication required");
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Use raw queries for performance and to include member status
    // Only show collections where user is NOT the owner and has ACCEPTED membership
    const userId = authReq.user.id;
    const collections = await prisma.$queryRaw<any[]>`
      SELECT c.*, cm.status as "memberStatus", cm.permission as "userPermission", owner.name as "ownerName", owner.email as "ownerEmail"
      FROM "Collection" c
      JOIN "CollectionMember" cm ON cm."collectionId" = c.id AND cm."isDeleted" = false
      JOIN "User" owner ON owner.id = c."ownerId"
      WHERE cm."userId" = ${userId} 
        AND c."isDeleted" = false 
        AND c."ownerId" != ${userId}
        AND cm.status = 'ACCEPTED'
      ORDER BY c."createdAt" DESC
      LIMIT ${limit} OFFSET ${skip}
    `;
    const totalRes = await prisma.$queryRaw<any[]>`
      SELECT COUNT(*)::int as count
      FROM "CollectionMember" cm
      JOIN "Collection" c ON c.id = cm."collectionId"
      WHERE cm."userId" = ${userId} 
        AND cm."isDeleted" = false 
        AND c."isDeleted" = false
        AND c."ownerId" != ${userId}
        AND cm.status = 'ACCEPTED'
    `;

    sendPaginatedResponse(
      res,
      collections,
      {
        page,
        limit,
        total: totalRes[0]?.count || 0,
        totalPage: Math.ceil((totalRes[0]?.count || 0) / limit),
      },
      "Shared collections retrieved successfully"
    );
  }),

  // Invites sent by me
  getInvitesSent: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) {
      throw new ApiError(401, "Authentication required");
    }
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const inviterId = authReq.user.id;
    const items = await prisma.$queryRaw<any[]>`
      SELECT cm.id, cm."collectionId", cm."userId", cm.status, cm.permission, cm."invitedAt", c.name as "collectionName", u.email as "inviteeEmail", u.name as "inviteeName"
      FROM "CollectionMember" cm
      JOIN "Collection" c ON c.id = cm."collectionId"
      JOIN "User" u ON u.id = cm."userId"
      WHERE cm."invitedById" = ${inviterId} AND cm."isDeleted" = false
      ORDER BY cm."invitedAt" DESC
      LIMIT ${limit} OFFSET ${skip}
    `;
    const totalRes = await prisma.$queryRaw<any[]>`
      SELECT COUNT(*)::int as count
      FROM "CollectionMember" cm
      WHERE cm."invitedById" = ${inviterId} AND cm."isDeleted" = false
    `;
    sendPaginatedResponse(
      res,
      items,
      {
        page,
        limit,
        total: totalRes[0]?.count || 0,
        totalPage: Math.ceil((totalRes[0]?.count || 0) / limit),
      },
      "Invites sent retrieved successfully"
    );
  }),

  // Invites received by me
  getInvitesReceived: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) {
      throw new ApiError(401, "Authentication required");
    }
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const userId = authReq.user.id;
    const items = await prisma.$queryRaw<any[]>`
      SELECT cm.id, cm."collectionId", cm.status, cm.permission, cm."invitedAt", cm."invitedById", c.name as "collectionName", inv."email" as "inviterEmail", inv.name as "inviterName"
      FROM "CollectionMember" cm
      JOIN "Collection" c ON c.id = cm."collectionId"
      LEFT JOIN "User" inv ON inv.id = cm."invitedById"
      WHERE cm."userId" = ${userId} 
        AND cm."isDeleted" = false 
        AND cm.status = 'PENDING'
        AND cm."invitedById" IS NOT NULL
        AND cm."invitedById" != ${userId}
      ORDER BY cm."invitedAt" DESC
      LIMIT ${limit} OFFSET ${skip}
    `;
    const totalRes = await prisma.$queryRaw<any[]>`
      SELECT COUNT(*)::int as count
      FROM "CollectionMember" cm
      WHERE cm."userId" = ${userId} 
        AND cm."isDeleted" = false 
        AND cm.status = 'PENDING'
        AND cm."invitedById" IS NOT NULL
        AND cm."invitedById" != ${userId}
    `;
    sendPaginatedResponse(
      res,
      items,
      {
        page,
        limit,
        total: totalRes[0]?.count || 0,
        totalPage: Math.ceil((totalRes[0]?.count || 0) / limit),
      },
      "Invites received retrieved successfully"
    );
  }),

  // Get user's collections
  getMyCollections: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) {
      throw new ApiError(401, "Authentication required");
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const workspaceId = req.query.workspaceId as string;
    const skip = (page - 1) * limit;

    const result = await CollectionService.getUserCollections(
      authReq.user.id,
      limit,
      skip,
      workspaceId
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

  // Invite a member to a collection by email
  inviteMember: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) {
      throw new ApiError(401, "Authentication required");
    }

    const { id } = req.params; // collection id
    const parsed = inviteMemberSchema.safeParse(req.body);
    if (!parsed.success) {
      const errorDetails = parsed.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join(", ");
      throw new ApiError(400, `Validation failed: ${errorDetails}`);
    }

    const { email, role, permission } = parsed.data;
    const inviterId = authReq.user.id;

    // Ensure inviter is the owner of the collection
    const collection = await prisma.collection.findFirst({
      where: { id, ownerId: inviterId, isDeleted: false },
    });
    if (!collection) {
      throw new ApiError(403, "Only the owner can invite members");
    }

    // Find the user by email
    const user = await prisma.user.findFirst({
      where: { email, isDeleted: false },
    });
    if (!user) {
      throw new ApiError(404, "User with this email does not exist");
    }

    // Prevent inviting self
    if (user.id === inviterId) {
      throw new ApiError(400, "You cannot invite yourself");
    }

    // Upsert membership to PENDING if not exists, otherwise update status back to PENDING
    const existing = await prisma.collectionMember.findFirst({
      where: { collectionId: id, userId: user.id, isDeleted: false },
    });

    let member;
    if (existing) {
      member = await prisma.collectionMember.update({
        where: { id: existing.id },
        data: {
          role: role as any,
          permission: permission as any,
          status: "PENDING" as any,
          invitedById: inviterId,
          invitedAt: new Date(),
          declinedAt: null,
          acceptedAt: null,
        },
      });
    } else {
      member = await prisma.collectionMember.create({
        data: {
          collectionId: id,
          userId: user.id,
          role: role as any,
          permission: permission as any,
          invitedById: inviterId,
          status: "PENDING" as any,
        },
      });
    }

    // Send invitation email
    try {
      const inviter = await prisma.user.findUnique({
        where: { id: inviterId },
        select: { name: true, email: true },
      });

      await emailService.sendCollectionInvitationEmail({
        email: user.email,
        name: user.name || user.email,
        collectionName: collection.name,
        inviterName: inviter?.name || inviter?.email || "A ScholarFlow user",
        collectionId: collection.id,
      });
    } catch (emailError) {
      // Log email error but don't fail the invitation
      console.error("Failed to send invitation email:", emailError);
    }

    sendSuccessResponse(
      res,
      { memberId: member.id },
      "Invitation sent successfully",
      201
    );
  }),

  // Accept an invite
  acceptInvite: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) {
      throw new ApiError(401, "Authentication required");
    }
    const { id } = req.params;

    const member = await prisma.collectionMember.findFirst({
      where: { collectionId: id, userId: authReq.user.id, isDeleted: false },
    });
    if (!member) throw new ApiError(404, "Invitation not found");

    const updated = await prisma.collectionMember.update({
      where: { id: member.id },
      data: {
        status: "ACCEPTED" as any,
        acceptedAt: new Date(),
        declinedAt: null,
      },
    });

    sendSuccessResponse(res, updated, "Invitation accepted");
  }),

  // Decline an invite
  declineInvite: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) {
      throw new ApiError(401, "Authentication required");
    }
    const { id } = req.params;

    const member = await prisma.collectionMember.findFirst({
      where: { collectionId: id, userId: authReq.user.id, isDeleted: false },
    });
    if (!member) throw new ApiError(404, "Invitation not found");

    const updated = await prisma.collectionMember.update({
      where: { id: member.id },
      data: { status: "DECLINED" as any, declinedAt: new Date() },
    });

    sendSuccessResponse(res, updated, "Invitation declined");
  }),

  // List collection members (owner only)
  getMembers: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) {
      throw new ApiError(401, "Authentication required");
    }
    const { id } = req.params;

    const collection = await prisma.collection.findFirst({
      where: { id, ownerId: authReq.user.id, isDeleted: false },
    });
    if (!collection) throw new ApiError(403, "Only the owner can view members");

    const members = await prisma.collectionMember.findMany({
      where: { collectionId: id, isDeleted: false },
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
        invitedBy: { select: { id: true, name: true, email: true } },
      },
      orderBy: { invitedAt: "desc" },
    });

    sendSuccessResponse(res, members, "Members retrieved successfully");
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
            addedAt: "desc",
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

    // Check access permissions and get user permission
    const isOwner = authReq.user?.id === collection.ownerId;
    const isPublic = collection.isPublic;
    const userPermission = authReq.user?.id
      ? await CollectionService.getUserPermission(id, authReq.user.id)
      : null;

    if (!isOwner && !isPublic && !userPermission) {
      throw new ApiError(403, "Access denied");
    }

    // Add user permission to response
    const responseData = {
      ...collection,
      userPermission: isOwner ? "OWNER" : userPermission,
    };

    sendSuccessResponse(res, responseData, "Collection retrieved successfully");
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

    // Check if collection exists
    const collection = await prisma.collection.findFirst({
      where: {
        id,
        isDeleted: false,
      },
    });

    if (!collection) {
      throw new ApiError(404, "Collection not found");
    }

    // Check edit permission
    const hasEditPermission = await CollectionService.hasEditPermission(
      id,
      authReq.user.id
    );
    if (!hasEditPermission) {
      throw new ApiError(
        403,
        "Access denied: You don't have edit permission for this collection"
      );
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

    // Check if collection exists
    const collection = await prisma.collection.findFirst({
      where: {
        id,
        isDeleted: false,
      },
    });

    if (!collection) {
      throw new ApiError(404, "Collection not found");
    }

    // Check edit permission
    const hasEditPermission = await CollectionService.hasEditPermission(
      id,
      authReq.user.id
    );
    if (!hasEditPermission) {
      throw new ApiError(
        403,
        "Access denied: You don't have edit permission for this collection"
      );
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
    if (!q || typeof q !== "string") {
      throw new ApiError(400, "Search query is required");
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const result = await CollectionService.searchCollections(q, limit, skip);

    sendPaginatedResponse(
      res,
      result.result,
      {
        page: 1,
        limit: 50,
        total: result.result.length,
        totalPage: 1,
        ...result.meta,
      },
      "Search results retrieved successfully"
    );
  }),

  // Get collection statistics
  getStats: catchAsync(async (req: Request, res: Response) => {
    const stats = await CollectionService.getCollectionStats();
    sendSuccessResponse(
      res,
      stats,
      "Collection statistics retrieved successfully"
    );
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

    // Check if collection exists
    const collection = await prisma.collection.findFirst({
      where: {
        id: collectionId,
        isDeleted: false,
      },
    });

    if (!collection) {
      throw new ApiError(404, "Collection not found");
    }

    // Check edit permission
    const hasEditPermission = await CollectionService.hasEditPermission(
      collectionId,
      userId
    );
    if (!hasEditPermission) {
      throw new ApiError(
        403,
        "Access denied: You don't have edit permission for this collection"
      );
    }

    // Check if paper exists and user has access
    const paper = await prisma.paper.findFirst({
      where: {
        id: paperId,
        isDeleted: false,
        OR: [{ uploaderId: userId }, { workspaceId: collection.workspaceId }],
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

    sendSuccessResponse(
      res,
      collectionPaper,
      "Paper added to collection successfully",
      201
    );
  }),

  // Remove paper from collection
  removePaper: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) {
      throw new ApiError(401, "Authentication required");
    }

    const { collectionId, paperId } = req.params;
    const userId = authReq.user.id;

    // Check if collection exists
    const collection = await prisma.collection.findFirst({
      where: {
        id: collectionId,
        isDeleted: false,
      },
    });

    if (!collection) {
      throw new ApiError(404, "Collection not found");
    }

    // Check edit permission
    const hasEditPermission = await CollectionService.hasEditPermission(
      collectionId,
      userId
    );
    if (!hasEditPermission) {
      throw new ApiError(
        403,
        "Access denied: You don't have edit permission for this collection"
      );
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

    sendSuccessResponse(
      res,
      null,
      "Paper removed from collection successfully"
    );
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
                status: "ACCEPTED" as any,
              },
            },
          },
        ],
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
          addedAt: "desc",
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
