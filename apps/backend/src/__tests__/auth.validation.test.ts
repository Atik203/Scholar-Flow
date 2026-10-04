import { describe, expect, it } from "@jest/globals";
import {
  passwordResetSchema,
  registerSchema,
  signInSchema,
} from "../app/modules/Auth/auth.validation";

describe("auth validation schemas", () => {
  it("accepts a valid registration and defaults the role to RESEARCHER", () => {
    const result = registerSchema.safeParse({
      firstName: "Ada",
      lastName: "Lovelace",
      email: "ada@example.com",
      password: "secret123",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.role).toBe("RESEARCHER");
    }
  });

  it("rejects weak registration passwords", () => {
    const result = registerSchema.safeParse({
      firstName: "Ada",
      lastName: "Lovelace",
      email: "ada@example.com",
      password: "passwordonly",
    });

    expect(result.success).toBe(false);
  });

  it("validates sign-in and password reset payloads", () => {
    expect(
      signInSchema.safeParse({ email: "a@b.co", password: "secret1" }).success
    ).toBe(true);
    expect(
      signInSchema.safeParse({ email: "bad-email", password: "secret1" }).success
    ).toBe(false);
    expect(
      passwordResetSchema.safeParse({ token: "", newPassword: "weak" }).success
    ).toBe(false);
  });
});
