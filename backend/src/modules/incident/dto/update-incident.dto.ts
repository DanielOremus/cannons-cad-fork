import { updateIncidentSchema, updateIncidentUnitsSchema } from '@project/shared';
import { ZodDto } from '../../../shared/dto/zod.dto.js';

export class UpdateIncidentDto extends ZodDto(updateIncidentSchema) {}
export class UpdateIncidentUnitsDto extends ZodDto(updateIncidentUnitsSchema) {}
