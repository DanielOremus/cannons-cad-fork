import { CitationStatus, CitationDto as ReadDto, VehicleDto } from '@project/shared';
import { ChargeDto } from './get-charge.dto';

export class CitationDto implements ReadDto {
  charges: ChargeDto[];
  issuedVehicle?: VehicleDto | null;
  status: CitationStatus;
  issuedBy: { name: string } | null;
  issuedAt: Date;
}
