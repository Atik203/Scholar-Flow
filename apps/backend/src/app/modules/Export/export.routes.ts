import express from "express";
import { authMiddleware } from "../../middleware/auth";
import { rateLimiter } from "../../middleware/rateLimiter";
import catchAsync from "../../shared/catchAsync";
import { sendSuccessResponse } from "../../shared/sendResponse";
import { AuthenticatedRequest } from "../../interfaces/common";
import { latexService } from "./latex.service";
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

export const exportRoutes = router;
