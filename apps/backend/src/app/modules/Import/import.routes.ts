import express from "express";
import { authMiddleware } from "../../middleware/auth";
import { paperUploadLimiter } from "../../middleware/rateLimiter";
import { importController } from "./import.controller";

export const importRoutes: express.Router = express.Router();

// DOI import (CrossRef)
importRoutes.post("/doi", paperUploadLimiter, authMiddleware as any, importController.importByDOI as any);

// arXiv import
importRoutes.post("/arxiv", paperUploadLimiter, authMiddleware as any, importController.importByArxiv as any);

// URL import (download PDF)
importRoutes.post("/url", paperUploadLimiter, authMiddleware as any, importController.importByURL as any);

// Smart URL import (detects IEEE/ResearchGate/Google Scholar/arXiv/Semantic Scholar)
importRoutes.post("/smart-url", paperUploadLimiter, authMiddleware as any, importController.importBySmartURL as any);

// File import (BibTeX/RIS)
importRoutes.post("/file", paperUploadLimiter, authMiddleware as any, importController.importByFile as any);

// OAuth stubs
importRoutes.post("/zotero", paperUploadLimiter, authMiddleware as any, importController.importByZotero as any);
importRoutes.post("/mendeley", paperUploadLimiter, authMiddleware as any, importController.importByMendeley as any);
importRoutes.post("/endnote", paperUploadLimiter, authMiddleware as any, importController.importByEndnote as any);

// Import history
importRoutes.get("/history", authMiddleware as any, importController.getImportHistory as any);
