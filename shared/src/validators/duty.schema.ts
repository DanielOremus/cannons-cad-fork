import * as z from 'zod/v4';
import { DutyType } from '../types/duty.type.js';

export const startDutySchema = z.object({
  duty: z.enum(DutyType),
});
