import type { VehicleDto } from '../vehicle/get-vehicle.dto.js';

export type ChargeDto = {
  amount: number;
  reason: string;
  jailTime?: string | null;
  count: number;
};

export type CitationDto = {
  charges: ChargeDto[];
  issuedVehicle?: VehicleDto | null;
  issuedAt: Date;
};
