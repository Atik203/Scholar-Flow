import express, { Router } from "express";
import { AuthRequest, requireRole } from "../middleware/auth";

const router: Router = express.Router();

// Apply admin role requirement to all routes
router.use(requireRole(["ADMIN"]));

// GET /admin/users
router.get("/users", async (req: AuthRequest, res) => {
  res.status(501).json({
    error: "Admin endpoints not yet implemented",
    message: "This endpoint will return admin user management interface",
  });
});

// GET /admin/metrics
router.get("/metrics", async (req: AuthRequest, res) => {
  res.status(501).json({
    error: "Admin endpoints not yet implemented",
    message: "This endpoint will return system metrics and analytics",
  });
});

export default router;
