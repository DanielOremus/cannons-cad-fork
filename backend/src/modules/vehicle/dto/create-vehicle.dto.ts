import { createVehicleSchema } from '@project/shared';
import { ZodDto } from '../../../shared/dto/zod.dto';

export class CreateVehicleDto extends ZodDto(createVehicleSchema) {}
