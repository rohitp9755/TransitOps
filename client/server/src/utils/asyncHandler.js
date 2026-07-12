/**
 * Wraps an async route handler so rejected promises reach the error
 * middleware instead of crashing the process. Keeps controllers free of
 * repetitive try/catch noise.
 */
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
