/* eslint-disable @typescript-eslint/no-explicit-any */
import { TErrorSources, TGenericErrorResponse } from "../interfaces/error";

const handleDuplicateError = (error: any): TGenericErrorResponse => {
  const statusCode = 400;
  const match = error.message.match(/"([^"]*)"/);
  const extractedMessage = match && match[1];
  const errorSources: TErrorSources = [
    {
      path: "",
      message: `${extractedMessage} already exists`,
    },
  ];

  return {
    message: "Duplicate value entered",
    statusCode,
    errorSources,
  };
};

export default handleDuplicateError;
