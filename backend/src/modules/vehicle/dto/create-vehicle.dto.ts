import { createVehicleSchema } from '@project/shared';
import { ZodDto } from '../../../shared/dto/zod.dto.js';

export class CreateVehicleDto extends ZodDto(createVehicleSchema) {}
