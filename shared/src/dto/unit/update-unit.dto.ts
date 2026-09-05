import * as z from 'zod/v4';
import { updateUnitStatusSchema } from '../../validators/unit.schema.js';

export type UpdateUnitStatusDto = z.infer<typeof updateUnitStatusSchema>;
