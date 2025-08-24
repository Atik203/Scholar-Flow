# Enhanced Error Handling System for ScholarFlow Backend

## Overview

This document outlines the comprehensive error handling system implemented for the ScholarFlow backend, specifically designed for PostgreSQL + Prisma architecture following DRY principles.

## Error Handlers Created

### 1. Prisma-Specific Error Handlers

#### `handlePrismaError.ts`

Handles Prisma Client Known Request Errors with specific handling for:

- **P2002**: Unique constraint violation (409 Conflict)
- **P2025**: Record not found (404 Not Found)
- **P2003**: Foreign key constraint violation (400 Bad Request)
- **P2014**: Required relation violation (400 Bad Request)
- **P2011**: Null constraint violation (400 Bad Request)
- **P2012**: Missing required value (400 Bad Request)
- **P2013**: Missing required argument (400 Bad Request)
- **P2015**: Related record not found (404 Not Found)
- **P2016**: Query interpretation error (400 Bad Request)
- **P2021**: Table does not exist (500 Internal Server Error)
- **P2022**: Column does not exist (500 Internal Server Error)

#### `handlePostgresError.ts`

Handles raw PostgreSQL errors with specific handling for:

- **23505**: Unique violation (409 Conflict)
- **23503**: Foreign key violation (400 Bad Request)
- **23502**: Not null violation (400 Bad Request)
- **23514**: Check violation (400 Bad Request)
- **42P01**: Undefined table (500 Internal Server Error)
- **42703**: Undefined column (500 Internal Server Error)
- **08003**: Connection does not exist (500 Internal Server Error)
- **08006**: Connection failure (500 Internal Server Error)
- **53300**: Too many connections (503 Service Unavailable)

### 2. Validation Error Handlers

#### `handleZodError.ts`

Handles Zod validation errors with proper field mapping and error messages.

#### `handleValidationError.ts`

Generic validation error handler for other validation libraries.

### 3. Authentication Error Handlers

#### `handleJWTError.ts`

Handles JSON Web Token errors (401 Unauthorized).

#### `handleTokenExpiredError.ts`

Handles expired JWT tokens (401 Unauthorized).

### 4. Legacy Compatibility

#### `handleDuplicateError.ts`

Handles MongoDB-style duplicate key errors for backward compatibility (if any legacy code exists).

## Error Response Format

All error handlers return a consistent format:

```typescript
interface TGenericErrorResponse {
  statusCode: number;
  message: string;
  errorSources: TErrorSources;
}

type TErrorSources = {
  path: string | number;
  message: string;
}[];
```

Example response:

```json
{
  "success": false,
  "message": "Validation Error",
  "errorSources": [
    {
      "path": "email",
      "message": "Email is required"
    },
    {
      "path": "password",
      "message": "Password must be at least 8 characters"
    }
  ],
  "stack": "Error stack trace (development only)"
}
```

## Global Error Handler

The `globalErrorHandler.ts` middleware automatically detects error types and applies the appropriate handler:

```typescript
// Automatic error type detection and handling
if (err instanceof ZodError) {
  // Use handleZodError
} else if (err instanceof Prisma.PrismaClientKnownRequestError) {
  // Use handlePrismaError
} else if (err instanceof Prisma.PrismaClientValidationError) {
  // Handle Prisma validation errors
} else if ((err as any)?.code && typeof (err as any).code === "string") {
  // Use handlePostgresError for raw PostgreSQL errors
} else if ((err as Error)?.name === "JsonWebTokenError") {
  // Use handleJWTError
} else if ((err as Error)?.name === "TokenExpiredError") {
  // Use handleTokenExpiredError
}
```

## Usage Examples

### 1. In Services (Throwing Errors)

```typescript
import { ApiError } from "../errors";

// Throwing a custom API error
if (!user) {
  throw new ApiError(404, "User not found");
}

// Prisma errors are automatically caught and handled
const user = await prisma.user.findUniqueOrThrow({
  where: { id: userId },
}); // Will throw P2025 if not found
```

### 2. In Controllers (Using catchAsync)

```typescript
import catchAsync from "../utils/catchAsync";

const createUser = catchAsync(async (req: Request, res: Response) => {
  // Any error thrown here will be caught and handled by globalErrorHandler
  const result = await userService.create(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User created successfully",
    data: result,
  });
});
```

### 3. Validation with Zod

```typescript
import { z } from "zod";

const createUserSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// Validation errors are automatically handled
const validateRequest = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      next(error); // Will be handled by handleZodError
    }
  };
};
```

## Benefits

1. **Consistency**: All errors follow the same response format
2. **Type Safety**: Full TypeScript support with proper error types
3. **DRY Principle**: Reusable error handlers eliminate code duplication
4. **Database Specific**: Tailored for PostgreSQL + Prisma architecture
5. **Developer Friendly**: Clear error messages and proper HTTP status codes
6. **Production Ready**: Stack traces only shown in development
7. **Comprehensive Coverage**: Handles all common database, validation, and authentication errors

## Error Handler Export

All error handlers are exported from a single index file for easy importing:

```typescript
import {
  ApiError,
  AppError,
  handleDuplicateError,
  handleJWTError,
  handlePostgresError,
  handlePrismaError,
  handleTokenExpiredError,
  handleValidationError,
  handleZodError,
} from "../errors";
```

## Future Enhancements

1. **Error Logging**: Add structured logging for errors
2. **Error Reporting**: Integration with error reporting services (e.g., Sentry)
3. **Rate Limiting**: Add rate limiting error handlers
4. **Custom Error Codes**: Application-specific error codes for better client handling
5. **Internationalization**: Multi-language error messages
