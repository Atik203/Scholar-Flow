import { Request, Response } from "express";
import ApiError from "../../errors/ApiError";
import { AuthenticatedRequest } from "../../interfaces/common";
import catchAsync from "../../shared/catchAsync";
import {
  sendPaginatedResponse,
  sendSuccessResponse,
} from "../../shared/sendResponse";
import { StorageService } from "./StorageService";
import { createPaperError } from "./paper.errors";
import { ensureDevUserAndWorkspace, paperService } from "./paper.service";
import {
  deletePaperParamsSchema,
  getPaperParamsSchema,
  listPapersQuerySchema,
  updatePaperMetadataSchema,
  uploadPaperSchema,
} from "./paper.validation";

const storage = new StorageService();

function featureEnabled() {
  return process.env.FEATURE_UPLOADS === "true";
}

export const paperController = {
  upload: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!featureEnabled()) {
      throw createPaperError.uploadDisabled();
    }
    if (!authReq.file) {
      throw createPaperError.missingFile();
    }
    if (authReq.file.mimetype !== "application/pdf") {
      throw createPaperError.invalidFileType(["PDF"]);
    }

    const parsed = uploadPaperSchema.safeParse(authReq.body);
    if (!parsed.success) {
      const errorDetails = parsed.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join(", ");
      throw createPaperError.validationFailed(errorDetails);
    }

    // Resolve uploader & workspace fallback for dev/testing
    let userId = authReq.user?.id as string | undefined;
    let workspaceId = parsed.data.workspaceId as string | undefined;
    if (!userId || !workspaceId) {
      const { user, workspace } = await ensureDevUserAndWorkspace();
      if (!userId) userId = user.id;
      if (!workspaceId) workspaceId = workspace.id;
    }

    const objectKey = `papers/${workspaceId}/${Date.now()}-${authReq.file.originalname}`;
    console.log("[PaperUpload] putObject", { objectKey });
    await storage.putObject({
      key: objectKey,
      body: authReq.file.buffer,
      contentType: authReq.file.mimetype,
    });

    const paper = await paperService.createUploadedPaper({
      input: parsed.data,
      file: authReq.file,
      uploaderId: userId!,
      workspaceId: workspaceId!,
      objectKey,
    });

    sendSuccessResponse(res, { paper }, "Paper uploaded successfully", 201);
  }),

  list: catchAsync(async (req: Request, res: Response) => {
    const parsed = listPapersQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      const errorDetails = parsed.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join(", ");
      throw createPaperError.validationFailed(errorDetails);
    }

    const { workspaceId, page, limit } = parsed.data;

    // If workspaceId is explicitly provided and not empty, use workspace-scoped listing (for future workspace features)
    if (workspaceId && workspaceId.trim() !== "") {
      const results = await paperService.listByWorkspace(
        workspaceId,
        page || 1,
        limit || 10
      );
      return sendPaginatedResponse(
        res,
        results.items,
        results.meta,
        "Papers retrieved successfully"
      );
    }

    // Default: list papers by authenticated user
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) {
      throw createPaperError.authenticationRequired();
    }

    const results = await paperService.listByUser(
      authReq.user.id,
      page || 1,
      limit || 10
    );

    sendPaginatedResponse(
      res,
      results.items,
      results.meta,
      "Papers retrieved successfully"
    );
  }),

  getOne: catchAsync(async (req: Request, res: Response) => {
    const parsed = getPaperParamsSchema.safeParse(req.params);
    if (!parsed.success) {
      throw createPaperError.validationFailed("Invalid paper ID format");
    }

    const paper = await paperService.getById(parsed.data.id);
    if (!paper) {
      throw createPaperError.paperNotFound(parsed.data.id);
    }

    sendSuccessResponse(res, paper, "Paper retrieved successfully");
  }),

  delete: catchAsync(async (req: Request, res: Response) => {
    const parsed = deletePaperParamsSchema.safeParse(req.params);
    if (!parsed.success) {
      throw createPaperError.validationFailed("Invalid paper ID format");
    }

    await paperService.softDelete(parsed.data.id);
    sendSuccessResponse(res, null, "Paper deleted successfully");
  }),

  // Return a short-lived signed URL for the paper's PDF file
  getFileUrl: catchAsync(async (req: Request, res: Response) => {
    const parsed = getPaperParamsSchema.safeParse(req.params);
    if (!parsed.success) {
      throw new ApiError(400, "Invalid paper ID");
    }

    const paper = await paperService.getById(parsed.data.id);
    if (!paper) {
      throw new ApiError(404, "Paper not found");
    }
    if (!paper.file || !paper.file.objectKey) {
      throw new ApiError(404, "Paper file not found");
    }

    // Use shorter expiry for security; front-end can re-request as needed
    const EXPIRES_SECONDS = 120; // 2 minutes
    const url = storage.getSignedUrl(paper.file.objectKey, EXPIRES_SECONDS);

    sendSuccessResponse(
      res,
      { url, expiresIn: EXPIRES_SECONDS },
      "Signed file URL generated"
    );
  }),

  updateMetadata: catchAsync(async (req: Request, res: Response) => {
    const params = getPaperParamsSchema.safeParse(req.params);
    if (!params.success) {
      throw new ApiError(400, "Invalid paper ID");
    }

    const body = updatePaperMetadataSchema.safeParse(req.body);
    if (!body.success) {
      throw new ApiError(400, "Invalid metadata");
    }

    const updated = await paperService.updateMetadata(
      params.data.id,
      body.data
    );
    if (!updated) {
      throw new ApiError(404, "Paper not found");
    }

    sendSuccessResponse(res, updated, "Paper metadata updated successfully");
  }),

  // Debug endpoint to get dev workspace info
  getDevWorkspace: catchAsync(async (req: Request, res: Response) => {
    const { user, workspace } = await ensureDevUserAndWorkspace();
    sendSuccessResponse(
      res,
      { workspace, user: { id: user.id, email: user.email } },
      "Dev workspace retrieved"
    );
  }),

  // Authenticated helper endpoint: returns count of papers uploaded by current user
  myUploadsSummary: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.id) {
      throw new ApiError(401, "Authentication required");
    }
    const userId: string = authReq.user.id;
    const count = await paperService.countByUser(userId);

    sendSuccessResponse(res, { count }, "My uploads summary");
  }),
};
