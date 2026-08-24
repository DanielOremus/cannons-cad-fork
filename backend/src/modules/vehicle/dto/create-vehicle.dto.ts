import { createVehicleSchema } from '@project/shared';
import { createZodDto } from 'nestjs-zod';

export class CreateVehicleDto extends createZodDto(createVehicleSchema) {}
