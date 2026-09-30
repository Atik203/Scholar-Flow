import { describe, expect, it } from "@jest/globals";
import { clearAuthCookie, setAuthCookie } from "@/lib/auth/authCookies";

type GlobalWithDocument = { document?: unknown };

describe("auth cookie helpers", () => {
  it("is safe without a document (SSR)", () => {
    expect(() => setAuthCookie()).not.toThrow();
    expect(() => clearAuthCookie()).not.toThrow();
  });

  it("writes and clears the sf_auth proxy cookie in the browser", () => {
    const fakeDocument = { cookie: "" };
    (globalThis as GlobalWithDocument).document = fakeDocument;

    try {
      setAuthCookie();
      expect(fakeDocument.cookie).toContain("sf_auth=1");

      clearAuthCookie();
      expect(fakeDocument.cookie).toContain("sf_auth=;");
    } finally {
      delete (globalThis as GlobalWithDocument).document;
    }
  });
});
