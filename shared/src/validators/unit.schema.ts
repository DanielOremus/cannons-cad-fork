import * as z from 'zod/v4';
import { UnitStatus } from '../types/unit.status.js';
import { uuidValidator } from './common.schema.js';

export const createUnitSchema = z.object({
  callsign: z.string(),
  status: z.enum(UnitStatus).default(UnitStatus.OFF_SERVICE),
  members: z
    .array(
      z.object({
        name: z.string(),
        rank: z.string(),
        user: uuidValidator,
      }),
    )
    .length(1),
});

export const createUnitMemberSchema = z.object({
  name: z.string().trim().nonempty().max(20),
  rank: z.string().trim().nonempty().max(20),
});

export const updateUnitStatusSchema = z.object({
  status: z.enum(UnitStatus),
});
