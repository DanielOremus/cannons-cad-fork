import { createZodDto } from 'nestjs-zod';
import { updateCharacterSchema } from '@project/shared';

export class UpdateCharacterDto extends createZodDto(updateCharacterSchema) {}
