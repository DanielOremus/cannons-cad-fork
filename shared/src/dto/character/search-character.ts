import type { CharacterFlag } from '../../types/character/character.flag.js';
import { searchCharacterSchema } from '../../validators/character.schema.js';
import * as z from 'zod/v4';

export type SearchCharacterDto = z.infer<typeof searchCharacterSchema>;

export class SearchCharacterResponseDto {
  id: number;
  user: {
    name: string;
  };
  firstName: string;
  lastName: string;
  dob: string;
  age: number;
  phoneNumber?: string | null;
  address?: string | null;
  hasGunPermit: boolean;
  flags: CharacterFlag[];
}
