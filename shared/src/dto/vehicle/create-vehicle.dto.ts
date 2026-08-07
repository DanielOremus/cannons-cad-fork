import * as z from 'zod/v4';
import { vehicleCreateSchema } from '../../validators/vehicle.schema.js';

export type CreateVehicleDto = z.infer<typeof vehicleCreateSchema>;
