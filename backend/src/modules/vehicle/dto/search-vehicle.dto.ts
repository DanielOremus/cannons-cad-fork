import { searchVehicleSchema } from '@project/shared';
import { ZodDto } from '../../../shared/dto/zod.dto';

export class SearchVehicleDto extends ZodDto(searchVehicleSchema) {}
