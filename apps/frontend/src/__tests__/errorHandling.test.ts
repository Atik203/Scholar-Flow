import { describe, expect, it } from "@jest/globals";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import {
  getErrorMessage,
  isFetchBaseQueryError,
  isSerializedError,
  shouldRetryRequest,
} from "@/lib/errorHandling";

describe("error handling helpers", () => {
  it("maps API status codes to user-friendly messages", () => {
    expect(getErrorMessage({ status: 403 } as FetchBaseQueryError)).toBe(
      "You do not have permission to perform this action."
    );
    expect(getErrorMessage({ status: 404 } as FetchBaseQueryError)).toBe(
      "The requested resource was not found."
    );
    expect(getErrorMessage(undefined)).toBe("An unknown error occurred");
  });

  it("retries server and network failures, but not client errors", () => {
    expect(shouldRetryRequest({ status: 500 } as FetchBaseQueryError)).toBe(true);
    expect(
      shouldRetryRequest({ status: "TIMEOUT_ERROR" } as FetchBaseQueryError)
    ).toBe(true);
    expect(shouldRetryRequest({ status: 400 } as FetchBaseQueryError)).toBe(false);
  });

  it("distinguishes RTK fetch errors from serialized errors", () => {
    expect(isFetchBaseQueryError({ status: 500 })).toBe(true);
    expect(isFetchBaseQueryError({ message: "boom" })).toBe(false);
    expect(isSerializedError({ message: "boom" })).toBe(true);
    expect(isSerializedError({ status: 500 })).toBe(false);
  });
});
