import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import ApiError from "../errors/ApiError";
import { IAuthUser } from "../interfaces/common";
import {
  AUTH_ERROR_MESSAGES,
  ROLE_HIERARCHY,
  USER_ROLES,
} from "../modules/Auth/auth.constant";
import prisma from "../shared/prisma";

export interface AuthRequest extends Request {
  user?: IAuthUser;
}

/**
 * Authentication middleware to verify JWT token
 */
export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Conditional debug logging (only in development)
  const DEBUG_AUTH = process.env.NODE_ENV === "development";

  try {
    const authHeader = req.headers.authorization;

    if (DEBUG_AUTH) {
      console.log("Auth Middleware - Authorization header:", authHeader);
    }

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, AUTH_ERROR_MESSAGES.UNAUTHORIZED);
    }

    const token = authHeader.substring(7);
    const jwtSecret = process.env.NEXTAUTH_SECRET;

    if (!jwtSecret) {
      throw new ApiError(500, "JWT secret not configured");
    }

    // Verify JWT token
    const decoded = jwt.verify(token, jwtSecret) as any;

    // Conditional debug logging (only in development)
    if (DEBUG_AUTH) {
      console.log("Auth Middleware - Token sub:", decoded.sub);
      console.log("Auth Middleware - Token email:", decoded.email);
    }

    // Get user from database with single OR query (optimized from two-round-trip fallback)
    const userId = decoded.sub || decoded.id;
    const userEmail = decoded.email;

    if (!userId && !userEmail) {
      throw new ApiError(401, "Invalid token: missing user identifier");
    }

    const orConditions: Record<string, unknown>[] = [];

    if (userId) {
      orConditions.push({ id: userId, isDeleted: false });
    }
    if (userEmail) {
      orConditions.push({ email: userEmail, isDeleted: false });
    }

    const user = await prisma.user.findFirst({
      where: { OR: orConditions },
      select: { id: true, email: true, role: true, isDeleted: true },
    });

    if (DEBUG_AUTH) {
      console.log("Auth Middleware - User lookup result:", user ? "found" : "not found");
    }

    if (!user) {
      throw new ApiError(401, AUTH_ERROR_MESSAGES.USER_NOT_FOUND);
    }

    req.user = {
      userId: user.id as string,
      id: user.id as string,
      email: user.email as string,
      role: user.role as string,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new ApiError(401, AUTH_ERROR_MESSAGES.INVALID_TOKEN));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new ApiError(401, AUTH_ERROR_MESSAGES.TOKEN_EXPIRED));
    } else if (error instanceof ApiError) {
      next(error);
    } else {
      console.error("Auth middleware error:", error);
      next(new ApiError(401, AUTH_ERROR_MESSAGES.INVALID_TOKEN));
    }
  }
};

/**
 * Authorization middleware to check user roles (exact match)
 * Use requireMinRole for hierarchy-based checking instead.
 */
export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new ApiError(401, AUTH_ERROR_MESSAGES.UNAUTHORIZED));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, AUTH_ERROR_MESSAGES.FORBIDDEN));
    }

    next();
  };
};

/**
 * Hierarchy-based authorization middleware.
 * Uses ROLE_HIERARCHY to allow higher roles automatic access.
 * e.g., requireMinRole("TEAM_LEAD") allows TEAM_LEAD and ADMIN.
 */
export const requireMinRole = (minRole: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new ApiError(401, AUTH_ERROR_MESSAGES.UNAUTHORIZED));
    }

    const userLevel =
      ROLE_HIERARCHY[req.user.role as keyof typeof ROLE_HIERARCHY] || 0;
    const requiredLevel =
      ROLE_HIERARCHY[minRole as keyof typeof ROLE_HIERARCHY] || 0;

    if (userLevel < requiredLevel) {
      return next(new ApiError(403, AUTH_ERROR_MESSAGES.FORBIDDEN));
    }

    next();
  };
};

/**
 * Authorization middleware for admin only routes
 */
