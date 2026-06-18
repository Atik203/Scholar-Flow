import ApiError from "../../errors/ApiError";
import prisma, { Prisma } from "../../shared/prisma";

export class WorkspaceService {
  static async listUserWorkspaces(
    userId: string,
    limit: number,
    cursor: string | undefined,
    scope: "all" | "owned" | "shared" = "all"
  ) {
    const whereOwned = scope === "owned";
    const whereShared = scope === "shared";
    const take = limit + 1;

    const cursorFilter = cursor
      ? Prisma.sql`AND fw."createdAt" < (SELECT "createdAt" FROM "Workspace" WHERE id = ${cursor})`
      : Prisma.empty;

    const rows = await prisma.$queryRaw<any[]>`
      WITH filtered_workspaces AS (
        SELECT w.*
        FROM "Workspace" w
        JOIN "WorkspaceMember" m ON m."workspaceId" = w.id AND m."isDeleted" = false
        WHERE m."userId" = ${userId}
          AND w."isDeleted" = false
          AND (${whereOwned} = false OR w."ownerId" = ${userId})
          AND (${whereShared} = false OR w."ownerId" != ${userId})
      )
      SELECT
        fw.*,
        (fw."ownerId" = ${userId})::boolean AS "isOwner",
        COALESCE(member_counts.member_count, 0)::int AS "memberCount",
        COALESCE(collection_counts.collection_count, 0)::int AS "collectionCount",
        COALESCE(paper_counts.paper_count, 0)::int AS "paperCount"
      FROM filtered_workspaces fw
      LEFT JOIN (
        SELECT "workspaceId", COUNT(*)::int AS member_count
        FROM "WorkspaceMember"
        WHERE "isDeleted" = false
        GROUP BY "workspaceId"
      ) member_counts ON member_counts."workspaceId" = fw.id
      LEFT JOIN (
        SELECT "workspaceId", COUNT(*)::int AS collection_count
        FROM "Collection"
        WHERE "isDeleted" = false
        GROUP BY "workspaceId"
      ) collection_counts ON collection_counts."workspaceId" = fw.id
      LEFT JOIN (
        SELECT "workspaceId", COUNT(*)::int AS paper_count
        FROM "Paper"
        WHERE "isDeleted" = false
        GROUP BY "workspaceId"
      ) paper_counts ON paper_counts."workspaceId" = fw.id
      WHERE true
        ${cursorFilter}
      ORDER BY fw."createdAt" DESC
      LIMIT ${take}
    `;

    const hasMore = rows.length > limit;
    const sliced = hasMore ? rows.slice(0, -1) : rows;

    return {
      result: sliced,
      meta: {
        limit,
        nextCursor: hasMore ? sliced[sliced.length - 1].id : null,
        hasMore,
      },
    };
  }

  static async createWorkspace(ownerId: string, name: string) {
    // Create workspace and membership in a transaction
    try {
      const workspace = await prisma.$queryRaw<any[]>`
        INSERT INTO "Workspace" (id, name, "ownerId", "createdAt", "updatedAt", "isDeleted")
        VALUES (gen_random_uuid(), ${name}, ${ownerId}, now(), now(), false)
        RETURNING *
      `;
      const w = workspace[0];
      await prisma.$executeRaw`
        INSERT INTO "WorkspaceMember" (id, "workspaceId", "userId", role, "joinedAt", "createdAt", "updatedAt", "isDeleted")
        VALUES (gen_random_uuid(), ${w.id}, ${ownerId}, 'OWNER', now(), now(), now(), false)
      `;
      await prisma.$executeRaw`
        INSERT INTO "ActivityLog" (id, "userId", "workspaceId", entity, "entityId", action, "createdAt", "updatedAt", "isDeleted")
        VALUES (gen_random_uuid(), ${ownerId}, ${w.id}, 'Workspace', ${w.id}, 'CREATE', now(), now(), false)
      `;
      return w;
    } catch (e) {
      throw new ApiError(500, "Failed to create workspace");
    }
  }

