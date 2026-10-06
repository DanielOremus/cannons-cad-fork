import { createIncidentNoteSchema } from '@project/shared';
import { ZodDto } from '../../../../shared/dto/zod.dto.js';

export class CreateIncidentNoteDto extends ZodDto(createIncidentNoteSchema) {}
