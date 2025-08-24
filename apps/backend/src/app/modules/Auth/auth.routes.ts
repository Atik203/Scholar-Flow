import express from "express";
import { authMiddleware, optionalAuth } from "../../middleware/auth";
import { validateRequestBody } from "../../middleware/validateRequest";
import { authController } from "./auth.controller";
import { authValidation } from "./auth.validation";

const router: express.Router = express.Router();

/**
 * POST /api/auth/oauth/signin
 * Handle OAuth sign-in from frontend
 */
router.post(
  "/oauth/signin",
  validateRequestBody(authValidation.oauthSignin),
  authController.oauthSignin
);

/**
 * POST /api/auth/session/validate
 * Validate JWT session token
 */
router.post(
  "/session/validate",
  validateRequestBody(authValidation.sessionValidation),
  authController.validateSession
);

/**
 * POST /api/auth/session/get
 * Get session by token
 */
router.post(
  "/session/get",
  validateRequestBody(authValidation.sessionToken),
  authController.getSession
);

/**
 * DELETE /api/auth/session
 * Delete session (logout)
 */
router.delete(
  "/session",
  validateRequestBody(authValidation.sessionToken),
  authController.deleteSession
);

/**
 * GET /api/auth/me
 * Get current user profile (protected route)
 */
router.get("/me", authMiddleware, authController.getCurrentUser);

/**
 * GET /api/auth/profile (optional auth)
 * Get user profile with optional authentication
 */
router.get("/profile", optionalAuth, authController.getCurrentUser);

export const authRoutes: express.Router = router;
export default router;
