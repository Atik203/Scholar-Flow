import { IPaginationOptions } from "../../interfaces/pagination";
import prisma from "../../shared/prisma";
// TypedSQL usage is optional; fallback to Prisma count in Phase 1
import ApiError from "../../errors/ApiError";
import { IAuthUser } from "../../interfaces/common";
import { UpdateProfileInput } from "./user.validation";

const getAllFromDB = async (params: any, options: IPaginationOptions) => {
  // Use simple $queryRaw for basic user pagination - more efficient than QueryBuilder
  const limit = options.limit || 10;
  const page = options.page || 1;
  const skip = (page - 1) * limit;

  try {
    let users: any[];
    let totalResult: [{ count: bigint }];

    // Get users with pagination using $queryRaw
    // Source: optimized user pagination with search capability
    if (params.search) {
      users = await prisma.$queryRaw<any[]>`
        SELECT id, email, role, "createdAt", "updatedAt"
        FROM "User"
        WHERE "isDeleted" = false
          AND (email ILIKE ${`%${params.search}%`} OR role ILIKE ${`%${params.search}%`})
        ORDER BY "createdAt" DESC
        LIMIT ${limit} OFFSET ${skip}
      `;

      totalResult = await prisma.$queryRaw<[{ count: bigint }]>`
        SELECT COUNT(*) as count
        FROM "User"
        WHERE "isDeleted" = false
          AND (email ILIKE ${`%${params.search}%`} OR role ILIKE ${`%${params.search}%`})
      `;
    } else {
      users = await prisma.$queryRaw<any[]>`
        SELECT id, email, role, "createdAt", "updatedAt"
        FROM "User"
        WHERE "isDeleted" = false
        ORDER BY "createdAt" DESC
        LIMIT ${limit} OFFSET ${skip}
      `;

      totalResult = await prisma.$queryRaw<[{ count: bigint }]>`
        SELECT COUNT(*) as count
        FROM "User"
        WHERE "isDeleted" = false
      `;
    }

    const total = Number(totalResult[0]?.count || 0);
    const totalPage = Math.ceil(total / limit);

    return {
      result: users,
      meta: {
        page,
        limit,
        total,
        totalPage,
      },
    };
  } catch (error) {
    console.error("Error in getAllFromDB with $queryRaw:", error);
    throw new ApiError(500, "Failed to get users from database");
  }
};

const getMyProfile = async (user: IAuthUser) => {
  // Use $queryRaw for optimized profile retrieval
  // Source: optimized single user profile query
  const users = await prisma.$queryRaw<any[]>`
    SELECT id, email, name, "firstName", "lastName", institution, "fieldOfStudy",
           image, role, "createdAt", "updatedAt", "emailVerified"
    FROM "User"
    WHERE email = ${user?.email} AND "isDeleted" = false
    LIMIT 1
  `;

  if (users.length === 0) {
    throw new Error("User not found");
  }

  return users[0];
};

