import { CharacterFlag, DriverLicenseDto, CharacterDto as ReadDto } from '@project/shared';

export class CharacterDto implements ReadDto {
  id: number;
  firstName: string;
  lastName: string;
  dob: string;
  age: number;
  phoneNumber?: string | null;
  address?: string | null;
  hasGunPermit: boolean;
  flags: CharacterFlag[];
  driverLicense: DriverLicenseDto | null;
  citationsCount: number;
  vehiclesCount: number;
}
