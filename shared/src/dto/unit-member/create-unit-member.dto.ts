import type { createUnitMemberSchema } from '../../validators/unit.schema.js';
import * as z from 'zod/v4';

export type CreateUnitMemberDto = z.infer<typeof createUnitMemberSchema>;
