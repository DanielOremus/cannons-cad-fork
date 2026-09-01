import { createCharacterSchema } from '@project/shared';
import { CreateCharacterResponseDto as CreateResponseDto } from '@project/shared';
import { ZodDto } from '../../../shared/dto/zod.dto';

export class CreateCharacterDto extends ZodDto(createCharacterSchema) {}
export class CreateCharacterResponseDto extends CreateCharacterDto implements CreateResponseDto {
  id: number;
  age: number;
}
