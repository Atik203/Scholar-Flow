import { z } from "zod";
import { OAUTH_PROVIDERS, USER_ROLES } from "./auth.constant";

// Email/Password Sign-in validation
export const signInSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// OAuth Profile validation
export const oauthProfileSchema = z.object({
  email: z.string().email("Invalid email format"),
  name: z.string().optional(),
  image: z.string().url().optional(),
  picture: z.string().url().optional(),
  avatar_url: z.string().url().optional(),
});

// OAuth Account validation
export const oauthAccountSchema = z.object({
  type: z.string(),
  provider: z.enum([OAUTH_PROVIDERS.GOOGLE, OAUTH_PROVIDERS.GITHUB]),
  providerAccountId: z.string(),
  refresh_token: z.string().optional(),
  access_token: z.string().optional(),
  expires_at: z.number().optional(),
  token_type: z.string().optional(),
  scope: z.string().optional(),
  id_token: z.string().optional(),
  session_state: z.string().optional(),
});

// OAuth Sign-in validation
export const oauthSigninSchema = z.object({
  profile: oauthProfileSchema,
  account: oauthAccountSchema,
});

// Role update validation
export const updateRoleSchema = z.object({
  role: z.enum([
    USER_ROLES.RESEARCHER,
    USER_ROLES.PRO_RESEARCHER,
    USER_ROLES.TEAM_LEAD,
    USER_ROLES.ADMIN,
  ]),
  reason: z.string().optional(),
});

// Session validation
export const sessionValidationSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

export const sessionTokenSchema = z.object({
  sessionToken: z.string().min(1, "Session token is required"),
});

// Session creation validation
export const createSessionSchema = z.object({
  sessionToken: z.string().min(1, "Session token is required"),
  userId: z.string().uuid("Invalid user ID"),
  expires: z.string().datetime("Invalid expiration date"),
});

// Login validation
export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

// Registration validation
export const registerSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50),
  email: z.string().email("Invalid email format"),
  institution: z.string().max(100).optional(),
  fieldOfStudy: z.string().max(100).optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*\d)/,
      "Password must contain at least one lowercase letter and one number"
    ),
  role: z
    .enum([
      USER_ROLES.RESEARCHER,
      USER_ROLES.PRO_RESEARCHER,
      USER_ROLES.TEAM_LEAD,
      USER_ROLES.ADMIN,
    ])
    .optional()
    .default(USER_ROLES.RESEARCHER),
});

// Password change validation
export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*\d)/,
      "Password must contain at least one lowercase letter and one number"
    ),
});

// Password reset request validation
export const passwordResetRequestSchema = z.object({
  email: z.string().email("Invalid email format"),
});

// Forgot password validation (initiate password reset)
export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
});

// Password reset validation
export const passwordResetSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*\d)/,
      "Password must contain at least one lowercase letter and one number"
    ),
});

// Email verification validation
export const emailVerificationSchema = z.object({
  token: z.string().min(1, "Verification token is required"),
});

// Send email verification validation
export const sendEmailVerificationSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
});

// User creation validation
export const createUserSchema = z.object({
  email: z.string().email("Invalid email format"),
  name: z.string().optional(),
  image: z.string().url().optional(),
  role: z
    .enum([
      USER_ROLES.RESEARCHER,
      USER_ROLES.PRO_RESEARCHER,
      USER_ROLES.TEAM_LEAD,
      USER_ROLES.ADMIN,
    ])
    .optional()
    .default(USER_ROLES.RESEARCHER),
});

// User update validation
export const updateUserSchema = z.object({
  name: z.string().optional(),
  image: z.string().url().optional(),
  role: z
    .enum([
      USER_ROLES.RESEARCHER,
      USER_ROLES.PRO_RESEARCHER,
      USER_ROLES.TEAM_LEAD,
      USER_ROLES.ADMIN,
    ])
    .optional(),
});

// JWT token payload validation
export const jwtPayloadSchema = z.object({
  sub: z.string(),
  email: z.string().email(),
  role: z.string(),
  iat: z.number().optional(),
  exp: z.number().optional(),
});

// Pagination validation
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

// Query filters validation
export const userFiltersSchema = z.object({
  search: z.string().optional(),
  role: z
    .enum([
      USER_ROLES.RESEARCHER,
      USER_ROLES.PRO_RESEARCHER,
      USER_ROLES.TEAM_LEAD,
      USER_ROLES.ADMIN,
    ])
    .optional(),
  isDeleted: z.boolean().optional().default(false),
});

// Export all validation schemas
export const authValidation = {
  signInRequest: signInSchema,
  oAuthSignInRequest: oauthSigninSchema,
  oauthSignin: oauthSigninSchema,
  sessionValidationRequest: sessionValidationSchema,
  sessionValidation: sessionValidationSchema,
  sessionToken: sessionTokenSchema,
  createSessionRequest: createSessionSchema,
  updateRoleRequest: updateRoleSchema,
  login: loginSchema,
  register: registerSchema,
  passwordChange: passwordChangeSchema,
  forgotPassword: forgotPasswordSchema,
  passwordReset: passwordResetSchema,
  emailVerification: emailVerificationSchema,
  sendEmailVerification: sendEmailVerificationSchema,
  createUser: createUserSchema,
  updateUser: updateUserSchema,
  jwtPayload: jwtPayloadSchema,
  pagination: paginationSchema,
  userFilters: userFiltersSchema,
};
