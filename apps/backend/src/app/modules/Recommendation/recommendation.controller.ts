// phase-4/collection-suggestions

import { Request, Response } from "express";
import ApiError from "../../errors/ApiError";
import { AuthenticatedRequest } from "../../interfaces/common";
import catchAsync from "../../shared/catchAsync";
import { sendSuccessResponse } from "../../shared/sendResponse";
import { RecommendationService } from "./recommendation.service";

export const recommendationController = {
  getSuggestedCollections: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) {
      throw new ApiError(401, "Authentication required");
    }
    const limit = Math.min(parseInt(req.query.limit as string) || 5, 10);
    const suggestions = await RecommendationService.getSuggestedCollections(
      authReq.user.id,
      limit
    );
    sendSuccessResponse(res, suggestions, "Suggested collections retrieved");
  }),

  getCollectionSuggestions: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) {
      throw new ApiError(401, "Authentication required");
    }
    const { id } = req.params;
    const limit = Math.min(parseInt(req.query.limit as string) || 5, 10);
    const suggestions = await RecommendationService.getCollectionSuggestions(
      id,
      authReq.user.id,
      limit
    );
    sendSuccessResponse(res, suggestions, "Collection suggestions retrieved");
  }),

  getRecommendedPapers: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) {
      throw new ApiError(401, "Authentication required");
    }
    const topics = req.query.topics
      ? (req.query.topics as string).split(",").map((t) => t.trim()).filter(Boolean)
      : undefined;
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 20);
    const recommendations = await RecommendationService.getRecommendedPapers(
      authReq.user.id,
      topics,
      limit
    );
    sendSuccessResponse(res, recommendations, "Recommended papers retrieved");
  }),
};
