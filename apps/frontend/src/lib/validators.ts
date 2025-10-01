import { z } from "zod";

// Common validation schemas for forms
export const commonSchemas = {
  // Email validation with proper error message
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters"),

  // Password validation with strength requirements
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be less than 128 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one lowercase letter, one uppercase letter, and one number"
    )
    .regex(
      /^(?=.*[!@#$%^&*(),.?":{}|<>])/,
      "Password must contain at least one special character"
    ),

  // Username validation
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    )
    .regex(/^[a-zA-Z]/, "Username must start with a letter"),

  // URL validation
  url: z
    .string()
    .min(1, "URL is required")
    .url("Invalid URL format")
    .max(2048, "URL must be less than 2048 characters"),

  // Phone validation (international format)
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format")
    .max(20, "Phone number must be less than 20 characters"),

  // Name validation
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Name can only contain letters, spaces, hyphens, and apostrophes"
    ),

  // Title validation
  title: z
    .string()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be less than 200 characters"),

  // Description validation
  description: z
    .string()
    .min(1, "Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters"),

  // Tag validation
  tag: z
    .string()
    .min(1, "Tag is required")
    .min(2, "Tag must be at least 2 characters")
    .max(50, "Tag must be less than 50 characters")
    .regex(
      /^[a-zA-Z0-9\s-]+$/,
      "Tag can only contain letters, numbers, spaces, and hyphens"
    ),

  // File size validation (in bytes)
  fileSize: (maxSizeMB: number) =>
    z.any().refine((file) => file?.size <= maxSizeMB * 1024 * 1024, {
      message: `File size must be less than ${maxSizeMB}MB`,
    }),

  // File type validation
  fileType: (allowedTypes: string[]) =>
    z.any().refine((file) => allowedTypes.includes(file?.type), {
      message: `File type must be one of: ${allowedTypes.join(", ")}`,
    }),
};

// Form-specific schemas
export const authSchemas = {
  // Login form
  login: z.object({
    email: commonSchemas.email,
    password: z.string().min(1, "Password is required"),
    rememberMe: z.boolean().optional(),
  }),

  // Registration form
  register: z
    .object({
      email: commonSchemas.email,
      username: commonSchemas.username,
      password: commonSchemas.password,
      confirmPassword: z.string().min(1, "Please confirm your password"),
      firstName: commonSchemas.name,
      lastName: commonSchemas.name,
      acceptTerms: z.boolean().refine((val) => val === true, {
        message: "You must accept the terms and conditions",
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    }),

  // Password reset request
  passwordResetRequest: z.object({
    email: commonSchemas.email,
  }),

  // Password reset
  passwordReset: z
    .object({
      token: z.string().min(1, "Reset token is required"),
      password: commonSchemas.password,
      confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    }),
};

export const profileSchemas = {
  // Profile update
  profileUpdate: z.object({
    firstName: commonSchemas.name,
    lastName: commonSchemas.name,
    bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
    website: commonSchemas.url.optional().or(z.literal("")),
    location: z
      .string()
      .max(100, "Location must be less than 100 characters")
      .optional(),
    phone: commonSchemas.phone.optional().or(z.literal("")),
  }),
};

export const paperSchemas = {
  // Paper creation/update
  paper: z.object({
    title: commonSchemas.title,
    abstract: commonSchemas.description,
    authors: z
      .array(z.string().min(1, "Author name is required"))
      .min(1, "At least one author is required"),
    keywords: z
      .array(commonSchemas.tag)
      .min(1, "At least one keyword is required")
      .max(10, "Maximum 10 keywords allowed"),
    doi: z.string().optional(),
    publicationDate: z.date().optional(),
    journal: z
      .string()
      .max(200, "Journal name must be less than 200 characters")
      .optional(),
    volume: z
      .string()
      .max(50, "Volume must be less than 50 characters")
      .optional(),
    issue: z
      .string()
      .max(50, "Issue must be less than 50 characters")
      .optional(),
    pages: z
      .string()
      .max(50, "Pages must be less than 50 characters")
      .optional(),
  }),

  // Paper search
  paperSearch: z.object({
    query: z.string().min(1, "Search query is required"),
    filters: z
      .object({
        authors: z.array(z.string()).optional(),
        keywords: z.array(z.string()).optional(),
        dateRange: z
          .object({
            start: z.date().optional(),
            end: z.date().optional(),
          })
          .optional(),
        journals: z.array(z.string()).optional(),
      })
      .optional(),
    sortBy: z.enum(["relevance", "date", "title", "citations"]).optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
  }),
};

export const collectionSchemas = {
  // Collection creation/update
  collection: z.object({
    name: commonSchemas.title,
    description: commonSchemas.description,
    isPublic: z.boolean(),
    tags: z.array(commonSchemas.tag).optional(),
  }),
};

const aiSummaryFocusAreaSchema = z
  .string()
  .trim()
  .min(2, "Focus areas should contain at least two characters")
  .max(120, "Focus areas should be shorter than 120 characters");

export const aiSchemas = {
  generateSummary: z.object({
    instructions: z
      .string()
      .trim()
      .min(4, "Instructions should contain at least four characters")
      .max(400, "Instructions should be shorter than 400 characters")
      .optional(),
    focusAreas: z.array(aiSummaryFocusAreaSchema).max(5).optional(),
    tone: z
      .enum(["academic", "technical", "executive", "casual", "conversational"])
      .optional(),
    audience: z
      .enum(["researcher", "student", "executive", "general"])
      .optional(),
    language: z
      .string()
      .trim()
      .min(2, "Language should contain at least two characters")
      .max(40, "Language should be shorter than 40 characters")
      .optional(),
    wordLimit: z
      .number({ invalid_type_error: "Word limit must be a number" })
      .int("Word limit must be an integer")
      .min(80, "Word limit must be at least 80 words")
      .max(600, "Word limit must be at most 600 words")
      .optional(),
    refresh: z.boolean().optional(),
  }),
};

export type GenerateSummaryFormInput = z.infer<
  typeof aiSchemas.generateSummary
>;

// Utility functions for validation
export const validateField = <T>(
  schema: z.ZodSchema<T>,
  value: unknown
): { success: true; data: T } | { success: false; error: string } => {
  try {
    const result = schema.parse(value);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0]?.message || "Validation failed",
      };
    }
    return { success: false, error: "Validation failed" };
  }
};

export const validateForm = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
):
  | { success: true; data: T }
  | { success: false; errors: Record<string, string> } => {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const path = err.path.join(".");
        errors[path] = err.message;
      });
      return { success: false, errors };
    }
    return { success: false, errors: { form: "Validation failed" } };
  }
};
