import * as z from 'zod/v4';
import { createCitationSchema } from '../../validators/citation.schema.js';

export type CreateCitationDto = z.infer<typeof createCitationSchema>;