  static async getWorkspace(userId: string, id: string) {
    const rows = await prisma.$queryRaw<any[]>`
      SELECT
        w.*,
        (w."ownerId" = ${userId})::boolean AS "isOwner",
        COALESCE(member_counts.member_count, 0)::int AS "memberCount",
        COALESCE(collection_counts.collection_count, 0)::int AS "collectionCount",
        COALESCE(paper_counts.paper_count, 0)::int AS "paperCount"
      FROM "Workspace" w
      JOIN "WorkspaceMember" m ON m."workspaceId" = w.id AND m."isDeleted" = false
      LEFT JOIN (
        SELECT "workspaceId", COUNT(*)::int AS member_count
        FROM "WorkspaceMember"
        WHERE "isDeleted" = false
        GROUP BY "workspaceId"
      ) member_counts ON member_counts."workspaceId" = w.id
      LEFT JOIN (
        SELECT "workspaceId", COUNT(*)::int AS collection_count
        FROM "Collection"
        WHERE "isDeleted" = false
        GROUP BY "workspaceId"
      ) collection_counts ON collection_counts."workspaceId" = w.id
      LEFT JOIN (
        SELECT "workspaceId", COUNT(*)::int AS paper_count
        FROM "Paper"
        WHERE "isDeleted" = false
        GROUP BY "workspaceId"
      ) paper_counts ON paper_counts."workspaceId" = w.id
      WHERE w.id = ${id} AND w."isDeleted" = false AND m."userId" = ${userId}
      LIMIT 1
    `;
    if (!rows[0])
      throw new ApiError(404, "Workspace not found or access denied");
    return rows[0];
  }

  static async updateWorkspace(
    userId: string,
    id: string,
    data: { name?: string; description?: string }
  ) {
    // Ensure user is Admin/TeamLead or owner
    const perm = await prisma.$queryRaw<any[]>`
      SELECT m.role, w."ownerId"
      FROM "WorkspaceMember" m JOIN "Workspace" w ON w.id = m."workspaceId"
      WHERE m."userId" = ${userId} AND m."workspaceId" = ${id} AND m."isDeleted" = false AND w."isDeleted" = false
    `;
    const member = perm[0];
    if (!member) throw new ApiError(403, "Not a member of this workspace");
    const isManager =
      ["OWNER", "MANAGER"].includes(member.role) || member.ownerId === userId;
    if (!isManager) throw new ApiError(403, "Insufficient permissions");

    if (data.name !== undefined || data.description !== undefined) {
      let rows: any[] = [];
      if (data.name !== undefined && data.description !== undefined) {
        rows = await prisma.$queryRaw<any[]>`
          UPDATE "Workspace"
          SET name = ${data.name}, description = ${data.description}, "updatedAt" = now()
          WHERE id = ${id}
          RETURNING *
        `;
      } else if (data.name !== undefined) {
        rows = await prisma.$queryRaw<any[]>`
          UPDATE "Workspace"
          SET name = ${data.name}, "updatedAt" = now()
          WHERE id = ${id}
          RETURNING *
        `;
      } else if (data.description !== undefined) {
        rows = await prisma.$queryRaw<any[]>`
          UPDATE "Workspace"
          SET description = ${data.description}, "updatedAt" = now()
          WHERE id = ${id}
          RETURNING *
        `;
      }
      await prisma.$executeRaw`
        INSERT INTO "ActivityLog" (id, "userId", "workspaceId", entity, "entityId", action, details, "createdAt", "updatedAt", "isDeleted")
        VALUES (gen_random_uuid(), ${userId}, ${id}, 'Workspace', ${id}, 'UPDATE', '{}'::jsonb, now(), now(), false)
      `;
      return rows[0];
    }
    return this.getWorkspace(userId, id);
  }

