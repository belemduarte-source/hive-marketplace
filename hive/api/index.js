// Vercel serverless entry point — exports the Express app
// Vercel calls this file as a serverless function for all /api/* routes
module.exports = require('../backend/src/app');
