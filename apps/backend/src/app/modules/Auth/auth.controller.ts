import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../../middleware/auth";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import AppError from "../../errors/AppError";
import { AUTH_ERROR_MESSAGES, AUTH_SUCCESS_MESSAGES } from "./auth.constant";
import {
  IOAuthSignInRequest,
  IRoleUpdateData,
  ISessionValidationRequest,
  IUserFilters,
  IValidationRequest,
} from "./auth.interface";
import { authService } from "./auth.service";

class AuthController {
  /**
   * Handle email/password sign-in
   * POST /api/auth/signin
   */
  signIn = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await authService.signInWithPassword(email, password);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: AUTH_SUCCESS_MESSAGES.SIGNIN_SUCCESS,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        },
      },
    });
  });

  /**
   * Handle user registration with email/password
   * POST /api/auth/register
   */
  register = catchAsync(async (req: Request, res: Response) => {
    const {
      firstName,
      lastName,
      email,
      password,
      institution,
      fieldOfStudy,
      role,
    } = req.body;

    const user = await authService.registerWithPassword(
      firstName,
      lastName,
      email,
      password,
      institution,
      fieldOfStudy,
      role
    );

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          firstName: user.firstName,
          lastName: user.lastName,
          institution: user.institution,
          fieldOfStudy: user.fieldOfStudy,
          role: user.role,
          createdAt: user.createdAt,
        },
      },
    });
  });

  /**
   * Handle OAuth sign-in from frontend
   * POST /api/auth/oauth/signin
   */
  oauthSignin = catchAsync(async (req: Request, res: Response) => {
    const { profile, account } = req.body as IOAuthSignInRequest;

    const user = await authService.handleOAuthSignIn(profile, account);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: AUTH_SUCCESS_MESSAGES.OAUTH_SUCCESS,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        },
      },
    });
  });

  /**
   * Update user role (Admin only)
   * PUT /api/auth/users/:userId/role
   */
  updateUserRole = catchAsync(async (req: AuthRequest, res: Response) => {
    const { userId } = req.params;
    const roleData = req.body as IRoleUpdateData;
    const adminUserId = req.user?.id;
    if (!adminUserId) {
      throw new AppError(401, "User not authenticated");
    }

    const updatedUser = await authService.updateUserRole(
      adminUserId,
      userId,
      roleData
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: AUTH_SUCCESS_MESSAGES.ROLE_UPDATED,
      data: {
        user: updatedUser,
      },
    });
  });

  /**
   * Get all users with filtering (Admin/Team Lead only)
   * GET /api/auth/users
   */
  getAllUsers = catchAsync(async (req: AuthRequest, res: Response) => {
    const filters = req.query as IUserFilters;
    const requestingUserId = req.user?.id;
    if (!requestingUserId) {
      throw new AppError(401, "User not authenticated");
    }

    const users = await authService.getAllUsers(requestingUserId, filters);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Users retrieved successfully",
      data: {
        users,
        meta: {
          total: users.length,
        },
      },
    });
  });

  /**
   * Validate JWT session token
   * POST /api/auth/session/validate
   */
  validateSession = catchAsync(async (req: Request, res: Response) => {
    const { token } = req.body as IValidationRequest;
    const jwtSecret = process.env.NEXTAUTH_SECRET;

    if (!jwtSecret) {
      sendResponse(res, {
        statusCode: 500,
        success: false,
        message: "JWT secret not configured",
      });
      return;
    }

    try {
      // Verify JWT token
      const decoded = jwt.verify(token, jwtSecret) as any;

      // Get user data using our service
      const user = await authService.validateJWTToken(decoded.sub);

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: AUTH_SUCCESS_MESSAGES.TOKEN_VALIDATED,
        data: {
          valid: true,
          user,
        },
      });
    } catch (error) {
      sendResponse(res, {
        statusCode: 401,
        success: false,
        message: AUTH_ERROR_MESSAGES.INVALID_TOKEN,
        data: {
          valid: false,
        },
      });
    }
  });

  /**
   * Get session by token
   * POST /api/auth/session/get
   */
  getSession = catchAsync(async (req: Request, res: Response) => {
    const { sessionToken } = req.body as ISessionValidationRequest;

    const session = await authService.getSessionByToken(sessionToken);

    if (!session) {
      sendResponse(res, {
        statusCode: 404,
        success: false,
        message: AUTH_ERROR_MESSAGES.SESSION_EXPIRED,
      });
      return;
    }

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Session retrieved successfully",
      data: { session },
    });
  });

  /**
   * Create session
   * POST /api/auth/session/create
   */
  createSession = catchAsync(async (req: Request, res: Response) => {
    const { sessionToken, userId, expires } = req.body;

    const sessionData = {
      sessionToken,
      userId,
      expires: new Date(expires),
    };

    const session = await authService.createSession(userId, sessionData);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Session created successfully",
      data: { session },
    });
  });

  /**
   * Delete session (logout)
   * DELETE /api/auth/session
   */
  deleteSession = catchAsync(async (req: Request, res: Response) => {
    const { sessionToken } = req.body as ISessionValidationRequest;

    await authService.deleteSession(sessionToken);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: AUTH_SUCCESS_MESSAGES.LOGOUT_SUCCESS,
    });
  });

  /**
   * Get current user profile
   * GET /api/auth/me
   */
  getCurrentUser = catchAsync(async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      sendResponse(res, {
        statusCode: 401,
        success: false,
        message: AUTH_ERROR_MESSAGES.UNAUTHORIZED,
      });
      return;
    }

    const token = authHeader.substring(7);
    const jwtSecret = process.env.NEXTAUTH_SECRET;

    if (!jwtSecret) {
      sendResponse(res, {
        statusCode: 500,
        success: false,
        message: "JWT secret not configured",
      });
      return;
    }

    try {
      const decoded = jwt.verify(token, jwtSecret) as any;
      const user = await authService.validateJWTToken(decoded.sub);

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User profile retrieved successfully",
        data: { user },
      });
    } catch (error) {
      sendResponse(res, {
        statusCode: 401,
        success: false,
        message: AUTH_ERROR_MESSAGES.INVALID_TOKEN,
      });
    }
  });

  /**
   * Initiate forgot password process
   * POST /api/auth/forgot-password
   */
  forgotPassword = catchAsync(async (req: Request, res: Response) => {
    const { email } = req.body;

    const result = await authService.initiateForgotPassword(email);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: result.message,
    });
  });

  /**
   * Reset password using token
   * POST /api/auth/reset-password
   */
  resetPassword = catchAsync(async (req: Request, res: Response) => {
    const { token, newPassword } = req.body;

    const result = await authService.resetPassword(token, newPassword);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: result.message,
    });
  });

  /**
   * Verify email using token
   * POST /api/auth/verify-email
   */
  verifyEmail = catchAsync(async (req: Request, res: Response) => {
    const { token } = req.body;

    const result = await authService.verifyEmail(token);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: result.message,
    });
  });

  /**
   * Send email verification email
   * POST /api/auth/send-verification
   */
  sendEmailVerification = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.body;

    const result = await authService.sendEmailVerification(userId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: result.message,
    });
  });
}

export const authController = new AuthController();
