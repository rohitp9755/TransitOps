import { z } from 'zod';

export const VEHICLE_STATUSES = ['AVAILABLE', 'ON_TRIP', 'IN_SHOP', 'RETIRED'];

export const createVehicleSchema = z.object({
  regNumber: z.string().trim().min(1, 'Registration number is required'),
  name: z.string().trim().min(1, 'Vehicle name is required'),
  type: z.string().trim().min(1, 'Type is required'),
  maxLoadKg: z.coerce.number().positive('Capacity must be greater than 0'),
  odometer: z.coerce.number().min(0).default(0),
  acquisitionCost: z.coerce.number().min(0).default(0),
  region: z.string().trim().optional(),
  status: z.enum(VEHICLE_STATUSES).optional(),
});

// Every field optional on update; regNumber stays immutable to protect history.
export const updateVehicleSchema = createVehicleSchema.partial().omit({ regNumber: true });

export const listVehicleQuerySchema = z.object({
  search: z.string().trim().optional(),
  type: z.string().trim().optional(),
  status: z.enum(VEHICLE_STATUSES).optional(),
  region: z.string().trim().optional(),
});
