import { NextFunction, Request, Response } from "express";

/**
 * Type for Express route handlers wrapped with catchAsync
 * This fixes TS2742 errors when declaration: true is set
 */
export type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

/**
 * Type for Express route handlers with custom request type
 */
export type AsyncAuthRequestHandler = (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) => Promise<void>;
