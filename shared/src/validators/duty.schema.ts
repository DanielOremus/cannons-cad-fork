import * as z from 'zod/v4';
import { DutyType } from '../types/duty.type.js';
import { idValidator } from './common.schema.js';

export const startDutySchema = z.object({
  memberId: idValidator.optional(),
  duty: z.enum(DutyType),
});