  static async deleteWorkspace(userId: string, id: string) {
    // Only Admin/Owner can delete
    const perm = await prisma.$queryRaw<any[]>`
      SELECT m.role, w."ownerId"
      FROM "WorkspaceMember" m JOIN "Workspace" w ON w.id = m."workspaceId"
      WHERE m."userId" = ${userId} AND m."workspaceId" = ${id} AND m."isDeleted" = false AND w."isDeleted" = false
    `;
    const member = perm[0];
    if (!member) throw new ApiError(403, "Not a member of this workspace");
    const isOwner = member.role === "OWNER" || member.ownerId === userId;
    if (!isOwner)
      throw new ApiError(403, "Only Owner can delete workspace");

    // Soft delete workspace and cascade to related entities
    await prisma.$executeRaw`
      UPDATE "Workspace" SET "isDeleted" = true, "updatedAt" = now() WHERE id = ${id}
    `;

    // Soft delete related invitations
    await prisma.$executeRaw`
      UPDATE "WorkspaceInvitation" SET "isDeleted" = true, "updatedAt" = now() 
      WHERE "workspaceId" = ${id} AND "isDeleted" = false
    `;

    // Soft delete workspace members
    await prisma.$executeRaw`
      UPDATE "WorkspaceMember" SET "isDeleted" = true, "updatedAt" = now() 
      WHERE "workspaceId" = ${id} AND "isDeleted" = false
    `;

    // Log the deletion activity
    await prisma.$executeRaw`
      INSERT INTO "ActivityLog" (id, "userId", "workspaceId", entity, "entityId", action, "createdAt", "updatedAt", "isDeleted")
      VALUES (gen_random_uuid(), ${userId}, ${id}, 'Workspace', ${id}, 'DELETE', now(), now(), false)
    `;
    return { success: true };
  }

  static async listMembers(
    userId: string,
    id: string,
    limit: number,
    cursor: string | undefined
  ) {
    // Must be a member to view
    await this.getWorkspace(userId, id);

    const take = limit + 1;
    const cursorFilter = cursor
      ? Prisma.sql`AND m."joinedAt" < (SELECT "joinedAt" FROM "WorkspaceMember" WHERE id = ${cursor})`
      : Prisma.empty;

    const rows = await prisma.$queryRaw<any[]>`
      SELECT m.*, u.email, u.name
      FROM "WorkspaceMember" m
      JOIN "User" u ON u.id = m."userId"
      WHERE m."workspaceId" = ${id} AND m."isDeleted" = false
        ${cursorFilter}
      ORDER BY m."joinedAt" DESC
      LIMIT ${take}
    `;

    const hasMore = rows.length > limit;
    const sliced = hasMore ? rows.slice(0, -1) : rows;

    return {
      result: sliced,
      meta: {
        limit,
        nextCursor: hasMore ? sliced[sliced.length - 1].id : null,
        hasMore,
      },
    };
  }

  static async addMember(
    requestorId: string,
    id: string,
    payload: { userId?: string; email?: string; role?: string }
  ) {
    // Only Admin/TeamLead/Owner can add
    const perm = await prisma.$queryRaw<any[]>`
      SELECT m.role, w."ownerId"
      FROM "WorkspaceMember" m JOIN "Workspace" w ON w.id = m."workspaceId"
      WHERE m."userId" = ${requestorId} AND m."workspaceId" = ${id} AND m."isDeleted" = false AND w."isDeleted" = false
    `;
    const member = perm[0];
    if (!member) throw new ApiError(403, "Not a member of this workspace");
    const isManager =
      ["OWNER", "MANAGER"].includes(member.role) ||
      member.ownerId === requestorId;
    if (!isManager) throw new ApiError(403, "Insufficient permissions");

    let targetUserId = payload.userId as string | undefined;
    if (!targetUserId && payload.email) {
      const u = await prisma.$queryRaw<any[]>`
        SELECT id FROM "User" WHERE email = ${payload.email} AND "isDeleted" = false LIMIT 1
      `;
      if (!u[0]) throw new ApiError(404, "User not found for the given email");
      targetUserId = u[0].id;
    }
    if (!targetUserId) throw new ApiError(400, "userId or email is required");

    // Upsert membership; if exists and soft-deleted, reactivate
    await prisma.$executeRaw`
      INSERT INTO "WorkspaceMember" (id, "workspaceId", "userId", role, "joinedAt", "createdAt", "updatedAt", "isDeleted")
      VALUES (gen_random_uuid(), ${id}, ${targetUserId}, ${payload.role || "EDITOR"}, now(), now(), now(), false)
      ON CONFLICT ("workspaceId", "userId") DO UPDATE SET role = EXCLUDED.role, "isDeleted" = false, "updatedAt" = now()
    `;
    await prisma.$executeRaw`
      INSERT INTO "ActivityLog" (id, "userId", "workspaceId", entity, "entityId", action, details, "createdAt", "updatedAt", "isDeleted")
      VALUES (gen_random_uuid(), ${requestorId}, ${id}, 'WorkspaceMember', ${id}, 'ADD_MEMBER', '{}'::jsonb, now(), now(), false)
    `;
    return { success: true };
  }

