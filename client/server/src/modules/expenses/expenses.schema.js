import { z } from 'zod';

export const createFuelLogSchema = z.object({
  vehicleId: z.string().min(1, 'Select a vehicle'),
  tripId: z.string().optional(),
  liters: z.coerce.number().positive('Litres must be greater than 0'),
  cost: z.coerce.number().min(0, 'Cost is required'),
  date: z.coerce.date().optional(),
});

export const createExpenseSchema = z.object({
  category: z.enum(['TOLL', 'MISC']),
  amount: z.coerce.number().min(0, 'Amount is required'),
  vehicleId: z.string().optional(),
  tripId: z.string().optional(),
  note: z.string().trim().optional(),
  date: z.coerce.date().optional(),
});
