import { PrismaClient } from '@prisma/client';

// A single shared Prisma instance. `--watch` can re-import modules, so we
// cache the client on globalThis to avoid exhausting DB connections in dev.
const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ log: ['warn', 'error'] });

if (!globalForPrisma.prisma) globalForPrisma.prisma = prisma;
