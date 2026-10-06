import { createIncidentSchema } from '@project/shared';
import { ZodDto } from '../../../shared/dto/zod.dto.js';

export class CreateIncidentDto extends ZodDto(createIncidentSchema) {}
