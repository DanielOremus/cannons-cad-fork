import * as z from 'zod/v4';
import { createUnitSchema } from '../../validators/unit.schema.js';

export type CreateUnitDto = z.infer<typeof createUnitSchema>;
