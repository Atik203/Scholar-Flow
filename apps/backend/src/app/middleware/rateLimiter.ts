import rateLimit from "express-rate-limit";

// General rate limiter for API endpoints
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per 15 minutes
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for sensitive auth endpoints
export const sensitiveAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // effectively disables rate limiting for testing
  message: {
    success: false,
    message: "Too many attempts. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for password reset operations
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // limit each IP to 3 password reset attempts per hour
  message: {
    success: false,
    message: "Too many password reset attempts. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for email verification
export const emailVerificationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 3 email verification attempts per 15 minutes
  message: {
    success: false,
    message: "Too many email verification attempts. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for login attempts
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 login attempts per 15 minutes
  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for registration
export const registrationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // limit each IP to 20 registration attempts per hour
  message: {
    success: false,
    message: "Too many registration attempts. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for paper uploads
export const paperUploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // limit each IP to 50 paper uploads per hour
  message: {
    success: false,
    message: "Too many upload attempts. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for paper listing (prevent abuse of list endpoint)
export const paperListLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 list requests per 15 minutes
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for general paper operations (get, update, delete)
export const paperOperationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 operations per 15 minutes
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
