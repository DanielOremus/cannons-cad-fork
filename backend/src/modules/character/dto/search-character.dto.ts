import { characterSearchSchema } from '@project/shared';
import { createZodDto } from 'nestjs-zod';

export class SearchCharacterDto extends createZodDto(characterSearchSchema) {}
