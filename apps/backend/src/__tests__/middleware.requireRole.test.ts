import { describe, expect, it, jest } from "@jest/globals";
import type { NextFunction, Request, Response } from "express";
import { requireRole } from "../app/middleware/requireRole";

const run = (role: string | undefined) => {
  const req = { user: role ? { role } : undefined };
  const nextMock = jest.fn();
  requireRole("TEAM_LEAD")(
    req as unknown as Request,
    {} as Response,
    nextMock as unknown as NextFunction
  );
  return nextMock;
};

describe("requireRole middleware", () => {
  it("rejects unauthenticated requests with 401", () => {
    const error = run(undefined).mock.calls[0]?.[0] as { statusCode?: number };
    expect(error?.statusCode).toBe(401);
  });

  it("rejects roles below the required threshold with 403", () => {
    const error = run("RESEARCHER").mock.calls[0]?.[0] as {
      statusCode?: number;
      message?: string;
    };
    expect(error?.statusCode).toBe(403);
    expect(error?.message).toContain("Insufficient permissions");
  });

  it("allows roles at or above the threshold", () => {
    const next = run("ADMIN");
    expect(next).toHaveBeenCalledWith();
  });
});
