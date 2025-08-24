export const USER_ROLES = {
  RESEARCHER: "RESEARCHER",
  PRO_RESEARCHER: "PRO_RESEARCHER",
  TEAM_LEAD: "TEAM_LEAD",
  ADMIN: "ADMIN",
} as const;

export const OAUTH_PROVIDERS = {
  GOOGLE: "google",
  GITHUB: "github",
} as const;

export const ACCOUNT_TYPES = {
  OAUTH: "oauth",
  EMAIL: "email",
} as const;

export const AUTH_COOKIES = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  SESSION_TOKEN: "session_token",
} as const;

export const TOKEN_EXPIRY = {
  ACCESS_TOKEN: "15m",
  REFRESH_TOKEN: "7d",
  SESSION_TOKEN: "30d",
} as const;

export const AUTH_ERROR_MESSAGES = {
  INVALID_CREDENTIALS: "Invalid email or password",
  USER_NOT_FOUND: "User not found",
  EMAIL_ALREADY_EXISTS: "Email already exists",
  INVALID_TOKEN: "Invalid or expired token",
  UNAUTHORIZED: "Unauthorized access",
  FORBIDDEN: "Insufficient permissions",
  TOKEN_EXPIRED: "Token has expired",
  OAUTH_ERROR: "OAuth authentication failed",
  SESSION_EXPIRED: "Session has expired",
} as const;

export const AUTH_SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Login successful",
  LOGOUT_SUCCESS: "Logout successful",
  REGISTRATION_SUCCESS: "Account created successfully",
  OAUTH_SUCCESS: "OAuth sign-in successful",
  TOKEN_VALIDATED: "Token validation successful",
  PASSWORD_CHANGED: "Password changed successfully",
  PASSWORD_RESET: "Password reset successful",
} as const;
