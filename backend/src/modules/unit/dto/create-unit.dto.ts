import { createUnitSchema } from '@project/shared';
import { ZodDto } from '../../../shared/dto/zod.dto.js';

export class CreateUnitDto extends ZodDto(createUnitSchema) {}
