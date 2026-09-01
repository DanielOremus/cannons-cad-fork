import { ZodDto } from '../../../shared/dto/zod.dto.js';
import { updateCharacterSchema } from '@project/shared';

export class UpdateCharacterDto extends ZodDto(updateCharacterSchema) {}
