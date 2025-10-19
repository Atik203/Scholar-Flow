import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";

export const userManagementService = {
  /**
   * Get all users with pagination and filters
   */
  async getAllUsers(
    page: number = 1,
    limit: number = 20,
    searchQuery?: string,
    role?: string,
    status?: string
  ) {
    const offset = (page - 1) * limit;
    const hasSearchQuery = searchQuery && searchQuery.trim() !== "";
    const hasRoleFilter = role && role !== "all";
    const hasStatusFilter = status && status !== "all";

    // Build count query based on filters
    let countResult: Array<{ count: bigint }>;
    let users: Array<{
      id: string;
      name: string | null;
      email: string;
      role: string;
      emailVerified: boolean;
      profileImage: string | null;
      createdAt: Date;
      updatedAt: Date;
      isDeleted: boolean;
      paperCount: bigint;
      subscriptionStatus: string | null;
      planName: string | null;
    }>;

    // Case 1: All filters
    if (hasSearchQuery && hasRoleFilter && hasStatusFilter) {
      const activeStatus = status === "active";
      countResult = await prisma.$queryRaw<Array<{ count: bigint }>>`
        SELECT COUNT(*)::bigint as count
        FROM "User"
        WHERE "isDeleted" = ${!activeStatus}
          AND role = ${role}::"Role"
          AND (name ILIKE ${`%${searchQuery}%`} OR email ILIKE ${`%${searchQuery}%`})
      `;

      users = await prisma.$queryRaw`
        SELECT 
          u.id,
          u.name,
          u.email,
          u.role::text as role,
          u."emailVerified",
          u."profileImage",
          u."createdAt",
          u."updatedAt",
          u."isDeleted",
          COUNT(DISTINCT p.id)::bigint as "paperCount",
          s.status::text as "subscriptionStatus",
          pl.name as "planName"
        FROM "User" u
        LEFT JOIN "Paper" p ON u.id = p."uploaderId" AND p."isDeleted" = false
        LEFT JOIN "Subscription" s ON u.id = s."userId" AND s."isDeleted" = false AND s.status = 'ACTIVE'
        LEFT JOIN "Plan" pl ON s."planId" = pl.id
        WHERE u."isDeleted" = ${!activeStatus}
          AND u.role = ${role}::"Role"
          AND (u.name ILIKE ${`%${searchQuery}%`} OR u.email ILIKE ${`%${searchQuery}%`})
        GROUP BY u.id, u.name, u.email, u.role, u."emailVerified", u."profileImage", u."createdAt", u."updatedAt", u."isDeleted", s.status, pl.name
        ORDER BY u."createdAt" DESC
        LIMIT ${limit}
        OFFSET ${offset}
      `;
    }
    // Case 2: Search + Role filter
    else if (hasSearchQuery && hasRoleFilter) {
      countResult = await prisma.$queryRaw<Array<{ count: bigint }>>`
        SELECT COUNT(*)::bigint as count
        FROM "User"
        WHERE "isDeleted" = false
          AND role = ${role}::"Role"
          AND (name ILIKE ${`%${searchQuery}%`} OR email ILIKE ${`%${searchQuery}%`})
      `;

      users = await prisma.$queryRaw`
        SELECT 
          u.id,
          u.name,
          u.email,
          u.role::text as role,
          u."emailVerified",
          u."profileImage",
          u."createdAt",
          u."updatedAt",
          u."isDeleted",
          COUNT(DISTINCT p.id)::bigint as "paperCount",
          s.status::text as "subscriptionStatus",
          pl.name as "planName"
        FROM "User" u
        LEFT JOIN "Paper" p ON u.id = p."uploaderId" AND p."isDeleted" = false
        LEFT JOIN "Subscription" s ON u.id = s."userId" AND s."isDeleted" = false AND s.status = 'ACTIVE'
        LEFT JOIN "Plan" pl ON s."planId" = pl.id
        WHERE u."isDeleted" = false
          AND u.role = ${role}::"Role"
          AND (u.name ILIKE ${`%${searchQuery}%`} OR u.email ILIKE ${`%${searchQuery}%`})
        GROUP BY u.id, u.name, u.email, u.role, u."emailVerified", u."profileImage", u."createdAt", u."updatedAt", u."isDeleted", s.status, pl.name
        ORDER BY u."createdAt" DESC
        LIMIT ${limit}
        OFFSET ${offset}
      `;
    }
    // Case 3: Search + Status filter
    else if (hasSearchQuery && hasStatusFilter) {
      const activeStatus = status === "active";
      countResult = await prisma.$queryRaw<Array<{ count: bigint }>>`
        SELECT COUNT(*)::bigint as count
        FROM "User"
        WHERE "isDeleted" = ${!activeStatus}
          AND (name ILIKE ${`%${searchQuery}%`} OR email ILIKE ${`%${searchQuery}%`})
      `;

      users = await prisma.$queryRaw`
        SELECT 
          u.id,
          u.name,
          u.email,
          u.role::text as role,
          u."emailVerified",
          u."profileImage",
          u."createdAt",
          u."updatedAt",
          u."isDeleted",
          COUNT(DISTINCT p.id)::bigint as "paperCount",
          s.status::text as "subscriptionStatus",
          pl.name as "planName"
        FROM "User" u
        LEFT JOIN "Paper" p ON u.id = p."uploaderId" AND p."isDeleted" = false
        LEFT JOIN "Subscription" s ON u.id = s."userId" AND s."isDeleted" = false AND s.status = 'ACTIVE'
        LEFT JOIN "Plan" pl ON s."planId" = pl.id
        WHERE u."isDeleted" = ${!activeStatus}
          AND (u.name ILIKE ${`%${searchQuery}%`} OR u.email ILIKE ${`%${searchQuery}%`})
        GROUP BY u.id, u.name, u.email, u.role, u."emailVerified", u."profileImage", u."createdAt", u."updatedAt", u."isDeleted", s.status, pl.name
        ORDER BY u."createdAt" DESC
        LIMIT ${limit}
        OFFSET ${offset}
      `;
    }
    // Case 4: Role + Status filter
    else if (hasRoleFilter && hasStatusFilter) {
      const activeStatus = status === "active";
      countResult = await prisma.$queryRaw<Array<{ count: bigint }>>`
        SELECT COUNT(*)::bigint as count
        FROM "User"
        WHERE "isDeleted" = ${!activeStatus}
          AND role = ${role}::"Role"
      `;

      users = await prisma.$queryRaw`
        SELECT 
          u.id,
          u.name,
          u.email,
          u.role::text as role,
          u."emailVerified",
          u."profileImage",
          u."createdAt",
          u."updatedAt",
          u."isDeleted",
          COUNT(DISTINCT p.id)::bigint as "paperCount",
          s.status::text as "subscriptionStatus",
          pl.name as "planName"
        FROM "User" u
        LEFT JOIN "Paper" p ON u.id = p."uploaderId" AND p."isDeleted" = false
        LEFT JOIN "Subscription" s ON u.id = s."userId" AND s."isDeleted" = false AND s.status = 'ACTIVE'
        LEFT JOIN "Plan" pl ON s."planId" = pl.id
        WHERE u."isDeleted" = ${!activeStatus}
          AND u.role = ${role}::"Role"
        GROUP BY u.id, u.name, u.email, u.role, u."emailVerified", u."profileImage", u."createdAt", u."updatedAt", u."isDeleted", s.status, pl.name
        ORDER BY u."createdAt" DESC
        LIMIT ${limit}
        OFFSET ${offset}
      `;
    }
    // Case 5: Only Search filter
    else if (hasSearchQuery) {
      countResult = await prisma.$queryRaw<Array<{ count: bigint }>>`
        SELECT COUNT(*)::bigint as count
        FROM "User"
        WHERE "isDeleted" = false
          AND (name ILIKE ${`%${searchQuery}%`} OR email ILIKE ${`%${searchQuery}%`})
      `;

      users = await prisma.$queryRaw`
        SELECT 
          u.id,
          u.name,
          u.email,
          u.role::text as role,
          u."emailVerified",
          u."profileImage",
          u."createdAt",
          u."updatedAt",
          u."isDeleted",
          COUNT(DISTINCT p.id)::bigint as "paperCount",
          s.status::text as "subscriptionStatus",
          pl.name as "planName"
        FROM "User" u
        LEFT JOIN "Paper" p ON u.id = p."uploaderId" AND p."isDeleted" = false
        LEFT JOIN "Subscription" s ON u.id = s."userId" AND s."isDeleted" = false AND s.status = 'ACTIVE'
        LEFT JOIN "Plan" pl ON s."planId" = pl.id
        WHERE u."isDeleted" = false
          AND (u.name ILIKE ${`%${searchQuery}%`} OR u.email ILIKE ${`%${searchQuery}%`})
        GROUP BY u.id, u.name, u.email, u.role, u."emailVerified", u."profileImage", u."createdAt", u."updatedAt", u."isDeleted", s.status, pl.name
        ORDER BY u."createdAt" DESC
        LIMIT ${limit}
        OFFSET ${offset}
      `;
    }
    // Case 6: Only Role filter
    else if (hasRoleFilter) {
      countResult = await prisma.$queryRaw<Array<{ count: bigint }>>`
        SELECT COUNT(*)::bigint as count
        FROM "User"
        WHERE "isDeleted" = false
          AND role = ${role}::"Role"
      `;

      users = await prisma.$queryRaw`
        SELECT 
          u.id,
          u.name,
          u.email,
          u.role::text as role,
          u."emailVerified",
          u."profileImage",
          u."createdAt",
          u."updatedAt",
          u."isDeleted",
          COUNT(DISTINCT p.id)::bigint as "paperCount",
          s.status::text as "subscriptionStatus",
          pl.name as "planName"
        FROM "User" u
        LEFT JOIN "Paper" p ON u.id = p."uploaderId" AND p."isDeleted" = false
        LEFT JOIN "Subscription" s ON u.id = s."userId" AND s."isDeleted" = false AND s.status = 'ACTIVE'
        LEFT JOIN "Plan" pl ON s."planId" = pl.id
        WHERE u."isDeleted" = false
          AND u.role = ${role}::"Role"
        GROUP BY u.id, u.name, u.email, u.role, u."emailVerified", u."profileImage", u."createdAt", u."updatedAt", u."isDeleted", s.status, pl.name
        ORDER BY u."createdAt" DESC
        LIMIT ${limit}
        OFFSET ${offset}
      `;
    }
    // Case 7: Only Status filter
    else if (hasStatusFilter) {
      const activeStatus = status === "active";
      countResult = await prisma.$queryRaw<Array<{ count: bigint }>>`
        SELECT COUNT(*)::bigint as count
        FROM "User"
        WHERE "isDeleted" = ${!activeStatus}
      `;

      users = await prisma.$queryRaw`
        SELECT 
          u.id,
          u.name,
          u.email,
          u.role::text as role,
          u."emailVerified",
          u."profileImage",
          u."createdAt",
          u."updatedAt",
          u."isDeleted",
          COUNT(DISTINCT p.id)::bigint as "paperCount",
          s.status::text as "subscriptionStatus",
          pl.name as "planName"
        FROM "User" u
        LEFT JOIN "Paper" p ON u.id = p."uploaderId" AND p."isDeleted" = false
        LEFT JOIN "Subscription" s ON u.id = s."userId" AND s."isDeleted" = false AND s.status = 'ACTIVE'
        LEFT JOIN "Plan" pl ON s."planId" = pl.id
        WHERE u."isDeleted" = ${!activeStatus}
        GROUP BY u.id, u.name, u.email, u.role, u."emailVerified", u."profileImage", u."createdAt", u."updatedAt", u."isDeleted", s.status, pl.name
        ORDER BY u."createdAt" DESC
        LIMIT ${limit}
        OFFSET ${offset}
      `;
    }
    // Case 8: No filters
    else {
      countResult = await prisma.$queryRaw<Array<{ count: bigint }>>`
        SELECT COUNT(*)::bigint as count
        FROM "User"
        WHERE "isDeleted" = false
      `;

      users = await prisma.$queryRaw`
        SELECT 
          u.id,
          u.name,
          u.email,
          u.role::text as role,
          u."emailVerified",
          u."profileImage",
          u."createdAt",
          u."updatedAt",
          u."isDeleted",
          COUNT(DISTINCT p.id)::bigint as "paperCount",
          s.status::text as "subscriptionStatus",
          pl.name as "planName"
        FROM "User" u
        LEFT JOIN "Paper" p ON u.id = p."uploaderId" AND p."isDeleted" = false
        LEFT JOIN "Subscription" s ON u.id = s."userId" AND s."isDeleted" = false AND s.status = 'ACTIVE'
        LEFT JOIN "Plan" pl ON s."planId" = pl.id
        WHERE u."isDeleted" = false
        GROUP BY u.id, u.name, u.email, u.role, u."emailVerified", u."profileImage", u."createdAt", u."updatedAt", u."isDeleted", s.status, pl.name
        ORDER BY u."createdAt" DESC
        LIMIT ${limit}
        OFFSET ${offset}
      `;
    }

    const totalCount = Number(countResult[0]?.count || 0);
    const totalPages = Math.ceil(totalCount / limit);

    return {
      users: users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        emailVerified: u.emailVerified,
        profileImage: u.profileImage,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
        isDeleted: u.isDeleted,
        paperCount: Number(u.paperCount),
        subscriptionStatus: u.subscriptionStatus,
        planName: u.planName,
      })),
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  },

  /**
   * Get user statistics for dashboard cards
   */
  async getUserStats() {
    const stats = await prisma.$queryRaw<
      Array<{
        totalUsers: bigint;
        activeUsers: bigint;
        proUsers: bigint;
        adminUsers: bigint;
        deletedUsers: bigint;
        verifiedUsers: bigint;
      }>
    >`
      SELECT 
        COUNT(*)::bigint as "totalUsers",
        COUNT(*) FILTER (WHERE "isDeleted" = false)::bigint as "activeUsers",
        COUNT(*) FILTER (WHERE role = 'PRO_RESEARCHER' AND "isDeleted" = false)::bigint as "proUsers",
        COUNT(*) FILTER (WHERE role = 'ADMIN' AND "isDeleted" = false)::bigint as "adminUsers",
        COUNT(*) FILTER (WHERE "isDeleted" = true)::bigint as "deletedUsers",
        COUNT(*) FILTER (WHERE "emailVerified" = true AND "isDeleted" = false)::bigint as "verifiedUsers"
      FROM "User"
    `;

    return {
      totalUsers: Number(stats[0]?.totalUsers || 0),
      activeUsers: Number(stats[0]?.activeUsers || 0),
      proUsers: Number(stats[0]?.proUsers || 0),
      adminUsers: Number(stats[0]?.adminUsers || 0),
      deletedUsers: Number(stats[0]?.deletedUsers || 0),
      verifiedUsers: Number(stats[0]?.verifiedUsers || 0),
    };
  },

  /**
   * Update user role (admin only)
   */
  async updateUserRole(userId: string, newRole: string, adminId: string) {
    // Validate that the user exists and is not deleted
    const existingUser = await prisma.$queryRaw<
      Array<{ id: string; role: string; isDeleted: boolean }>
    >`
      SELECT id, role::text, "isDeleted"
      FROM "User"
      WHERE id = ${userId}
    `;

    if (!existingUser.length || existingUser[0].isDeleted) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    // Prevent self role change to avoid admin lockout
    if (userId === adminId) {
      throw new ApiError(httpStatus.FORBIDDEN, "Cannot change your own role");
    }

    // Update the role
    const updatedUser = await prisma.$executeRaw`
      UPDATE "User"
      SET 
        role = ${newRole}::"Role",
        "updatedAt" = NOW()
      WHERE id = ${userId}
        AND "isDeleted" = false
    `;

    if (updatedUser === 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Failed to update user role");
    }

    // Return updated user data
    const updated = await prisma.$queryRaw<
      Array<{
        id: string;
        name: string | null;
        email: string;
        role: string;
        updatedAt: Date;
      }>
    >`
      SELECT id, name, email, role::text, "updatedAt"
      FROM "User"
      WHERE id = ${userId}
    `;

    return {
      id: updated[0].id,
      name: updated[0].name,
      email: updated[0].email,
      role: updated[0].role,
      updatedAt: updated[0].updatedAt,
    };
  },

  /**
   * Soft delete user (deactivate)
   */
  async deactivateUser(userId: string, adminId: string) {
    // Validate that the user exists and is not already deleted
    const existingUser = await prisma.$queryRaw<
      Array<{ id: string; isDeleted: boolean }>
    >`
      SELECT id, "isDeleted"
      FROM "User"
      WHERE id = ${userId}
    `;

    if (!existingUser.length) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    if (existingUser[0].isDeleted) {
      throw new ApiError(httpStatus.BAD_REQUEST, "User is already deactivated");
    }

    // Prevent self-deletion to avoid admin lockout
    if (userId === adminId) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        "Cannot deactivate your own account"
      );
    }

    // Soft delete the user
    const deletedUser = await prisma.$executeRaw`
      UPDATE "User"
      SET 
        "isDeleted" = true,
        "updatedAt" = NOW()
      WHERE id = ${userId}
        AND "isDeleted" = false
    `;

    if (deletedUser === 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Failed to deactivate user");
    }

    return {
      message: "User deactivated successfully",
      userId,
    };
  },

  /**
   * Reactivate user (restore soft-deleted user)
   */
  async reactivateUser(userId: string) {
    // Validate that the user exists and is deleted
    const existingUser = await prisma.$queryRaw<
      Array<{ id: string; isDeleted: boolean }>
    >`
      SELECT id, "isDeleted"
      FROM "User"
      WHERE id = ${userId}
    `;

    if (!existingUser.length) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    if (!existingUser[0].isDeleted) {
      throw new ApiError(httpStatus.BAD_REQUEST, "User is already active");
    }

    // Reactivate the user
    const reactivatedUser = await prisma.$executeRaw`
      UPDATE "User"
      SET 
        "isDeleted" = false,
        "updatedAt" = NOW()
      WHERE id = ${userId}
        AND "isDeleted" = true
    `;

    if (reactivatedUser === 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Failed to reactivate user");
    }

    return {
      message: "User reactivated successfully",
      userId,
    };
  },

  /**
   * Permanently delete user (hard delete - use with caution)
   */
  async permanentlyDeleteUser(userId: string, adminId: string) {
    // Validate that the user exists
    const existingUser = await prisma.$queryRaw<Array<{ id: string }>>`
      SELECT id
      FROM "User"
      WHERE id = ${userId}
    `;

    if (!existingUser.length) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    // Prevent self-deletion
    if (userId === adminId) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        "Cannot permanently delete your own account"
      );
    }

    // Hard delete user - cascade will handle related records
    const deletedUser = await prisma.$executeRaw`
      DELETE FROM "User"
      WHERE id = ${userId}
    `;

    if (deletedUser === 0) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Failed to permanently delete user"
      );
    }

    return {
      message: "User permanently deleted",
      userId,
    };
  },
};
