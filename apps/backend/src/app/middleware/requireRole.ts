import { NextFunction, Request, Response } from "express";
import ApiError from "../errors/ApiError";
import { AuthRequest } from "./auth";
import { ROLE_HIERARCHY, USER_ROLES } from "../modules/Auth/auth.constant";

/**
 * Role-based access middleware.
 * Rejects requests when the authenticated user's role is below the required threshold.
 *
 * Usage:
 *   router.get("/team/...", authMiddleware, requireRole(USER_ROLES.TEAM_LEAD), handler)
 *   router.delete("/admin/...", authMiddleware, requireRole(USER_ROLES.ADMIN), handler)
 */
export const requireRole = (requiredRole: keyof typeof USER_ROLES) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authReq = req as AuthRequest;
    const userRole = authReq.user?.role;

    if (!userRole) {
      return next(new ApiError(401, "Authentication required"));
    }

    const userLevel = ROLE_HIERARCHY[userRole as keyof typeof ROLE_HIERARCHY] || 0;
    const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0;

    if (userLevel < requiredLevel) {
      return next(
        new ApiError(
          403,
          `Insufficient permissions. Required: ${requiredRole}, got: ${userRole}`
        )
      );
    }

    next();
  };
};

/**
 * Convenience middleware for TEAM_LEAD+ access.
 * Equivalent to `requireRole(USER_ROLES.TEAM_LEAD)`.
 */
export const requireTeamLead = requireRole("TEAM_LEAD");

/**
 * Convenience middleware for ADMIN-only access.
 * Equivalent to `requireRole(USER_ROLES.ADMIN)`.
 */
export const requireAdmin = requireRole("ADMIN");
