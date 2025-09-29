import ApiError from "../../errors/ApiError";

/**
 * Custom error class for paper-related operations
 */
export class PaperError extends ApiError {
  public details?: any;

  constructor(message: string, statusCode = 400, details?: any) {
    super(statusCode, message);
    this.name = "PaperError";
    this.details = details;
  }
}

/**
 * Pre-defined paper error messages and status codes
 */
export const PAPER_ERRORS = {
  // Upload errors
  UPLOAD_DISABLED: {
    message: "Paper upload feature is currently disabled",
    statusCode: 403,
  },
  MISSING_FILE: { message: "No file provided for upload", statusCode: 400 },
  INVALID_FILE_TYPE: {
    message: "Only PDF files are supported",
    statusCode: 400,
  },
  FILE_TOO_LARGE: {
    message: "File size exceeds maximum allowed limit",
    statusCode: 413,
  },
  UPLOAD_FAILED: {
    message: "Failed to upload file to storage",
    statusCode: 500,
  },

  // Validation errors
  VALIDATION_FAILED: { message: "Request validation failed", statusCode: 400 },
  INVALID_METADATA: {
    message: "Invalid paper metadata provided",
    statusCode: 400,
  },
  INVALID_PAPER_ID: { message: "Invalid paper ID format", statusCode: 400 },

  // Authorization errors
  AUTHENTICATION_REQUIRED: {
    message: "Authentication required to access this resource",
    statusCode: 401,
  },
  INSUFFICIENT_PERMISSIONS: {
    message: "Insufficient permissions to perform this action",
    statusCode: 403,
  },

  // Resource errors
  PAPER_NOT_FOUND: {
    message: "Paper not found or has been deleted",
    statusCode: 404,
  },
  FILE_NOT_FOUND: {
    message: "Paper file not found or unavailable",
    statusCode: 404,
  },
  WORKSPACE_NOT_FOUND: { message: "Workspace not found", statusCode: 404 },

  // Processing errors
  PROCESSING_FAILED: { message: "Paper processing failed", statusCode: 422 },
  PROCESSING_IN_PROGRESS: {
    message: "Paper is currently being processed",
    statusCode: 409,
  },
  SUMMARY_GENERATION_FAILED: {
    message: "Failed to generate AI summary",
    statusCode: 502,
  },

  // Operation errors
  DELETE_FAILED: { message: "Failed to delete paper", statusCode: 500 },
  UPDATE_FAILED: {
    message: "Failed to update paper metadata",
    statusCode: 500,
  },

  // Storage errors
  STORAGE_ERROR: { message: "Storage operation failed", statusCode: 500 },
  SIGNED_URL_FAILED: {
    message: "Failed to generate signed URL for file access",
    statusCode: 500,
  },
} as const;

/**
 * Helper functions to create specific paper errors
 */
export const createPaperError = {
  uploadDisabled: () =>
    new PaperError(
      PAPER_ERRORS.UPLOAD_DISABLED.message,
      PAPER_ERRORS.UPLOAD_DISABLED.statusCode
    ),

  missingFile: () =>
    new PaperError(
      PAPER_ERRORS.MISSING_FILE.message,
      PAPER_ERRORS.MISSING_FILE.statusCode
    ),

  invalidFileType: (allowedTypes?: string[]) =>
    new PaperError(
      PAPER_ERRORS.INVALID_FILE_TYPE.message +
        (allowedTypes ? `. Allowed: ${allowedTypes.join(", ")}` : ""),
      PAPER_ERRORS.INVALID_FILE_TYPE.statusCode
    ),

  fileTooLarge: (maxSize?: number) =>
    new PaperError(
      PAPER_ERRORS.FILE_TOO_LARGE.message +
        (maxSize ? ` (max: ${Math.round(maxSize / 1024 / 1024)}MB)` : ""),
      PAPER_ERRORS.FILE_TOO_LARGE.statusCode
    ),

  validationFailed: (details?: string) =>
    new PaperError(
      PAPER_ERRORS.VALIDATION_FAILED.message + (details ? `: ${details}` : ""),
      PAPER_ERRORS.VALIDATION_FAILED.statusCode
    ),

  authenticationRequired: () =>
    new PaperError(
      PAPER_ERRORS.AUTHENTICATION_REQUIRED.message,
      PAPER_ERRORS.AUTHENTICATION_REQUIRED.statusCode
    ),

  insufficientPermissions: () =>
    new PaperError(
      PAPER_ERRORS.INSUFFICIENT_PERMISSIONS.message,
      PAPER_ERRORS.INSUFFICIENT_PERMISSIONS.statusCode
    ),

  paperNotFound: (paperId?: string) =>
    new PaperError(
      PAPER_ERRORS.PAPER_NOT_FOUND.message +
        (paperId ? ` (ID: ${paperId})` : ""),
      PAPER_ERRORS.PAPER_NOT_FOUND.statusCode
    ),

  fileNotFound: () =>
    new PaperError(
      PAPER_ERRORS.FILE_NOT_FOUND.message,
      PAPER_ERRORS.FILE_NOT_FOUND.statusCode
    ),

  processingFailed: (reason?: string) =>
    new PaperError(
      PAPER_ERRORS.PROCESSING_FAILED.message + (reason ? `: ${reason}` : ""),
      PAPER_ERRORS.PROCESSING_FAILED.statusCode
    ),

  storageError: (operation?: string) =>
    new PaperError(
      PAPER_ERRORS.STORAGE_ERROR.message +
        (operation ? ` during ${operation}` : ""),
      PAPER_ERRORS.STORAGE_ERROR.statusCode
    ),

  summaryGenerationFailed: (details?: string) =>
    new PaperError(
      PAPER_ERRORS.SUMMARY_GENERATION_FAILED.message +
        (details ? `: ${details}` : ""),
      PAPER_ERRORS.SUMMARY_GENERATION_FAILED.statusCode
    ),
};
