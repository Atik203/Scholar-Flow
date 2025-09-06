import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import ApiError from "../../errors/ApiError";
import emailService from "../../shared/emailService";
import prisma from "../../shared/prisma";
import tokenService from "../../shared/tokenService";
import {
  AUTH_ERROR_MESSAGES,
  Permission,
  ROLE_HIERARCHY,
  ROLE_PERMISSIONS,
  USER_ROLES,
} from "./auth.constant";
import {
  IAccountData,
  IOAuthProfile,
  IRoleUpdateData,
  ISessionData,
  IUserData,
} from "./auth.interface";

class AuthService {
  /**
   * Create or update user using Prisma with role support
   */
  async createOrUpdateUser(userData: IUserData) {
    try {
      const userId = userData.id || uuidv4();
      const role = this.validateRole(userData.role || USER_ROLES.RESEARCHER);

      const user = await prisma.user.upsert({
        where: { email: userData.email },
        update: {
          name: userData.name ?? "",
          image: userData.image ?? "",
          role: role as any,
        },
        create: {
          id: userId,
          email: userData.email,
          name: userData.name ?? "",
          image: userData.image ?? "",
          role: role as any,
        },
      });

      return user;
    } catch (error) {
      console.error("Error creating/updating user:", error);
      throw new ApiError(500, AUTH_ERROR_MESSAGES.OAUTH_ERROR);
    }
  }

  /**
   * Create or update user with email verified for OAuth users
   */
  async createOrUpdateUserWithOAuth(userData: IUserData) {
    try {
      const userId = userData.id || uuidv4();
      const role = this.validateRole(userData.role || USER_ROLES.RESEARCHER);

      const user = await prisma.user.upsert({
        where: { email: userData.email },
        update: {
          name: userData.name ?? "",
          image: userData.image ?? "",
          role: role as any,
          emailVerified: new Date(), // Mark as verified for OAuth users
        },
        create: {
          id: userId,
          email: userData.email,
          name: userData.name ?? "",
          image: userData.image ?? "",
          role: role as any,
          emailVerified: new Date(), // Mark as verified for OAuth users
        },
      });

      return user;
    } catch (error) {
      console.error("Error creating/updating OAuth user:", error);
      throw new ApiError(500, AUTH_ERROR_MESSAGES.OAUTH_ERROR);
    }
  }

  /**
   * Validate if role is valid
   */
  private validateRole(role: string): string {
    const validRoles = Object.values(USER_ROLES);
    if (!validRoles.includes(role as any)) {
      throw new ApiError(400, AUTH_ERROR_MESSAGES.INVALID_ROLE);
    }
    return role;
  }

