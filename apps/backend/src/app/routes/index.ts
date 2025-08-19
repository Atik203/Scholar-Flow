import express from "express";
import { userRoutes } from "../modules/User/user.routes";

// Legacy route handlers (to be migrated into feature modules under app/modules/*)
import authRouter from "../../routes/auth";
// Placeholder imports for other route groups can be added as they are modularized
// import papersRouter from "../../routes/papers"; // TODO: migrate into app/modules/Paper

const router: import("express").Router = express.Router();

// Feature module based routes
router.use("/user", userRoutes);

// Legacy flat routes (will be refactored into modules)
router.use("/auth", authRouter);
// router.use("/papers", papersRouter);

export default router;
