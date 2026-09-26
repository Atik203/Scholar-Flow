import { describe, expect, it } from "@jest/globals";
import express from "express";
import request from "supertest";
import { healthCheck, routeNotFound } from "../app/middleware/routeHandler";

// API end-to-end smoke test (Supertest): exercises the real Express
// handlers over HTTP without booting the full server (no DB, no cron).
const app = express();
app.get("/api/health", healthCheck);
app.use(routeNotFound);

describe("API end-to-end (Supertest)", () => {
  it("GET /api/health returns 200 with the API health payload", async () => {
    const res = await request(app).get("/api/health");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Scholar-Flow API is running!");
    expect(typeof res.body.timestamp).toBe("string");
  });

  it("unknown routes return a clean JSON 404", async () => {
    const res = await request(app).get("/api/does-not-exist");

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.statusCode).toBe(404);
  });
});
