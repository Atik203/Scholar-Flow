import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { AUTH_ERROR_MESSAGES, AUTH_SUCCESS_MESSAGES } from "./auth.constant";
import {
  IOAuthSignInRequest,
  ISessionValidationRequest,
  IValidationRequest,
} from "./auth.interface";
import { authService } from "./auth.service";

class AuthController {
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
}

export const authController = new AuthController();
