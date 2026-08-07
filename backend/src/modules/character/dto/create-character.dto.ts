import { characterCreateSchema } from '@project/shared';
import { createZodDto } from 'nestjs-zod';

export class CreateCharacterDto extends createZodDto(characterCreateSchema) {}