  static async updateMemberRole(
    requestorId: string,
    id: string,
    memberId: string,
    role: string
  ) {
    // Only Admin/Owner can promote/demote
    const perm = await prisma.$queryRaw<any[]>`
      SELECT m.role, w."ownerId"
      FROM "WorkspaceMember" m JOIN "Workspace" w ON w.id = m."workspaceId"
      WHERE m."userId" = ${requestorId} AND m."workspaceId" = ${id} AND m."isDeleted" = false AND w."isDeleted" = false
    `;
    const member = perm[0];
    if (!member) throw new ApiError(403, "Not a member of this workspace");
    const isOwner = member.role === "OWNER" || member.ownerId === requestorId;
    if (!isOwner)
      throw new ApiError(403, "Only Owner can update member roles");

    await prisma.$executeRaw`
      UPDATE "WorkspaceMember" SET role = ${role}, "updatedAt" = now()
      WHERE id = ${memberId} AND "workspaceId" = ${id}
    `;
    await prisma.$executeRaw`
      INSERT INTO "ActivityLog" (id, "userId", "workspaceId", entity, "entityId", action, details, "createdAt", "updatedAt", "isDeleted")
      VALUES (gen_random_uuid(), ${requestorId}, ${id}, 'WorkspaceMember', ${memberId}, 'UPDATE_MEMBER_ROLE', '{}'::jsonb, now(), now(), false)
    `;
    return { success: true };
  }

  static async removeMember(requestorId: string, id: string, memberId: string) {
    // Admin/TeamLead/Owner can remove; prevent removing the owner
    const ownerRes = await prisma.$queryRaw<any[]>`
      SELECT w."ownerId", m.role AS "requestorRole"
      FROM "Workspace" w
      JOIN "WorkspaceMember" m ON m."workspaceId" = w.id AND m."userId" = ${requestorId}
      WHERE w.id = ${id}
    `;
    const ctx = ownerRes[0];
    if (!ctx) throw new ApiError(403, "Not a member of this workspace");
    const canManage =
      ["OWNER", "MANAGER"].includes(ctx.requestorRole) ||
      ctx.ownerId === requestorId;
    if (!canManage) throw new ApiError(403, "Insufficient permissions");

    // Prevent removing owner
    const target = await prisma.$queryRaw<any[]>`
      SELECT wm."userId" FROM "WorkspaceMember" wm WHERE wm.id = ${memberId} AND wm."workspaceId" = ${id}
    `;
    if (target[0]?.userId === ctx.ownerId) {
      throw new ApiError(400, "Cannot remove the workspace owner");
    }

    await prisma.$executeRaw`
      UPDATE "WorkspaceMember" SET "isDeleted" = true, "updatedAt" = now()
      WHERE id = ${memberId} AND "workspaceId" = ${id}
    `;
    await prisma.$executeRaw`
      INSERT INTO "ActivityLog" (id, "userId", "workspaceId", entity, "entityId", action, details, "createdAt", "updatedAt", "isDeleted")
      VALUES (gen_random_uuid(), ${requestorId}, ${id}, 'WorkspaceMember', ${memberId}, 'REMOVE_MEMBER', '{}'::jsonb, now(), now(), false)
    `;
    return { success: true };
  }

