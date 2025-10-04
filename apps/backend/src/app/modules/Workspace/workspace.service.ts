import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";

export class WorkspaceService {
  static async listUserWorkspaces(
    userId: string,
    limit: number,
    skip: number,
    scope: "all" | "owned" | "shared" = "all"
  ) {
    const whereOwned = scope === "owned";
    const whereShared = scope === "shared";

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
      ORDER BY fw."createdAt" DESC
      LIMIT ${limit} OFFSET ${skip}
    `;

    const totalRes = await prisma.$queryRaw<any[]>`
      SELECT COUNT(*)::int as count
      FROM "Workspace" w
      JOIN "WorkspaceMember" m ON m."workspaceId" = w.id AND m."isDeleted" = false
      WHERE m."userId" = ${userId}
        AND w."isDeleted" = false
        AND (${whereOwned} = false OR w."ownerId" = ${userId})
        AND (${whereShared} = false OR w."ownerId" != ${userId})
    `;
    return {
      result: rows,
      meta: {
        page: skip / limit + 1,
        limit,
        total: totalRes[0]?.count || 0,
        totalPage: Math.ceil((totalRes[0]?.count || 0) / limit),
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
        VALUES (gen_random_uuid(), ${w.id}, ${ownerId}, 'ADMIN', now(), now(), now(), false)
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
      ["ADMIN", "TEAM_LEAD"].includes(member.role) || member.ownerId === userId;
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
    const isAdmin = member.role === "ADMIN" || member.ownerId === userId;
    if (!isAdmin)
      throw new ApiError(403, "Only Admin or Owner can delete workspace");

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
    skip: number
  ) {
    // Must be a member to view
    await this.getWorkspace(userId, id);

    const rows = await prisma.$queryRaw<any[]>`
      SELECT m.*, u.email, u.name
      FROM "WorkspaceMember" m
      JOIN "User" u ON u.id = m."userId"
      WHERE m."workspaceId" = ${id} AND m."isDeleted" = false
      ORDER BY m."joinedAt" DESC
      LIMIT ${limit} OFFSET ${skip}
    `;
    const totalRes = await prisma.$queryRaw<any[]>`
      SELECT COUNT(*)::int as count
      FROM "WorkspaceMember" m
      WHERE m."workspaceId" = ${id} AND m."isDeleted" = false
    `;
    return {
      result: rows,
      meta: {
        page: skip / limit + 1,
        limit,
        total: totalRes[0]?.count || 0,
        totalPage: Math.ceil((totalRes[0]?.count || 0) / limit),
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
      ["ADMIN", "TEAM_LEAD"].includes(member.role) ||
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
      VALUES (gen_random_uuid(), ${id}, ${targetUserId}, ${payload.role || "RESEARCHER"}, now(), now(), now(), false)
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
    const isAdmin = member.role === "ADMIN" || member.ownerId === requestorId;
    if (!isAdmin)
      throw new ApiError(403, "Only Admin or Owner can update roles");

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
      ["ADMIN", "TEAM_LEAD"].includes(ctx.requestorRole) ||
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
    const isAdmin = ws.inviterRole === "ADMIN";
    if (!isOwner && !isAdmin) {
      throw new ApiError(
        403,
        "Only workspace owners and admins can invite members"
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
    const roleValue = payload.role || "RESEARCHER";
    const invitationResult = await prisma.$queryRaw<any[]>`
      INSERT INTO "WorkspaceInvitation" (id, "workspaceId", "userId", role, "invitedById", status, "invitedAt", "createdAt", "updatedAt", "isDeleted")
      VALUES (gen_random_uuid(), ${workspaceId}, ${targetUser.id}, ${roleValue}::"Role", ${inviterId}, 'PENDING'::"MembershipStatus", now(), now(), now(), false)
      ON CONFLICT ("workspaceId", "userId") DO UPDATE SET 
        role = ${roleValue}::"Role", 
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
          VALUES (gen_random_uuid(), ${workspaceId}, ${userId}, ${invitation[0].role}::"Role", now(), now(), now(), false)
          ON CONFLICT ("workspaceId", "userId") DO UPDATE SET 
            role = ${invitation[0].role}::"Role", 
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
}

export default WorkspaceService;
