import * as z from 'zod/v4';
import type { searchVehicleSchema } from '../../validators/vehicle.schema.js';

export type SearchVehicleDto = z.infer<typeof searchVehicleSchema>;
