import { updateCitationSchema } from '@project/shared';
import { ZodDto } from '../../../shared/dto/zod.dto.js';

export class UpdateCitationDto extends ZodDto(updateCitationSchema) {}
