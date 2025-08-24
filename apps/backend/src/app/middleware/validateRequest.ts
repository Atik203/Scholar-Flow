import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";
import ApiError from "../errors/ApiError";

export const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        cookies: req.cookies,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = error.issues
          .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
          .join(", ");

        return next(
          new ApiError(400, `Validation failed: ${validationErrors}`)
        );
      }
      next(error);
    }
  };
};

export const validateRequestBody = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = await schema.parseAsync(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = error.issues
          .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
          .join(", ");

        return next(
          new ApiError(
            400,
            `Request body validation failed: ${validationErrors}`
          )
        );
      }
      next(error);
    }
  };
};

export const validateRequestQuery = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = await schema.parseAsync(req.query);
      req.query = validatedData;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = error.issues
          .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
          .join(", ");

        return next(
          new ApiError(
            400,
            `Query parameters validation failed: ${validationErrors}`
          )
        );
      }
      next(error);
    }
  };
};

export const validateRequestParams = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = await schema.parseAsync(req.params);
      req.params = validatedData;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = error.issues
          .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
          .join(", ");

        return next(
          new ApiError(
            400,
            `URL parameters validation failed: ${validationErrors}`
          )
        );
      }
      next(error);
    }
  };
};
