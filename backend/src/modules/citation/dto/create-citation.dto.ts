import { createCitationSchema } from '@project/shared';
import { ZodDto } from '../../../shared/dto/zod.dto.js';

export class CreateCitationDto extends ZodDto(createCitationSchema) {}
