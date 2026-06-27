/**
 * Vercel Serverless Function entry point.
 *
 * Vercel requires the handler to be inside an `api/` directory.
 * This file imports the compiled Express app from `dist/server.js`
 * and re-exports it for @vercel/node.
 *
 * Note: server.ts exports the Express app as the default export
 * AND as `module.exports = app`. The require() below returns the
 * Express app directly (not wrapped in an object).
 */
const app = require("../dist/server");

// If TypeScript emitted a default export, destructure it
module.exports = app.default || app;
