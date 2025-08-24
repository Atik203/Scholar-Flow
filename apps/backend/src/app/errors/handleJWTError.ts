import { TErrorSources, TGenericErrorResponse } from "../interfaces/error";

const handleJWTError = (): TGenericErrorResponse => {
  const errorSources: TErrorSources = [
    {
      path: "token",
      message: "Invalid JWT token",
    },
  ];

  return {
    statusCode: 401,
    message: "Invalid token",
    errorSources,
  };
};

export default handleJWTError;