  // Invite a user to workspace by email
  static async inviteMember(
    inviterId: string,
    workspaceId: string,
    payload: { email: string; role?: string }
  ) {
    // Only workspace owners and admins can invite members
    const workspace = await prisma.$queryRaw<any[]>`
      SELECT w.id, w.name, w."ownerId", m.role AS "inviterRole"
      FROM "Workspace" w
      LEFT JOIN "WorkspaceMember" m ON m."workspaceId" = w.id AND m."userId" = ${inviterId} AND m."isDeleted" = false
      WHERE w.id = ${workspaceId} AND w."isDeleted" = false
    `;
    const ws = workspace[0];
    if (!ws) throw new ApiError(404, "Workspace not found");

    const isOwner = ws.ownerId === inviterId;
    const isOwnerOrManager = ["OWNER", "MANAGER"].includes(ws.inviterRole);
    if (!isOwner && !isOwnerOrManager) {
      throw new ApiError(
        403,
        "Only workspace owners and managers can invite members"
      );
    }

    // Find user by email
    const user = await prisma.$queryRaw<any[]>`
      SELECT id, email, name FROM "User" WHERE email = ${payload.email} AND "isDeleted" = false
    `;
    if (!user[0]) {
      throw new ApiError(404, "User with this email does not exist");
    }
    const targetUser = user[0];

    // Prevent inviting self
    if (targetUser.id === inviterId) {
      throw new ApiError(400, "You cannot invite yourself");
    }

    // Check if user is already a member
    const existingMember = await prisma.$queryRaw<any[]>`
      SELECT id FROM "WorkspaceMember" 
      WHERE "workspaceId" = ${workspaceId} AND "userId" = ${targetUser.id} AND "isDeleted" = false
    `;
    if (existingMember[0]) {
      throw new ApiError(400, "User is already a member of this workspace");
    }

    // Check if invitation already exists
    const existingInvite = await prisma.$queryRaw<any[]>`
      SELECT id, status FROM "WorkspaceInvitation" 
      WHERE "workspaceId" = ${workspaceId} AND "userId" = ${targetUser.id} AND "isDeleted" = false
    `;
    if (existingInvite[0]?.status === "PENDING") {
      throw new ApiError(400, "User already has a pending invitation");
    }

    // Create or update invitation
    const roleValue = payload.role || "EDITOR";
    const invitationResult = await prisma.$queryRaw<any[]>`
      INSERT INTO "WorkspaceInvitation" (id, "workspaceId", "userId", role, "invitedById", status, "invitedAt", "createdAt", "updatedAt", "isDeleted")
      VALUES (gen_random_uuid(), ${workspaceId}, ${targetUser.id}, ${roleValue}::"WorkspaceRole", ${inviterId}, 'PENDING'::"MembershipStatus", now(), now(), now(), false)
      ON CONFLICT ("workspaceId", "userId") DO UPDATE SET 
        role = ${roleValue}::"WorkspaceRole", 
        "invitedById" = EXCLUDED."invitedById",
        status = 'PENDING'::"MembershipStatus",
        "invitedAt" = now(),
        "acceptedAt" = null,
        "declinedAt" = null,
        "isDeleted" = false,
        "updatedAt" = now()
      RETURNING id
    `;

    // Send invitation email (similar to collection pattern)
    try {
      const emailService = (await import("../../shared/emailService")).default;
      await emailService.sendWorkspaceInvitationEmail({
        email: targetUser.email,
        name: targetUser.name || targetUser.email,
        workspaceName: ws.name,
        inviterName:
          (
            await prisma.$queryRaw<any[]>`
          SELECT name, email FROM "User" WHERE id = ${inviterId}
        `
          )[0]?.name || "A ScholarFlow user",
        workspaceId: workspaceId,
      });
    } catch (emailError) {
      console.error("Failed to send workspace invitation email:", emailError);
    }

    return { invitationId: invitationResult[0]?.id };
  }

  // Accept workspace invitation
  static async acceptInvitation(userId: string, workspaceId: string) {
    const invitation = await prisma.$queryRaw<any[]>`
      SELECT wi.id, wi.role, wi.status
      FROM "WorkspaceInvitation" wi
      WHERE wi."workspaceId" = ${workspaceId} AND wi."userId" = ${userId} AND wi."isDeleted" = false
    `;

    if (!invitation[0]) {
      throw new ApiError(404, "Invitation not found");
    }
    if (invitation[0].status !== "PENDING") {
      throw new ApiError(400, "Invitation is not pending");
    }

    try {
      // Update invitation status and create membership in transaction
      await prisma.$transaction(async (tx) => {
        await tx.$executeRaw`
          UPDATE "WorkspaceInvitation" 
          SET status = 'ACCEPTED'::"MembershipStatus", "acceptedAt" = now(), "updatedAt" = now()
          WHERE id = ${invitation[0].id}
        `;

        await tx.$executeRaw`
          INSERT INTO "WorkspaceMember" (id, "workspaceId", "userId", role, "joinedAt", "createdAt", "updatedAt", "isDeleted")
          VALUES (gen_random_uuid(), ${workspaceId}, ${userId}, ${invitation[0].role}::"WorkspaceRole", now(), now(), now(), false)
          ON CONFLICT ("workspaceId", "userId") DO UPDATE SET 
            role = ${invitation[0].role}::"WorkspaceRole", 
            "isDeleted" = false, 
            "joinedAt" = now(),
            "updatedAt" = now()
        `;

        // Add activity log
        await tx.$executeRaw`
          INSERT INTO "ActivityLog" (id, "userId", "workspaceId", entity, "entityId", action, "createdAt", "updatedAt", "isDeleted")
          VALUES (gen_random_uuid(), ${userId}, ${workspaceId}, 'Workspace', ${workspaceId}, 'JOIN', now(), now(), false)
        `;
      });

      return { success: true };
    } catch (error) {
      throw new ApiError(500, "Failed to accept invitation");
    }
  }

