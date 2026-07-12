import { z } from 'zod';

export const TRIP_STATUSES = [
  'DRAFT',
  'SCHEDULED',
  'ASSIGNED',
  'STARTED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
];

export const createTripSchema = z.object({
  source: z.string().trim().min(1, 'Source is required'),
  destination: z.string().trim().min(1, 'Destination is required'),
  vehicleId: z.string().min(1, 'Select a vehicle'),
  driverId: z.string().min(1, 'Select a driver'),
  cargoWeightKg: z.coerce.number().positive('Cargo weight must be greater than 0'),
  plannedDistanceKm: z.coerce.number().positive('Planned distance must be greater than 0'),
  revenue: z.coerce.number().min(0).default(0),
  plannedStart: z.coerce.date().optional(),
  plannedEnd: z.coerce.date().optional(),
});

export const scheduleTripSchema = z.object({
  plannedStart: z.coerce.date(),
  plannedEnd: z.coerce.date(),
});

export const completeTripSchema = z.object({
  endOdometer: z.coerce.number().min(0, 'Enter the final odometer reading'),
  fuelConsumedL: z.coerce.number().positive('Enter fuel consumed (litres)'),
});

export const listTripQuerySchema = z.object({
  status: z.enum(TRIP_STATUSES).optional(),
  search: z.string().trim().optional(),
});