  /**
   * Sign in with email and password using $queryRaw for optimized user lookup
   * Source: optimized single query for authentication data retrieval
   */
  async signInWithPassword(email: string, _password: string) {
    try {
      // Find user by email using $queryRaw for better performance
      const users = await prisma.$queryRaw<any[]>`
        SELECT id, email, name, image, password, role
        FROM "User"
        WHERE email = ${email} AND "isDeleted" = false
        LIMIT 1
      `;

      const user = users[0];
      if (!user) {
        throw new ApiError(401, AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS);
      }

      // Check if user has a password (not OAuth-only user)
      if (!user.password) {
        throw new ApiError(
          401,
          "This account uses OAuth login. Please sign in with Google or GitHub."
        );
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(_password, user.password);
      if (!isPasswordValid) {
        throw new ApiError(401, AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS);
      }

      // Return user without password
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      console.error("Error during password sign-in:", error);
      throw new ApiError(500, "Internal server error during sign-in");
    }
  }

  /**
   * Register new user with email and password using $queryRaw for optimized operations
   * Source: optimized user existence check and creation in single transaction
   */
  async registerWithPassword(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    institution?: string,
    fieldOfStudy?: string,
    role: string = USER_ROLES.RESEARCHER
  ) {
    try {
      // Check if user already exists using $queryRaw
      const existingUsers = await prisma.$queryRaw<any[]>`
        SELECT id FROM "User" 
        WHERE email = ${email} AND "isDeleted" = false
        LIMIT 1
      `;

      if (existingUsers.length > 0) {
        throw new ApiError(409, "User with this email already exists");
      }

      // Validate role
      const validRole = this.validateRole(role);

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create full name from first and last name
      const name = `${firstName} ${lastName}`.trim();
      const userId = uuidv4();

      // Create new user using $queryRaw with proper role casting
      await prisma.$queryRaw`
        INSERT INTO "User" (
          id, email, name, "firstName", "lastName", institution, "fieldOfStudy", 
          password, role, "isDeleted", "createdAt", "updatedAt"
        ) VALUES (
          ${userId}, ${email}, ${name}, ${firstName}, ${lastName}, 
          ${institution || null}, ${fieldOfStudy || null}, ${hashedPassword}, 
          ${validRole}::"Role", false, NOW(), NOW()
        )
      `;

      // Return the created user data using $queryRaw
      const users = await prisma.$queryRaw<any[]>`
        SELECT id, email, name, "firstName", "lastName", institution, 
               "fieldOfStudy", image, role, "createdAt"
        FROM "User"
        WHERE id = ${userId}
        LIMIT 1
      `;

      return users[0];
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      console.error("Error during user registration:", error);
      throw new ApiError(500, "Internal server error during registration");
    }
  }

  /**
   * Check if user has permission
   */
  hasPermission(userRole: string, permission: Permission): boolean {
    const rolePermissions =
      ROLE_PERMISSIONS[userRole as keyof typeof ROLE_PERMISSIONS];
    return rolePermissions
      ? (rolePermissions as readonly Permission[]).includes(permission)
      : false;
  }

  /**
   * Check if user has role hierarchy access
   */
  hasRoleAccess(userRole: string, requiredRole: string): boolean {
    const userLevel =
      ROLE_HIERARCHY[userRole as keyof typeof ROLE_HIERARCHY] || 0;
    const requiredLevel =
      ROLE_HIERARCHY[requiredRole as keyof typeof ROLE_HIERARCHY] || 0;
    return userLevel >= requiredLevel;
  }

  /**
   * Update user role using $queryRaw for optimized role update operation
   * Source: optimized role update with single query execution
   */
  async updateUserRole(
    adminUserId: string,
    targetUserId: string,
    roleData: IRoleUpdateData
  ) {
    try {
      // Verify admin has permission
      const adminUser = await this.getUserById(adminUserId);
      if (!adminUser || adminUser.role !== USER_ROLES.ADMIN) {
        throw new ApiError(403, AUTH_ERROR_MESSAGES.FORBIDDEN);
      }

      // Validate new role
      const newRole = this.validateRole(roleData.role);

      // Update user role using $queryRaw with proper role casting
      await prisma.$queryRaw`
        UPDATE "User" 
        SET role = ${newRole}::"Role", "updatedAt" = NOW()
        WHERE id = ${targetUserId} AND "isDeleted" = false
      `;

      // Return updated user data
      const users = await prisma.$queryRaw<any[]>`
        SELECT id, email, name, role, "createdAt", "updatedAt"
        FROM "User"
        WHERE id = ${targetUserId} AND "isDeleted" = false
        LIMIT 1
      `;

      if (users.length === 0) {
        throw new ApiError(404, "User not found");
      }

      return users[0];
    } catch (error) {
      console.error("Error updating user role:", error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, "Failed to update user role");
    }
  }

  /**
   * Get all users with role filtering (admin/team lead only)
   * Uses $queryRaw for optimized filtering and search
   * Source: optimized user filtering with role hierarchy and search
   */
  async getAllUsers(
    requestingUserId: string,
    filters?: { role?: string; search?: string }
  ) {
    try {
      // Verify requesting user has permission
      const requestingUser = await this.getUserById(requestingUserId);
      if (
        !requestingUser ||
        !this.hasRoleAccess(requestingUser.role, USER_ROLES.TEAM_LEAD)
      ) {
        throw new ApiError(403, AUTH_ERROR_MESSAGES.FORBIDDEN);
      }

      // Use $queryRaw with conditional logic for better performance
      let users: any[];

      if (requestingUser.role === USER_ROLES.TEAM_LEAD) {
        // Team leads can only see researchers
        if (filters?.search) {
          users = await prisma.$queryRaw<any[]>`
            SELECT id, email, name, image, role, "createdAt", "updatedAt"
            FROM "User"
            WHERE "isDeleted" = false
              AND role IN ('RESEARCHER', 'PRO_RESEARCHER')
              AND (email ILIKE ${`%${filters.search}%`} OR name ILIKE ${`%${filters.search}%`})
            ORDER BY "createdAt" DESC
          `;
        } else {
          users = await prisma.$queryRaw<any[]>`
            SELECT id, email, name, image, role, "createdAt", "updatedAt"
            FROM "User"
            WHERE "isDeleted" = false
              AND role IN ('RESEARCHER', 'PRO_RESEARCHER')
            ORDER BY "createdAt" DESC
          `;
        }
      } else {
        // Admin can see all users with optional role and search filters
        if (filters?.role && filters?.search) {
          const validRole = this.validateRole(filters.role);
          users = await prisma.$queryRaw<any[]>`
            SELECT id, email, name, image, role, "createdAt", "updatedAt"
            FROM "User"
            WHERE "isDeleted" = false
              AND role = ${validRole}
              AND (email ILIKE ${`%${filters.search}%`} OR name ILIKE ${`%${filters.search}%`})
            ORDER BY "createdAt" DESC
          `;
        } else if (filters?.role) {
          const validRole = this.validateRole(filters.role);
          users = await prisma.$queryRaw<any[]>`
            SELECT id, email, name, image, role, "createdAt", "updatedAt"
            FROM "User"
            WHERE "isDeleted" = false AND role = ${validRole}
            ORDER BY "createdAt" DESC
          `;
        } else if (filters?.search) {
          users = await prisma.$queryRaw<any[]>`
            SELECT id, email, name, image, role, "createdAt", "updatedAt"
            FROM "User"
            WHERE "isDeleted" = false
              AND (email ILIKE ${`%${filters.search}%`} OR name ILIKE ${`%${filters.search}%`})
            ORDER BY "createdAt" DESC
          `;
        } else {
          users = await prisma.$queryRaw<any[]>`
            SELECT id, email, name, image, role, "createdAt", "updatedAt"
            FROM "User"
            WHERE "isDeleted" = false
            ORDER BY "createdAt" DESC
          `;
        }
      }

      return users;
    } catch (error) {
      console.error("Error getting all users:", error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, "Failed to get users");
    }
  }

  async getUserByEmail(email: string) {
    try {
      const users = await prisma.$queryRaw<any[]>`
        SELECT id, email, name, "firstName", "lastName", image, role, password, 
               "emailVerified", institution, "fieldOfStudy", "createdAt", "updatedAt", "isDeleted"
        FROM "User" 
        WHERE email = ${email} AND "isDeleted" = false
        LIMIT 1
      `;
      return users[0] || null;
    } catch (error) {
      console.error("Error getting user by email:", error);
      throw new ApiError(500, "Failed to get user by email");
    }
  }

  async getUserById(id: string) {
    try {
      const users = await prisma.$queryRaw<any[]>`
        SELECT id, email, name, "firstName", "lastName", image, role, password,
               "emailVerified", institution, "fieldOfStudy", "createdAt", "updatedAt", "isDeleted"
        FROM "User" 
        WHERE id = ${id} AND "isDeleted" = false
        LIMIT 1
      `;
      return users[0] || null;
    } catch (error) {
      console.error("Error getting user by ID:", error);
      throw new ApiError(500, "Failed to get user by ID");
    }
  }

  async createAccount(userId: string, accountData: IAccountData) {
    try {
      const account = await prisma.account.upsert({
        where: {
          provider_providerAccountId: {
            provider: accountData.provider,
            providerAccountId: accountData.providerAccountId,
          },
        },
        update: {
          refresh_token: accountData.refresh_token,
          access_token: accountData.access_token,
          expires_at: accountData.expires_at,
          token_type: accountData.token_type,
          scope: accountData.scope,
          id_token: accountData.id_token,
          session_state: accountData.session_state,
        },
        create: {
          userId,
          type: accountData.type,
          provider: accountData.provider,
          providerAccountId: accountData.providerAccountId,
          refresh_token: accountData.refresh_token,
          access_token: accountData.access_token,
          expires_at: accountData.expires_at,
          token_type: accountData.token_type,
          scope: accountData.scope,
          id_token: accountData.id_token,
          session_state: accountData.session_state,
        },
      });

      return account;
    } catch (error) {
      console.error("Error creating account:", error);
      throw new ApiError(500, AUTH_ERROR_MESSAGES.OAUTH_ERROR);
    }
  }

  /**
   * Create session using $queryRaw for optimized session creation
   * Source: optimized session insertion with direct SQL
   */
  async createSession(userId: string, sessionData: ISessionData) {
    try {
      // Create session using $queryRaw
      await prisma.$queryRaw`
        INSERT INTO "Session" ("sessionToken", "userId", expires, "createdAt", "updatedAt")
        VALUES (${sessionData.sessionToken}, ${userId}, ${sessionData.expires}, NOW(), NOW())
      `;

      // Return the created session
      const sessions = await prisma.$queryRaw<any[]>`
        SELECT "sessionToken", "userId", expires, "createdAt", "updatedAt"
        FROM "Session"
        WHERE "sessionToken" = ${sessionData.sessionToken}
        LIMIT 1
      `;

      return sessions[0];
    } catch (error) {
      console.error("Error creating session:", error);
      throw new ApiError(500, AUTH_ERROR_MESSAGES.SESSION_EXPIRED);
    }
  }

  /**
   * Get session by token using $queryRaw with user data join
   * Source: optimized session retrieval with user information in single query
   */
  async getSessionByToken(sessionToken: string) {
    try {
      const sessions = await prisma.$queryRaw<any[]>`
        SELECT 
          s."sessionToken", s."userId", s.expires, s."createdAt" as "sessionCreatedAt",
          u.id as "userId", u.email, u.name, u.image, u.role, u."emailVerified"
        FROM "Session" s
        LEFT JOIN "User" u ON s."userId" = u.id
        WHERE s."sessionToken" = ${sessionToken}
        LIMIT 1
      `;

      if (sessions.length === 0) {
        return null;
      }

      const session = sessions[0];

      // Format the response to match Prisma's include structure
      return {
        sessionToken: session.sessionToken,
        userId: session.userId,
        expires: session.expires,
        createdAt: session.sessionCreatedAt,
        user: {
          id: session.userId,
          email: session.email,
          name: session.name,
          image: session.image,
          role: session.role,
          emailVerified: session.emailVerified,
        },
      };
    } catch (error) {
      console.error("Error getting session by token:", error);
      throw new ApiError(500, "Failed to get session");
    }
  }

  /**
   * Delete session using $queryRaw for optimized session removal
   * Source: optimized session deletion with direct SQL
   */
  async deleteSession(sessionToken: string) {
    try {
      await prisma.$queryRaw`
        DELETE FROM "Session"
        WHERE "sessionToken" = ${sessionToken}
      `;
      return true;
    } catch (error) {
      console.error("Error deleting session:", error);
      throw new ApiError(500, "Failed to delete session");
    }
  }

  /**
   * Handle OAuth sign-in process
   */
  async handleOAuthSignIn(profile: IOAuthProfile, account: IAccountData) {
    try {
      // Extract user data from OAuth profile
      const userData: IUserData = {
        email: profile.email,
        name: profile.name,
        image: profile.image || profile.picture || profile.avatar_url,
        role: USER_ROLES.RESEARCHER,
      };

      // Create or update user with email verified for OAuth users
      const user = await this.createOrUpdateUserWithOAuth(userData);

      // Create account linking
      await this.createAccount(user.id, account);

      return user;
    } catch (error) {
      console.error("Error handling OAuth sign-in:", error);
      throw new ApiError(500, AUTH_ERROR_MESSAGES.OAUTH_ERROR);
    }
  }

  /**
   * Validate JWT token and get user
   */
  async validateJWTToken(userId: string) {
    try {
      const user = await this.getUserById(userId);

      if (!user) {
        throw new ApiError(401, "User not found");
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        image: user.image,
      };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      console.error("Error validating JWT token:", error);
      throw new ApiError(500, "Failed to validate token");
    }
  }

  /**
   * Initiate forgot password process using $queryRaw for optimized user lookup
   * Source: optimized user lookup for password reset functionality
   */
  async initiateForgotPassword(email: string) {
    try {
      // Find user by email using $queryRaw
      const users = await prisma.$queryRaw<any[]>`
        SELECT id, email, name
        FROM "User"
        WHERE email = ${email} AND "isDeleted" = false
        LIMIT 1
      `;

      if (users.length === 0) {
        // Don't reveal if user exists or not for security
        return {
          message:
            "If an account with that email exists, a password reset link has been sent.",
        };
      }

      const user = users[0];

      // Generate and store password reset token
      const resetToken = await tokenService.createAndStoreToken(
        user.id,
        "password-reset"
      );

      // Send password reset email
      await emailService.sendPasswordResetEmail({
        email: user.email,
        name: user.name || "User",
        token: resetToken,
        type: "password-reset",
      });

      return {
        message:
          "If an account with that email exists, a password reset link has been sent.",
      };
    } catch (error) {
      console.error("Error initiating forgot password:", error);
      throw new ApiError(500, "Failed to process password reset request");
    }
  }

  /**
   * Reset password using token with $queryRaw for optimized password update
   * Source: optimized password update operation
   */
  async resetPassword(token: string, newPassword: string) {
    try {
      // Validate the token
      const tokenValidation = await tokenService.validateToken(
        token,
        "password-reset"
      );

      if (!tokenValidation.valid || !tokenValidation.userId) {
        throw new ApiError(400, "Invalid or expired reset token");
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      // Update user's password using $queryRaw
      await prisma.$queryRaw`
        UPDATE "User" 
        SET password = ${hashedPassword}, "updatedAt" = NOW()
        WHERE id = ${tokenValidation.userId} AND "isDeleted" = false
      `;

      // Mark token as used
      await tokenService.markTokenAsUsed(token, "password-reset");

      return { message: "Password has been reset successfully" };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      console.error("Error resetting password:", error);
      throw new ApiError(500, "Failed to reset password");
    }
  }

  /**
   * Verify email using token with $queryRaw for optimized email verification update
   * Source: optimized email verification status update
   */
  async verifyEmail(token: string) {
    try {
      // Validate the token
      const tokenValidation = await tokenService.validateToken(
        token,
        "email-verification"
      );

      if (!tokenValidation.valid || !tokenValidation.userId) {
        throw new ApiError(400, "Invalid or expired verification token");
      }

      // Update user's email verification status using $queryRaw
      await prisma.$queryRaw`
        UPDATE "User" 
        SET "emailVerified" = NOW(), "emailVerificationToken" = NULL, "updatedAt" = NOW()
        WHERE id = ${tokenValidation.userId} AND "isDeleted" = false
      `;

      // Mark token as used
      await tokenService.markTokenAsUsed(token, "email-verification");

      return { message: "Email verified successfully" };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      console.error("Error verifying email:", error);
      throw new ApiError(500, "Failed to verify email");
    }
  }

  /**
   * Send email verification email using $queryRaw for optimized user lookup
   * Source: optimized user data retrieval for email verification
   */
  async sendEmailVerification(userId: string) {
    try {
      // Get user details using $queryRaw
      const users = await prisma.$queryRaw<any[]>`
        SELECT id, email, name
        FROM "User"
        WHERE id = ${userId} AND "isDeleted" = false
        LIMIT 1
      `;

      if (users.length === 0) {
        throw new ApiError(404, "User not found");
      }

      const user = users[0];

      // Generate and store email verification token
      const verificationToken = await tokenService.createAndStoreToken(
        user.id,
        "email-verification"
      );

      // Send email verification email
      await emailService.sendEmailVerificationEmail({
        email: user.email,
        name: user.name || "User",
        token: verificationToken,
        type: "email-verification",
      });

      return { message: "Verification email sent successfully" };
    } catch (error) {
      console.error("Error sending email verification:", error);
      throw new ApiError(500, "Failed to send verification email");
    }
  }
}

export const authService = new AuthService();
