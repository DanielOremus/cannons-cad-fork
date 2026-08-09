import { createCharacterSchema } from '@project/shared';
import { CreateCharacterResponseDto as CreateResponseDto } from '@project/shared';
import { createZodDto } from 'nestjs-zod';

export class CreateCharacterDto extends createZodDto(createCharacterSchema) {}
export class CreateCharacterResponseDto extends CreateCharacterDto implements CreateResponseDto {
  id: number;
  age: number;
}
