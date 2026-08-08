import { createCharacterSchema } from '../../validators/character.schema.js';
import * as z from 'zod/v4';

export type CreateCharacterDto = z.infer<typeof createCharacterSchema>;
