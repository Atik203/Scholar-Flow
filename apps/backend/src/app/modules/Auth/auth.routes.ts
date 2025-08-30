import express from "express";
import {
  authMiddleware,
  optionalAuth,
  requireAdmin,
  requireTeamLead,
} from "../../middleware/auth";
import {
  emailVerificationLimiter,
  passwordResetLimiter,
  sensitiveAuthLimiter,
} from "../../middleware/rateLimiter";
import { validateRequestBody } from "../../middleware/validateRequest";
import { authController } from "./auth.controller";
import { authValidation } from "./auth.validation";

const router: express.Router = express.Router();

// Public routes
router.post(
  "/register",
  validateRequestBody(authValidation.register),
  authController.register
);

router.post(
  "/signin",
  validateRequestBody(authValidation.signInRequest),
  authController.signIn
);

router.post(
  "/oauth/signin",
  validateRequestBody(authValidation.oAuthSignInRequest),
  authController.oauthSignin
);

router.post(
  "/session/validate",
  validateRequestBody(authValidation.sessionValidationRequest),
  authController.validateSession
);

router.post(
  "/session/get",
  validateRequestBody(authValidation.sessionValidationRequest),
  authController.getSession
);

router.post(
  "/session/create",
  validateRequestBody(authValidation.createSessionRequest),
  authController.createSession
);

router.post(
  "/session/delete",
  validateRequestBody(authValidation.sessionValidationRequest),
  authController.deleteSession
);

// Password reset and email verification routes
router.post(
  "/forgot-password",
  passwordResetLimiter,
  validateRequestBody(authValidation.forgotPassword),
  authController.forgotPassword
);

router.post(
  "/reset-password",
  passwordResetLimiter,
  validateRequestBody(authValidation.passwordReset),
  authController.resetPassword
);

router.post(
  "/verify-email",
  emailVerificationLimiter,
  validateRequestBody(authValidation.emailVerification),
  authController.verifyEmail
);

router.post(
  "/send-verification",
  sensitiveAuthLimiter,
  validateRequestBody(authValidation.sendEmailVerification),
  authController.sendEmailVerification
);

// Protected routes for user management
router.get(
  "/users",
  authMiddleware,
  requireTeamLead,
  authController.getAllUsers
);

router.put(
  "/users/:userId/role",
  authMiddleware,
  requireAdmin,
  validateRequestBody(authValidation.updateRoleRequest),
  authController.updateUserRole
);

router.get("/profile", optionalAuth, authController.getCurrentUser);

/**
 * @swagger
 * components:
 *   schemas:
 *     OAuthSigninRequest:
 *       type: object
 *       required:
 *         - email
 *         - name
 *         - provider
 *         - providerAccountId
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *           example: "john.doe@example.com"
 *         name:
 *           type: string
 *           description: User's full name
 *           example: "John Doe"
 *         image:
 *           type: string
 *           format: uri
 *           nullable: true
 *           description: URL to user's profile image
 *           example: "https://example.com/avatar.jpg"
 *         provider:
 *           type: string
 *           enum: [google, github]
 *           description: OAuth provider
 *           example: "google"
 *         providerAccountId:
 *           type: string
 *           description: Unique identifier from OAuth provider
 *           example: "1234567890"
 *         type:
 *           type: string
 *           default: "oauth"
 *           description: Account type
 *         access_token:
 *           type: string
 *           description: OAuth access token
 *         refresh_token:
 *           type: string
 *           nullable: true
 *           description: OAuth refresh token
 *         expires_at:
 *           type: integer
 *           nullable: true
 *           description: Token expiration timestamp
 *         scope:
 *           type: string
 *           nullable: true
 *           description: OAuth scope
 *         token_type:
 *           type: string
 *           nullable: true
 *           description: Token type (usually "Bearer")
 *
 *     SessionValidationRequest:
 *       type: object
 *       required:
 *         - token
 *       properties:
 *         token:
 *           type: string
 *           description: JWT token to validate
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *
 *     SessionTokenRequest:
 *       type: object
 *       required:
 *         - token
 *       properties:
 *         token:
 *           type: string
 *           description: JWT session token
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *
 *     AuthResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Authentication successful"
 *         data:
 *           type: object
 *           properties:
 *             user:
 *               $ref: '#/components/schemas/User'
 *             token:
 *               type: string
 *               description: JWT access token
 *               example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *             refreshToken:
 *               type: string
 *               description: JWT refresh token
 *               example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 */

/**
 * @swagger
 * /api/auth/oauth/signin:
 *   post:
 *     summary: OAuth Sign-in
 *     description: Handle OAuth sign-in from frontend. Creates or updates user account and returns JWT tokens.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OAuthSigninRequest'
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post(
  "/oauth/signin",
  validateRequestBody(authValidation.oauthSignin),
  authController.oauthSignin
);

/**
 * @swagger
 * /api/auth/session/validate:
 *   post:
 *     summary: Validate Session Token
 *     description: Validate a JWT session token and return validation status
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SessionValidationRequest'
 *     responses:
 *       200:
 *         description: Token validation result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Token is valid"
 *                 data:
 *                   type: object
 *                   properties:
 *                     valid:
 *                       type: boolean
 *                       example: true
 *                     userId:
 *                       type: string
 *                       format: uuid
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post(
  "/session/validate",
  validateRequestBody(authValidation.sessionValidation),
  authController.validateSession
);

/**
 * @swagger
 * /api/auth/session/get:
 *   post:
 *     summary: Get Session Information
 *     description: Retrieve session information for a given JWT token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SessionTokenRequest'
 *     responses:
 *       200:
 *         description: Session information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Session retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     sessionExpiry:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-01T12:00:00Z"
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post(
  "/session/get",
  validateRequestBody(authValidation.sessionToken),
  authController.getSession
);

/**
 * @swagger
 * /api/auth/session:
 *   delete:
 *     summary: Logout (Delete Session)
 *     description: Delete/invalidate a user session (logout)
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SessionTokenRequest'
 *     responses:
 *       200:
 *         description: Session deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Logged out successfully"
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.delete(
  "/session",
  validateRequestBody(authValidation.sessionToken),
  authController.deleteSession
);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get Current User Profile (Protected)
 *     description: Get the current authenticated user's profile information. Requires valid JWT token.
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User profile retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get("/me", authMiddleware, authController.getCurrentUser);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get User Profile (Optional Auth)
 *     description: Get user profile with optional authentication. Returns public info if not authenticated, full profile if authenticated.
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *       - {}
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User profile retrieved successfully"
 *                 data:
 *                   anyOf:
 *                     - $ref: '#/components/schemas/User'
 *                     - type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           format: uuid
 *                         name:
 *                           type: string
 *                         image:
 *                           type: string
 *                           format: uri
 *                           nullable: true
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get("/profile", optionalAuth, authController.getCurrentUser);

export const authRoutes: express.Router = router;
export default router;
