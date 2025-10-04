import rateLimit from "express-rate-limit";

// General rate limiter for API endpoints
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // TESTING: Increased from 100 to 1000 requests per 15 minutes
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
  max: 200, // TESTING: Increased from 20 to 200 requests per 15 minutes
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
  max: 100, // TESTING: Increased from 20 to 100 attempts per hour
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
  max: 100, // TESTING: Increased from 20 to 100 attempts per 15 minutes
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
  max: 200, // TESTING: Increased from 20 to 200 login attempts per 15 minutes
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
  max: 100, // TESTING: Increased from 20 to 100 registration attempts per hour
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
  max: 500, // TESTING: Increased from 50 to 500 paper uploads per hour
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
  max: 1000, // TESTING: Increased from 100 to 1000 list requests per 15 minutes
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
  max: 2000, // TESTING: Increased from 200 to 2000 operations per 15 minutes
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for billing checkout sessions
export const billingCheckoutLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // TESTING: Increased from 10 to 100 checkout attempts per hour
  message: {
    success: false,
    message: "Too many checkout attempts. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for billing portal access
export const billingPortalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // TESTING: Increased from 20 to 200 portal requests per 15 minutes
  message: {
    success: false,
    message: "Too many portal requests. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for subscription reads
export const billingSubscriptionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // TESTING: Increased from 100 to 1000 reads per 15 minutes
  message: {
    success: false,
    message: "Too many subscription requests. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
