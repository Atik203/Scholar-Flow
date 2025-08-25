import { NextFunction, Request, Response } from "express";
import ApiError from "../errors/ApiError";

/**
 * 404 Route Not Found middleware
 */
export const routeNotFound = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = new ApiError(
    404,
    `Route not found: ${req.method} ${req.originalUrl}`
  );
  next(error);
};

/**
 * Health check endpoint handler
 */
export const healthCheck = (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Scholar-Flow API is running!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    version: process.env.npm_package_version || "1.0.0",
  });
};
