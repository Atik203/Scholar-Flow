import { Request, Response } from "express";
import ApiError from "../../errors/ApiError";
import { AuthenticatedRequest } from "../../interfaces/common";
import catchAsync from "../../shared/catchAsync";
import { sendPaginatedResponse, sendSuccessResponse } from "../../shared/sendResponse";
import SearchService from "./search.service";
import { globalSearchQuerySchema, searchHistoryQuerySchema, saveSearchHistorySchema } from "./search.validation";

export const SearchController = {
  globalSearch: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");

    const q = globalSearchQuerySchema.parse(req.query);
    const page = parseInt(q.page || "1", 10);
    const limit = Math.min(50, parseInt(q.limit || "10", 10));
    const skip = (page - 1) * limit;

    const result = await SearchService.globalSearch(
      authReq.user.id,
      q.q,
      q.type as any,
      limit,
      skip,
      q.workspaceId
    );
    
    // Optionally log this user search to history 
    // We do it asynchronously without blocking
    if (page === 1) {
      SearchService.saveSearchQuery(authReq.user.id, q.q, { type: q.type, workspaceId: q.workspaceId }, result.meta).catch(console.error);
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Search results retrieved successfully",
      meta: { ...result.meta, page },
      data: result.results
    });
  }),

  // Manual save for history
  saveSearchQuery: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");

    const body = saveSearchHistorySchema.parse(req.body);
    const result = await SearchService.saveSearchQuery(
      authReq.user.id,
      body.query,
      body.filters,
      body.results
    );

    sendSuccessResponse(res, result, "Search query saved");
  }),

  getSearchHistory: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");

    const q = searchHistoryQuerySchema.parse(req.query);
    const page = parseInt(q.page || "1", 10);
    const limit = Math.min(50, parseInt(q.limit || "10", 10));
    const skip = (page - 1) * limit;

    const result = await SearchService.getSearchHistory(
      authReq.user.id,
      limit,
      skip
    );

    sendPaginatedResponse(
      res,
      result.result,
      { ...result.meta, page, limit, totalPage: Math.ceil(result.meta.total / limit) },
      "Search history retrieved successfully"
    );
  }),

  getTrending: catchAsync(async (req: Request, res: Response) => {
    // Open route, auth not strict
    const result = await SearchService.getTrendingPapers(10);
    sendSuccessResponse(res, result, "Trending retrieved successfully");
  }),

  getRecommendations: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) throw new ApiError(401, "Authentication required");

    const result = await SearchService.getRecommendations(authReq.user.id, 10);
    sendSuccessResponse(res, result, "Recommendations retrieved successfully");
  }),
};

export default SearchController;
