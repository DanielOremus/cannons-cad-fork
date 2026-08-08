import type { CharacterFlag } from '../../types/character/character.flag.js';
import type { DriverLicenseDto } from '../driver-license/get-driver-license.dto.js';

export type CharacterDto = {
  id: number;
  driverLicense: DriverLicenseDto | null;
  firstName: string;
  lastName: string;
  dob: string;
  age: number;
  phoneNumber?: string | null;
  address?: string | null;
  hasGunPermit: boolean;
  flags: CharacterFlag[];
  vehiclesCount: number;
  citationsCount: number;
};