const updateProfile = async (_user: IAuthUser, payload: UpdateProfileInput) => {
  // Debug logging
  console.log("UpdateProfile Service - User:", _user);
  console.log("UpdateProfile Service - Payload:", payload);

  if (!_user || !_user.id) {
    throw new ApiError(401, "User authentication failed");
  }

  try {
    // First verify user exists and is not deleted
    const existingUsers = await prisma.$queryRaw<any[]>`
      SELECT id, email, "isDeleted"
      FROM "User"
      WHERE id = ${_user.id} AND "isDeleted" = false
      LIMIT 1
    `;

    if (existingUsers.length === 0) {
      throw new ApiError(404, "User not found or account deleted");
    }

    // Extract allowed fields for update with validation
    const allowedFields = {
      name: payload.name?.trim(),
      firstName: payload.firstName?.trim(),
      lastName: payload.lastName?.trim(),
      institution: payload.institution?.trim(),
      fieldOfStudy: payload.fieldOfStudy?.trim(),
      image: payload.image?.trim(),
    };

    // Remove undefined and empty values
    const updateData = Object.fromEntries(
      Object.entries(allowedFields).filter(
        ([_, value]) => value !== undefined && value !== ""
      )
    );

    // Build dynamic update query using $queryRaw
    // Source: optimized profile update with dynamic field handling
    const updateFields = Object.keys(updateData);

    if (updateFields.length === 0) {
      // No fields to update, return current user data
      const users = await prisma.$queryRaw<any[]>`
        SELECT id, email, name, "firstName", "lastName", institution, "fieldOfStudy",
               image, role, "createdAt", "updatedAt"
        FROM "User"
        WHERE id = ${_user.id} AND "isDeleted" = false
        LIMIT 1
      `;
      return users[0];
    }

    // Perform the update based on which fields are provided
    if (
      updateData.name !== undefined &&
      updateData.firstName !== undefined &&
      updateData.lastName !== undefined &&
      updateData.institution !== undefined &&
      updateData.fieldOfStudy !== undefined &&
      updateData.image !== undefined
    ) {
      // All fields provided
      await prisma.$queryRaw`
      UPDATE "User" 
      SET name = ${updateData.name}, "firstName" = ${updateData.firstName}, 
          "lastName" = ${updateData.lastName}, institution = ${updateData.institution},
          "fieldOfStudy" = ${updateData.fieldOfStudy}, image = ${updateData.image},
          "updatedAt" = NOW()
      WHERE id = ${_user.id} AND "isDeleted" = false
    `;
    } else {
      // Handle partial updates with specific field combinations
      if (updateData.name !== undefined) {
        await prisma.$queryRaw`
        UPDATE "User" 
        SET name = ${updateData.name}, "updatedAt" = NOW()
        WHERE id = ${_user.id} AND "isDeleted" = false
      `;
      }
      if (updateData.firstName !== undefined) {
        await prisma.$queryRaw`
        UPDATE "User" 
        SET "firstName" = ${updateData.firstName}, "updatedAt" = NOW()
        WHERE id = ${_user.id} AND "isDeleted" = false
      `;
      }
      if (updateData.lastName !== undefined) {
        await prisma.$queryRaw`
        UPDATE "User" 
        SET "lastName" = ${updateData.lastName}, "updatedAt" = NOW()
        WHERE id = ${_user.id} AND "isDeleted" = false
      `;
      }
      if (updateData.institution !== undefined) {
        await prisma.$queryRaw`
        UPDATE "User" 
        SET institution = ${updateData.institution}, "updatedAt" = NOW()
        WHERE id = ${_user.id} AND "isDeleted" = false
      `;
      }
      if (updateData.fieldOfStudy !== undefined) {
        await prisma.$queryRaw`
        UPDATE "User" 
        SET "fieldOfStudy" = ${updateData.fieldOfStudy}, "updatedAt" = NOW()
        WHERE id = ${_user.id} AND "isDeleted" = false
      `;
      }
      if (updateData.image !== undefined) {
        await prisma.$queryRaw`
        UPDATE "User" 
        SET image = ${updateData.image}, "updatedAt" = NOW()
        WHERE id = ${_user.id} AND "isDeleted" = false
      `;
      }
    }

    // Return updated user data
    const users = await prisma.$queryRaw<any[]>`
      SELECT id, email, name, "firstName", "lastName", institution, "fieldOfStudy",
             image, role, "createdAt", "updatedAt"
      FROM "User"
      WHERE id = ${_user.id} AND "isDeleted" = false
      LIMIT 1
    `;

    if (users.length === 0) {
      throw new ApiError(404, "User not found after update");
    }

    return users[0];
  } catch (error) {
    console.error("Error updating user profile:", error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Failed to update profile");
  }
};

const changePassword = async (_user: IAuthUser, _payload: any) => {
  // Password-based auth isn't implemented in Prisma User model; skipping for dev boot.
  return;
};

const deleteAccount = async (user: IAuthUser) => {
  // Soft delete user account by setting isDeleted to true
  // Source: secure account deletion with data preservation
  try {
    // First verify user exists and is not already deleted
    const existingUsers = await prisma.$queryRaw<any[]>`
      SELECT id, email, "isDeleted"
      FROM "User"
      WHERE id = ${user.id} AND "isDeleted" = false
      LIMIT 1
    `;

    if (existingUsers.length === 0) {
      throw new ApiError(404, "User not found or already deleted");
    }

    // Soft delete the user account
    await prisma.$queryRaw`
      UPDATE "User"
      SET "isDeleted" = true, "updatedAt" = NOW()
      WHERE id = ${user.id} AND "isDeleted" = false
    `;

    // Delete all user sessions to force logout
    await prisma.$queryRaw`
      DELETE FROM "Session"
      WHERE "userId" = ${user.id}
    `;

    return {
      success: true,
      message: "Account deleted successfully",
      deletedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error deleting user account:", error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Failed to delete account");
  }
};

export const userService = {
  getAllFromDB,
  getMyProfile,
  updateProfile,
  changePassword,
  deleteAccount,
};
