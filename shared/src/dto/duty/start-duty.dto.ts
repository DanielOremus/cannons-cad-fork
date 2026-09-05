import * as z from 'zod/v4';
import { startDutySchema } from '../../validators/duty.schema.js';

export type StartDutyDto = z.infer<typeof startDutySchema>;
