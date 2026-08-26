import * as z from 'zod/v4';
import type { updateVehicleSchema } from '../../validators/vehicle.schema.js';

export type UpdateVehicleDto = z.infer<typeof updateVehicleSchema>;
