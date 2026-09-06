/**
 * Vercel Serverless Function entry point.
 *
 * Vercel requires the handler to be inside an `api/` directory.
 * This file imports the compiled Express app from `dist/server.js`
 * and re-exports it for @vercel/node.
 *
 * Required environment variables:
 *   DIRECT_DATABASE_URL or DATABASE_URL — PostgreSQL connection string
 *   JWT_SECRET                          — JWT signing key
 *   FRONTEND_URL                        — e.g. https://scholar-flow-ai.vercel.app
 *   AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_BUCKET_NAME, AWS_REGION
 *   (AI, Stripe, Redis keys optional — app degrades gracefully)
 */

let app;
try {
  app = require("../dist/server");
} catch (err) {
  console.error("[FATAL] Failed to load dist/server.js:", err.message);
  if (err.code === "MODULE_NOT_FOUND") {
    console.error("[FATAL] Module resolution error. Check that build completed and includeFiles is configured.");
    console.error("[FATAL] Missing module:", err.message.split("\n")[0]);
  }
  console.error("[FATAL] Stack:", err.stack);
  throw err;
}

// If TypeScript emitted a default export, destructure it
const handler = app.default || app;

if (!handler || typeof handler !== "function") {
  console.error("[FATAL] dist/server.js did not export a valid Express app. typeof:", typeof handler);
  throw new Error("Invalid Express app export from dist/server.js");
}

module.exports = handler;
