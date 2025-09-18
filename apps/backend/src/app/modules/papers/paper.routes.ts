import express from "express";
import multer from "multer";
import { authMiddleware, optionalAuth } from "../../middleware/auth";
import {
  paperListLimiter,
  paperOperationLimiter,
  paperUploadLimiter,
} from "../../middleware/rateLimiter";
import { validateRequestBody } from "../../middleware/validateRequest";
import { paperController } from "./paper.controller";
import { updatePaperMetadataSchema } from "./paper.validation";

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
