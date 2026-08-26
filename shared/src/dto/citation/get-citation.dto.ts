import type { CitationStatus } from '../../types/citation/citation.status.js';
import type { VehicleDto } from '../vehicle/get-vehicle.dto.js';

export type ChargeDto = {
  amount: number;
  reason: string;
  jailTime?: string | null;
  count: number;
};

export type CitationDto = {
  charges: ChargeDto[];
  status: CitationStatus;
  issuedVehicle?: VehicleDto | null;
  issuedBy: { name: string } | null;
  issuedAt: Date;
};
