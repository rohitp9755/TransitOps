import { ApiError } from '../utils/ApiError.js';

/**
 * Validates a request section against a Zod schema and replaces it with the
 * parsed (coerced, stripped) value. Keeps controllers free of parsing logic.
 */
export const validate = (schema, source = 'body') => (req, res, next) => {
  const result = schema.safeParse(req[source]);
  if (!result.success) {
    const details = result.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message }));
    return next(ApiError.badRequest('Please check the highlighted fields', details));
  }
  req[source] = result.data;
  next();
};
