// Vercel Serverless Function entry point
// This file imports the compiled Express app and exports it for Vercel's serverless runtime

const app = require('../dist/server.js');

module.exports = app.default || app;
