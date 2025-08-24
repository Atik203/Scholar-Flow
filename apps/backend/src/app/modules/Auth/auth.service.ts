import {
  createSession,
  createUser,
  deleteSession,
  getSessionByToken,
  getUserByEmail,
  getUserById,
} from "@prisma/client/sql";
import { v4 as uuidv4 } from "uuid";
import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";
import { AUTH_ERROR_MESSAGES, USER_ROLES } from "./auth.constant";
import {
  IAccountData,
  IOAuthProfile,
  ISessionData,
  IUserData,
} from "./auth.interface";

class AuthService {
  /**
   * Create or update user using raw SQL
   */
  async createOrUpdateUser(userData: IUserData) {
    try {
      const userId = userData.id || uuidv4();
      const role = userData.role || USER_ROLES.RESEARCHER;

      const [user] = await prisma.$queryRawTyped(
        createUser(
          userId,
          userData.email,
          userData.name ?? "",
          userData.image ?? "",
          role
        )
      );

      return user;
    } catch (error) {
      console.error("Error creating/updating user:", error);
      throw new ApiError(500, AUTH_ERROR_MESSAGES.OAUTH_ERROR);
    }
  }

  /**
   * Get user by email using raw SQL
   */
  async getUserByEmail(email: string) {
    try {
      const users = await prisma.$queryRawTyped(getUserByEmail(email));
      return users[0] || null;
    } catch (error) {
      console.error("Error getting user by email:", error);
      throw new ApiError(500, "Failed to get user by email");
    }
  }

  /**
   * Get user by ID using raw SQL
   */
  async getUserById(id: string) {
    try {
      const users = await prisma.$queryRawTyped(getUserById(id));
      return users[0] || null;
    } catch (error) {
      console.error("Error getting user by ID:", error);
      throw new ApiError(500, "Failed to get user by ID");
    }
  }

  /**
   * Create account linking for OAuth provider using standard Prisma client
   */
  async createAccount(userId: string, accountData: IAccountData) {
    try {
      const account = await prisma.account.create({
        data: {
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
   * Create session using raw SQL
   */
  async createSession(userId: string, sessionData: ISessionData) {
    try {
      const [session] = await prisma.$queryRawTyped(
        createSession(
          sessionData.sessionToken,
          userId,
          sessionData.expires.toISOString()
        )
      );

      return session;
    } catch (error) {
      console.error("Error creating session:", error);
      throw new ApiError(500, AUTH_ERROR_MESSAGES.SESSION_EXPIRED);
    }
  }

  /**
   * Get session by token using raw SQL
   */
  async getSessionByToken(sessionToken: string) {
    try {
      const sessions = await prisma.$queryRawTyped(
        getSessionByToken(sessionToken)
      );
      return sessions[0] || null;
    } catch (error) {
      console.error("Error getting session by token:", error);
      throw new ApiError(500, "Failed to get session");
    }
  }

  /**
   * Delete session using raw SQL
   */
  async deleteSession(sessionToken: string) {
    try {
      await prisma.$queryRawTyped(deleteSession(sessionToken));
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
