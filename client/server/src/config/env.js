import 'dotenv/config';

/**
 * Reads a required env var, failing fast at boot if it is missing.
 * Fail-fast beats a confusing runtime error later.
 */
function required(key) {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  jwtSecret: required('JWT_SECRET'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '8h',
  clientOrigin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
  isProd: process.env.NODE_ENV === 'production',
};
