import { TErrorSources, TGenericErrorResponse } from "../interfaces/error";

const handleTokenExpiredError = (): TGenericErrorResponse => {
  const errorSources: TErrorSources = [
    {
      path: "token",
      message: "JWT token has expired",
    },
  ];

  return {
    statusCode: 401,
    message: "Token expired",
    errorSources,
  };
};

export default handleTokenExpiredError;
