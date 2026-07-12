import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { apiRouter } from './routes.js';
import { notFoundHandler, errorHandler } from './middleware/error.js';

/** Builds the Express app (kept separate from server startup for testability). */
export function createApp() {
  const app = express();

  app.use(cors({ origin: env.clientOrigin }));
  app.use(express.json());

  app.use('/api', apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
