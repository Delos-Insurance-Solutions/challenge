const jsonServer = require('json-server');
const express = require('express');
const rateLimit = require('express-rate-limit');

const app = express();
const port = 3001;

// Apply rate limiting middleware
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 5, // max 5 requests per minute
});

app.use('/api', limiter); // Apply rate limiting to the /api endpoint

// Use json-server middleware
const jsonServerMiddleware = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

jsonServerMiddleware.use(middlewares);
jsonServerMiddleware.use('/api', limiter);
jsonServerMiddleware.use(router);

const PORT = process.env.PORT || 3001;

jsonServerMiddleware.listen(PORT, () => {
  console.log(`JSON Server is running on http://localhost:${port}`);
});
