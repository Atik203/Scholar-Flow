import { TErrorSources, TGenericErrorResponse } from "../interfaces/error";

const handleZodError = (err: any): TGenericErrorResponse => {
  const message = "Validation Error";
  const statusCode = 400;

  const errorSources: TErrorSources = err.issues?.map((issue: any) => ({
    path: issue?.path?.join(".") || "unknown",
    message: issue?.message || "Validation failed",
  })) || [
    {
      path: "unknown",
      message: err.message || "Validation failed",
    },
  ];

  return {
    statusCode,
    message,
    errorSources,
  };
};

export default handleZodError;
