import { ZodDto } from '../../../shared/dto/zod.dto';
import {
  searchCharacterSchema,
  SearchCharacterResponseDto as SearchResponseDto,
} from '@project/shared';
import { CharacterDto } from './get-character.dto';

export class SearchCharacterDto extends ZodDto(searchCharacterSchema) {}
export class SearchCharacterResponseDto extends CharacterDto implements SearchResponseDto {
  user: { name: string };
}
