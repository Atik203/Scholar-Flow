import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import ApiError from "../errors/ApiError";

const globalErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = 500;
  const success = false;
  let message = "Something went wrong!";
  let error: unknown = undefined;

  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation error";
    error = err.issues;
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        statusCode = 409;
        message = "Unique constraint failed";
        break;
      case "P2025":
        statusCode = 404;
        message = "Record not found";
        break;
      default:
        statusCode = 400;
        message = "Database request error";
    }
    error = { code: err.code, meta: err.meta };
  } else if (err instanceof ApiError) {
    statusCode = err.statusCode || statusCode;
    message = err.message || message;
  } else if (err instanceof Error) {
    message = err.message || message;
  }

  const maybeStatus = (err as { statusCode?: number } | undefined)?.statusCode;
  if (typeof maybeStatus === "number") {
    statusCode = maybeStatus;
  }

  res.status(statusCode).json({
    success,
    message,
    error,
  });
};

export default globalErrorHandler;
