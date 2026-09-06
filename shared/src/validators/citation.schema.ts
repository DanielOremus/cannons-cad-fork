import { z } from 'zod/v4';
import { idValidator } from './common.schema.js';
import { CitationStatus } from '../types/citation/citation.status.js';

const chargeValidator = z.object({
  amount: z.int().positive(),
  reason: z.string().trim().nonempty(),
  jailTime: z.string().trim().nullish(),
  count: z.int().positive().default(1),
});

export const createCitationSchema = z.object({
  officerName: z.string().trim().nonempty(),
  officerRank: z.string().trim().nonempty(),
  charges: z.array(chargeValidator).nonempty(),
  issuedCharacterId: idValidator,
  issuedVehicleId: z.nullish(idValidator),
});

export const updateCitationSchema = z.object({
  status: z.enum(CitationStatus),
});
