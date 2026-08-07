import * as z from 'zod/v4';
import { citationCreateSchema } from '../../validators/citation.schema.js';

export type CreateCitationDto = z.infer<typeof citationCreateSchema>;
