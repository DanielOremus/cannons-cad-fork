import { updateVehicleSchema } from '@project/shared';
import { createZodDto } from 'nestjs-zod';

export class UpdateVehicleDto extends createZodDto(updateVehicleSchema) {}
