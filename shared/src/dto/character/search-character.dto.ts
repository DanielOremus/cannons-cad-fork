import { searchCharacterSchema } from '../../validators/character.schema.js';
import * as z from 'zod/v4';
import type { CharacterDto } from './get-character.dto.js';

export type SearchCharacterDto = z.infer<typeof searchCharacterSchema>;

export type SearchCharacterResponseDto = CharacterDto & {
  user: {
    name: string;
  };
};
