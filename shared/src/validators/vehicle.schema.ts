import { z } from 'zod/v4';
import { idValidator } from './common.schema.js';
import { VehicleType } from '../types/vehicle/vehicle.type.js';
import { VehicleFlag } from '../types/vehicle/vehicle.flag.js';

export const createVehicleSchema = z.object({
  type: z.enum(VehicleType),
  licensePlate: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9]{3,10}$/, 'Invalid license plate format'),
  make: z.string().trim().nonempty(),
  model: z.string().trim().min(3),
  year: z.coerce
    .number()
    .positive()
    .refine((year) => {
      const digitsNumber = Math.floor(Math.log10(year));
      const currentYear = new Date().getUTCFullYear();
      return digitsNumber === 4 && currentYear >= year;
    }, 'Must be in YYYY format'),

  color: z.string().trim().nullish(),
  flags: z.array(z.enum(VehicleFlag)).default([]),
  ownerId: idValidator,
});
