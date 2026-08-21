import * as z from 'zod/v4';
import { createVehicleSchema } from '../../validators/vehicle.schema.js';

export type CreateVehicleDto = z.infer<typeof createVehicleSchema>;
