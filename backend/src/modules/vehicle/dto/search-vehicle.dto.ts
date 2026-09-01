import { searchVehicleSchema } from '@project/shared';
import { ZodDto } from '../../../shared/dto/zod.dto.js';

export class SearchVehicleDto extends ZodDto(searchVehicleSchema) {}
