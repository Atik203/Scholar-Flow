import express from "express";
import {
  getApiStatus,
  getAvailableRoutes,
} from "../controllers/status.controller";
import { adminRoutes } from "../modules/Admin/admin.routes";
import { annotationRoutes } from "../modules/Annotations/annotation.routes";
import { authRoutes } from "../modules/Auth/auth.routes";
import { billingRoutes } from "../modules/Billing/billing.routes";
import { collectionRoutes } from "../modules/Collection/collection.routes";
import { editorPaperRoutes, paperRoutes } from "../modules/Papers/paper.routes";
import { noteRoutes } from "../modules/Notes/note.routes";
import { notebookRoutes } from "../modules/Notebook/notebook.routes";
import { reportRoutes } from "../modules/Reports/report.routes";
import { auditLogRoutes } from "../modules/AuditLog/auditLog.routes";
import { webhookRoutes } from "../modules/Webhooks/webhook.routes";
import { analyticsRoutes } from "../modules/Analytics/analytics.routes";
import { userRoutes } from "../modules/User/user.routes";
import { workspaceRoutes } from "../modules/Workspace/workspace.routes";
import { notificationRoutes } from "../modules/Notification/notification.routes";
import { publicRoutes } from "../modules/Public/public.routes";
import { searchRoutes } from "../modules/Search/search.routes";
import { recommendationRoutes } from "../modules/Recommendation/recommendation.routes";
import { importRoutes } from "../modules/Import/import.routes";
import { teamRoutes } from "../modules/Team/team.routes";
import { citationRoutes } from "../modules/CitationExport/citationExport.routes";
import { discussionRoutes } from "../modules/Discussion/discussion.routes";
import { activityLogRoutes } from "../modules/ActivityLog/activityLog.routes";
import healthRoutes from "./health.routes";

const router: import("express").Router = express.Router();

// Status and documentation routes
router.get("/status", getApiStatus);
router.get("/routes", getAvailableRoutes);

// Feature module based routes
router.use("/health", healthRoutes);
router.use("/user", userRoutes);
router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/billing", billingRoutes);
router.use("/papers", paperRoutes);
router.use("/editor", editorPaperRoutes); // Editor-specific paper routes
router.use("/collections", collectionRoutes);
router.use("/workspaces", workspaceRoutes);
router.use("/annotations", annotationRoutes);
router.use("/notes", noteRoutes);
router.use("/notebooks", notebookRoutes);

// Phase 2 features
router.use("/citations", citationRoutes);
router.use("/discussions", discussionRoutes);
router.use("/activity-log", activityLogRoutes);

// Phase 3 features
router.use("/notifications", notificationRoutes);

// Phase 1.9 Public content
router.use("/public", publicRoutes);

// Phase 4 features
router.use("/search", searchRoutes);
router.use("/recommendations", recommendationRoutes);
router.use("/import", importRoutes);

// Phase 5 features
router.use("/team", teamRoutes);

// Phase 7 features
router.use("/admin/reports", reportRoutes);
router.use("/admin/audit-log", auditLogRoutes);
router.use("/admin/webhooks", webhookRoutes);
router.use("/analytics", analyticsRoutes);
export default router;
