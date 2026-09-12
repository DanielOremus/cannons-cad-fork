import * as z from 'zod/v4';
import { UnitStatus } from '../types/unit.status.js';
import { idValidator } from './common.schema.js';
import { LiveDuty } from '../types/duty.type.js';

export const getUnitsQuerySchema = z.object({
  duty: z.enum(LiveDuty),
});

export const createUnitSchema = z.object({
  duty: z.enum(LiveDuty),
  callsign: z.nullish(z.string()),
  status: z.enum(UnitStatus).default(UnitStatus.OFF_SERVICE),
  memberId: idValidator,
});

export const createUnitMemberSchema = z.object({
  name: z.string().trim().nonempty().max(20),
  rank: z.string().trim().nonempty().max(20),
});
export const updateUnitMemberSchema = createUnitMemberSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, { error: 'At least one field must be provided' });

export const updateUnitStatusSchema = z.object({
  status: z.enum(UnitStatus),
});
