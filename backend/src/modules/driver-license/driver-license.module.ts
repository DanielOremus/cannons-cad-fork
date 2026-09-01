import { Module } from '@nestjs/common';
import { DriverLicenseMapper } from './driver-license.mapper.js';

@Module({
  providers: [DriverLicenseMapper],
  exports: [DriverLicenseMapper],
})
export class DriverLicenseModule {}