  // Decline workspace invitation
  static async declineInvitation(userId: string, workspaceId: string) {
    const invitation = await prisma.$queryRaw<any[]>`
      SELECT wi.id, wi.status
      FROM "WorkspaceInvitation" wi
      WHERE wi."workspaceId" = ${workspaceId} AND wi."userId" = ${userId} AND wi."isDeleted" = false
    `;
    if (!invitation[0]) {
      throw new ApiError(404, "Invitation not found");
    }
    if (invitation[0].status !== "PENDING") {
      throw new ApiError(400, "Invitation is not pending");
    }

    await prisma.$executeRaw`
      UPDATE "WorkspaceInvitation" 
      SET status = 'DECLINED'::"MembershipStatus", "declinedAt" = now(), "updatedAt" = now()
      WHERE id = ${invitation[0].id}
    `;

    return { success: true };
  }

  // Get invitations sent by user
  static async getInvitationsSent(
    inviterId: string,
    limit: number,
    skip: number
  ) {
    const invitations = await prisma.$queryRaw<any[]>`
      SELECT wi.id, wi."workspaceId", wi."userId", wi.role, wi.status, wi."invitedAt", 
             w.name as "workspaceName", u.email as "inviteeEmail", u.name as "inviteeName"
      FROM "WorkspaceInvitation" wi
      JOIN "Workspace" w ON w.id = wi."workspaceId"
      JOIN "User" u ON u.id = wi."userId"
      WHERE wi."invitedById" = ${inviterId} AND wi."isDeleted" = false
      ORDER BY wi."invitedAt" DESC
      LIMIT ${limit} OFFSET ${skip}
    `;

    const totalRes = await prisma.$queryRaw<any[]>`
      SELECT COUNT(*)::int as count
      FROM "WorkspaceInvitation" wi
      WHERE wi."invitedById" = ${inviterId} AND wi."isDeleted" = false
    `;

    return {
      result: invitations,
      meta: {
        total: totalRes[0]?.count || 0,
        totalPage: Math.ceil((totalRes[0]?.count || 0) / limit),
      },
    };
  }

  // Get invitations received by user
  static async getInvitationsReceived(
    userId: string,
    limit: number,
    skip: number
  ) {
    const invitations = await prisma.$queryRaw<any[]>`
      SELECT wi.id, wi."workspaceId", wi.role, wi.status, wi."invitedAt", 
             w.name as "workspaceName", inv.email as "inviterEmail", inv.name as "inviterName"
      FROM "WorkspaceInvitation" wi
      JOIN "Workspace" w ON w.id = wi."workspaceId"
      LEFT JOIN "User" inv ON inv.id = wi."invitedById"
      WHERE wi."userId" = ${userId} AND wi."isDeleted" = false
      ORDER BY wi."invitedAt" DESC
      LIMIT ${limit} OFFSET ${skip}
    `;

    const totalRes = await prisma.$queryRaw<any[]>`
      SELECT COUNT(*)::int as count
      FROM "WorkspaceInvitation" wi
      WHERE wi."userId" = ${userId} AND wi."isDeleted" = false
    `;

    return {
      result: invitations,
      meta: {
        total: totalRes[0]?.count || 0,
        totalPage: Math.ceil((totalRes[0]?.count || 0) / limit),
      },
    };
  }

  // ==========================================================================
  // Phase 5 — Workspace Settings, Activity, Stats, Papers, Collections
  // ==========================================================================

