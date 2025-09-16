import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import ApiError from "../errors/ApiError";
import { IAuthUser } from "../interfaces/common";
import { AUTH_ERROR_MESSAGES, USER_ROLES } from "../modules/Auth/auth.constant";
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
  try {
    const authHeader = req.headers.authorization;

    // Debug logging
    console.log("Auth Middleware - Request headers:", req.headers);
    console.log("Auth Middleware - Authorization header:", authHeader);

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

    // Debug logging
    console.log("Auth Middleware - Decoded token:", decoded);
    console.log("Auth Middleware - Token sub:", decoded.sub);
    console.log("Auth Middleware - Token email:", decoded.email);

    // Get user from database using $queryRaw for optimized lookup
    // Source: optimized authentication middleware user lookup
    const userId = decoded.sub || decoded.id;
    const userEmail = decoded.email;

    if (!userId && !userEmail) {
      throw new ApiError(401, "Invalid token: missing user identifier");
    }

    let users: any[];
    if (userId) {
      users = await prisma.$queryRaw<any[]>`
        SELECT id, email, role, "isDeleted"
        FROM "User"
        WHERE id = ${userId} AND "isDeleted" = false
        LIMIT 1
      `;
    } else {
      users = await prisma.$queryRaw<any[]>`
        SELECT id, email, role, "isDeleted"
        FROM "User"
        WHERE email = ${userEmail} AND "isDeleted" = false
        LIMIT 1
      `;
    }

    const user = users[0];

    if (!user || user.isDeleted) {
      throw new ApiError(401, AUTH_ERROR_MESSAGES.USER_NOT_FOUND);
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
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
 * Authorization middleware to check user roles
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
 * Authorization middleware for admin only routes
 */
export const requireAdmin = requireRole([USER_ROLES.ADMIN]);

/**
 * Authorization middleware for team leads and admins
 */
export const requireTeamLead = requireRole([
  USER_ROLES.TEAM_LEAD,
  USER_ROLES.ADMIN,
]);

/**
 * Authorization middleware for pro researchers and above
 */
export const requireProResearcher = requireRole([
  USER_ROLES.PRO_RESEARCHER,
  USER_ROLES.TEAM_LEAD,
  USER_ROLES.ADMIN,
]);

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
