import ApiError from "../../errors/ApiError";

export class AiError extends ApiError {
  code?: string;

  constructor(
    statusCode: number,
    message: string,
    code?: string,
    stack?: string
  ) {
    super(statusCode, message, stack);
    this.code = code;
    this.name = "AiError";
  }
}

export const isAiError = (error: unknown): error is AiError => {
  return error instanceof AiError;
};
