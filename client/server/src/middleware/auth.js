import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import { can } from '../config/permissions.js';

/** Verifies the Bearer token and attaches { id, role } to req.user. */
export function authenticate(req, res, next) {
  const header = req.headers.authorization ?? '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return next(ApiError.unauthorized());
  }
  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    next(ApiError.unauthorized('Session expired or invalid'));
  }
}

/**
 * Guards a route by the RBAC matrix. Usage: authorize('trips', 'edit').
 * Must run after `authenticate`.
 */
export const authorize = (module, action = 'view') => (req, res, next) => {
  if (!req.user) return next(ApiError.unauthorized());
  if (!can(req.user.role, module, action)) {
    return next(ApiError.forbidden(`Your role cannot ${action} ${module}`));
  }
  next();
};
