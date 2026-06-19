import { randomUUID } from "crypto";
import ApiError from "../../errors/ApiError";
import { IAuthUser } from "../../interfaces/common";
import { IPaginationOptions } from "../../interfaces/pagination";
import prisma from "../../shared/prisma";
import { StorageService } from "../Papers/storage.service";
import {
  UpdateOnboardingInput,
  UpdatePreferencesInput,
  UpdateProfileInput,
} from "./user.validation";

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
           image, role, "createdAt", "updatedAt", "emailVerified",
           "onboardingCompleted", "onboardingStep"
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

/**
 * Upload profile picture to S3 and update user record
 * Uses permanent URLs (no expiration) for profile pictures
 */
const uploadProfilePicture = async (
  user: IAuthUser,
  file: Express.Multer.File
) => {
  try {
    // Verify user exists
    const existingUsers = await prisma.$queryRaw<any[]>`
      SELECT id, email, "isDeleted"
      FROM "User"
      WHERE id = ${user.id} AND "isDeleted" = false
      LIMIT 1
    `;

    if (existingUsers.length === 0) {
      throw new ApiError(404, "User not found or account deleted");
    }

    // Initialize storage service
    const storageService = new StorageService();

    // Generate unique file key for profile picture
    const fileExtension = file.mimetype.split("/")[1];
    const fileKey = `profile-pictures/${user.id}/${randomUUID()}.${fileExtension}`;

    // Upload to S3 with public-read ACL
    await storageService.putObject({
      key: fileKey,
      body: file.buffer,
      contentType: file.mimetype,
    });

    // Generate permanent public URL (no expiration)
    // Profile pictures are uploaded with public-read ACL for permanent access
    const bucket = process.env.AWS_BUCKET_NAME || process.env.S3_BUCKET;
    const region = process.env.AWS_REGION || "us-east-1";
    const imageUrl = `https://${bucket}.s3.${region}.amazonaws.com/${fileKey}`;

    // Update user profile with new image URL
    await prisma.$queryRaw`
      UPDATE "User" 
      SET image = ${imageUrl}, "updatedAt" = NOW()
      WHERE id = ${user.id} AND "isDeleted" = false
    `;

    // Return updated user data
    const users = await prisma.$queryRaw<any[]>`
      SELECT id, email, name, "firstName", "lastName", institution, "fieldOfStudy",
             image, role, "createdAt", "updatedAt"
      FROM "User"
      WHERE id = ${user.id} AND "isDeleted" = false
      LIMIT 1
    `;

    if (users.length === 0) {
      throw new ApiError(404, "User not found after update");
    }

    return {
      ...users[0],
      imageUrl,
      message: "Profile picture uploaded successfully",
    };
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Failed to upload profile picture");
  }
};

/**
 * Get comprehensive user analytics including papers, collections, storage, and tokens
 */
