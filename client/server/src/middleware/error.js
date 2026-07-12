import { Prisma } from '@prisma/client';
import { ApiError } from '../utils/ApiError.js';
import { env } from '../config/env.js';

/** 404 fallback for unmatched routes. */
export function notFoundHandler(req, res) {
  res.status(404).json({ error: { message: `Route not found: ${req.method} ${req.originalUrl}` } });
}

/** Central error translator -> consistent { error: { message, details } } envelope. */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (err?.isApiError) {
    return res.status(err.statusCode).json({ error: { message: err.message, details: err.details } });
  }

  // Prisma unique-constraint violation -> 409 with the offending field.
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
    const field = err.meta?.target?.[0] ?? 'field';
    return res.status(409).json({ error: { message: `A record with this ${field} already exists` } });
  }
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
    return res.status(404).json({ error: { message: 'Resource not found' } });
  }

  if (!env.isProd) console.error(err);
  res.status(500).json({ error: { message: 'Something went wrong on our end' } });
}
