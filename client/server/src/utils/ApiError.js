/**
 * Typed application error. Thrown anywhere in the request lifecycle and
 * translated into a consistent JSON envelope by the error middleware.
 */
export class ApiError extends Error {
  constructor(statusCode, message, details = undefined) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isApiError = true;
  }

  static badRequest(msg, details) { return new ApiError(400, msg, details); }
  static unauthorized(msg = 'Authentication required') { return new ApiError(401, msg); }
  static forbidden(msg = 'You do not have access to this action') { return new ApiError(403, msg); }
  static notFound(msg = 'Resource not found') { return new ApiError(404, msg); }
  static conflict(msg, details) { return new ApiError(409, msg, details); }
}
