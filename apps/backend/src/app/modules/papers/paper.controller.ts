import { Request, Response } from "express";
import ApiError from "../../errors/ApiError";
import { AuthenticatedRequest } from "../../interfaces/common";
import { queuePDFExtraction } from "../../services/pdfProcessingQueue";
import catchAsync from "../../shared/catchAsync";
import prisma from "../../shared/prisma";
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
    const startTime = Date.now();
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

    const validationStart = Date.now();
    const parsed = uploadPaperSchema.safeParse(authReq.body);
    if (!parsed.success) {
      const errorDetails = parsed.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join(", ");
      throw createPaperError.validationFailed(errorDetails);
    }
    console.log(`[PaperUpload] Validation: ${Date.now() - validationStart}ms`);

    // Resolve uploader & workspace fallback for dev/testing
    const resolveStart = Date.now();
    let userId = authReq.user?.id as string | undefined;
    let workspaceId = parsed.data.workspaceId as string | undefined;
    if (!userId || !workspaceId) {
      const { user, workspace } = await ensureDevUserAndWorkspace();
      if (!userId) userId = user.id;
      if (!workspaceId) workspaceId = workspace.id;
    }
    console.log(
      `[PaperUpload] User/workspace resolve: ${Date.now() - resolveStart}ms`
    );

    const objectKey = `papers/${workspaceId}/${Date.now()}-${authReq.file.originalname}`;
    const s3Start = Date.now();
    console.log("[PaperUpload] Starting S3 upload", {
      objectKey,
      fileSize: `${(authReq.file.size / 1024 / 1024).toFixed(2)}MB`,
      contentType: authReq.file.mimetype,
    });

    await storage.putObject({
      key: objectKey,
      body: authReq.file.buffer,
      contentType: authReq.file.mimetype,
    });
    const s3Time = Date.now() - s3Start;
    console.log(`[PaperUpload] S3 upload completed: ${s3Time}ms`);

    const dbStart = Date.now();
    console.log("[PaperUpload] Starting database operations");
    const paper = await paperService.createUploadedPaper({
      input: parsed.data,
      file: authReq.file,
      uploaderId: userId!,
      workspaceId: workspaceId!,
      objectKey,
    });
    const dbTime = Date.now() - dbStart;
    console.log(`[PaperUpload] Database operations completed: ${dbTime}ms`);

    const totalTime = Date.now() - startTime;
    console.log(
      `[PaperUpload] TOTAL TIME: ${totalTime}ms (S3: ${s3Time}ms, DB: ${dbTime}ms, Other: ${totalTime - s3Time - dbTime}ms)`
    );

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

  // Trigger PDF processing for a specific paper
  processPDF: catchAsync(async (req: Request, res: Response) => {
    const parsed = getPaperParamsSchema.safeParse(req.params);
    if (!parsed.success) {
      throw new ApiError(400, "Invalid paper ID");
    }

    const paper = await paperService.getById(parsed.data.id);
    if (!paper) {
      throw new ApiError(404, "Paper not found");
    }

    if (!paper.file) {
      throw new ApiError(400, "Paper file not found");
    }

    console.log(`[PaperController] Starting PDF processing for paper: ${parsed.data.id}`);

    try {
      // Try to queue PDF processing first
      await queuePDFExtraction(parsed.data.id);
      
      console.log(`[PaperController] Successfully queued PDF processing for paper: ${parsed.data.id}`);
      sendSuccessResponse(
        res,
        { message: "PDF processing queued" },
        "PDF processing started"
      );
    } catch (queueError) {
      console.warn(`[PaperController] Queue failed for paper ${parsed.data.id}, attempting direct processing:`, queueError);
      
      // Fallback: Process directly if queue fails
      try {
        const { pdfExtractionService } = await import('../../services/pdfExtractionService');
        console.log(`[PaperController] Starting direct PDF processing for paper: ${parsed.data.id}`);
        
        const result = await pdfExtractionService.extractTextFromPDF(parsed.data.id);
        
        if (result.success) {
          console.log(`[PaperController] Direct PDF processing completed successfully for paper: ${parsed.data.id}`);
          sendSuccessResponse(
            res,
            { message: "PDF processing completed directly" },
            "PDF processing completed"
          );
        } else {
          console.error(`[PaperController] Direct PDF processing failed for paper ${parsed.data.id}:`, result.error);
          throw new ApiError(500, `PDF processing failed: ${result.error}`);
        }
      } catch (directError) {
        console.error(`[PaperController] Direct processing also failed for paper ${parsed.data.id}:`, directError);
        throw new ApiError(500, `PDF processing failed: ${directError instanceof Error ? directError.message : String(directError)}`);
      }
    }
  }),

  // Get processing status and chunks for a paper
  getProcessingStatus: catchAsync(async (req: Request, res: Response) => {
    const parsed = getPaperParamsSchema.safeParse(req.params);
    if (!parsed.success) {
      throw new ApiError(400, "Invalid paper ID");
    }

    const paper = await paperService.getById(parsed.data.id);
    if (!paper) {
      throw new ApiError(404, "Paper not found");
    }

    // Get chunks if available
    const chunks = await prisma.paperChunk.findMany({
      where: { paperId: parsed.data.id, isDeleted: false },
      orderBy: { idx: "asc" },
      select: {
        id: true,
        idx: true,
        page: true,
        content: true,
        tokenCount: true,
        createdAt: true,
      },
    });

    sendSuccessResponse(
      res,
      {
        processingStatus: paper.processingStatus,
        processingError: (paper as any).processingError,
        processedAt: (paper as any).processedAt,
        chunksCount: chunks.length,
        chunks: chunks.slice(0, 5), // Return first 5 chunks as preview
      },
      "Processing status retrieved"
    );
  }),

  // Get all chunks for a paper
  getAllChunks: catchAsync(async (req: Request, res: Response) => {
    const parsed = getPaperParamsSchema.safeParse(req.params);
    if (!parsed.success) {
      throw new ApiError(400, "Invalid paper ID");
    }

    const paper = await paperService.getById(parsed.data.id);
    if (!paper) {
      throw new ApiError(404, "Paper not found");
    }

    // Get all chunks
    const chunks = await prisma.paperChunk.findMany({
      where: { paperId: parsed.data.id, isDeleted: false },
      orderBy: { idx: "asc" },
      select: {
        id: true,
        idx: true,
        page: true,
        content: true,
        tokenCount: true,
        createdAt: true,
      },
    });

    sendSuccessResponse(
      res,
      {
        chunksCount: chunks.length,
        chunks: chunks,
      },
      "All chunks retrieved"
    );
  }),

  // Force direct PDF processing (bypasses Redis queue)
  processPDFDirect: catchAsync(async (req: Request, res: Response) => {
    const parsed = getPaperParamsSchema.safeParse(req.params);
    if (!parsed.success) {
      throw new ApiError(400, "Invalid paper ID");
    }

    const paper = await paperService.getById(parsed.data.id);
    if (!paper) {
      throw new ApiError(404, "Paper not found");
    }

    if (!paper.file) {
      throw new ApiError(400, "Paper file not found");
    }

    console.log(`[PaperController] Starting direct PDF processing for paper: ${parsed.data.id}`);

    try {
      const { pdfExtractionService } = await import('../../services/pdfExtractionService');
      const result = await pdfExtractionService.extractTextFromPDF(parsed.data.id);
      
      if (result.success) {
        console.log(`[PaperController] Direct PDF processing completed successfully for paper: ${parsed.data.id}`);
        sendSuccessResponse(
          res,
          { 
            message: "PDF processing completed directly",
            result: {
              pageCount: result.pageCount,
              chunksCount: result.chunks?.length || 0,
              textLength: result.text?.length || 0
            }
          },
          "PDF processing completed"
        );
      } else {
        console.error(`[PaperController] Direct PDF processing failed for paper ${parsed.data.id}:`, result.error);
        throw new ApiError(500, `PDF processing failed: ${result.error}`);
      }
    } catch (error) {
      console.error(`[PaperController] Direct processing failed for paper ${parsed.data.id}:`, error);
      throw new ApiError(500, `PDF processing failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }),
};
