class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export default AppError;
