import { updateVehicleSchema } from '@project/shared';
import { ZodDto } from '../../../shared/dto/zod.dto';

export class UpdateVehicleDto extends ZodDto(updateVehicleSchema) {}
