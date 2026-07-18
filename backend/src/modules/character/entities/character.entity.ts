import { CharacterFlag, CharacterGender } from '@project/shared';
import { BaseEntity } from '../../../shared/entities/base.entity';
import { UserEntity } from '../../user/entities/user.entity';

export class CharacterEntity implements BaseEntity {
  id: number;
  firstName: string;
  lastName: string;
  dob: Date;
  age: number;
  gender: CharacterGender;
  idNumber: string;
  driverLicense: DriverLicenseEntity | null;
  phoneNumber: string | null;
  address: string | null;
  hasGunPermit: boolean;
  flags: CharacterFlag[];
  user: Pick<UserEntity, 'id' | 'name'> | null;
  vehicles: VehicleEntity[];
}
