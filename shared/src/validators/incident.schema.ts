import * as z from 'zod/v4';
import { IncidentPriority } from '../types/incident/incident.priority.js';
import { IncidentOrigin } from '../types/incident/incident.origin.js';
import { IncidentStatus } from '../types/incident/incident.status.js';
import { idValidator } from './common.schema.js';

// title: string;
//   priority: IncidentPriority | null;
//   origin: IncidentOrigin;
//   status: IncidentStatus;
//   code: string;
//   address: string;
//   postal: string | null;
//   attachedUnits: UnitDto[];
//   description: string | null;
//   notes: IncidentNoteDto[];

export const createIncidentSchema = z.object({
  title: z.string().trim().max(20),
  priority: z.nullish(z.enum(IncidentPriority)).default(null),
  origin: z.enum(IncidentOrigin),
  status: z.enum(IncidentStatus),
  code: z.string(),
  address: z.string(),
  postal: z.nullish(z.string().trim()),
  attachedUnits: z.array(idValidator).default([]),
  description: z.nullish(z.string().trim().max(700)),
});

export const updateIncidentSchema = createIncidentSchema
  .omit({ attachedUnits: true })
  .partial()
  .refine((data) => Object.keys(data).length > 0, { error: 'At least one field must be provided' });

export const createIncidentNoteSchema = z.object({
  text: z.string().trim().max(500),
});

export const updateIncidentUnitsSchema = z.object({
  change: z.array(
    z.object({
      unitId: idValidator,
      action: z.coerce.number().int().min(0).max(1),
    }),
  ),
});
