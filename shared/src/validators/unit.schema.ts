import * as z from 'zod/v4';
import { UnitStatus } from '../types/unit.status.js';

export const updateUnitStatusSchema = z.object({
  status: z.enum(UnitStatus),
});
