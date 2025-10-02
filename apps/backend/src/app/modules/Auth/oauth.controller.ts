/**
 * OAuth Controller Methods
 * Handles Google and GitHub OAuth flows
 */

import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import AppError from "../../errors/AppError";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { AsyncRequestHandler } from "../../types/express";
import { authService } from "./auth.service";

interface GoogleTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
}

interface GoogleProfile {
  id: string;
  email: string;
  name: string;
  picture: string;
}

interface GitHubTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
  error?: string;
  error_description?: string;
}

interface GitHubProfile {
  id: number;
  login: string;
  name: string | null;
  email: string | null;
  avatar_url: string;
}

interface GitHubEmail {
  email: string;
  primary: boolean;
  verified: boolean;
}

interface UserData {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  role: string;
}

/**
 * Generate JWT access token for authenticated user
 */
function generateAccessToken(user: UserData): string {
  const jwtSecret = process.env.NEXTAUTH_SECRET;
  if (!jwtSecret) {
    throw new AppError(500, "JWT secret not configured");
  }

  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      image: user.image,
    },
    jwtSecret,
    { expiresIn: "7d" } // 7 days expiry
  );
}

/**
 * Initiate Google OAuth flow
 * GET /api/auth/oauth/google
 */
export const initiateGoogleOAuth: AsyncRequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    // callbackUrl is already URL-encoded from the frontend, don't encode again
    const callbackUrl = (req.query.callbackUrl as string) || "/dashboard";
    const state = callbackUrl; // Use as-is, already encoded from frontend

    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const redirectUri = `${frontendUrl}/auth/callback/google`;

    if (!googleClientId) {
      throw new AppError(500, "Google OAuth not configured");
    }

    const googleAuthUrl = new URL(
      "https://accounts.google.com/o/oauth2/v2/auth"
    );
    googleAuthUrl.searchParams.append("client_id", googleClientId);
    googleAuthUrl.searchParams.append("redirect_uri", redirectUri);
    googleAuthUrl.searchParams.append("response_type", "code");
    googleAuthUrl.searchParams.append("scope", "openid email profile");
    googleAuthUrl.searchParams.append("state", state);
    googleAuthUrl.searchParams.append("access_type", "offline");
    googleAuthUrl.searchParams.append("prompt", "consent");

    // Redirect to Google
    res.redirect(googleAuthUrl.toString());
  }
);

/**
 * Initiate GitHub OAuth flow
 * GET /api/auth/oauth/github
 */
export const initiateGitHubOAuth: AsyncRequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    // callbackUrl is already URL-encoded from the frontend, don't encode again
    const callbackUrl = (req.query.callbackUrl as string) || "/dashboard";
    const state = callbackUrl; // Use as-is, already encoded from frontend

    const githubClientId = process.env.GITHUB_CLIENT_ID;
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const redirectUri = `${frontendUrl}/auth/callback/github`;

    if (!githubClientId) {
      throw new AppError(500, "GitHub OAuth not configured");
    }

    const githubAuthUrl = new URL("https://github.com/login/oauth/authorize");
    githubAuthUrl.searchParams.append("client_id", githubClientId);
    githubAuthUrl.searchParams.append("redirect_uri", redirectUri);
    githubAuthUrl.searchParams.append("scope", "read:user user:email");
    githubAuthUrl.searchParams.append("state", state);

    // Redirect to GitHub
    res.redirect(githubAuthUrl.toString());
  }
);

/**
 * Handle Google OAuth callback
 * POST /api/auth/oauth/google/callback
 */
