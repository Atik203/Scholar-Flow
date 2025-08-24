// Test setup file
import { afterAll, beforeAll, jest } from "@jest/globals";

// Set environment variables for testing
process.env.NODE_ENV = "test";
process.env.DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://test:test@localhost:5432/scholar_flow_test";

// Mock console methods to reduce noise in test output
beforeAll(() => {
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  jest.restoreAllMocks();
});
