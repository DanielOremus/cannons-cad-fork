import {
  UnitStatus,
  updateUnitSchema,
  UpdateUnitResponseDto as UpdateResponseDto,
} from '@project/shared';
import { ZodDto } from '../../../shared/dto/zod.dto.js';

export class UpdateUnitDto extends ZodDto(updateUnitSchema) {}

export class UpdateUnitResponseDto implements UpdateResponseDto {
  id: number;
  callsign: string | null;
  status: UnitStatus;
}
