import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../lib/prisma.js';
import { env } from '../../config/env.js';
import { ApiError } from '../../utils/ApiError.js';
import { permissionsFor } from '../../config/permissions.js';

const SALT_ROUNDS = 10;

/** Strips the password hash before a user object ever leaves the service. */
function toPublicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    permissions: permissionsFor(user.role),
  };
}

function signToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
}

export async function register({ name, email, password, role }) {
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await prisma.user.create({
    data: { name, email: email.toLowerCase(), passwordHash, role },
  });
  return { token: signToken(user), user: toPublicUser(user) };
}

export async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  // Same error for missing user and wrong password — no account enumeration.
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw ApiError.unauthorized('Invalid credentials');
  }
  return { token: signToken(user), user: toPublicUser(user) };
}

export async function getProfile(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw ApiError.notFound('User not found');
  return toPublicUser(user);
}
