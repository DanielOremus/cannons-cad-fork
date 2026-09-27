import { getUnitsQuerySchema } from '@project/shared';
import { ZodDto } from '../../../shared/dto/zod.dto.js';

export class UnitsFilterDto extends ZodDto(getUnitsQuerySchema) {}
