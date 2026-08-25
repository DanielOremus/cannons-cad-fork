import { z } from 'zod/v4';
import { idValidator } from './common.schema.js';
import { VehicleType } from '../types/vehicle/vehicle.type.js';
import { VehicleFlag } from '../types/vehicle/vehicle.flag.js';

const flagsValidator = z.array(z.enum(VehicleFlag));

export const licensePlateValidator = z
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
  });

export const createVehicleSchema = z.object({
  type: z.enum(VehicleType),
  licensePlate: licensePlateValidator,
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
    })
    .transform((year) => year.toString()),

  color: z.string().trim().nullish(),
  flags: flagsValidator.default([]),
  characterId: idValidator,
});

export const updateVehicleSchema = createVehicleSchema
  .omit({ characterId: true })
  .partial()
  .extend({ flags: flagsValidator.optional() })
  .refine((data) => Object.keys(data).length > 0, { error: 'At least one field must be provided' });
