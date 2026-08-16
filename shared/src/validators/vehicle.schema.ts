import { z } from 'zod/v4';
import { idValidator } from './common.schema.js';
import { VehicleType } from '../types/vehicle/vehicle.type.js';
import { VehicleFlag } from '../types/vehicle/vehicle.flag.js';

export const createVehicleSchema = z.object({
  type: z.enum(VehicleType),
  licensePlate: z
    .string()
    .trim()
    .min(3)
    .max(10)
    .toUpperCase()
    .refine((plate) => /^[A-Z0-9]+$/.test(plate), {
      params: {
        code: 'invalid_format',
        required: 'alphanumeric',
      },
    }),
  make: z.string().trim().nonempty(),
  model: z.string().trim().min(3),
  year: z.coerce
    .number()
    .int()
    .positive()
    .superRefine((year, ctx) => {
      const digits = Math.floor(Math.log10(year)) + 1;
      const currentYear = new Date().getUTCFullYear();
      if (digits !== 4) {
        ctx.addIssue({
          code: 'custom',
          params: {
            code: 'invalid_format',
            required: 'YYYY',
          },
        });
        return;
      }
      if (year > currentYear) {
        ctx.addIssue({
          code: 'custom',
          params: {
            code: 'in_future',
          },
        });
      }
    }),

  color: z.string().trim().nullish(),
  flags: z.array(z.enum(VehicleFlag)).default([]),
  ownerId: idValidator,
});
