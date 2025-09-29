import { createHash } from "crypto";
import { Request, Response } from "express";
import ApiError from "../../errors/ApiError";
import { AuthenticatedRequest } from "../../interfaces/common";
import { queueDocumentExtraction } from "../../services/pdfProcessingQueue";
import catchAsync from "../../shared/catchAsync";
import prisma from "../../shared/prisma";
import {
  sendPaginatedResponse,
  sendSuccessResponse,
} from "../../shared/sendResponse";
import { aiSummaryCache } from "../AI/ai.cache";
import { aiService } from "../AI/ai.service";
import { StorageService } from "./StorageService";
import { createPaperError } from "./paper.errors";
import {
  editorPaperService,
  ensureDevUserAndWorkspace,
  exportService,
  paperService,
} from "./paper.service";
import type { GeneratePaperSummaryInput } from "./paper.validation";
import {
  createEditorPaperSchema,
  deletePaperParamsSchema,
  getPaperParamsSchema,
  listPapersQuerySchema,
  publishDraftSchema,
  updateEditorContentSchema,
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
    const allowedMimeTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
      "application/msword", // DOC (legacy support)
    ];

    if (!allowedMimeTypes.includes(authReq.file.mimetype)) {
      throw createPaperError.invalidFileType(["PDF", "DOCX", "DOC"]);
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
    const url = await storage.getSignedUrl(
      paper.file.objectKey,
      EXPIRES_SECONDS
    );

    sendSuccessResponse(
      res,
      { url, expiresIn: EXPIRES_SECONDS },
      "Signed file URL generated"
    );
  }),

  // Return a signed URL for the paper's preview file (PDF converted from DOCX) or original file
  getPreviewUrl: catchAsync(async (req: Request, res: Response) => {
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

    // Prefer preview file if available (for DOCX → PDF conversion)
    let objectKey = paper.file.objectKey;
    let mimeType =
      paper.file.contentType || paper.originalMimeType || "application/pdf";

    if (paper.previewFileKey && paper.previewMimeType) {
      objectKey = paper.previewFileKey;
      mimeType = paper.previewMimeType;
      console.log(
        `[PaperController] Using preview file: ${objectKey}, mimeType: ${mimeType}`
      );
    } else {
      console.log(
        `[PaperController] Using original file: ${objectKey}, mimeType: ${mimeType}`
      );
      console.log(
        `[PaperController] Debug - file.contentType: ${paper.file.contentType}, originalMimeType: ${paper.originalMimeType}`
      );
    }

    // Use shorter expiry for security; front-end can re-request as needed
    const EXPIRES_SECONDS = 300; // 5 minutes for preview (longer than file download)
    const url = await storage.getSignedUrl(objectKey, EXPIRES_SECONDS);

    // Add Cache-Control header to prevent caching of signed URLs
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");

    const responseData = {
      url,
      mime: mimeType,
      expiresIn: EXPIRES_SECONDS,
      isPreview: !!paper.previewFileKey,
      originalMimeType: paper.originalMimeType,
    };

    console.log(`[PaperController] Preview URL response:`, responseData);

    sendSuccessResponse(res, responseData, "Signed preview URL generated");
  }),

  generateSummary: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;

    if (!authReq.user?.id) {
      throw createPaperError.authenticationRequired();
    }

    const params = getPaperParamsSchema.safeParse(req.params);
    if (!params.success) {
      throw createPaperError.validationFailed("Invalid paper ID format");
    }

    const paperId = params.data.id;
    const options = req.body as GeneratePaperSummaryInput;

    const paperRecord = await paperService.getPaperForSummary(paperId);
    if (!paperRecord) {
      throw createPaperError.paperNotFound(paperId);
    }

    const hasAccess = await paperService.userHasSummaryAccess(
      paperRecord,
      authReq.user.id
    );

    if (!hasAccess) {
      throw createPaperError.insufficientPermissions();
    }

    const source = await paperService.getSummarySourceText(
      paperId,
      paperRecord
    );
    const focusAreas = options.focusAreas
      ?.map((area: string) => area.trim())
      .filter((area) => area.length > 0);

    const summaryInput = {
      paperId,
      text: source.text,
      instructions: options.instructions,
      focusAreas,
      tone: options.tone,
      audience: options.audience,
      language: options.language,
      wordLimit: options.wordLimit,
      workspaceId: paperRecord.workspaceId,
      uploaderId: paperRecord.uploaderId,
    };

    const textHash = createHash("sha1")
      .update(summaryInput.text || "")
      .digest("hex");
    const cacheParams = {
      tone: summaryInput.tone,
      audience: summaryInput.audience,
      language: summaryInput.language,
      wordLimit: summaryInput.wordLimit,
      focus: summaryInput.focusAreas,
      textHash,
    };
    const promptKey = summaryInput.instructions || "default";
    const cacheKey = aiSummaryCache.buildKey(paperId, promptKey, cacheParams);
    const promptHash = cacheKey.split(":").pop() ?? cacheKey;

    if (!options.refresh) {
      const stored = await paperService.findStoredSummary(paperId, promptHash);
      if (stored) {
        return sendSuccessResponse(
          res,
          {
            summary: stored.summary,
            highlights: stored.highlights || [],
            followUpQuestions: stored.followUpQuestions || [],
            provider: stored.provider || "heuristic",
            model: stored.model,
            tokensUsed: stored.tokensUsed ?? null,
            cached: true,
            promptHash,
            source: source.source,
            chunkCount: source.chunkCount,
            generatedAt: stored.updatedAt.toISOString(),
            refreshed: false,
          },
          "Summary retrieved from history"
        );
      }
    } else {
      await aiSummaryCache.invalidate(paperId);
    }

    const result = await aiService.generateSummary(summaryInput);

    const providerPayload =
      result.rawResponse &&
      typeof result.rawResponse === "object" &&
      result.rawResponse !== null &&
      "data" in (result.rawResponse as Record<string, unknown>)
        ? (result.rawResponse as { data?: Record<string, unknown> }).data
        : result.rawResponse;

    let modelName: string = result.provider;
    if (
      providerPayload &&
      typeof providerPayload === "object" &&
      providerPayload !== null
    ) {
      const rawModel = (providerPayload as Record<string, unknown>).model;
      if (typeof rawModel === "string" && rawModel.trim()) {
        modelName = rawModel;
      }
    }

    await paperService.upsertSummaryRecord({
      paperId,
      model: modelName,
      promptHash,
      payload: {
        summary: result.summary,
        highlights: result.highlights,
        followUpQuestions: result.followUpQuestions,
        tokensUsed: result.tokensUsed ?? null,
        provider: result.provider,
      },
    });

    sendSuccessResponse(
      res,
      {
        summary: result.summary,
        highlights: result.highlights || [],
        followUpQuestions: result.followUpQuestions || [],
        provider: result.provider,
        model: modelName,
        tokensUsed: result.tokensUsed ?? null,
        cached: Boolean(result.cached),
        promptHash,
        source: source.source,
        chunkCount: source.chunkCount,
        generatedAt: new Date().toISOString(),
        refreshed: Boolean(options.refresh),
      },
      result.cached
        ? "Summary retrieved from cache"
        : "Summary generated successfully"
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

    console.log(
      `[PaperController] Starting document processing for paper: ${parsed.data.id}`
    );

    // Reset processing status if it was failed or stuck
    if (
      paper.processingStatus === "FAILED" ||
      paper.processingStatus === "PROCESSING"
    ) {
      console.log(
        `[PaperController] Resetting processing status from ${paper.processingStatus} to UPLOADED for paper: ${parsed.data.id}`
      );
      await prisma.paper.update({
        where: { id: parsed.data.id },
        data: {
          processingStatus: "UPLOADED",
          processingError: null,
        },
      });
    }

    try {
      // Try to queue document processing first (supports PDF, DOCX, etc.)
      await queueDocumentExtraction(parsed.data.id);

      console.log(
        `[PaperController] Successfully queued document processing for paper: ${parsed.data.id}`
      );
      sendSuccessResponse(
        res,
        { message: "Document processing queued" },
        "Document processing started"
      );
    } catch (queueError) {
      console.warn(
        `[PaperController] Queue failed for paper ${parsed.data.id}, attempting direct processing:`,
        queueError
      );

      // Fallback: Process directly if queue fails
      try {
        const { documentExtractionService } = await import(
          "../../services/documentExtractionService"
        );
        console.log(
          `[PaperController] Starting direct document processing for paper: ${parsed.data.id}`
        );

        const result = await documentExtractionService.extractFromDocument(
          parsed.data.id,
          {
            preserveFormatting: true,
            includeHtml: true,
          }
        );

        if (result.success) {
          console.log(
            `[PaperController] Direct document processing completed successfully for paper: ${parsed.data.id}`
          );
          sendSuccessResponse(
            res,
            { message: "Document processing completed directly" },
            "Document processing completed"
          );
        } else {
          console.error(
            `[PaperController] Direct document processing failed for paper ${parsed.data.id}:`,
            result.error
          );
          throw new ApiError(
            500,
            `Document processing failed: ${result.error}`
          );
        }
      } catch (directError) {
        console.error(
          `[PaperController] Direct processing also failed for paper ${parsed.data.id}:`,
          directError
        );
        throw new ApiError(
          500,
          `Document processing failed: ${directError instanceof Error ? directError.message : String(directError)}`
        );
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

    console.log(
      `[PaperController] Starting direct document processing for paper: ${parsed.data.id}`
    );

    try {
      const { documentExtractionService } = await import(
        "../../services/documentExtractionService"
      );
      const result = await documentExtractionService.extractFromDocument(
        parsed.data.id,
        {
          preserveFormatting: true,
          includeHtml: true,
        }
      );

      if (result.success) {
        console.log(
          `[PaperController] Direct document processing completed successfully for paper: ${parsed.data.id}`
        );
        sendSuccessResponse(
          res,
          {
            message: "Document processing completed directly",
            result: {
              pageCount: result.pageCount,
              chunksCount: result.chunks?.length || 0,
              textLength: result.text?.length || 0,
              hasHtmlContent: !!result.htmlContent,
            },
          },
          "Document processing completed"
        );
      } else {
        console.error(
          `[PaperController] Direct document processing failed for paper ${parsed.data.id}:`,
          result.error
        );
        throw new ApiError(500, `Document processing failed: ${result.error}`);
      }
    } catch (error) {
      console.error(
        `[PaperController] Direct processing failed for paper ${parsed.data.id}:`,
        error
      );
      throw new ApiError(
        500,
        `Document processing failed: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }),

  shareViaEmail: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const { paperId, recipientEmail, permission } = req.body;

    // Validate input
    if (!paperId || !recipientEmail || !permission) {
      throw new ApiError(
        400,
        "Paper ID, recipient email, and permission are required"
      );
    }

    if (!["view", "edit"].includes(permission)) {
      throw new ApiError(400, "Permission must be 'view' or 'edit'");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      throw new ApiError(400, "Invalid email format");
    }

    try {
      // Get paper details
      const paper = (await prisma.$queryRaw`
        SELECT p.id, p.title, p."contentHtml", u.name as author_name
        FROM "Paper" p
        JOIN "User" u ON p."uploaderId" = u.id
        WHERE p.id = ${paperId}
      `) as any[];

      if (!paper.length) {
        throw new ApiError(404, "Paper not found");
      }

      const paperData = paper[0];

      // Check if user has permission to share this paper
      const hasPermission = (await prisma.$queryRaw`
        SELECT 1 FROM "Paper" p
        WHERE p.id = ${paperId}
        AND (
          p."uploaderId" = ${authReq.user.id}
          OR EXISTS (
            SELECT 1 FROM "CollectionPaper" cp
            JOIN "CollectionMember" cm ON cp."collectionId" = cm."collectionId"
            WHERE cp."paperId" = ${paperId}
            AND cm."userId" = ${authReq.user.id}
            AND cm.permission = 'EDIT'
          )
        )
      `) as any[];

      if (!hasPermission.length) {
        throw new ApiError(
          403,
          "You don't have permission to share this paper"
        );
      }

      // Generate paper link (assuming frontend URL structure)
      const paperLink = `${process.env.FRONTEND_URL || "http://localhost:3000"}/papers/${paperId}`;

      // Import and use email service
      const { emailService } = await import("../../shared/emailService");

      await emailService.sendPaperShareEmail({
        recipientEmail,
        senderName: authReq.user.name || authReq.user.email,
        paperTitle: paperData.title,
        paperLink,
        permission,
      });

      sendSuccessResponse(res, {
        message: "Paper shared successfully via email",
        data: {
          recipientEmail,
          paperTitle: paperData.title,
          permission,
        },
      });
    } catch (error) {
      console.error("[PaperController] Email share failed:", error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, "Failed to share paper via email");
    }
  }),
};

// Editor-specific controller functions
export const editorPaperController = {
  // Create a new editor paper
  createEditorPaper: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const parsed = createEditorPaperSchema.safeParse(req.body);

    if (!parsed.success) {
      throw new ApiError(400, "Invalid input");
    }

    try {
      const paper = await editorPaperService.createEditorPaper(
        parsed.data,
        authReq.user.id
      );

      return sendSuccessResponse(
        res,
        { paper },
        "Editor paper created successfully",
        201
      );
    } catch (error) {
      console.error("[EditorPaperController] Create failed:", error);
      throw new ApiError(500, "Failed to create editor paper");
    }
  }),

  // Get editor paper content
  getEditorPaper: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const parsed = getPaperParamsSchema.safeParse(req.params);

    if (!parsed.success) {
      throw new ApiError(400, "Invalid paper ID");
    }

    const paper = await editorPaperService.getEditorPaperContent(
      parsed.data.id,
      authReq.user.id
    );

    if (!paper) {
      throw new ApiError(404, "Editor paper not found or access denied");
    }

    return sendSuccessResponse(res, paper, "Editor paper retrieved");
  }),

  // Update editor paper content
  updateEditorContent: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const paramsParsed = getPaperParamsSchema.safeParse(req.params);
    const bodyParsed = updateEditorContentSchema.safeParse(req.body);

    if (!paramsParsed.success) {
      throw new ApiError(400, "Invalid paper ID");
    }
    if (!bodyParsed.success) {
      throw new ApiError(400, "Invalid content data");
    }

    const result = await editorPaperService.updateEditorContent(
      paramsParsed.data.id,
      bodyParsed.data,
      authReq.user.id
    );

    if (!result || (Array.isArray(result) && result.length === 0)) {
      throw new ApiError(404, "Editor paper not found or access denied");
    }

    return sendSuccessResponse(res, result, "Content updated successfully");
  }),

  // Auto-save editor content (lighter endpoint for frequent saves)
  autoSaveContent: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const paramsParsed = getPaperParamsSchema.safeParse(req.params);

    if (!paramsParsed.success) {
      throw new ApiError(400, "Invalid paper ID");
    }
    if (!req.body.content || typeof req.body.content !== "string") {
      throw new ApiError(400, "Content is required");
    }

    await editorPaperService.autoSaveContent(
      paramsParsed.data.id,
      req.body.content,
      authReq.user.id
    );

    return sendSuccessResponse(res, {}, "Content auto-saved");
  }),

  // Publish a draft paper
  publishDraft: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const paramsParsed = getPaperParamsSchema.safeParse(req.params);
    const bodyParsed = publishDraftSchema.safeParse(req.body);

    if (!paramsParsed.success) {
      throw new ApiError(400, "Invalid paper ID");
    }
    if (!bodyParsed.success) {
      throw new ApiError(400, "Invalid publish data");
    }

    const result = await editorPaperService.publishDraft(
      paramsParsed.data.id,
      bodyParsed.data,
      authReq.user.id
    );

    if (!result || (Array.isArray(result) && result.length === 0)) {
      throw new ApiError(404, "Draft not found or already published");
    }

    return sendSuccessResponse(res, result, "Paper published successfully");
  }),

  // Get user's editor papers
  getUserEditorPapers: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const { isDraft, page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = Math.min(parseInt(limit as string, 10) || 10, 50);
    const offset = (pageNum - 1) * limitNum;

    const draftFilter =
      isDraft === "true" ? true : isDraft === "false" ? false : undefined;

    const papers = await editorPaperService.getUserEditorPapers(
      authReq.user.id,
      draftFilter,
      limitNum,
      offset
    );

    const meta = {
      page: pageNum,
      limit: limitNum,
      total: papers.length, // This would ideally be total count, but for now using current results
      totalPage: Math.ceil(papers.length / limitNum),
    };

    return sendPaginatedResponse(res, papers, meta, "Editor papers retrieved");
  }),

  // Delete editor paper
  deleteEditorPaper: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const parsed = deletePaperParamsSchema.safeParse(req.params);

    if (!parsed.success) {
      throw new ApiError(400, "Invalid paper ID");
    }

    await editorPaperService.deleteEditorPaper(parsed.data.id, authReq.user.id);

    return sendSuccessResponse(res, {}, "Editor paper deleted");
  }),

  // Export paper as PDF
  exportPDF: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const parsed = getPaperParamsSchema.safeParse(req.params);

    if (!parsed.success) {
      throw new ApiError(400, "Invalid paper ID");
    }

    try {
      const pdfBuffer = await exportService.generatePDF(
        parsed.data.id,
        authReq.user.id
      );

      // Get paper title for filename
      const paper = await editorPaperService.getEditorPaperContent(
        parsed.data.id,
        authReq.user.id
      );

      const filename = paper
        ? `${paper.title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`
        : `paper_${parsed.data.id}.pdf`;

      // Set CORS headers explicitly for file download
      res.setHeader(
        "Access-Control-Allow-Origin",
        process.env.FRONTEND_URL || "http://localhost:3000"
      );
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
      );
      res.setHeader("Content-Length", pdfBuffer.length);

      res.send(pdfBuffer);
    } catch (error) {
      console.error("[EditorPaperController] PDF export failed:", error);
      throw new ApiError(500, "Failed to export PDF");
    }
  }),

  // Export paper as DOCX
  exportDOCX: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const parsed = getPaperParamsSchema.safeParse(req.params);

    if (!parsed.success) {
      throw new ApiError(400, "Invalid paper ID");
    }

    try {
      const docxBuffer = await exportService.generateDOCX(
        parsed.data.id,
        authReq.user.id
      );

      // Get paper title for filename
      const paper = await editorPaperService.getEditorPaperContent(
        parsed.data.id,
        authReq.user.id
      );

      const filename = paper
        ? `${paper.title.replace(/[^a-zA-Z0-9]/g, "_")}.docx`
        : `paper_${parsed.data.id}.docx`;

      // Set CORS headers explicitly for file download
      res.setHeader(
        "Access-Control-Allow-Origin",
        process.env.FRONTEND_URL || "http://localhost:3000"
      );
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
      );
      res.setHeader("Content-Length", docxBuffer.length);

      res.send(docxBuffer);
    } catch (error) {
      console.error("[EditorPaperController] DOCX export failed:", error);
      throw new ApiError(500, "Failed to export DOCX");
    }
  }),

  // Upload image for editor
  uploadImage: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;

    if (!authReq.file) {
      throw new ApiError(400, "No image file provided");
    }

    // Validate file type
    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedMimeTypes.includes(authReq.file.mimetype)) {
      throw new ApiError(
        400,
        "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed."
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (authReq.file.size > maxSize) {
      throw new ApiError(400, "File too large. Maximum size is 5MB.");
    }

    try {
      // Upload to S3
      const result = await storage.uploadFile(
        authReq.file.buffer,
        authReq.file.originalname || "image",
        authReq.file.mimetype
      );

      console.log("[EditorPaperController] Upload result:", result);

      const responseData = {
        message: "Image uploaded successfully",
        data: {
          url: result.url,
          fileName: result.filename,
        },
      };

      console.log("[EditorPaperController] Sending response:", responseData);

      sendSuccessResponse(res, responseData.data, responseData.message);
    } catch (error) {
      console.error("[EditorPaperController] Image upload failed:", error);
      throw new ApiError(500, "Failed to upload image");
    }
  }),
};