  /**
   * Get WorkspaceSettings for a workspace. Returns null if no row exists.
   */
  static async getWorkspaceSettings(userId: string, workspaceId: string) {
    await this.getWorkspace(userId, workspaceId);
    return prisma.workspaceSettings.findUnique({ where: { workspaceId } });
  }

  /**
   * Upsert WorkspaceSettings for a workspace. Caller must be the owner.
   */
  static async updateWorkspaceSettings(
    userId: string,
    workspaceId: string,
    data: {
      color?: string;
      coverImageKey?: string | null;
      iconKey?: string | null;
      allowExternalSharing?: boolean;
      allowDownload?: boolean;
      defaultMemberRole?: string;
      requireApprovalForJoin?: boolean;
      allowMemberInvites?: boolean;
      allowPublicCollections?: boolean;
      aiFeaturesEnabled?: boolean;
      enforce2FAForMembers?: boolean;
      allowedEmailDomains?: string[];
    }
  ) {
    const perm = await prisma.$queryRaw<any[]>`
      SELECT m.role, w."ownerId"
      FROM "WorkspaceMember" m JOIN "Workspace" w ON w.id = m."workspaceId"
      WHERE m."userId" = ${userId} AND m."workspaceId" = ${workspaceId} AND m."isDeleted" = false AND w."isDeleted" = false
      LIMIT 1
    `;
    const ctx = perm[0];
    if (!ctx) throw new ApiError(403, "Not a member of this workspace");
    if (ctx.role !== "OWNER" && ctx.ownerId !== userId) {
      throw new ApiError(403, "Only workspace owner can update settings");
    }

    const updated = await prisma.workspaceSettings.upsert({
      where: { workspaceId },
      create: {
        workspaceId,
        color: data.color,
        coverImageKey: data.coverImageKey,
        iconKey: data.iconKey,
        allowExternalSharing: data.allowExternalSharing,
        allowDownload: data.allowDownload,
        defaultMemberRole: data.defaultMemberRole as any,
        requireApprovalForJoin: data.requireApprovalForJoin,
        allowMemberInvites: data.allowMemberInvites,
        allowPublicCollections: data.allowPublicCollections,
        aiFeaturesEnabled: data.aiFeaturesEnabled,
        enforce2FAForMembers: data.enforce2FAForMembers,
        allowedEmailDomains: data.allowedEmailDomains ?? [],
      },
      update: {
        ...(data.color !== undefined && { color: data.color }),
        ...(data.coverImageKey !== undefined && { coverImageKey: data.coverImageKey }),
        ...(data.iconKey !== undefined && { iconKey: data.iconKey }),
        ...(data.allowExternalSharing !== undefined && { allowExternalSharing: data.allowExternalSharing }),
        ...(data.allowDownload !== undefined && { allowDownload: data.allowDownload }),
        ...(data.defaultMemberRole !== undefined && { defaultMemberRole: data.defaultMemberRole as any }),
        ...(data.requireApprovalForJoin !== undefined && { requireApprovalForJoin: data.requireApprovalForJoin }),
        ...(data.allowMemberInvites !== undefined && { allowMemberInvites: data.allowMemberInvites }),
        ...(data.allowPublicCollections !== undefined && { allowPublicCollections: data.allowPublicCollections }),
        ...(data.aiFeaturesEnabled !== undefined && { aiFeaturesEnabled: data.aiFeaturesEnabled }),
        ...(data.enforce2FAForMembers !== undefined && { enforce2FAForMembers: data.enforce2FAForMembers }),
        ...(data.allowedEmailDomains !== undefined && { allowedEmailDomains: data.allowedEmailDomains }),
      },
    });

    // Keep denormalized color in sync
    if (data.color) {
      await prisma.workspace.update({
        where: { id: workspaceId },
        data: { color: data.color },
      });
    }

    // Log activity
    await prisma.activityLogEntry.create({
      data: {
        userId,
        workspaceId,
        entity: "WorkspaceSettings",
        entityId: workspaceId,
        action: "UPDATE",
        severity: "INFO",
      },
    });

    return updated;
  }

