import { NextFunction, Request, Response } from "express";
import ApiError from "../errors/ApiError";
import { AuthRequest } from "./auth";
import { TeamService } from "../modules/Team/team.service";

/**
 * Team section access = lead+ OR active collaboration in a shared workspace.
 *
 * Read/participate endpoints (members, stats, activity, invitations) use this
 * gate so invited RESEARCHER / PRO_RESEARCHER users can see the team they were
 * added to. Manage endpoints (role changes, settings, member removal) add
 * `requireTeamLead` on top.
 */
export const requireTeamAccess = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  const authReq = req as AuthRequest;
  if (!authReq.user?.id) {
    return next(new ApiError(401, "Authentication required"));
  }

  try {
    const access = await TeamService.getAccessInfo(authReq.user.id);
    if (!access.hasAccess) {
      return next(
        new ApiError(
          403,
          "Team access requires a team lead role or an active workspace collaboration"
        )
      );
    }
    next();
  } catch (error) {
    next(error);
  }
};
