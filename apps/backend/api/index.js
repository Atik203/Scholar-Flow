// Vercel Serverless Function entry point
// This file imports the compiled Express app from dist and exports it

/* eslint-disable @typescript-eslint/no-var-requires */
const app = require('../dist/server.js');

module.exports = app;
module.exports.config = {
	api: {
		bodyParser: false,
		externalResolver: true,
	},
};
