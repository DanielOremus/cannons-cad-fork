import {
  searchCharacterSchema,
  SearchCharacterResponseDto as SearchResponseDto,
} from '@project/shared';
import { createZodDto } from 'nestjs-zod';
import { CharacterDto } from './get-character.dto';

export class SearchCharacterDto extends createZodDto(searchCharacterSchema) {}
export class SearchCharacterResponseDto extends CharacterDto implements SearchResponseDto {
  user: { name: string };
}
