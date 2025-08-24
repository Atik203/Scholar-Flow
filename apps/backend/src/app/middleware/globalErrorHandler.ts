import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import config from "../config";
import {
  ApiError,
  handleDuplicateError,
  handleJWTError,
  handlePostgresError,
  handlePrismaError,
  handleTokenExpiredError,
  handleZodError,
} from "../errors";
import { TErrorSources } from "../interfaces/error";

const globalErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = 500;
  let message = "Something went wrong!";
  let errorSources: TErrorSources = [
    {
      path: "",
      message: "Something went wrong!",
    },
  ];

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  }
  // Handle Prisma known request errors
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const simplifiedError = handlePrismaError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  }
  // Handle Prisma validation errors
  else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = "Validation Error";
    errorSources = [
      {
        path: "validation",
        message: err.message,
      },
    ];
  }
  // Handle PostgreSQL errors
  else if ((err as any)?.code && typeof (err as any).code === "string") {
    const simplifiedError = handlePostgresError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  }
  // Handle JWT errors
  else if ((err as Error)?.name === "JsonWebTokenError") {
    const simplifiedError = handleJWTError();
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  }
  // Handle JWT expired errors
  else if ((err as Error)?.name === "TokenExpiredError") {
    const simplifiedError = handleTokenExpiredError();
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  }
  // Handle MongoDB duplicate key errors (if any legacy code exists)
  else if ((err as any)?.code === 11000) {
    const simplifiedError = handleDuplicateError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  }
  // Handle ApiError instances
  else if (err instanceof ApiError) {
    statusCode = err?.statusCode;
    message = err?.message;
    errorSources = [
      {
        path: "",
        message: err?.message,
      },
    ];
  }
  // Handle generic Error instances
  else if (err instanceof Error) {
    message = err?.message;
    errorSources = [
      {
        path: "",
        message: err?.message,
      },
    ];
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack: config.env === "development" ? (err as Error)?.stack : null,
  });
};

export default globalErrorHandler;
