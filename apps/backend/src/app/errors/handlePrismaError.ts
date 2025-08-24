import { Prisma } from "@prisma/client";
import { TErrorSources, TGenericErrorResponse } from "../interfaces/error";

const handlePrismaError = (
  err: Prisma.PrismaClientKnownRequestError
): TGenericErrorResponse => {
  let message = "Database Error";
  let statusCode = 500;
  let errorSources: TErrorSources = [];

  switch (err.code) {
    case "P2002":
      // Unique constraint violation
      statusCode = 409;
      message = "Duplicate entry";
      errorSources = [
        {
          path: (err.meta?.target as string) || "unknown",
          message: `${err.meta?.target} already exists`,
        },
      ];
      break;

    case "P2025":
      // Record not found
      statusCode = 404;
      message = "Record not found";
      errorSources = [
        {
          path: "id",
          message: "The requested resource was not found",
        },
      ];
      break;

    case "P2003":
      // Foreign key constraint violation
      statusCode = 400;
      message = "Foreign key constraint failed";
      errorSources = [
        {
          path: (err.meta?.field_name as string) || "unknown",
          message: "Referenced record does not exist",
        },
      ];
      break;

    case "P2014":
      // Required relation violation
      statusCode = 400;
      message = "Required relation missing";
      errorSources = [
        {
          path: (err.meta?.relation_name as string) || "unknown",
          message: "A required relation is missing",
        },
      ];
      break;

    case "P2011":
      // Null constraint violation
      statusCode = 400;
      message = "Null constraint violation";
      errorSources = [
        {
          path: (err.meta?.column_name as string) || "unknown",
          message: "This field is required and cannot be null",
        },
      ];
      break;

    case "P2012":
      // Missing required value
      statusCode = 400;
      message = "Missing required value";
      errorSources = [
        {
          path: (err.meta?.column_name as string) || "unknown",
          message: "A required value is missing",
        },
      ];
      break;

    case "P2013":
      // Missing required argument
      statusCode = 400;
      message = "Missing required argument";
      errorSources = [
        {
          path: (err.meta?.argument_name as string) || "unknown",
          message: "A required argument is missing",
        },
      ];
      break;

    case "P2015":
      // Related record not found
      statusCode = 404;
      message = "Related record not found";
      errorSources = [
        {
          path: (err.meta?.relation_name as string) || "unknown",
          message: "The related record was not found",
        },
      ];
      break;

    case "P2016":
      // Query interpretation error
      statusCode = 400;
      message = "Query interpretation error";
      errorSources = [
        {
          path: "query",
          message: err.message,
        },
      ];
      break;

    case "P2021":
      // Table does not exist
      statusCode = 500;
      message = "Table does not exist";
      errorSources = [
        {
          path: (err.meta?.table as string) || "unknown",
          message: "The requested table does not exist in the database",
        },
      ];
      break;

    case "P2022":
      // Column does not exist
      statusCode = 500;
      message = "Column does not exist";
      errorSources = [
        {
          path: (err.meta?.column as string) || "unknown",
          message: "The requested column does not exist in the database",
        },
      ];
      break;

    default:
      statusCode = 500;
      message = "Database error occurred";
      errorSources = [
        {
          path: "database",
          message: err.message,
        },
      ];
  }

  return {
    statusCode,
    message,
    errorSources,
  };
};

export default handlePrismaError;
