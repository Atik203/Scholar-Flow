export const USER_ROLES = {
  RESEARCHER: "RESEARCHER",
  PRO_RESEARCHER: "PRO_RESEARCHER",
  TEAM_LEAD: "TEAM_LEAD",
  ADMIN: "ADMIN",
} as const;

export const ROLE_HIERARCHY = {
  RESEARCHER: 1,
  PRO_RESEARCHER: 2,
  TEAM_LEAD: 3,
  ADMIN: 4,
} as const;

export const ROLE_PERMISSIONS = {
  RESEARCHER: [
    "paper:read",
    "paper:create",
    "paper:update_own",
    "paper:delete_own",
    "collection:read",
    "collection:create",
    "collection:update_own",
    "collection:delete_own",
    "profile:read_own",
    "profile:update_own",
  ],
  PRO_RESEARCHER: [
    "paper:read",
    "paper:create",
    "paper:update_own",
    "paper:delete_own",
    "paper:ai_features",
    "collection:read",
    "collection:create",
    "collection:update_own",
    "collection:delete_own",
    "collection:share",
    "collaboration:join",
    "profile:read_own",
    "profile:update_own",
    "workspace:create",
    "workspace:join",
  ],
  TEAM_LEAD: [
    "paper:read",
    "paper:create",
    "paper:update_own",
    "paper:delete_own",
    "paper:update_team",
    "paper:delete_team",
    "paper:ai_features",
    "collection:read",
    "collection:create",
    "collection:update_own",
    "collection:delete_own",
    "collection:update_team",
    "collection:delete_team",
    "collection:share",
    "collaboration:join",
    "collaboration:manage",
    "profile:read_own",
    "profile:update_own",
    "profile:read_team",
    "workspace:create",
    "workspace:join",
    "workspace:manage",
    "user:invite",
  ],
  ADMIN: [
    "paper:read",
    "paper:create",
    "paper:update",
    "paper:delete",
    "paper:ai_features",
    "collection:read",
    "collection:create",
    "collection:update",
    "collection:delete",
    "collection:share",
    "collaboration:join",
    "collaboration:manage",
    "profile:read",
    "profile:update",
    "profile:delete",
    "workspace:create",
    "workspace:join",
    "workspace:manage",
    "workspace:delete",
    "user:read",
    "user:create",
    "user:update",
    "user:delete",
    "user:invite",
    "admin:dashboard",
    "admin:analytics",
    "admin:settings",
    "system:manage",
  ],
} as const;

// Extract permission type from the constant
type PermissionValue =
  (typeof ROLE_PERMISSIONS)[keyof typeof ROLE_PERMISSIONS][number];
export type Permission = PermissionValue;

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
  INVALID_ROLE: "Invalid user role",
  ROLE_CHANGE_FORBIDDEN: "Role change not allowed",
} as const;

export const AUTH_SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Login successful",
  SIGNIN_SUCCESS: "Sign-in successful",
  LOGOUT_SUCCESS: "Logout successful",
  REGISTRATION_SUCCESS: "Account created successfully",
  OAUTH_SUCCESS: "OAuth sign-in successful",
  TOKEN_VALIDATED: "Token validation successful",
  PASSWORD_CHANGED: "Password changed successfully",
  PASSWORD_RESET: "Password reset successful",
  ROLE_UPDATED: "User role updated successfully",
  ADMIN_ACCESS_GRANTED: "Admin access granted",
} as const;
