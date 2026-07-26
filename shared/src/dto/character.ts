import { characterCreateSchema, characterSearchSchema } from '../validators/character.schema.js';
import * as z from 'zod/v4';

export type CreateCharacterDto = z.infer<typeof characterCreateSchema>;
export type SearchCharacterDto = z.infer<typeof characterSearchSchema>;
export type SearchCharacterRequest = z.input<typeof characterSearchSchema>;
export type CreateCharacterRequest = z.input<typeof characterCreateSchema>;
