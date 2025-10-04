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

    const workspaceRows = await prisma.$queryRaw<
      Array<{ id: string; ownerId: string }>
    >`
      SELECT id, "ownerId"
      FROM "Workspace"
      WHERE id = ${workspaceId}
        AND "ownerId" = ${userId}
        AND "isDeleted" = false
      LIMIT 1
    `;

    if (!workspaceRows.length) {
      try {
        const workspaceName = `${
          (authReq.user as any)?.name || authReq.user.email
        }'s Workspace`;

        await prisma.$executeRaw`
          INSERT INTO "Workspace" (
            id,
            name,
            "ownerId",
            "createdAt",
            "updatedAt",
            "isDeleted"
          ) VALUES (
            ${workspaceId},
            ${workspaceName},
            ${userId},
            NOW(),
            NOW(),
            false
          )
        `;

        await prisma.$executeRaw`
          INSERT INTO "WorkspaceMember" (
            id,
            "workspaceId",
            "userId",
            role,
            "createdAt",
            "updatedAt",
            "isDeleted"
          ) VALUES (
            gen_random_uuid(),
            ${workspaceId},
            ${userId},
            'RESEARCHER'::"Role",
            NOW(),
            NOW(),
            false
          )
          ON CONFLICT ("workspaceId", "userId") DO NOTHING
        `;
      } catch (workspaceError) {
        console.error("Error creating workspace:", workspaceError);
        throw new ApiError(500, "Failed to create workspace for collection");
      }
    }

    try {
      const collectionRows = await prisma.$queryRaw<
        Array<{
          id: string;
          workspaceId: string;
          ownerId: string;
          name: string;
          description: string | null;
          isPublic: boolean;
          createdAt: Date;
          updatedAt: Date;
        }>
      >`
        INSERT INTO "Collection" (
          id,
          "workspaceId",
          "ownerId",
          name,
          description,
          "isPublic",
          "createdAt",
          "updatedAt",
          "isDeleted"
        ) VALUES (
          gen_random_uuid(),
          ${workspaceId},
          ${userId},
          ${name},
          ${description ?? null},
          ${isPublic ?? false},
          NOW(),
          NOW(),
          false
        )
        RETURNING id, "workspaceId", "ownerId", name, description, "isPublic", "createdAt", "updatedAt"
      `;

      const collectionRow = collectionRows[0];
      if (!collectionRow) {
        throw new Error("Failed to insert collection record");
      }

      await prisma.$executeRaw`
        INSERT INTO "CollectionMember" (
          id,
          "collectionId",
          "userId",
          role,
          permission,
          status,
          "invitedById",
          "invitedAt",
          "acceptedAt",
          "createdAt",
          "updatedAt",
          "isDeleted"
        ) VALUES (
          gen_random_uuid(),
          ${collectionRow.id},
          ${userId},
          'RESEARCHER'::"Role",
          'EDIT'::"CollectionPermission",
          'ACCEPTED'::"MembershipStatus",
          ${userId},
          NOW(),
          NOW(),
          NOW(),
          NOW(),
          false
        )
        ON CONFLICT ("collectionId", "userId") DO UPDATE SET
          status = 'ACCEPTED',
          permission = EXCLUDED.permission,
          role = EXCLUDED.role,
          "acceptedAt" = NOW(),
          "declinedAt" = NULL,
          "updatedAt" = NOW()
      `;

      const ownerRows = await prisma.$queryRaw<
        Array<{ id: string; name: string | null; email: string | null }>
      >`
        SELECT id, name, email
        FROM "User"
        WHERE id = ${userId}
        LIMIT 1
      `;

      const owner = ownerRows[0];
      const responsePayload = {
        id: collectionRow.id,
        workspaceId: collectionRow.workspaceId,
        ownerId: collectionRow.ownerId,
        name: collectionRow.name,
        description: collectionRow.description,
        isPublic: collectionRow.isPublic,
        createdAt: collectionRow.createdAt,
        updatedAt: collectionRow.updatedAt,
        owner: owner
          ? {
              id: owner.id,
              name: owner.name,
              email: owner.email,
            }
          : {
              id: userId,
              name: null,
              email: authReq.user.email,
            },
        _count: {
          papers: 0,
        },
      };

      sendSuccessResponse(
        res,
        responsePayload,
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

    const collectionRows = await prisma.$queryRaw<
      Array<{ id: string; name: string }>
    >`
      SELECT id, name
      FROM "Collection"
      WHERE id = ${id}
        AND "ownerId" = ${inviterId}
        AND "isDeleted" = false
      LIMIT 1
    `;

    const collection = collectionRows[0];
    if (!collection) {
      throw new ApiError(403, "Only the owner can invite members");
    }

    const userRows = await prisma.$queryRaw<
      Array<{ id: string; email: string; name: string | null }>
    >`
      SELECT id, email, name
      FROM "User"
      WHERE email = ${email}
        AND "isDeleted" = false
      LIMIT 1
    `;

    const user = userRows[0];
    if (!user) {
      throw new ApiError(404, "User with this email does not exist");
    }

    if (user.id === inviterId) {
      throw new ApiError(400, "You cannot invite yourself");
    }

    const existingRows = await prisma.$queryRaw<Array<{ id: string }>>`
      SELECT id
      FROM "CollectionMember"
      WHERE "collectionId" = ${id}
        AND "userId" = ${user.id}
        AND "isDeleted" = false
      LIMIT 1
    `;

    let memberId: string | undefined;

    if (existingRows.length) {
      const updatedRows = await prisma.$queryRaw<Array<{ id: string }>>`
        UPDATE "CollectionMember"
        SET
          role = ${role ?? "RESEARCHER"}::"Role",
          permission = ${permission ?? "EDIT"}::"CollectionPermission",
          status = 'PENDING'::"MembershipStatus",
          "invitedById" = ${inviterId},
          "invitedAt" = NOW(),
          "declinedAt" = NULL,
          "acceptedAt" = NULL,
          "updatedAt" = NOW()
        WHERE id = ${existingRows[0].id}
        RETURNING id
      `;

      memberId = updatedRows[0]?.id ?? existingRows[0].id;
    } else {
      const insertedRows = await prisma.$queryRaw<Array<{ id: string }>>`
        INSERT INTO "CollectionMember" (
          id,
          "collectionId",
          "userId",
          role,
          permission,
          status,
          "invitedById",
          "invitedAt",
          "createdAt",
          "updatedAt",
          "isDeleted"
        ) VALUES (
          gen_random_uuid(),
          ${id},
          ${user.id},
          ${role ?? "RESEARCHER"}::"Role",
          ${permission ?? "EDIT"}::"CollectionPermission",
          'PENDING'::"MembershipStatus",
          ${inviterId},
          NOW(),
          NOW(),
          NOW(),
          false
        )
        RETURNING id
      `;

      memberId = insertedRows[0]?.id;
    }

    // Send invitation email (best-effort)
    try {
      const inviterRows = await prisma.$queryRaw<
        Array<{ name: string | null; email: string | null }>
      >`
        SELECT name, email
        FROM "User"
        WHERE id = ${inviterId}
        LIMIT 1
      `;

      const inviter = inviterRows[0];

      await emailService.sendCollectionInvitationEmail({
        email: user.email,
        name: user.name || user.email,
        collectionName: collection.name,
        inviterName: inviter?.name || inviter?.email || "A ScholarFlow user",
        collectionId: collection.id,
      });
    } catch (emailError) {
      console.error("Failed to send invitation email:", emailError);
    }

    if (!memberId) {
      throw new ApiError(500, "Failed to persist collection invitation");
    }

    sendSuccessResponse(res, { memberId }, "Invitation sent successfully", 201);
  }),

  // Accept an invite
  acceptInvite: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) {
      throw new ApiError(401, "Authentication required");
    }
    const { id } = req.params;

    const memberRows = await prisma.$queryRaw<Array<{ id: string }>>`
      SELECT id
      FROM "CollectionMember"
      WHERE "collectionId" = ${id}
        AND "userId" = ${authReq.user.id}
        AND "isDeleted" = false
      LIMIT 1
    `;

    const member = memberRows[0];
    if (!member) {
      throw new ApiError(404, "Invitation not found");
    }

    const updatedRows = await prisma.$queryRaw<
      Array<{
        id: string;
        collectionId: string;
        userId: string;
        role: string;
        permission: string;
        status: string;
        invitedById: string | null;
        invitedAt: Date;
        acceptedAt: Date | null;
        declinedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        isDeleted: boolean;
      }>
    >`
      UPDATE "CollectionMember"
      SET
        status = 'ACCEPTED',
        "acceptedAt" = NOW(),
        "declinedAt" = NULL,
        "updatedAt" = NOW()
      WHERE id = ${member.id}
      RETURNING id, "collectionId", "userId", role, permission, status, "invitedById", "invitedAt", "acceptedAt", "declinedAt", "createdAt", "updatedAt", "isDeleted"
    `;

    const updated = updatedRows[0];

    sendSuccessResponse(res, updated, "Invitation accepted");
  }),

  // Decline an invite
  declineInvite: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) {
      throw new ApiError(401, "Authentication required");
    }
    const { id } = req.params;

    const memberRows = await prisma.$queryRaw<Array<{ id: string }>>`
      SELECT id
      FROM "CollectionMember"
      WHERE "collectionId" = ${id}
        AND "userId" = ${authReq.user.id}
        AND "isDeleted" = false
      LIMIT 1
    `;

    const member = memberRows[0];
    if (!member) {
      throw new ApiError(404, "Invitation not found");
    }

    const updatedRows = await prisma.$queryRaw<
      Array<{
        id: string;
        collectionId: string;
        userId: string;
        role: string;
        permission: string;
        status: string;
        invitedById: string | null;
        invitedAt: Date;
        acceptedAt: Date | null;
        declinedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        isDeleted: boolean;
      }>
    >`
      UPDATE "CollectionMember"
      SET
        status = 'DECLINED',
        "declinedAt" = NOW(),
        "updatedAt" = NOW()
      WHERE id = ${member.id}
      RETURNING id, "collectionId", "userId", role, permission, status, "invitedById", "invitedAt", "acceptedAt", "declinedAt", "createdAt", "updatedAt", "isDeleted"
    `;

    const updated = updatedRows[0];

    sendSuccessResponse(res, updated, "Invitation declined");
  }),

  // List collection members (owner only)
  getMembers: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) {
      throw new ApiError(401, "Authentication required");
    }
    const { id } = req.params;

    const collectionRows = await prisma.$queryRaw<Array<{ id: string }>>`
      SELECT id
      FROM "Collection"
      WHERE id = ${id}
        AND "ownerId" = ${authReq.user.id}
        AND "isDeleted" = false
      LIMIT 1
    `;

    if (!collectionRows.length) {
      throw new ApiError(403, "Only the owner can view members");
    }

    const memberRows = await prisma.$queryRaw<
      Array<{
        id: string;
        collectionId: string;
        userId: string;
        role: string;
        permission: string;
        status: string;
        invitedAt: Date;
        invitedById: string | null;
        acceptedAt: Date | null;
        declinedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        isDeleted: boolean;
        user_id: string | null;
        user_name: string | null;
        user_email: string | null;
        user_image: string | null;
        inviter_id: string | null;
        inviter_name: string | null;
        inviter_email: string | null;
      }>
    >`
      SELECT
        cm.id,
        cm."collectionId",
        cm."userId",
        cm.role,
        cm.permission,
        cm.status,
        cm."invitedAt",
        cm."invitedById",
        cm."acceptedAt",
        cm."declinedAt",
        cm."createdAt",
        cm."updatedAt",
        cm."isDeleted",
        u.id AS user_id,
        u.name AS user_name,
        u.email AS user_email,
        u.image AS user_image,
        inv.id AS inviter_id,
        inv.name AS inviter_name,
        inv.email AS inviter_email
      FROM "CollectionMember" cm
      LEFT JOIN "User" u ON u.id = cm."userId"
      LEFT JOIN "User" inv ON inv.id = cm."invitedById"
      WHERE cm."collectionId" = ${id}
        AND cm."isDeleted" = false
      ORDER BY cm."invitedAt" DESC
    `;

    const members = memberRows.map((row) => ({
      id: row.id,
      collectionId: row.collectionId,
      userId: row.userId,
      role: row.role,
      permission: row.permission,
      status: row.status,
      invitedAt: row.invitedAt,
      invitedById: row.invitedById,
      acceptedAt: row.acceptedAt,
      declinedAt: row.declinedAt,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      isDeleted: row.isDeleted,
      user: row.user_id
        ? {
            id: row.user_id,
            name: row.user_name,
            email: row.user_email,
            image: row.user_image,
          }
        : null,
      invitedBy: row.inviter_id
        ? {
            id: row.inviter_id,
            name: row.inviter_name,
            email: row.inviter_email,
          }
        : null,
    }));

    sendSuccessResponse(res, members, "Members retrieved successfully");
  }),

  // Get a specific collection
  getOne: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const authReq = req as AuthenticatedRequest;

    const collectionRows = await prisma.$queryRaw<
      Array<{
        id: string;
        workspaceId: string;
        ownerId: string;
        name: string;
        description: string | null;
        isPublic: boolean;
        createdAt: Date;
        updatedAt: Date;
        ownerName: string | null;
        ownerEmail: string | null;
        paperCount: number;
        memberCount: number;
      }>
    >`
      SELECT
        c.id,
        c."workspaceId",
        c."ownerId",
        c.name,
        c.description,
        c."isPublic",
        c."createdAt",
        c."updatedAt",
        u.name AS "ownerName",
        u.email AS "ownerEmail",
        COALESCE(p_counts.paper_count, 0)::int AS "paperCount",
        COALESCE(m_counts.member_count, 0)::int AS "memberCount"
      FROM "Collection" c
      LEFT JOIN "User" u ON u.id = c."ownerId"
      LEFT JOIN (
        SELECT "collectionId", COUNT(*)::int AS paper_count
        FROM "CollectionPaper"
        WHERE "isDeleted" = false
        GROUP BY "collectionId"
      ) p_counts ON p_counts."collectionId" = c.id
      LEFT JOIN (
        SELECT "collectionId", COUNT(*)::int AS member_count
        FROM "CollectionMember"
        WHERE "isDeleted" = false AND status = 'ACCEPTED'
        GROUP BY "collectionId"
      ) m_counts ON m_counts."collectionId" = c.id
      WHERE c.id = ${id}
        AND c."isDeleted" = false
      LIMIT 1
    `;

    const collectionData = collectionRows[0];
    if (!collectionData) {
      throw new ApiError(404, "Collection not found");
    }

    // Check access permissions and get user permission
    const isOwner = authReq.user?.id === collectionData.ownerId;
    const isPublic = collectionData.isPublic;
    const userPermission = authReq.user?.id
      ? await CollectionService.getUserPermission(id, authReq.user.id)
      : null;

    if (!isOwner && !isPublic && !userPermission) {
      throw new ApiError(403, "Access denied");
    }

    // Get papers in collection
    const paperRows = await prisma.$queryRaw<
      Array<{
        cp_id: string;
        cp_addedAt: Date;
        paper_id: string;
        paper_title: string;
        paper_abstract: string | null;
        paper_doi: string | null;
        paper_source: string | null;
        paper_processingStatus: string;
        paper_createdAt: Date;
        paper_updatedAt: Date;
        file_id: string | null;
        file_objectKey: string | null;
        file_contentType: string | null;
        file_sizeBytes: number | null;
        file_originalFilename: string | null;
      }>
    >`
      SELECT
        cp.id AS cp_id,
        cp."addedAt" AS cp_addedAt,
        p.id AS paper_id,
        p.title AS paper_title,
        p.abstract AS paper_abstract,
        p.doi AS paper_doi,
        p.source AS paper_source,
        p."processingStatus" AS paper_processingStatus,
        p."createdAt" AS paper_createdAt,
        p."updatedAt" AS paper_updatedAt,
        pf.id AS file_id,
        pf."objectKey" AS file_objectKey,
        pf."contentType" AS file_contentType,
        pf."sizeBytes" AS file_sizeBytes,
        pf."originalFilename" AS file_originalFilename
      FROM "CollectionPaper" cp
      JOIN "Paper" p ON p.id = cp."paperId"
      LEFT JOIN "PaperFile" pf ON pf."paperId" = p.id AND pf."isDeleted" = false
      WHERE cp."collectionId" = ${id}
        AND cp."isDeleted" = false
      ORDER BY cp."addedAt" DESC
    `;

    const papers = paperRows.map((row) => ({
      id: row.cp_id,
      addedAt: row.cp_addedAt,
      paper: {
        id: row.paper_id,
        title: row.paper_title,
        abstract: row.paper_abstract,
        doi: row.paper_doi,
        source: row.paper_source,
        processingStatus: row.paper_processingStatus,
        createdAt: row.paper_createdAt,
        updatedAt: row.paper_updatedAt,
        file: row.file_id
          ? {
              id: row.file_id,
              objectKey: row.file_objectKey,
              contentType: row.file_contentType,
              sizeBytes: row.file_sizeBytes,
              originalFilename: row.file_originalFilename,
            }
          : null,
      },
    }));

    // Add user permission to response
    const responseData = {
      id: collectionData.id,
      workspaceId: collectionData.workspaceId,
      ownerId: collectionData.ownerId,
      name: collectionData.name,
      description: collectionData.description,
      isPublic: collectionData.isPublic,
      createdAt: collectionData.createdAt,
      updatedAt: collectionData.updatedAt,
      owner: {
        id: collectionData.ownerId,
        name: collectionData.ownerName,
        email: collectionData.ownerEmail,
      },
      papers,
      _count: {
        papers: collectionData.paperCount,
        members: collectionData.memberCount,
      },
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
    const collectionRows = await prisma.$queryRaw<Array<{ id: string }>>`
      SELECT id
      FROM "Collection"
      WHERE id = ${id}
        AND "isDeleted" = false
      LIMIT 1
    `;

    if (!collectionRows.length) {
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

    const { name, description, isPublic } = parsed.data;

    // Build update statement dynamically
    const updateFields: string[] = [];
    if (name !== undefined) {
      updateFields.push("name");
    }
    if (description !== undefined) {
      updateFields.push("description");
    }
    if (isPublic !== undefined) {
      updateFields.push("isPublic");
    }

    if (updateFields.length === 0) {
      throw new ApiError(400, "No fields to update");
    }

    // Use separate queries for simplicity and type safety
    const updatePromises = [];

    if (name !== undefined) {
      updatePromises.push(
        prisma.$executeRaw`
          UPDATE "Collection"
          SET name = ${name}, "updatedAt" = NOW()
          WHERE id = ${id}
        `
      );
    }
    if (description !== undefined) {
      updatePromises.push(
        prisma.$executeRaw`
          UPDATE "Collection"
          SET description = ${description}, "updatedAt" = NOW()
          WHERE id = ${id}
        `
      );
    }
    if (isPublic !== undefined) {
      updatePromises.push(
        prisma.$executeRaw`
          UPDATE "Collection"
          SET "isPublic" = ${isPublic}, "updatedAt" = NOW()
          WHERE id = ${id}
        `
      );
    }

    await Promise.all(updatePromises);

    // Fetch updated collection with owner and counts
    const updatedRows = await prisma.$queryRaw<
      Array<{
        id: string;
        workspaceId: string;
        ownerId: string;
        name: string;
        description: string | null;
        isPublic: boolean;
        createdAt: Date;
        updatedAt: Date;
        ownerName: string | null;
        ownerEmail: string | null;
        paperCount: number;
      }>
    >`
      SELECT
        c.id,
        c."workspaceId",
        c."ownerId",
        c.name,
        c.description,
        c."isPublic",
        c."createdAt",
        c."updatedAt",
        u.name AS "ownerName",
        u.email AS "ownerEmail",
        COALESCE(paper_counts.paper_count, 0)::int AS "paperCount"
      FROM "Collection" c
      LEFT JOIN "User" u ON u.id = c."ownerId"
      LEFT JOIN (
        SELECT "collectionId", COUNT(*)::int AS paper_count
        FROM "CollectionPaper"
        WHERE "isDeleted" = false
        GROUP BY "collectionId"
      ) paper_counts ON paper_counts."collectionId" = c.id
      WHERE c.id = ${id}
        AND c."isDeleted" = false
      LIMIT 1
    `;

    if (!updatedRows.length) {
      throw new ApiError(500, "Failed to update collection");
    }

    const updated = updatedRows[0];
    const responseData = {
      id: updated.id,
      workspaceId: updated.workspaceId,
      ownerId: updated.ownerId,
      name: updated.name,
      description: updated.description,
      isPublic: updated.isPublic,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
      owner: {
        id: updated.ownerId,
        name: updated.ownerName,
        email: updated.ownerEmail,
      },
      _count: {
        papers: updated.paperCount,
      },
    };

    sendSuccessResponse(res, responseData, "Collection updated successfully");
  }),

  // Delete a collection
  delete: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) {
      throw new ApiError(401, "Authentication required");
    }

    const { id } = req.params;

    // Check if collection exists
    const collectionRows = await prisma.$queryRaw<Array<{ id: string }>>`
      SELECT id
      FROM "Collection"
      WHERE id = ${id}
        AND "isDeleted" = false
      LIMIT 1
    `;

    if (!collectionRows.length) {
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
    await prisma.$executeRaw`
      UPDATE "Collection"
      SET "isDeleted" = true, "updatedAt" = NOW()
      WHERE id = ${id}
    `;

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
    const collectionRows = await prisma.$queryRaw<
      Array<{ id: string; workspaceId: string | null }>
    >`
      SELECT id, "workspaceId"
      FROM "Collection"
      WHERE id = ${collectionId}
        AND "isDeleted" = false
      LIMIT 1
    `;

    const collection = collectionRows[0];
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
    const paperRows = await prisma.$queryRaw<
      Array<{
        id: string;
        workspaceId: string;
        uploaderId: string;
      }>
    >`
      SELECT id, "workspaceId", "uploaderId"
      FROM "Paper"
      WHERE id = ${paperId}
        AND "isDeleted" = false
        AND (
          "uploaderId" = ${userId}
          OR "workspaceId" = ${collection.workspaceId}
        )
      LIMIT 1
    `;

    if (!paperRows.length) {
      throw new ApiError(404, "Paper not found or access denied");
    }

    // Check if paper is already in collection
    const existingJoin = await prisma.$queryRaw<Array<{ id: string }>>`
      SELECT id
      FROM "CollectionPaper"
      WHERE "collectionId" = ${collectionId}
        AND "paperId" = ${paperId}
        AND "isDeleted" = false
      LIMIT 1
    `;

    if (existingJoin.length) {
      throw new ApiError(400, "Paper is already in this collection");
    }

    // Add paper to collection
    const insertedRows = await prisma.$queryRaw<
      Array<{
        cp_id: string;
        cp_collectionId: string;
        cp_paperId: string;
        cp_addedById: string;
        cp_addedAt: Date;
        cp_createdAt: Date;
        cp_updatedAt: Date;
        paper_id: string;
        paper_workspaceId: string;
        paper_uploaderId: string;
        paper_title: string;
        paper_abstract: string | null;
        paper_metadata: unknown;
        paper_source: string | null;
        paper_doi: string | null;
        paper_processingStatus: string;
        paper_createdAt: Date;
        paper_updatedAt: Date;
        paper_previewFileKey: string | null;
        paper_previewMimeType: string | null;
        paper_originalMimeType: string | null;
        file_id: string | null;
        file_storageProvider: string | null;
        file_objectKey: string | null;
        file_contentType: string | null;
        file_sizeBytes: number | null;
        file_originalFilename: string | null;
        file_extractedAt: Date | null;
      }>
    >`
      WITH inserted AS (
        INSERT INTO "CollectionPaper" (
          id,
          "collectionId",
          "paperId",
          "addedById",
          "addedAt",
          "createdAt",
          "updatedAt",
          "isDeleted"
        ) VALUES (
          gen_random_uuid(),
          ${collectionId},
          ${paperId},
          ${userId},
          NOW(),
          NOW(),
          NOW(),
          false
        )
        RETURNING id, "collectionId", "paperId", "addedById", "addedAt", "createdAt", "updatedAt"
      )
      SELECT
        i.id AS cp_id,
        i."collectionId" AS cp_collectionId,
        i."paperId" AS cp_paperId,
        i."addedById" AS cp_addedById,
        i."addedAt" AS cp_addedAt,
        i."createdAt" AS cp_createdAt,
        i."updatedAt" AS cp_updatedAt,
        p.id AS paper_id,
        p."workspaceId" AS paper_workspaceId,
        p."uploaderId" AS paper_uploaderId,
        p.title AS paper_title,
        p.abstract AS paper_abstract,
        p.metadata AS paper_metadata,
        p.source AS paper_source,
        p.doi AS paper_doi,
        p."processingStatus" AS paper_processingStatus,
        p."createdAt" AS paper_createdAt,
        p."updatedAt" AS paper_updatedAt,
        p."previewFileKey" AS paper_previewFileKey,
        p."previewMimeType" AS paper_previewMimeType,
        p."originalMimeType" AS paper_originalMimeType,
        pf.id AS file_id,
        pf."storageProvider" AS file_storageProvider,
        pf."objectKey" AS file_objectKey,
        pf."contentType" AS file_contentType,
        pf."sizeBytes" AS file_sizeBytes,
        pf."originalFilename" AS file_originalFilename,
        pf."extractedAt" AS file_extractedAt
      FROM inserted i
      JOIN "Paper" p ON p.id = i."paperId"
      LEFT JOIN "PaperFile" pf ON pf."paperId" = p.id AND pf."isDeleted" = false
    `;

    const inserted = insertedRows[0];

    if (!inserted) {
      throw new ApiError(500, "Failed to add paper to collection");
    }

    const responsePayload = {
      id: inserted.cp_id,
      collectionId: inserted.cp_collectionId,
      paperId: inserted.cp_paperId,
      addedById: inserted.cp_addedById,
      addedAt: inserted.cp_addedAt,
      createdAt: inserted.cp_createdAt,
      updatedAt: inserted.cp_updatedAt,
      paper: {
        id: inserted.paper_id,
        workspaceId: inserted.paper_workspaceId,
        uploaderId: inserted.paper_uploaderId,
        title: inserted.paper_title,
        abstract: inserted.paper_abstract,
        metadata: inserted.paper_metadata,
        source: inserted.paper_source,
        doi: inserted.paper_doi,
        processingStatus: inserted.paper_processingStatus,
        createdAt: inserted.paper_createdAt,
        updatedAt: inserted.paper_updatedAt,
        previewFileKey: inserted.paper_previewFileKey,
        previewMimeType: inserted.paper_previewMimeType,
        originalMimeType: inserted.paper_originalMimeType,
        file: inserted.file_id
          ? {
              id: inserted.file_id,
              storageProvider: inserted.file_storageProvider,
              objectKey: inserted.file_objectKey,
              contentType: inserted.file_contentType,
              sizeBytes: inserted.file_sizeBytes,
              originalFilename: inserted.file_originalFilename,
              extractedAt: inserted.file_extractedAt,
            }
          : null,
      },
    };

    sendSuccessResponse(
      res,
      responsePayload,
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
    const collectionRows = await prisma.$queryRaw<Array<{ id: string }>>`
      SELECT id
      FROM "Collection"
      WHERE id = ${collectionId}
        AND "isDeleted" = false
      LIMIT 1
    `;

    if (!collectionRows.length) {
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
    const collectionPaperRows = await prisma.$queryRaw<Array<{ id: string }>>`
      SELECT id
      FROM "CollectionPaper"
      WHERE "collectionId" = ${collectionId}
        AND "paperId" = ${paperId}
        AND "isDeleted" = false
      LIMIT 1
    `;

    const collectionPaper = collectionPaperRows[0];
    if (!collectionPaper) {
      throw new ApiError(404, "Paper not found in this collection");
    }

    // Soft delete the collection-paper relationship
    await prisma.$executeRaw`
      UPDATE "CollectionPaper"
      SET "isDeleted" = true, "updatedAt" = NOW()
      WHERE id = ${collectionPaper.id}
    `;

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
    const collectionRows = await prisma.$queryRaw<
      Array<{
        id: string;
        isPublic: boolean;
        ownerId: string;
        hasMembership: boolean;
      }>
    >`
      SELECT
        c.id,
        c."isPublic",
        c."ownerId",
        CASE
          WHEN cm."userId" IS NOT NULL AND cm.status = 'ACCEPTED' THEN true
          ELSE false
        END AS "hasMembership"
      FROM "Collection" c
      LEFT JOIN "CollectionMember" cm
        ON cm."collectionId" = c.id
        AND cm."userId" = ${authReq.user?.id ?? null}
        AND cm."isDeleted" = false
        AND cm.status = 'ACCEPTED'
      WHERE c.id = ${collectionId}
        AND c."isDeleted" = false
      LIMIT 1
    `;

    const collection = collectionRows[0];
    if (!collection) {
      throw new ApiError(404, "Collection not found");
    }

    // Check access permissions
    const isOwner = authReq.user?.id === collection.ownerId;
    const isPublic = collection.isPublic;
    const hasMembership = collection.hasMembership;

    if (!isOwner && !isPublic && !hasMembership) {
      throw new ApiError(403, "Access denied");
    }

    // Get papers in collection
    const paperRows = await prisma.$queryRaw<
      Array<{
        cp_id: string;
        cp_collectionId: string;
        cp_paperId: string;
        cp_addedById: string;
        cp_addedAt: Date;
        cp_createdAt: Date;
        cp_updatedAt: Date;
        paper_id: string;
        paper_workspaceId: string;
        paper_uploaderId: string;
        paper_title: string;
        paper_abstract: string | null;
        paper_metadata: unknown;
        paper_source: string | null;
        paper_doi: string | null;
        paper_processingStatus: string;
        paper_createdAt: Date;
        paper_updatedAt: Date;
        file_id: string | null;
        file_storageProvider: string | null;
        file_objectKey: string | null;
        file_contentType: string | null;
        file_sizeBytes: number | null;
        file_originalFilename: string | null;
        uploader_id: string;
        uploader_name: string | null;
        uploader_email: string | null;
      }>
    >`
      SELECT
        cp.id AS cp_id,
        cp."collectionId" AS cp_collectionId,
        cp."paperId" AS cp_paperId,
        cp."addedById" AS cp_addedById,
        cp."addedAt" AS cp_addedAt,
        cp."createdAt" AS cp_createdAt,
        cp."updatedAt" AS cp_updatedAt,
        p.id AS paper_id,
        p."workspaceId" AS paper_workspaceId,
        p."uploaderId" AS paper_uploaderId,
        p.title AS paper_title,
        p.abstract AS paper_abstract,
        p.metadata AS paper_metadata,
        p.source AS paper_source,
        p.doi AS paper_doi,
        p."processingStatus" AS paper_processingStatus,
        p."createdAt" AS paper_createdAt,
        p."updatedAt" AS paper_updatedAt,
        pf.id AS file_id,
        pf."storageProvider" AS file_storageProvider,
        pf."objectKey" AS file_objectKey,
        pf."contentType" AS file_contentType,
        pf."sizeBytes" AS file_sizeBytes,
        pf."originalFilename" AS file_originalFilename,
        u.id AS uploader_id,
        u.name AS uploader_name,
        u.email AS uploader_email
      FROM "CollectionPaper" cp
      JOIN "Paper" p ON p.id = cp."paperId"
      LEFT JOIN "PaperFile" pf ON pf."paperId" = p.id AND pf."isDeleted" = false
      JOIN "User" u ON u.id = p."uploaderId"
      WHERE cp."collectionId" = ${collectionId}
        AND cp."isDeleted" = false
      ORDER BY cp."addedAt" DESC
      LIMIT ${limit} OFFSET ${skip}
    `;

    const totalRes = await prisma.$queryRaw<Array<{ count: number }>>`
      SELECT COUNT(*)::int as count
      FROM "CollectionPaper" cp
      WHERE cp."collectionId" = ${collectionId}
        AND cp."isDeleted" = false
    `;

    const papers = paperRows.map((row) => ({
      id: row.cp_id,
      collectionId: row.cp_collectionId,
      paperId: row.cp_paperId,
      addedById: row.cp_addedById,
      addedAt: row.cp_addedAt,
      createdAt: row.cp_createdAt,
      updatedAt: row.cp_updatedAt,
      paper: {
        id: row.paper_id,
        workspaceId: row.paper_workspaceId,
        uploaderId: row.paper_uploaderId,
        title: row.paper_title,
        abstract: row.paper_abstract,
        metadata: row.paper_metadata,
        source: row.paper_source,
        doi: row.paper_doi,
        processingStatus: row.paper_processingStatus,
        createdAt: row.paper_createdAt,
        updatedAt: row.paper_updatedAt,
        file: row.file_id
          ? {
              id: row.file_id,
              storageProvider: row.file_storageProvider,
              objectKey: row.file_objectKey,
              contentType: row.file_contentType,
              sizeBytes: row.file_sizeBytes,
              originalFilename: row.file_originalFilename,
            }
          : null,
        uploader: {
          id: row.uploader_id,
          name: row.uploader_name,
          email: row.uploader_email,
        },
      },
    }));

    const total = totalRes[0]?.count || 0;
    const totalPage = Math.ceil(total / limit);

    sendPaginatedResponse(
      res,
      papers,
      { page, limit, total, totalPage },
      "Collection papers retrieved successfully"
    );
  }),
};
