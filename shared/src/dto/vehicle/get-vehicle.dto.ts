import type { VehicleFlag } from '../../types/vehicle/vehicle.flag.js';
import type { VehicleType } from '../../types/vehicle/vehicle.type.js';

export type VehicleDto = {
  id: number;
  make: string;
  model: string;
  year: string;
  licensePlate: string;
  color?: string | null;
  flags: VehicleFlag[];
  type: VehicleType;
  owner: { id: number; firstName: string; lastName: string };
};
