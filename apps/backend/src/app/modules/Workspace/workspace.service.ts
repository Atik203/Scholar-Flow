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
      SELECT w.*,
             (SELECT COUNT(*)::int FROM "WorkspaceMember" wm WHERE wm."workspaceId" = w.id AND wm."isDeleted" = false) as "memberCount",
             (SELECT COUNT(*)::int FROM "Collection" c WHERE c."workspaceId" = w.id AND c."isDeleted" = false) as "collectionCount",
             (SELECT COUNT(*)::int FROM "Paper" p WHERE p."workspaceId" = w.id AND p."isDeleted" = false) as "paperCount",
             (w."ownerId" = ${userId}) as "isOwner"
      FROM "Workspace" w
      JOIN "WorkspaceMember" m ON m."workspaceId" = w.id AND m."isDeleted" = false
      WHERE m."userId" = ${userId} AND w."isDeleted" = false
        AND (${whereOwned} = false OR w."ownerId" = ${userId})
        AND (${whereShared} = false OR w."ownerId" != ${userId})
      ORDER BY w."createdAt" DESC
      LIMIT ${limit} OFFSET ${skip}
    `;
    const totalRes = await prisma.$queryRaw<any[]>`
      SELECT COUNT(*)::int as count
      FROM "WorkspaceMember" m
      JOIN "Workspace" w ON w.id = m."workspaceId" AND w."isDeleted" = false
      WHERE m."userId" = ${userId}
        AND m."isDeleted" = false
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
      SELECT w.*
      FROM "Workspace" w
      JOIN "WorkspaceMember" m ON m."workspaceId" = w.id AND m."isDeleted" = false
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
    data: { name?: string }
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

    if (data.name) {
      const rows = await prisma.$queryRaw<any[]>`
        UPDATE "Workspace" SET name = ${data.name}, "updatedAt" = now()
        WHERE id = ${id}
        RETURNING *
      `;
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

    await prisma.$executeRaw`
      UPDATE "Workspace" SET "isDeleted" = true, "updatedAt" = now() WHERE id = ${id}
    `;
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
}

export default WorkspaceService;