  /**
   * Get aggregated stats for a workspace (papers, collections, members, storage estimate).
   */
  static async getWorkspaceStats(userId: string, workspaceId: string) {
    await this.getWorkspace(userId, workspaceId);

    const [papers, collections, members] = await Promise.all([
      prisma.paper.count({ where: { workspaceId, isDeleted: false } }),
      prisma.collection.count({ where: { workspaceId, isDeleted: false } }),
      prisma.workspaceMember.count({ where: { workspaceId, isDeleted: false } }),
    ]);

    // Storage estimate: ~250KB per paper, 50KB per collection (rough heuristic)
    const storageBytes = papers * 250_000 + collections * 50_000;
    const storageMB = Math.round(storageBytes / (1024 * 1024) * 10) / 10;

    return {
      papers,
      collections,
      members,
      storage: storageMB < 1 ? `${Math.round(storageBytes / 1024)} KB` : `${storageMB} MB`,
    };
  }

  /**
   * Get activity log entries for a workspace (cursor paginated).
   */
  static async getWorkspaceActivity(
    userId: string,
    workspaceId: string,
    limit: number,
    cursor: string | undefined
  ) {
    await this.getWorkspace(userId, workspaceId);

    const take = limit + 1;
    const where: any = {
      workspaceId,
      isDeleted: false,
    };
    if (cursor) {
      const cur = await prisma.activityLogEntry.findUnique({
        where: { id: cursor },
        select: { createdAt: true },
      });
      if (cur) where.createdAt = { lt: cur.createdAt };
    }

    const entries = await prisma.activityLogEntry.findMany({
      where,
      take,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      include: {
        user: {
          select: {
            id: true,
            name: true,
            firstName: true,
            lastName: true,
            image: true,
          },
        },
      },
    });

    const hasMore = entries.length > limit;
    const sliced = hasMore ? entries.slice(0, -1) : entries;

    return {
      result: sliced,
      meta: {
        limit,
        hasMore,
        nextCursor: hasMore ? sliced[sliced.length - 1].id : null,
      },
    };
  }

  /**
   * Get papers in a workspace (cursor paginated, sorted by createdAt desc).
   */
  static async getWorkspacePapers(
    userId: string,
    workspaceId: string,
    limit: number,
    cursor: string | undefined
  ) {
    await this.getWorkspace(userId, workspaceId);

    const take = limit + 1;
    const where: any = { workspaceId, isDeleted: false };
    if (cursor) {
      const cur = await prisma.paper.findUnique({
        where: { id: cursor },
        select: { createdAt: true },
      });
      if (cur) where.createdAt = { lt: cur.createdAt };
    }

    const papers = await prisma.paper.findMany({
      where,
      take,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      select: {
        id: true,
        title: true,
        abstract: true,
        doi: true,
        source: true,
        createdAt: true,
        uploader: { select: { id: true, name: true, firstName: true, lastName: true, image: true } },
        _count: { select: { chunks: true } },
      },
    });

    const hasMore = papers.length > limit;
    const sliced = hasMore ? papers.slice(0, -1) : papers;

    return {
      result: sliced,
      meta: {
        limit,
        hasMore,
        nextCursor: hasMore ? sliced[sliced.length - 1].id : null,
      },
    };
  }

  /**
   * Get collections in a workspace (cursor paginated, sorted by createdAt desc).
   */
  static async getWorkspaceCollections(
    userId: string,
    workspaceId: string,
    limit: number,
    cursor: string | undefined
  ) {
    await this.getWorkspace(userId, workspaceId);

    const take = limit + 1;
    const where: any = { workspaceId, isDeleted: false };
    if (cursor) {
      const cur = await prisma.collection.findUnique({
        where: { id: cursor },
        select: { createdAt: true },
      });
      if (cur) where.createdAt = { lt: cur.createdAt };
    }

    const collections = await prisma.collection.findMany({
      where,
      take,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      select: {
        id: true,
        name: true,
        description: true,
        visibility: true,
        color: true,
        tags: true,
        isPublic: true,
        createdAt: true,
        owner: { select: { id: true, name: true, firstName: true, lastName: true, image: true } },
        _count: { select: { papers: { where: { isDeleted: false } } } },
      },
    });

    const hasMore = collections.length > limit;
    const sliced = hasMore ? collections.slice(0, -1) : collections;

    return {
      result: collections,
      meta: {
        limit,
        hasMore,
        nextCursor: hasMore ? sliced[sliced.length - 1].id : null,
      },
    };
  }
}

export default WorkspaceService;
