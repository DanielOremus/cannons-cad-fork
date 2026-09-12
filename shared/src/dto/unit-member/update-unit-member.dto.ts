import * as z from 'zod/v4';
import type { updateUnitMemberSchema } from '../../validators/unit.schema.js';

export type UpdateUnitMemberDto = z.infer<typeof updateUnitMemberSchema>;
