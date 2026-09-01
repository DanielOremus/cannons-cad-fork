import { CitationStatus, CitationDto as ReadDto, VehicleDto } from '@project/shared';
import { ChargeDto } from './get-charge.dto.js';

export class CitationDto implements ReadDto {
  id: number;
  charges: ChargeDto[];
  issuedVehicle?: VehicleDto | null;
  status: CitationStatus;
  issuedBy: { name: string } | null;
  issuedAt: Date;
}
