import { ZodDto } from '../../../shared/dto/zod.dto.js';
import {
  searchCharacterSchema,
  SearchCharacterResponseDto as SearchResponseDto,
} from '@project/shared';
import { CharacterDto } from './get-character.dto.js';

export class SearchCharacterDto extends ZodDto(searchCharacterSchema) {}
export class SearchCharacterResponseDto extends CharacterDto implements SearchResponseDto {
  user: { name: string };
}
