import { describe, expect, it } from "@jest/globals";
import { authSchemas, commonSchemas, paperSchemas } from "@/lib/validators";

describe("form validation schemas", () => {
  it("validates emails", () => {
    expect(commonSchemas.email.safeParse("user@example.com").success).toBe(true);
    expect(commonSchemas.email.safeParse("not-an-email").success).toBe(false);
  });

  it("enforces password strength rules", () => {
    expect(commonSchemas.password.safeParse("Strong1!").success).toBe(true);
    expect(commonSchemas.password.safeParse("weakpassword").success).toBe(false);
  });

  it("requires usernames to start with a letter", () => {
    expect(commonSchemas.username.safeParse("ada_1").success).toBe(true);
    expect(commonSchemas.username.safeParse("1ada").success).toBe(false);
  });

  it("rejects registration when the passwords do not match", () => {
    const result = authSchemas.register.safeParse({
      email: "ada@example.com",
      username: "ada",
      password: "Strong1!",
      confirmPassword: "Different1!",
      firstName: "Ada",
      lastName: "Lovelace",
      acceptTerms: true,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Passwords don't match");
    }
  });

  it("validates paper metadata schemas", () => {
    const valid = paperSchemas.paper.safeParse({
      title: "A Study of Research Tools",
      abstract: "This is a sufficiently long description of the paper.",
      authors: ["Ada Lovelace"],
      keywords: ["research"],
    });
    expect(valid.success).toBe(true);

    const missingAuthors = paperSchemas.paper.safeParse({
      title: "A Study of Research Tools",
      abstract: "This is a sufficiently long description of the paper.",
      authors: [],
      keywords: ["research"],
    });
    expect(missingAuthors.success).toBe(false);
  });
});
