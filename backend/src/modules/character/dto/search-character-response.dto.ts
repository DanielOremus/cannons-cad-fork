import { searchCharacterResponseSchema } from '@project/shared';
import { createZodDto } from 'nestjs-zod';

export class SearchCharacterResponseDto extends createZodDto(searchCharacterResponseSchema) {}
