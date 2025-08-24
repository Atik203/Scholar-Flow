// Vercel Serverless Function entry point
// This file imports the compiled Express app from dist and exports it

const app = require('../dist/server.js');

module.exports = app;
