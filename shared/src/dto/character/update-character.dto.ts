import * as z from 'zod/v4';
import type { updateCharacterSchema } from '../../validators/character.schema.js';

export type UpdateCharacterDto = z.infer<typeof updateCharacterSchema>;
