import { updateVehicleSchema } from '@project/shared';
import { ZodDto } from '../../../shared/dto/zod.dto.js';

export class UpdateVehicleDto extends ZodDto(updateVehicleSchema) {}
