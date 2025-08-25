// Temporarily commenting out TypedSQL imports due to build issues
// import {
//   createSession,
//   deleteSession,
//   getSessionByToken,
// } from "@prisma/client/sql";
// import {
//   createUser,
//   getUserByEmail,
//   getUserById,
// } from "@prisma/client/sql";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";
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
   * Sign in with email and password
   */
  async signInWithPassword(email: string, password: string) {
    try {
      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
          password: true,
          role: true,
        },
      });

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
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new ApiError(401, AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS);
      }

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
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
   * Register new user with email and password
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
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new ApiError(409, "User with this email already exists");
      }

      // Validate role
      const validRole = this.validateRole(role);

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create full name from first and last name
      const name = `${firstName} ${lastName}`.trim();

      // Create new user
      const user = await prisma.user.create({
        data: {
          id: uuidv4(),
          email,
          name,
          firstName,
          lastName,
          institution,
          fieldOfStudy,
          password: hashedPassword,
          role: validRole as any,
        },
        select: {
          id: true,
          email: true,
          name: true,
          firstName: true,
          lastName: true,
          institution: true,
          fieldOfStudy: true,
          image: true,
          role: true,
          createdAt: true,
        },
      });

      return user;
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
   * Update user role (admin only)
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

      // Update user role
      const updatedUser = await prisma.user.update({
        where: { id: targetUserId },
        data: {
          role: newRole as any,
          updatedAt: new Date(),
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return updatedUser;
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

      const whereClause: any = { isDeleted: false };

      // Apply role filter
      if (filters?.role) {
        whereClause.role = this.validateRole(filters.role);
      }

      // Apply search filter
      if (filters?.search) {
        whereClause.OR = [
          { email: { contains: filters.search, mode: "insensitive" } },
          { name: { contains: filters.search, mode: "insensitive" } },
        ];
      }

      // Team leads can only see users below their level
      if (requestingUser.role === USER_ROLES.TEAM_LEAD) {
        whereClause.role = {
          in: [USER_ROLES.RESEARCHER, USER_ROLES.PRO_RESEARCHER],
        };
      }

      const users = await prisma.user.findMany({
        where: whereClause,
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: "desc" },
      });

      return users;
    } catch (error) {
      console.error("Error getting all users:", error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, "Failed to get users");
    }
  }

  /**
   * Get user by email using Prisma
   */
  async getUserByEmail(email: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });
      return user;
    } catch (error) {
      console.error("Error getting user by email:", error);
      throw new ApiError(500, "Failed to get user by email");
    }
  }

  /**
   * Get user by ID using Prisma
   */
  async getUserById(id: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
      });
      return user;
    } catch (error) {
      console.error("Error getting user by ID:", error);
      throw new ApiError(500, "Failed to get user by ID");
    }
  }

  /**
   * Create account linking for OAuth provider using standard Prisma upsert
   * NOTE: DO NOT change this to raw query - it causes database constraint errors
   * The upsert operation handles both creating new accounts and updating existing ones
   */
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
   * Create session using Prisma
   */
  async createSession(userId: string, sessionData: ISessionData) {
    try {
      const session = await prisma.session.create({
        data: {
          sessionToken: sessionData.sessionToken,
          userId: userId,
          expires: sessionData.expires,
        },
      });

      return session;
    } catch (error) {
      console.error("Error creating session:", error);
      throw new ApiError(500, AUTH_ERROR_MESSAGES.SESSION_EXPIRED);
    }
  }

  /**
   * Get session by token using Prisma
   */
  async getSessionByToken(sessionToken: string) {
    try {
      const session = await prisma.session.findUnique({
        where: { sessionToken },
        include: { user: true },
      });
      return session;
    } catch (error) {
      console.error("Error getting session by token:", error);
      throw new ApiError(500, "Failed to get session");
    }
  }

  /**
   * Delete session using Prisma
   */
  async deleteSession(sessionToken: string) {
    try {
      await prisma.session.delete({
        where: { sessionToken },
      });
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

      // Create or update user
      const user = await this.createOrUpdateUser(userData);

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
}

export const authService = new AuthService();
