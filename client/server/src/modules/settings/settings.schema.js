import { z } from 'zod';

export const updateSettingsSchema = z.object({
  depotName: z.string().trim().min(1).optional(),
  currency: z.string().trim().min(1).optional(),
  distanceUnit: z.string().trim().min(1).optional(),
});
