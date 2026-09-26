import { describe, expect, it, jest } from "@jest/globals";
import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { validateRequestBody } from "../app/middleware/validateRequest";

const schema = z.object({ email: z.string().email() });

describe("validateRequestBody middleware", () => {
  it("accepts valid bodies and replaces them with parsed data", async () => {
    const req = { body: { email: "user@example.com" } };
    const nextMock = jest.fn();

    await validateRequestBody(schema)(
      req as unknown as Request,
      {} as Response,
      nextMock as unknown as NextFunction
    );

    expect(nextMock).toHaveBeenCalledWith();
    expect((req.body as { email: string }).email).toBe("user@example.com");
  });

  it("rejects invalid bodies with a 400 error", async () => {
    const req = { body: { email: "not-an-email" } };
    const nextMock = jest.fn();

    await validateRequestBody(schema)(
      req as unknown as Request,
      {} as Response,
      nextMock as unknown as NextFunction
    );

    const error = nextMock.mock.calls[0]?.[0] as {
      statusCode?: number;
      message?: string;
    };
    expect(error?.statusCode).toBe(400);
    expect(error?.message).toContain("validation failed");
  });
});
