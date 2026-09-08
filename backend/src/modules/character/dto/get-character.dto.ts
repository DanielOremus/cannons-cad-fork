import {
  CharacterFlag,
  DriverLicenseDto,
  CharacterDto as ReadDto,
  CharacterListItemDto as ListItemDto,
} from '@project/shared';

export class CharacterListItemDto implements ListItemDto {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  dob: string;
  flags: CharacterFlag[];
}

export class CharacterDto extends CharacterListItemDto implements ReadDto {
  phoneNumber?: string | null;
  address?: string | null;
  hasGunPermit: boolean;
  driverLicense: DriverLicenseDto | null;
  citationsCount: number;
  vehiclesCount: number;
}
