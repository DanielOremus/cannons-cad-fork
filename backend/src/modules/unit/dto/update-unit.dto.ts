import { updateUnitStatusSchema } from '@project/shared';
import { ZodDto } from '../../../shared/dto/zod.dto.js';

export class UpdateUnitStatusDto extends ZodDto(updateUnitStatusSchema) {}
