import express from "express";
import multer from "multer";
import { authMiddleware } from "../../middleware/auth";
import {
  paperOperationLimiter,
  paperUploadLimiter,
} from "../../middleware/rateLimiter";
import { validateRequestBody } from "../../middleware/validateRequest";
import { userController } from "./user.controller";
import { changePasswordSchema, updateProfileSchema } from "./user.validation";

const router: import("express").Router = express.Router();

// Configure multer for profile picture uploads (memory storage, max 5MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimeTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, and WebP are allowed"));
    }
  },
});

/**
 * @swagger
 * components:
 *   schemas:
 *     UserListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Users retrieved successfully"
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 *         meta:
 *           $ref: '#/components/schemas/PaginationMeta'
 *
 *     ChangePasswordRequest:
 *       type: object
 *       required:
 *         - currentPassword
 *         - newPassword
 *       properties:
 *         currentPassword:
 *           type: string
 *           format: password
 *           description: Current password for verification
 *           example: "currentPassword123"
 *         newPassword:
 *           type: string
 *           format: password
 *           minLength: 8
 *           description: New password (minimum 8 characters)
 *           example: "newSecurePassword123"
 */

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Get All Users
 *     description: Retrieve a paginated list of all users in the system. Supports filtering and sorting.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for filtering users by name or email
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [USER, ADMIN]
 *         description: Filter users by role
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, email, createdAt, updatedAt]
 *           default: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserListResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get("/", authMiddleware, userController.getAllFromDB);

/**
 * @swagger
 * /api/user/me:
 *   get:
 *     summary: Get My Profile
 *     description: Get the current authenticated user's detailed profile information
 *     tags: [Users]
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
 *                   allOf:
 *                     - $ref: '#/components/schemas/User'
 *                     - type: object
 *                       properties:
 *                         accounts:
 *                           type: array
 *                           description: Connected OAuth accounts
 *                           items:
 *                             type: object
 *                             properties:
 *                               provider:
 *                                 type: string
 *                                 example: "google"
 *                               providerAccountId:
 *                                 type: string
 *                                 example: "1234567890"
 *                               type:
 *                                 type: string
 *                                 example: "oauth"
 *                         collections:
 *                           type: array
 *                           description: User's paper collections
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                                 format: uuid
 *                               name:
 *                                 type: string
 *                               description:
 *                                 type: string
 *                                 nullable: true
 *                               paperCount:
 *                                 type: integer
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get("/me", authMiddleware, userController.getMyProfile);

/**
 * @swagger
 * /api/user/update-profile:
 *   put:
 *     summary: Update User Profile
 *     description: Update the current user's profile information including name, institution, field of study, and image.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Full name of the user
 *                 example: "Dr. John Smith"
 *               firstName:
 *                 type: string
 *                 description: First name of the user
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 description: Last name of the user
 *                 example: "Smith"
 *               institution:
 *                 type: string
 *                 description: User's institution or organization
 *                 example: "Stanford University"
 *               fieldOfStudy:
 *                 type: string
 *                 description: User's field of study or research area
 *                 example: "Computer Science"
 *               image:
 *                 type: string
 *                 description: URL to user's profile image
 *                 example: "https://example.com/avatar.jpg"
 *     responses:
 *       200:
 *         description: Profile updated successfully
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
 *                   example: "Profile updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.put(
  "/update-profile",
  authMiddleware,
  validateRequestBody(updateProfileSchema),
  userController.updateProfile
);

/**
 * @swagger
 * /api/user/change-password:
 *   post:
 *     summary: Change Password
 *     description: Change the current user's password. Requires current password for verification.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordRequest'
 *     responses:
 *       200:
 *         description: Password changed successfully
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
 *                   example: "Password changed successfully"
 *       400:
 *         description: Invalid request or current password incorrect
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               invalidPassword:
 *                 summary: Current password is incorrect
 *                 value:
 *                   success: false
 *                   message: "Current password is incorrect"
 *               weakPassword:
 *                 summary: New password is too weak
 *                 value:
 *                   success: false
 *                   message: "Password must be at least 8 characters long"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post(
  "/change-password",
  authMiddleware,
  validateRequestBody(changePasswordSchema),
  userController.changePassword
);

/**
 * @swagger
 * /api/user/delete-account:
 *   delete:
 *     summary: Delete User Account
 *     description: Permanently delete the current user's account. This action is irreversible and will log out the user immediately.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Account deleted successfully
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
 *                   example: "Account deleted successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                       example: true
 *                     message:
 *                       type: string
 *                       example: "Account deleted successfully"
 *                     deletedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-15T10:30:00.000Z"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: User not found or already deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.delete("/delete-account", authMiddleware, userController.deleteAccount);

/**
 * @swagger
 * /api/user/upload-profile-picture:
 *   post:
 *     summary: Upload Profile Picture
 *     description: Upload a new profile picture to S3. Accepts JPEG, PNG, or WebP images up to 5MB. Returns permanent URL with no expiration.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Profile picture image file (JPEG, PNG, or WebP, max 5MB)
 *     responses:
 *       200:
 *         description: Profile picture uploaded successfully
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
 *                   example: "Profile picture uploaded successfully!"
 *                 data:
 *                   type: object
 *                   properties:
 *                     imageUrl:
 *                       type: string
 *                       example: "https://bucket.s3.region.amazonaws.com/profile-pictures/user-id/uuid.jpg"
 *       400:
 *         description: Invalid file type or size
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post(
  "/upload-profile-picture",
  authMiddleware,
  paperUploadLimiter,
  upload.single("file") as any,
  userController.uploadProfilePicture
);

/**
 * @swagger
 * /api/user/analytics:
 *   get:
 *     summary: Get User Analytics
 *     description: Retrieve comprehensive analytics including papers count, collections count, storage usage, AI tokens usage, and charts data.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics retrieved successfully
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
 *                   example: "User analytics retrieved successfully!"
 *                 data:
 *                   type: object
 *                   properties:
 *                     plan:
 *                       type: string
 *                       enum: [FREE, PRO]
 *                       example: "FREE"
 *                     limits:
 *                       type: object
 *                       properties:
 *                         maxPapers:
 *                           type: number
 *                           example: 50
 *                         maxStorage:
 *                           type: number
 *                           example: 1024
 *                         maxTokens:
 *                           type: number
 *                           example: 10000
 *                         maxCollections:
 *                           type: number
 *                           example: 10
 *                     usage:
 *                       type: object
 *                       properties:
 *                         papers:
 *                           type: object
 *                         collections:
 *                           type: object
 *                         storage:
 *                           type: object
 *                         tokens:
 *                           type: object
 *                     charts:
 *                       type: object
 *                       properties:
 *                         papersOverTime:
 *                           type: array
 *                         collectionsOverTime:
 *                           type: array
 *                         storageOverTime:
 *                           type: array
 *                         papersByStatus:
 *                           type: array
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get(
  "/analytics",
  authMiddleware,
  paperOperationLimiter,
  userController.getUserAnalytics
);

export const userRoutes = router;
