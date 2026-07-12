import { z } from 'zod';

export const DRIVER_STATUSES = ['AVAILABLE', 'ON_TRIP', 'OFF_DUTY', 'SUSPENDED'];

export const createDriverSchema = z.object({
  name: z.string().trim().min(1, 'Driver name is required'),
  licenseNumber: z.string().trim().min(1, 'License number is required'),
  licenseCategory: z.string().trim().min(1, 'License category is required'),
  licenseExpiry: z.coerce.date({ errorMap: () => ({ message: 'Enter a valid expiry date' }) }),
  contact: z.string().trim().min(1, 'Contact number is required'),
  safetyScore: z.coerce.number().int().min(0).max(100).default(100),
  completionRate: z.coerce.number().int().min(0).max(100).default(0),
  status: z.enum(DRIVER_STATUSES).optional(),
});

export const updateDriverSchema = createDriverSchema.partial().omit({ licenseNumber: true });

export const listDriverQuerySchema = z.object({
  search: z.string().trim().optional(),
  status: z.enum(DRIVER_STATUSES).optional(),
});