export const requireAdmin = requireMinRole(USER_ROLES.ADMIN);

/**
 * Authorization middleware for team leads and above
 */
export const requireTeamLead = requireMinRole(USER_ROLES.TEAM_LEAD);

/**
 * Authorization middleware for pro researchers and above
 */
export const requireProResearcher = requireMinRole(USER_ROLES.PRO_RESEARCHER);

/**
 * Middleware to check if user has completed onboarding.
 * Returns 403 with onboarding_required error code if not completed.
 * This allows the frontend to redirect to /onboarding.
 */
export const requireOnboarding = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      return next(new ApiError(401, AUTH_ERROR_MESSAGES.UNAUTHORIZED));
    }

    const users = await prisma.$queryRaw<any[]>`
      SELECT "onboardingCompleted"
      FROM "User"
      WHERE id = ${req.user.id} AND "isDeleted" = false
      LIMIT 1
    `;

    const user = users[0];
    if (!user) {
      return next(new ApiError(401, AUTH_ERROR_MESSAGES.USER_NOT_FOUND));
    }

    if (!user.onboardingCompleted) {
      return next(
        new ApiError(403, "Onboarding required", "ONBOARDING_REQUIRED")
      );
    }

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    console.error("Onboarding middleware error:", error);
    next(new ApiError(500, "Failed to check onboarding status"));
  }
};

/**
 * Lightweight auth middleware for SSE endpoints.
 *
 * EventSource cannot set custom headers, so the client passes the JWT via
 * `?token=...` query param. This middleware accepts either the standard
 * `Authorization: Bearer <token>` header (used by RTK Query) OR the
 * `?token=` query param. It verifies the JWT and attaches the decoded
 * identity to `req.user` without performing a DB lookup (SSE only needs
 * the user id for the broadcaster channel).
 */
export const sseAuthMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const header = req.headers.authorization;
    let token: string | null = null;

    if (header && header.startsWith("Bearer ")) {
      token = header.substring(7);
    } else if (typeof req.query.token === "string" && req.query.token.length > 0) {
      token = req.query.token;
    }

    if (!token) {
      throw new ApiError(401, AUTH_ERROR_MESSAGES.UNAUTHORIZED);
    }

    const jwtSecret = process.env.NEXTAUTH_SECRET;
    if (!jwtSecret) {
      throw new ApiError(500, "JWT secret not configured");
    }

    const decoded = jwt.verify(token, jwtSecret) as {
      sub?: string;
      id?: string;
      email?: string;
      role?: string;
    };

    const userId = decoded.sub || decoded.id;
    if (!userId) {
      throw new ApiError(401, "Invalid token: missing user identifier");
    }

    req.user = {
      userId,
      id: userId,
      email: decoded.email as string,
      role: decoded.role as string,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new ApiError(401, AUTH_ERROR_MESSAGES.INVALID_TOKEN));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new ApiError(401, AUTH_ERROR_MESSAGES.TOKEN_EXPIRED));
    } else if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(401, AUTH_ERROR_MESSAGES.INVALID_TOKEN));
    }
  }
};

/**
 * Optional authentication middleware - doesn't throw error if no token
 */
export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next();
    }

    const token = authHeader.substring(7);
    const jwtSecret = process.env.NEXTAUTH_SECRET;

    if (!jwtSecret) {
      return next();
    }

    // Verify JWT token
    const decoded = jwt.verify(token, jwtSecret) as any;

    // Get user from database using $queryRaw for optimized lookup
    // Source: optimized optional authentication user lookup
    const users = await prisma.$queryRaw<any[]>`
      SELECT id, email, role, "isDeleted"
      FROM "User"
      WHERE id = ${decoded.sub} AND "isDeleted" = false
      LIMIT 1
    `;

    const user = users[0];

    if (user && !user.isDeleted) {
      req.user = {
        userId: user.id,
        id: user.id,
        email: user.email,
        role: user.role,
      };
    }

    next();
  } catch (error) {
    // For optional auth, we don't throw errors, just continue without user
    next();
  }
};
