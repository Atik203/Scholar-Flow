import { TErrorSources, TGenericErrorResponse } from "../interfaces/error";

const handlePostgresError = (err: any): TGenericErrorResponse => {
  let message = "Database Error";
  let statusCode = 500;
  let errorSources: TErrorSources = [];

  // Handle different PostgreSQL error codes
  switch (err.code) {
    case "23505": {
      // Unique violation
      statusCode = 409;
      message = "Duplicate entry";
      const field = err.detail?.match(/Key \(([^)]+)\)=/)?.[1] || "field";
      errorSources = [
        {
          path: field,
          message: `${field} already exists`,
        },
      ];
      break;
    }

    case "23503":
      // Foreign key violation
      statusCode = 400;
      message = "Foreign key constraint violation";
      errorSources = [
        {
          path: "reference",
          message: "Referenced record does not exist",
        },
      ];
      break;

    case "23502": {
      // Not null violation
      statusCode = 400;
      message = "Required field missing";
      const column = err.column || "column";
      errorSources = [
        {
          path: column,
          message: `${column} is required`,
        },
      ];
      break;
    }

    case "23514":
      // Check violation
      statusCode = 400;
      message = "Data validation failed";
      errorSources = [
        {
          path: err.constraint || "unknown",
          message: err.detail || "Check constraint violation",
        },
      ];
      break;

    case "42P01":
      // Undefined table
      statusCode = 500;
      message = "Table does not exist";
      errorSources = [
        {
          path: "database",
          message: "The requested table does not exist",
        },
      ];
      break;

    case "42703":
      // Undefined column
      statusCode = 500;
      message = "Column does not exist";
      errorSources = [
        {
          path: "database",
          message: "The requested column does not exist",
        },
      ];
      break;

    case "08003":
      // Connection does not exist
      statusCode = 500;
      message = "Database connection error";
      errorSources = [
        {
          path: "database",
          message: "Failed to connect to the database",
        },
      ];
      break;

    case "08006":
      // Connection failure
      statusCode = 500;
      message = "Database connection failed";
      errorSources = [
        {
          path: "database",
          message: "Database connection was lost",
        },
      ];
      break;

    case "53300":
      // Too many connections
      statusCode = 503;
      message = "Service temporarily unavailable";
      errorSources = [
        {
          path: "database",
          message: "Database is currently overloaded",
        },
      ];
      break;

    default:
      statusCode = 500;
      message = "Database error occurred";
      errorSources = [
        {
          path: "database",
          message: err.message || "An unexpected database error occurred",
        },
      ];
  }

  return {
    statusCode,
    message,
    errorSources,
  };
};

export default handlePostgresError;
