import { TErrorSources, TGenericErrorResponse } from "../interfaces/error";

const handleValidationError = (
  err: Error & {
    issues?: Array<{ path: (string | number)[]; message: string }>;
  }
): TGenericErrorResponse => {
  const message = "Validation Error";
  const statusCode = 400;

  const errorSources: TErrorSources = err.issues
    ? err.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      }))
    : [
        {
          path: "unknown",
          message: err.message,
        },
      ];

  return {
    message,
    statusCode,
    errorSources,
  };
};

export default handleValidationError;
