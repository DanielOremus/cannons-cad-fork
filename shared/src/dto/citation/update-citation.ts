import * as z from 'zod/v4';
import { updateCitationSchema } from '../../validators/citation.schema.js';

export type UpdateCitationDto = z.infer<typeof updateCitationSchema>;
