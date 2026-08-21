import type { VehicleFlag } from '../../types/vehicle/vehicle.flag.js';

export type VehicleDto = {
  id: number;
  make: string;
  model: string;
  year: string;
  licensePlate: string;
  color?: string | null;
  flags: VehicleFlag[];
};
