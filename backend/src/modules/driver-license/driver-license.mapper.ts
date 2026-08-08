import { DriverLicenseDto } from '@project/shared';
import { DriverLicenseEntity } from './entities/driver-license.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DriverLicenseMapper {
  toReadDto(license: DriverLicenseEntity): DriverLicenseDto {
    return {
      id: license.id,
      categories: license.categories,
    };
  }
}
