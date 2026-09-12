import * as z from 'zod/v4';
import type { getUnitsQuerySchema } from '../../validators/unit.schema.js';

export type GetUnitsQueryDto = z.infer<typeof getUnitsQuerySchema>;