const getUserAnalytics = async (user: IAuthUser) => {
  try {
    // Verify user exists
    const existingUsers = await prisma.$queryRaw<any[]>`
      SELECT id, email, role, "stripeSubscriptionId", "stripePriceId", "isDeleted"
      FROM "User"
      WHERE id = ${user.id} AND "isDeleted" = false
      LIMIT 1
    `;

    if (existingUsers.length === 0) {
      throw new ApiError(404, "User not found or account deleted");
    }

    const userData = existingUsers[0];

    // Determine user plan (Free or Pro based on Stripe subscription)
    const plan = userData.stripeSubscriptionId ? "PRO" : "FREE";

    // Get papers count and storage used
    const paperStats = await prisma.$queryRaw<any[]>`
      SELECT 
        COUNT(DISTINCT p.id)::INTEGER as "totalPapers",
        COALESCE(SUM(pf."sizeBytes"), 0)::BIGINT as "totalStorage"
      FROM "Paper" p
      LEFT JOIN "PaperFile" pf ON p.id = pf."paperId" AND pf."isDeleted" = false
      WHERE p."uploaderId" = ${user.id} AND p."isDeleted" = false
    `;

    // Get collections count
    const collectionStats = await prisma.$queryRaw<any[]>`
      SELECT COUNT(*)::INTEGER as "totalCollections"
      FROM "Collection"
      WHERE "ownerId" = ${user.id} AND "isDeleted" = false
    `;

    // Get AI tokens usage (from UsageEvent)
    // Sum units for AI-related events (ai_summarize, semantic_search, etc.)
    const tokenStats = await prisma.$queryRaw<any[]>`
      SELECT 
        COALESCE(SUM("units"), 0)::INTEGER as "totalTokensUsed"
      FROM "UsageEvent"
      WHERE "userId" = ${user.id}
        AND "isDeleted" = false
        AND ("kind" LIKE 'ai_%' OR "kind" = 'semantic_search')
    `;

    // Get papers uploaded over time (last 30 days for chart)
    const papersOverTime = await prisma.$queryRaw<any[]>`
      SELECT 
        DATE("createdAt") as date,
        COUNT(*)::INTEGER as count
      FROM "Paper"
      WHERE "uploaderId" = ${user.id} 
        AND "isDeleted" = false
        AND "createdAt" >= NOW() - INTERVAL '30 days'
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `;

    // Get collections created over time (last 30 days)
    const collectionsOverTime = await prisma.$queryRaw<any[]>`
      SELECT 
        DATE("createdAt") as date,
        COUNT(*)::INTEGER as count
      FROM "Collection"
      WHERE "ownerId" = ${user.id} 
        AND "isDeleted" = false
        AND "createdAt" >= NOW() - INTERVAL '30 days'
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `;

    // Get storage usage by month (last 6 months)
    const storageOverTime = await prisma.$queryRaw<any[]>`
      SELECT 
        DATE_TRUNC('month', p."createdAt") as month,
        COALESCE(SUM(pf."sizeBytes"), 0)::BIGINT as "totalSize"
      FROM "Paper" p
      LEFT JOIN "PaperFile" pf ON p.id = pf."paperId" AND pf."isDeleted" = false
      WHERE p."uploaderId" = ${user.id} 
        AND p."isDeleted" = false
        AND p."createdAt" >= NOW() - INTERVAL '6 months'
      GROUP BY DATE_TRUNC('month', p."createdAt")
      ORDER BY month ASC
    `;

    // Get papers by processing status
    const papersByStatus = await prisma.$queryRaw<any[]>`
      SELECT 
        "processingStatus",
        COUNT(*)::INTEGER as count
      FROM "Paper"
      WHERE "uploaderId" = ${user.id} AND "isDeleted" = false
      GROUP BY "processingStatus"
    `;

    // Convert storage from bytes to MB for easier reading
    const totalStorageMB =
      Number(paperStats[0]?.totalStorage || 0) / (1024 * 1024);

    // Plan limits
    const planLimits = {
      FREE: {
        maxPapers: 50,
        maxStorage: 1024, // 1GB in MB
        maxTokens: 10000,
        maxCollections: 10,
      },
      PRO: {
        maxPapers: -1, // Unlimited
        maxStorage: 51200, // 50GB in MB
        maxTokens: 1000000,
        maxCollections: -1, // Unlimited
      },
    };

    const limits = planLimits[plan as keyof typeof planLimits];

    return {
      plan,
      limits,
      usage: {
        papers: {
          total: Number(paperStats[0]?.totalPapers || 0),
          limit: limits.maxPapers,
          percentage:
            limits.maxPapers === -1
              ? 0
              : (Number(paperStats[0]?.totalPapers || 0) / limits.maxPapers) *
                100,
        },
        collections: {
          total: Number(collectionStats[0]?.totalCollections || 0),
          limit: limits.maxCollections,
          percentage:
            limits.maxCollections === -1
              ? 0
              : (Number(collectionStats[0]?.totalCollections || 0) /
                  limits.maxCollections) *
                100,
        },
        storage: {
          used: totalStorageMB,
          limit: limits.maxStorage,
          percentage: (totalStorageMB / limits.maxStorage) * 100,
          unit: "MB",
        },
        tokens: {
          used: Number(tokenStats[0]?.totalTokensUsed || 0),
          limit: limits.maxTokens,
          percentage:
            (Number(tokenStats[0]?.totalTokensUsed || 0) / limits.maxTokens) *
            100,
        },
      },
      charts: {
        papersOverTime: papersOverTime.map((row) => ({
          date: row.date,
          count: Number(row.count),
        })),
        collectionsOverTime: collectionsOverTime.map((row) => ({
          date: row.date,
          count: Number(row.count),
        })),
        storageOverTime: storageOverTime.map((row) => ({
          month: row.month,
          size: Number(row.totalSize) / (1024 * 1024), // Convert to MB
        })),
        papersByStatus: papersByStatus.map((row) => ({
          status: row.processingStatus,
          count: Number(row.count),
        })),
      },
    };
  } catch (error) {
    console.error("Error fetching user analytics:", error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Failed to fetch user analytics");
  }
};

const updateOnboarding = async (user: IAuthUser, data: UpdateOnboardingInput) => {
  try {
    const fields: string[] = [];
    const values: any[] = [];

    if (data.onboardingCompleted !== undefined) {
      fields.push(`"onboardingCompleted" = $${fields.length + 1}`);
      values.push(data.onboardingCompleted);
    }
    if (data.onboardingStep !== undefined) {
      fields.push(`"onboardingStep" = $${fields.length + 1}`);
      values.push(data.onboardingStep);
    }
    fields.push(`"updatedAt" = NOW()`);

    if (fields.length === 0) {
      throw new ApiError(400, "No valid onboarding fields provided");
    }

    await prisma.$queryRaw`
      UPDATE "User"
      SET "onboardingCompleted" = ${data.onboardingCompleted ?? false},
          "onboardingStep" = ${data.onboardingStep ?? 0},
          "updatedAt" = NOW()
      WHERE id = ${user.id} AND "isDeleted" = false
    `;

    const users = await prisma.$queryRaw<any[]>`
      SELECT id, email, name, "firstName", "lastName", image, role,
             "onboardingCompleted", "onboardingStep"
      FROM "User"
      WHERE id = ${user.id} AND "isDeleted" = false
      LIMIT 1
    `;

    if (users.length === 0) {
      throw new ApiError(404, "User not found");
    }

    return users[0];
  } catch (error) {
    if (error instanceof ApiError) throw error;
    console.error("Error updating onboarding:", error);
    throw new ApiError(500, "Failed to update onboarding status");
  }
};

/**
 * Get or create default user preferences (idempotent)
 * Phase 3 - User preference data layer
 */
const getPreferences = async (user: IAuthUser) => {
  if (!user || !user.id) {
    throw new ApiError(401, "User authentication failed");
  }

  try {
    const existing = await prisma.$queryRaw<any[]>`
      SELECT id, "userId", theme, language, timezone, "emailDigest",
             "defaultCitationStyle", "compactMode", metadata,
             "createdAt", "updatedAt"
      FROM "UserPreference"
      WHERE "userId" = ${user.id}
      LIMIT 1
    `;

    if (existing.length > 0) {
      return existing[0];
    }

    // Create default preferences (idempotent via upsert)
    const created = await prisma.$queryRaw<any[]>`
      INSERT INTO "UserPreference" (id, "userId", theme, language, timezone,
                                     "emailDigest", "defaultCitationStyle",
                                     "compactMode", metadata, "createdAt", "updatedAt")
      VALUES (gen_random_uuid()::text, ${user.id}, 'system', 'en', 'UTC',
              true, 'APA', false, NULL, NOW(), NOW())
      ON CONFLICT ("userId") DO UPDATE SET "updatedAt" = NOW()
      RETURNING id, "userId", theme, language, timezone, "emailDigest",
                "defaultCitationStyle", "compactMode", metadata,
                "createdAt", "updatedAt"
    `;

    return created[0];
  } catch (error) {
    console.error("Error in getPreferences:", error);
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Failed to fetch user preferences");
  }
};

/**
 * Update user preferences (upsert semantics)
 * Phase 3 - User preference data layer
 */
const updatePreferences = async (
  user: IAuthUser,
  payload: UpdatePreferencesInput
) => {
  if (!user || !user.id) {
    throw new ApiError(401, "User authentication failed");
  }

  try {
    const existing = await prisma.$queryRaw<any[]>`
      SELECT id FROM "UserPreference" WHERE "userId" = ${user.id} LIMIT 1
    `;

    if (existing.length === 0) {
      // Insert with provided values (fall back to defaults)
      const theme = payload.theme ?? "system";
      const language = payload.language ?? "en";
      const timezone = payload.timezone ?? "UTC";
      const emailDigest = payload.emailDigest ?? true;
      const defaultCitationStyle = payload.defaultCitationStyle ?? "APA";
      const compactMode = payload.compactMode ?? false;
      const metadata = payload.metadata
        ? JSON.stringify(payload.metadata)
        : null;

      await prisma.$queryRaw`
        INSERT INTO "UserPreference" (id, "userId", theme, language, timezone,
                                       "emailDigest", "defaultCitationStyle",
                                       "compactMode", metadata, "createdAt", "updatedAt")
        VALUES (gen_random_uuid()::text, ${user.id}, ${theme}, ${language}, ${timezone},
                ${emailDigest}, ${defaultCitationStyle}, ${compactMode},
                ${metadata}::jsonb, NOW(), NOW())
      `;
    } else {
      // Build dynamic update
      const sets: string[] = [];
      const params: any[] = [];
      let idx = 1;
      if (payload.theme !== undefined) {
        sets.push(`theme = $${idx++}`);
        params.push(payload.theme);
      }
      if (payload.language !== undefined) {
        sets.push(`language = $${idx++}`);
        params.push(payload.language);
      }
      if (payload.timezone !== undefined) {
        sets.push(`timezone = $${idx++}`);
        params.push(payload.timezone);
      }
      if (payload.emailDigest !== undefined) {
        sets.push(`"emailDigest" = $${idx++}`);
        params.push(payload.emailDigest);
      }
      if (payload.defaultCitationStyle !== undefined) {
        sets.push(`"defaultCitationStyle" = $${idx++}`);
        params.push(payload.defaultCitationStyle);
      }
      if (payload.compactMode !== undefined) {
        sets.push(`"compactMode" = $${idx++}`);
        params.push(payload.compactMode);
      }
      if (payload.metadata !== undefined) {
        sets.push(`metadata = $${idx++}::jsonb`);
        params.push(JSON.stringify(payload.metadata));
      }

      if (sets.length > 0) {
        // Run conditional updates with separate tagged-template queries
        // to satisfy the project's no-$executeRawUnsafe lint rule.
        if (payload.theme !== undefined) {
          await prisma.$executeRaw`
            UPDATE "UserPreference"
            SET theme = ${payload.theme}, "updatedAt" = NOW()
            WHERE "userId" = ${user.id}
          `;
        }
        if (payload.language !== undefined) {
          await prisma.$executeRaw`
            UPDATE "UserPreference"
            SET language = ${payload.language}, "updatedAt" = NOW()
            WHERE "userId" = ${user.id}
          `;
        }
        if (payload.timezone !== undefined) {
          await prisma.$executeRaw`
            UPDATE "UserPreference"
            SET timezone = ${payload.timezone}, "updatedAt" = NOW()
            WHERE "userId" = ${user.id}
          `;
        }
        if (payload.emailDigest !== undefined) {
          await prisma.$executeRaw`
            UPDATE "UserPreference"
            SET "emailDigest" = ${payload.emailDigest}, "updatedAt" = NOW()
            WHERE "userId" = ${user.id}
          `;
        }
        if (payload.defaultCitationStyle !== undefined) {
          await prisma.$executeRaw`
            UPDATE "UserPreference"
            SET "defaultCitationStyle" = ${payload.defaultCitationStyle}, "updatedAt" = NOW()
            WHERE "userId" = ${user.id}
          `;
        }
        if (payload.compactMode !== undefined) {
          await prisma.$executeRaw`
            UPDATE "UserPreference"
            SET "compactMode" = ${payload.compactMode}, "updatedAt" = NOW()
            WHERE "userId" = ${user.id}
          `;
        }
        if (payload.metadata !== undefined) {
          await prisma.$executeRaw`
            UPDATE "UserPreference"
            SET metadata = ${JSON.stringify(payload.metadata)}::jsonb, "updatedAt" = NOW()
            WHERE "userId" = ${user.id}
          `;
        }
      }
    }

    // Return updated row
    const updated = await prisma.$queryRaw<any[]>`
      SELECT id, "userId", theme, language, timezone, "emailDigest",
             "defaultCitationStyle", "compactMode", metadata,
             "createdAt", "updatedAt"
      FROM "UserPreference"
      WHERE "userId" = ${user.id}
      LIMIT 1
    `;

    if (updated.length === 0) {
      throw new ApiError(500, "Failed to load preferences after update");
    }

    return updated[0];
  } catch (error) {
    console.error("Error in updatePreferences:", error);
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Failed to update user preferences");
  }
};

/**
 * Get user activity log (paginated)
 * Phase 3 - Activity feed for dashboard home
 */
const getActivity = async (user: IAuthUser, options: IPaginationOptions) => {
  if (!user || !user.id) {
    throw new ApiError(401, "User authentication failed");
  }

  const limit = options.limit || 10;
  const page = options.page || 1;
  const skip = (page - 1) * limit;

  try {
    const items = await prisma.$queryRaw<any[]>`
      SELECT id, entity, "entityId", action, details, severity,
             "workspaceId", "createdAt"
      FROM "ActivityLogEntry"
      WHERE "userId" = ${user.id} AND "isDeleted" = false
      ORDER BY "createdAt" DESC
      LIMIT ${limit} OFFSET ${skip}
    `;

    const totalResult = await prisma.$queryRaw<[{ count: bigint }]>`
      SELECT COUNT(*) as count
      FROM "ActivityLogEntry"
      WHERE "userId" = ${user.id} AND "isDeleted" = false
    `;

    const total = Number(totalResult[0]?.count || 0);
    const totalPage = Math.ceil(total / limit);

    return {
      result: items,
      meta: { page, limit, total, totalPage },
    };
  } catch (error) {
    console.error("Error in getActivity:", error);
    throw new ApiError(500, "Failed to fetch user activity");
  }
};

export const userService = {
  getAllFromDB,
  getMyProfile,
  updateProfile,
  changePassword,
  deleteAccount,
  uploadProfilePicture,
  getUserAnalytics,
  updateOnboarding,
  getPreferences,
  updatePreferences,
  getActivity,
};
