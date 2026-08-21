import { CitationDto as ReadDto, VehicleDto } from '@project/shared';
import { ChargeDto } from './get-charge.dto';

export class CitationDto implements ReadDto {
  charges: ChargeDto[];
  issuedVehicle?: VehicleDto | null;
  issuedAt: Date;
}
