import { Request } from "express";

/**
 * Parse request body data with type safety
 */
export const parseRequestBodyData = <T = any>(req: Request): T => {
  return req.body as T;
};

/**
 * Parse query parameters with type conversion
 */
export const parseQueryParams = (req: Request) => {
  const query = req.query;
  const parsed: Record<string, any> = {};

  for (const [key, value] of Object.entries(query)) {
    if (typeof value === "string") {
      // Try to parse numbers
      if (!isNaN(Number(value))) {
        parsed[key] = Number(value);
      }
      // Try to parse booleans
      else if (value === "true") {
        parsed[key] = true;
      } else if (value === "false") {
        parsed[key] = false;
      }
      // Keep as string
      else {
        parsed[key] = value;
      }
    } else {
      parsed[key] = value;
    }
  }

  return parsed;
};

/**
 * Extract pagination options from request query
 */
export const extractPaginationOptions = (req: Request) => {
  const { page = 1, limit = 10, sortBy, sortOrder = "desc" } = req.query;

  return {
    page: Number(page),
    limit: Math.min(Number(limit), 100), // Max 100 items per page
    sortBy: sortBy as string,
    sortOrder: sortOrder as "asc" | "desc",
  };
};

/**
 * Extract filters from request query (removes pagination params)
 */
export const extractFilters = (req: Request) => {
  const { page, limit, sortBy, sortOrder, ...filters } = req.query;
  return filters;
};

/**
 * Sanitize user input to prevent XSS
 */
export const sanitizeInput = (input: any): any => {
  if (typeof input === "string") {
    return input
      .trim()
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  }

  if (typeof input === "object" && input !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized;
  }

  return input;
};

/**
 * Convert string to boolean safely
 */
export const stringToBoolean = (value: string): boolean => {
  return value.toLowerCase() === "true";
};

/**
 * Parse date from string with error handling
 */
export const parseDate = (dateString: string): Date | null => {
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
};

/**
 * Generate unique filename with timestamp
 */
export const generateUniqueFilename = (originalName: string): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2);
  const extension = originalName.split(".").pop();
  return `${timestamp}-${random}.${extension}`;
};
