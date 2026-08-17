// export const VehicleSchema = defineEntity({
//   name: 'Vehicle',
//   extends: BaseSchema,
//   properties: {
//     type: p.enum(() => VehicleType),
//     licensePlate: p.string().unique(),
//     male: p.string(),
//     model: p.string(),
//     year: p.decimal().precision(4).scale(0),
//     color: p.string().nullable(),
//     flags: p
//       .enum(() => VehicleFlag)
//       .array()
//       .default([]),
//     owner: () => p.manyToOne(CharacterEntity).inversedBy('vehicles').deleteRule('cascade').owner(),
//   },
// });

import { z } from 'zod/v4';
import { idValidator } from './common.schema.js';
import { VehicleType } from '../types/vehicle/vehicle.type.js';
import { VehicleFlag } from '../types/vehicle/vehicle.flag.js';

export const vehicleCreateSchema = z.object({
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
      const currentYear = new Date().getUTCFullYear();
      return Number.isInteger(year) && year >= 1000 && currentYear >= year;
    }, 'Must be in YYYY format'),

  color: z.string().trim().nullish(),
  flags: z.array(z.enum(VehicleFlag)).default([]),
  ownerId: idValidator,
});
