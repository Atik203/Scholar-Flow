import { describe, expect, it } from "@jest/globals";
import { API_BASE_URL, getApiBaseUrl } from "@/lib/apiUrl";

describe("API base URL resolver", () => {
  it("resolves a non-empty /api base URL", () => {
    expect(typeof API_BASE_URL).toBe("string");
    expect(API_BASE_URL.length).toBeGreaterThan(0);
    expect(API_BASE_URL.endsWith("/api")).toBe(true);
    expect(getApiBaseUrl()).toBe(API_BASE_URL);
  });
});
