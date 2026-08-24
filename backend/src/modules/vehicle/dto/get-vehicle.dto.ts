import { VehicleDto as ReadDto, VehicleFlag, VehicleType } from '@project/shared';

export class VehicleDto implements ReadDto {
  owner: { id: number; firstName: string; lastName: string };
  id: number;
  make: string;
  model: string;
  year: string;
  licensePlate: string;
  color?: string | null;
  flags: VehicleFlag[];
  type: VehicleType;
}
