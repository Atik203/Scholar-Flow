import express from "express";
import multer from "multer";
import { authMiddleware, optionalAuth } from "../../middleware/auth";
import {
  paperListLimiter,
  paperOperationLimiter,
  paperUploadLimiter,
} from "../../middleware/rateLimiter";
import { validateRequestBody } from "../../middleware/validateRequest";
import { editorPaperController, paperController } from "./paper.controller";
import {
  createEditorPaperSchema,
  publishDraftSchema,
  shareViaEmailSchema,
  updateEditorContentSchema,
  updatePaperMetadataSchema,
} from "./paper.validation";

// Memory storage is fine for MVP; switch to streaming for large PDFs later.
const upload = multer({ storage: multer.memoryStorage() });

export const paperRoutes: express.Router = express.Router();

// Upload PDF (protected - requires auth for production, fallback for dev)
paperRoutes.post(
  "/",
  paperUploadLimiter,
  authMiddleware as any,
  upload.single("file") as any,
  paperController.upload as any
);

// List papers by user (protected, but allow dev fallback with workspaceId)
paperRoutes.get(
  "/",
  paperListLimiter,
  authMiddleware as any,
  paperController.list as any
);

// Get single paper (protected, but allow dev fallback)
paperRoutes.get(
  "/:id",
  paperOperationLimiter,
  optionalAuth as any,
  paperController.getOne as any
);

// Get signed file URL
paperRoutes.get(
  "/:id/file-url",
  paperOperationLimiter,
  optionalAuth as any,
  paperController.getFileUrl as any
);

// Get signed preview URL (prefers preview PDF for DOCX, falls back to original)
paperRoutes.get(
  "/:id/preview-url",
  paperOperationLimiter,
  optionalAuth as any,
  paperController.getPreviewUrl as any
);

// Update metadata (protected, but allow dev fallback)
paperRoutes.patch(
  "/:id",
  paperOperationLimiter,
  optionalAuth as any,
  validateRequestBody(updatePaperMetadataSchema) as any,
  paperController.updateMetadata as any
);

// Delete paper (protected, but allow dev fallback)
paperRoutes.delete(
  "/:id",
  paperOperationLimiter,
  optionalAuth as any,
  paperController.delete as any
);

// Debug endpoint to get dev workspace
paperRoutes.get("/dev/workspace", paperController.getDevWorkspace as any);

// Authenticated helper to verify uploadedPapers relation
paperRoutes.get(
  "/me/summary",
  authMiddleware as any,
  paperController.myUploadsSummary as any
);

// Trigger PDF processing for a specific paper
paperRoutes.post(
  "/:id/process",
  paperOperationLimiter,
  authMiddleware as any,
  paperController.processPDF as any
);

// Get processing status and chunks for a paper
paperRoutes.get(
  "/:id/processing-status",
  paperOperationLimiter,
  authMiddleware as any,
  paperController.getProcessingStatus as any
);

// Get all chunks for a paper
paperRoutes.get(
  "/:id/chunks",
  paperOperationLimiter,
  authMiddleware as any,
  paperController.getAllChunks as any
);

// Force direct PDF processing (bypasses Redis queue)
paperRoutes.post(
  "/:id/process-direct",
  paperOperationLimiter,
  authMiddleware as any,
  paperController.processPDFDirect as any
);

// Share paper via email
paperRoutes.post(
  "/share-email",
  paperOperationLimiter,
  authMiddleware as any,
  validateRequestBody(shareViaEmailSchema),
  paperController.shareViaEmail as any
);

// Editor-specific routes
export const editorPaperRoutes: express.Router = express.Router();

// Create new editor paper
editorPaperRoutes.post(
  "/",
  paperOperationLimiter,
  authMiddleware as any,
  validateRequestBody(createEditorPaperSchema) as any,
  editorPaperController.createEditorPaper as any
);

// Get user's editor papers (drafts and published)
editorPaperRoutes.get(
  "/",
  paperListLimiter,
  authMiddleware as any,
  editorPaperController.getUserEditorPapers as any
);

// Get specific editor paper
editorPaperRoutes.get(
  "/:id",
  paperOperationLimiter,
  authMiddleware as any,
  editorPaperController.getEditorPaper as any
);

// Update editor paper content
editorPaperRoutes.put(
  "/:id/content",
  paperOperationLimiter,
  authMiddleware as any,
  validateRequestBody(updateEditorContentSchema) as any,
  editorPaperController.updateEditorContent as any
);

// Auto-save editor content (no validation middleware for performance)
editorPaperRoutes.patch(
  "/:id/autosave",
  paperOperationLimiter,
  authMiddleware as any,
  editorPaperController.autoSaveContent as any
);

// Publish draft paper
editorPaperRoutes.post(
  "/:id/publish",
  paperOperationLimiter,
  authMiddleware as any,
  validateRequestBody(publishDraftSchema) as any,
  editorPaperController.publishDraft as any
);

// Delete editor paper
editorPaperRoutes.delete(
  "/:id",
  paperOperationLimiter,
  authMiddleware as any,
  editorPaperController.deleteEditorPaper as any
);

// Upload image for editor
editorPaperRoutes.post(
  "/upload-image",
  paperUploadLimiter,
  authMiddleware as any,
  upload.single("image") as any,
  editorPaperController.uploadImage as any
);

// Export paper as PDF
editorPaperRoutes.get(
  "/:id/export/pdf",
  paperOperationLimiter,
  authMiddleware as any,
  editorPaperController.exportPDF as any
);

// Export paper as DOCX
editorPaperRoutes.get(
  "/:id/export/docx",
  paperOperationLimiter,
  authMiddleware as any,
  editorPaperController.exportDOCX as any
);
