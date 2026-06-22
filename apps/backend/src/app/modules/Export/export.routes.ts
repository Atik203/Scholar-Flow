import express from "express";
import { authMiddleware } from "../../middleware/auth";
import { rateLimiter } from "../../middleware/rateLimiter";
import catchAsync from "../../shared/catchAsync";
import { sendSuccessResponse } from "../../shared/sendResponse";
import { AuthenticatedRequest } from "../../interfaces/common";
import { latexService } from "./latex.service";
import { latexProjectService } from "./latexProject.service";
import multer from "multer";
import path from "path";
import os from "os";
import fs from "fs";

const router: express.Router = express.Router();
const upload = multer({ dest: os.tmpdir() });

// GET /api/export/status — check available compilers
router.get(
  "/status",
  authMiddleware as any,
  catchAsync(async (_req, res) => {
    const status = latexService.getStatus();
    sendSuccessResponse(res, status, "Export tools status");
  })
);

// POST /api/export/latex — compile LaTeX content to PDF
router.post(
  "/latex",
  authMiddleware as any,
  rateLimiter as any,
  catchAsync(async (req, res) => {
    const { content } = req.body || {};
    if (!content) {
      res.status(400).json({ success: false, message: "LaTeX content is required" });
      return;
    }

    try {
      const { pdfBuffer, compiler } = await latexService.compileLatex(content);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=output.pdf");
      res.setHeader("X-Compiler", compiler);
      res.send(pdfBuffer);
    } catch (err: any) {
      res.status(502).json({
        success: false,
        message: err?.message || "LaTeX compilation failed",
      });
    }
  }) as any
);

// POST /api/export/upload — upload file and convert to PDF
router.post(
  "/upload",
  authMiddleware as any,
  rateLimiter as any,
  upload.single("file") as any,
  catchAsync(async (req, res) => {
    const file = req.file;
    if (!file) {
      res.status(400).json({ success: false, message: "File is required" });
      return;
    }

    const ext = path.extname(file.originalname).toLowerCase();
    const formatMap: Record<string, string> = {
      ".tex": "latex",
      ".docx": "docx",
      ".md": "markdown",
      ".rst": "rst",
      ".html": "html",
    };
    const inputFormat = formatMap[ext];
    if (!inputFormat) {
      fs.unlinkSync(file.path);
      res.status(400).json({ success: false, message: `Unsupported format: ${ext}` });
      return;
    }

    try {
      const { pdfBuffer, compiler } = await latexService.compileFromFile(file.path, inputFormat);
      const outName = file.originalname.replace(ext, ".pdf");
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=${outName}`);
      res.setHeader("X-Compiler", compiler);
      res.send(pdfBuffer);
    } catch (err: any) {
      res.status(502).json({
        success: false,
        message: err?.message || "Conversion failed",
      });
    } finally {
      try { fs.unlinkSync(file.path); } catch {}
    }
  }) as any
);

// LaTeX project file management (multi-file projects)
// GET /api/export/latex-project/:paperId/files — list project files
router.get(
  "/latex-project/:paperId/files",
  authMiddleware as any,
  catchAsync(async (req, res) => {
    const files = await latexProjectService.getFiles(req.params.paperId);
    sendSuccessResponse(res, { files }, "Project files retrieved");
  }) as any
);

// GET /api/export/latex-project/:paperId/files/:fileId — get file content
router.get(
  "/latex-project/:paperId/files/:fileId",
  authMiddleware as any,
  catchAsync(async (req, res) => {
    const file = await latexProjectService.getFile(req.params.paperId, req.params.fileId);
    if (!file) {
      res.status(404).json({ success: false, message: "File not found" });
      return;
    }
    sendSuccessResponse(res, file, "File retrieved");
  }) as any
);

// PUT /api/export/latex-project/:paperId/files/:fileId — save file content
router.put(
  "/latex-project/:paperId/files/:fileId",
  authMiddleware as any,
  rateLimiter as any,
  catchAsync(async (req, res) => {
    const { content } = req.body || {};
    if (content === undefined) {
      res.status(400).json({ success: false, message: "Content is required" });
      return;
    }
    const file = await latexProjectService.saveFile(req.params.paperId, req.params.fileId, content);
    sendSuccessResponse(res, file, "File saved");
  }) as any
);

// POST /api/export/latex-project/:paperId/files — create new file
router.post(
  "/latex-project/:paperId/files",
  authMiddleware as any,
  rateLimiter as any,
  catchAsync(async (req, res) => {
    const { name, content, parentId } = req.body || {};
    if (!name) {
      res.status(400).json({ success: false, message: "File name is required" });
      return;
    }
    const file = await latexProjectService.createFile(req.params.paperId, name, content, parentId);
    sendSuccessResponse(res, file, "File created");
  }) as any
);

// DELETE /api/export/latex-project/:paperId/files/:fileId — delete file
router.delete(
  "/latex-project/:paperId/files/:fileId",
  authMiddleware as any,
  catchAsync(async (req, res) => {
    await latexProjectService.deleteFile(req.params.paperId, req.params.fileId);
    sendSuccessResponse(res, null, "File deleted");
  }) as any
);

// PUT /api/export/latex-project/:paperId/main/:fileId — set main file
router.put(
  "/latex-project/:paperId/main/:fileId",
  authMiddleware as any,
  catchAsync(async (req, res) => {
    await latexProjectService.setMainFile(req.params.paperId, req.params.fileId);
    sendSuccessResponse(res, null, "Main file updated");
  }) as any
);

export const exportRoutes = router;
