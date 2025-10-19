import { Response } from "express";

export type TMeta = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
};

interface IApiResponse<T> {
  statusCode: number;
  success: boolean;
  message?: string | null;
  meta?: TMeta;
  data?: T | null;
  errors?: any;
}

const sendResponse = <T>(res: Response, data: IApiResponse<T>): void => {
  const responseData: IApiResponse<T> = {
    statusCode: data.statusCode,
    success: data.success,
    message: data.message || null,
    meta: data.meta || undefined,
    data: data.data || null,
    errors: data.errors || undefined,
  };

  res.status(data.statusCode).json(responseData);
};

// Convenience functions for common responses
export const sendSuccessResponse = <T>(
  res: Response,
  data: T,
  message: string = "Operation successful",
  statusCode: number = 200
) => {
  sendResponse(res, {
    statusCode,
    success: true,
    message,
    data,
  });
};

export const sendErrorResponse = (
  res: Response,
  message: string = "Something went wrong",
  statusCode: number = 500,
  errors?: any
) => {
  sendResponse(res, {
    statusCode,
    success: false,
    message,
    errors,
  });
};

export const sendPaginatedResponse = <T>(
  res: Response,
  data: T[],
  meta: TMeta,
  message: string = "Data retrieved successfully",
  statusCode: number = 200
) => {
  sendResponse(res, {
    statusCode,
    success: true,
    message,
    meta,
    data,
  });
};

export default sendResponse;
