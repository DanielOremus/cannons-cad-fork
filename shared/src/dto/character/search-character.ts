import { characterSearchSchema } from '../../validators/character.schema.js';
import * as z from 'zod/v4';

export type SearchCharacterDto = z.infer<typeof characterSearchSchema>;
export type SearchCharacterRequest = z.input<typeof characterSearchSchema>;
export type SearchCharacterResponseDto = z.infer<typeof characterSearchSchema>;
