import express from "express";
import {
  getApiStatus,
  getAvailableRoutes,
} from "../controllers/status.controller";
import { adminRoutes } from "../modules/Admin/admin.routes";
import { authRoutes } from "../modules/Auth/auth.routes";
import { billingRoutes } from "../modules/Billing/billing.routes";
import { collectionRoutes } from "../modules/Collection/collection.routes";
import { editorPaperRoutes, paperRoutes } from "../modules/papers/paper.routes";
import { userRoutes } from "../modules/User/user.routes";
import { workspaceRoutes } from "../modules/Workspace/workspace.routes";
import healthRoutes from "./health.routes";

// Legacy route handlers (to be migrated into feature modules under app/modules/*)
// Placeholder imports for other route groups can be added as they are modularized
// import papersRouter from "../../routes/papers"; // TODO: migrate into app/modules/Paper

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

// Legacy flat routes (will be refactored into modules)
// router.use("/papers", papersRouter);

export default router;
