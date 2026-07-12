import { z } from 'zod';

export const createMaintenanceSchema = z.object({
  vehicleId: z.string().min(1, 'Select a vehicle'),
  serviceType: z.string().trim().min(1, 'Service type is required'),
  cost: z.coerce.number().min(0).default(0),
  date: z.coerce.date().optional(),
  notes: z.string().trim().optional(),
});

export const listMaintenanceQuerySchema = z.object({
  status: z.enum(['ACTIVE', 'COMPLETED']).optional(),
  vehicleId: z.string().optional(),
});
