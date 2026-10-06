import * as z from 'zod/v4';
import type {
  updateIncidentSchema,
  updateIncidentUnitsSchema,
} from '../../validators/incident.schema.js';

export type UpdateIncidentDto = z.infer<typeof updateIncidentSchema>;
export type UpdateIncidentUnitsDto = z.infer<typeof updateIncidentUnitsSchema>;