export const handleGoogleCallback: AsyncRequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    // Support both POST body and URL query params for code
    const code = req.body.code || (req.query.code as string);

    if (!code) {
      throw new AppError(400, "Authorization code is required");
    }

    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const redirectUri = `${frontendUrl}/auth/callback/google`;

    if (!googleClientId || !googleClientSecret) {
      throw new AppError(500, "Google OAuth not configured");
    }

    // Exchange code for tokens
    console.log("🔄 Exchanging Google OAuth code...", {
      codeLength: code.length,
      redirectUri,
      frontendUrl,
    });

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: googleClientId,
        client_secret: googleClientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json().catch(() => ({}));
      console.error("❌ Google token exchange failed:", {
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
        error: errorData,
        redirectUri,
      });
      throw new AppError(
        401,
        errorData.error_description ||
          errorData.error ||
          "Failed to exchange authorization code"
      );
    }

    const tokens = (await tokenResponse.json()) as GoogleTokenResponse;

    // Get user profile
    const profileResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      }
    );

    if (!profileResponse.ok) {
      throw new AppError(401, "Failed to fetch user profile");
    }

    const profile = (await profileResponse.json()) as GoogleProfile;

    // Sign in or create user via auth service
    const user = await authService.handleOAuthSignIn(
      {
        email: profile.email,
        name: profile.name,
        image: profile.picture,
      },
      {
        type: "oauth",
        provider: "google",
        providerAccountId: profile.id,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_at: Math.floor(Date.now() / 1000) + tokens.expires_in,
        token_type: tokens.token_type,
      }
    );

    // Generate JWT access token
    const accessToken = generateAccessToken(user);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Google OAuth successful",
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        },
        accessToken,
      },
    });
  }
);

/**
 * Handle GitHub OAuth callback
 * POST /api/auth/oauth/github/callback
 */
export const handleGitHubCallback: AsyncRequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    // Support both POST body and URL query params for code
    const code = req.body.code || (req.query.code as string);

    if (!code) {
      throw new AppError(400, "Authorization code is required");
    }

    const githubClientId = process.env.GITHUB_CLIENT_ID;
    const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const redirectUri = `${frontendUrl}/auth/callback/github`;

    if (!githubClientId || !githubClientSecret) {
      throw new AppError(500, "GitHub OAuth not configured");
    }

    // Exchange code for tokens
    console.log("🔄 Exchanging GitHub OAuth code...", {
      codeLength: code.length,
      redirectUri,
      frontendUrl,
    });

    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          code,
          client_id: githubClientId,
          client_secret: githubClientSecret,
          redirect_uri: redirectUri,
        }),
      }
    );

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json().catch(() => ({}));
      console.error("❌ GitHub token exchange failed:", {
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
        error: errorData,
        redirectUri,
      });
      throw new AppError(
        401,
        errorData.error_description ||
          errorData.error ||
          "Failed to exchange authorization code"
      );
    }

    const tokens = (await tokenResponse.json()) as GitHubTokenResponse;

    if (tokens.error) {
      console.error("❌ GitHub OAuth error in token response:", tokens);
      throw new AppError(401, tokens.error_description || "OAuth failed");
    }

    // Get user profile
    const profileResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
        Accept: "application/json",
      },
    });

    if (!profileResponse.ok) {
      throw new AppError(401, "Failed to fetch user profile");
    }

    const profile = (await profileResponse.json()) as GitHubProfile;

    // Get user email if not public
    let email = profile.email;
    if (!email) {
      const emailResponse = await fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
          Accept: "application/json",
        },
      });
      if (emailResponse.ok) {
        const emails = (await emailResponse.json()) as GitHubEmail[];
        const primaryEmail = emails.find((e) => e.primary);
        email = primaryEmail?.email || emails[0]?.email;
      }
    }

    // Sign in or create user via auth service
    const user = await authService.handleOAuthSignIn(
      {
        email: email || "",
        name: profile.name || profile.login,
        image: profile.avatar_url,
      },
      {
        type: "oauth",
        provider: "github",
        providerAccountId: String(profile.id),
        access_token: tokens.access_token,
        token_type: tokens.token_type,
        scope: tokens.scope,
      }
    );

    // Generate JWT access token
    const accessToken = generateAccessToken(user);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "GitHub OAuth successful",
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        },
        accessToken,
      },
    });
  }
);
